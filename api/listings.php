<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

function listing_region_id(string $cityId): string
{
    if ($cityId === '' || !str_starts_with($cityId, 'UA')) return '';
    static $cache = [];
    if (array_key_exists($cityId, $cache)) return $cache[$cityId];
    try {
        $row = fetch_one(database(), <<<'SQL'
            SELECT l1_parent_id
            FROM entries
            WHERE type IN (2, 5, 7, 8) AND (l4_parent_id = ? OR l1_parent_id = ?)
            ORDER BY type ASC
            LIMIT 1
            SQL, [$cityId, $cityId]);
        return $cache[$cityId] = clean_text($row['l1_parent_id'] ?? '', 80);
    } catch (Throwable $error) {
        error_log('Cannot resolve listing region: ' . $error->getMessage());
        return $cache[$cityId] = '';
    }
}

function listing_query_values(string $key, int $limit = 20): array
{
    $value = $_GET[$key] ?? [];
    if (!is_array($value)) $value = [$value];
    return array_slice(array_values(array_unique(array_filter(array_map(
        fn(mixed $item): string => clean_text($item, 160),
        $value
    ), fn(string $item): bool => $item !== '' && $item !== 'all'))), 0, $limit);
}

function listing_user_initials(array $row): string
{
    $parts = array_values(array_filter([
        clean_text($row['user_first_name'] ?? '', 80),
        clean_text($row['user_last_name'] ?? '', 80),
    ]));
    if ($parts === []) {
        $parts = preg_split('/\s+/u', clean_text($row['user_name'] ?? '', 160), -1, PREG_SPLIT_NO_EMPTY) ?: [];
    }
    $initials = '';
    foreach (array_slice($parts, 0, 2) as $part) {
        $initials .= function_exists('mb_substr') ? mb_substr($part, 0, 1) : substr($part, 0, 1);
    }
    return function_exists('mb_strtoupper') ? mb_strtoupper($initials) : strtoupper($initials);
}

run_endpoint(function (): array {
    require_method('GET');
    $db = database();
    $page = max(1, (int) ($_GET['page'] ?? 1));
    $perPage = 20;
    $region = clean_text($_GET['region'] ?? '', 80);
    $city = clean_text($_GET['city'] ?? '', 80);
    $district = clean_text($_GET['district'] ?? '', 120);
    $rating = is_numeric($_GET['rating'] ?? null) ? min(5, max(0, (float) $_GET['rating'])) : 0;
    $specialties = listing_query_values('specialty');
    $formats = listing_query_values('format', 10);

    $where = ["s.user_id IS NOT NULL", "s.status = 'active'"];
    $params = [];
    if ($region !== '' && $region !== 'all') {
        $where[] = <<<'SQL'
            EXISTS (
              SELECT 1 FROM entries AS location
              WHERE location.type IN (2, 5, 7, 8)
                AND (location.l4_parent_id = s.city OR location.l1_parent_id = s.city)
                AND location.l1_parent_id = ?
            )
            SQL;
        $params[] = $region;
    }
    if ($city !== '' && $city !== 'all') {
        $where[] = 's.city = ?';
        $params[] = $city;
    }
    if ($district !== '' && $district !== 'all') {
        $where[] = <<<'SQL'
            EXISTS (
              SELECT 1
              FROM Districts AS filter_district
              INNER JOIN entries AS filter_entry ON filter_entry.l5_parent_id = filter_district.district_id
              WHERE filter_district.specialist_id = s.id AND BINARY filter_entry.name = BINARY ?
            )
            SQL;
        $params[] = $district;
    }
    if ($rating > 0) {
        $where[] = 's.rating >= ?';
        $params[] = $rating;
    }
    if ($specialties !== []) {
        $placeholders = implode(', ', array_fill(0, count($specialties), '?'));
        $where[] = "EXISTS (
          SELECT 1 FROM SpecialistRecords AS filter_sr
          INNER JOIN Catalog_record AS filter_r ON filter_r.id = filter_sr.catalog_record_id
          WHERE filter_sr.specialist_id = s.id AND filter_r.enabled = 1 AND filter_r.title IN ($placeholders)
        )";
        array_push($params, ...$specialties);
    }
    if ($formats !== []) {
        $formatConditions = [];
        foreach ($formats as $format) {
            if ($format === 'Онлайн') {
                $formatConditions[] = 's.online = 1';
            } elseif ($format === 'У фахівця') {
                $formatConditions[] = 'EXISTS (SELECT 1 FROM Districts AS format_district WHERE format_district.specialist_id = s.id AND format_district.client_site = 0)';
            } elseif ($format === 'У учня') {
                $formatConditions[] = 'EXISTS (SELECT 1 FROM Districts AS format_district WHERE format_district.specialist_id = s.id AND format_district.client_site = 1)';
            }
        }
        if ($formatConditions !== []) $where[] = '(' . implode(' OR ', $formatConditions) . ')';
    }

    $whereSql = implode("\n AND ", $where);
    $totalRow = fetch_one($db, "SELECT COUNT(*) AS total FROM Specialists AS s WHERE $whereSql", $params);
    $total = (int) ($totalRow['total'] ?? 0);
    $totalPages = max(1, (int) ceil($total / $perPage));
    $page = min($page, $totalPages);
    $offset = ($page - 1) * $perPage;

    $rows = execute_sql($db, "
        SELECT s.*, u.name AS user_name, u.first_name AS user_first_name, u.last_name AS user_last_name
        FROM Specialists AS s
        INNER JOIN Users AS u ON u.id = s.user_id
        WHERE $whereSql
        ORDER BY s.rating DESC, s.reviews_count DESC, s.created_at DESC, s.id DESC
        LIMIT $perPage OFFSET $offset
        ", $params)->fetchAll();

    $listings = [];
    foreach ($rows as $row) {
        $specialtyRows = execute_sql($db, <<<'SQL'
            SELECT r.title, sr.is_primary
            FROM SpecialistRecords AS sr
            INNER JOIN Catalog_record AS r ON r.id = sr.catalog_record_id
            WHERE sr.specialist_id = ? AND r.enabled = 1
            ORDER BY sr.is_primary DESC, sr.sort_order, sr.id
            SQL, [(int) $row['id']])->fetchAll();
        $specialties = array_values(array_unique(array_map(
            fn(array $item): string => clean_text($item['title'] ?? '', 160),
            $specialtyRows
        )));
        $specialties = array_values(array_filter($specialties));

        $reviewRows = execute_sql($db, <<<'SQL'
            SELECT c.id, c.body, c.rating, c.likes, c.dislikes, c.created_at,
              coalesce(u.first_name, u.name, 'Користувач') AS author
            FROM Comments AS c
            LEFT JOIN Users AS u ON u.id = c.user_id
            WHERE c.specialist_id = ? AND c.moderated = 1
            ORDER BY c.created_at DESC, c.id DESC
            SQL, [(int) $row['id']])->fetchAll();
        $reviews = array_map(fn(array $review): array => [
            'id' => 'comment-' . (int) $review['id'],
            'author' => clean_text($review['author'] ?? 'Користувач', 160),
            'date' => substr((string) ($review['created_at'] ?? ''), 0, 10),
            'rating' => (float) ($review['rating'] ?? 0),
            'text' => clean_text($review['body'] ?? '', 2000),
            'likes' => (int) ($review['likes'] ?? 0),
            'dislikes' => (int) ($review['dislikes'] ?? 0),
        ], $reviewRows);

        $phoneRows = execute_sql($db, 'SELECT phone FROM Phones WHERE user_id = ? ORDER BY id', [(int) $row['user_id']])->fetchAll();
        $phones = array_values(array_map(fn(array $item): string => (string) $item['phone'], $phoneRows));
        $districtRows = execute_sql($db, <<<'SQL'
            SELECT d.client_site, e.name
            FROM Districts AS d
            INNER JOIN entries AS e ON e.l5_parent_id = d.district_id
            WHERE d.specialist_id = ?
            ORDER BY e.name
            SQL, [(int) $row['id']])->fetchAll();
        $specialistDistricts = [];
        $studentDistricts = [];
        foreach ($districtRows as $districtRow) {
            $districtName = clean_text($districtRow['name'] ?? '', 120);
            if ($districtName === '') continue;
            if ((int) $districtRow['client_site'] === 1) {
                $studentDistricts[] = $districtName;
            } else {
                $specialistDistricts[] = $districtName;
            }
        }
        $districts = array_values(array_unique([...$specialistDistricts, ...$studentDistricts]));
        $formats = [];
        if ((int) ($row['online'] ?? 0) === 1) $formats[] = 'Онлайн';
        if ($specialistDistricts !== []) $formats[] = 'У фахівця';
        if ($studentDistricts !== []) $formats[] = 'У учня';
        $cityId = clean_text($row['city'] ?? '', 80);
        $name = clean_text($row['user_name'] ?? '', 160);
        if ($specialties === []) $specialties = ['Фахівець'];
        $primarySpecialty = $specialties[0] ?? 'Фахівець';
        $bio = clean_text($row['bio'] ?? '', 2000);
        $listings[] = [
            'id' => (int) $row['id'],
            'name' => $name,
            'initials' => listing_user_initials($row),
            'specialty' => $primarySpecialty,
            'specialties' => $specialties,
            'regionId' => listing_region_id($cityId),
            'city' => $cityId,
            'district' => implode(', ', $districts),
            'districts' => $districts,
            'specialistDistricts' => $specialistDistricts,
            'studentDistricts' => $studentDistricts,
            'phones' => $phones,
            'formats' => $formats,
            'rating' => (float) ($row['rating'] ?? 0),
            'reviews' => count($reviews),
            'price' => (int) ($row['price'] ?? 0),
            'duration' => (int) ($row['duration_minutes'] ?? 60),
            'next' => 'За домовленістю',
            'createdAt' => substr((string) ($row['created_at'] ?? ''), 0, 10),
            'status' => clean_text($row['status'] ?? 'active', 40),
            'verified' => false,
            'headline' => $primarySpecialty,
            'education' => clean_text($row['education'] ?? '', 1000) ?: 'Не вказано',
            'experience' => $row['experience'] === null ? null : (int) $row['experience'],
            'audience' => 'Не вказано',
            'offer' => [
                'title' => $primarySpecialty,
                'focus' => $bio,
                'format' => $formats !== [] ? implode(', ', $formats) : 'Не вказано',
            ],
            'tags' => array_slice($specialties, 0, 3),
            'about' => $bio,
            'reviewItems' => $reviews,
        ];
    }
    $categoryRows = execute_sql($db, <<<'SQL'
        SELECT r.title, COUNT(DISTINCT s.id) AS specialist_count
        FROM Specialists AS s
        INNER JOIN SpecialistRecords AS count_sr ON count_sr.specialist_id = s.id
        INNER JOIN Catalog_record AS r ON r.id = count_sr.catalog_record_id AND r.enabled = 1
        WHERE s.user_id IS NOT NULL AND s.status = 'active'
        GROUP BY r.id, r.title
        SQL)->fetchAll();
    $categoryCounts = [];
    foreach ($categoryRows as $categoryRow) {
        $categoryCounts[(string) $categoryRow['title']] = (int) $categoryRow['specialist_count'];
    }
    $catalogTotalRow = fetch_one($db, "SELECT COUNT(*) AS total FROM Specialists WHERE user_id IS NOT NULL AND status = 'active'");

    return [
        'listings' => $listings,
        'pagination' => [
            'page' => $page,
            'perPage' => $perPage,
            'total' => $total,
            'totalPages' => $totalPages,
        ],
        'catalogTotal' => (int) ($catalogTotalRow['total'] ?? 0),
        'categoryCounts' => $categoryCounts,
    ];
});
