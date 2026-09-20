<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

function decode_string_list(mixed $value): array
{
    if (!is_string($value) || trim($value) === '') return [];
    try {
        $items = json_decode($value, true, 64, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        return [];
    }
    if (!is_array($items)) return [];
    return array_values(array_filter(array_map(
        fn(mixed $item): string => clean_text($item, 160),
        $items
    ), fn(string $item): bool => $item !== ''));
}

function listing_region_id(string $cityId): string
{
    if ($cityId === '' || !str_starts_with($cityId, 'UA')) return '';
    static $map = null;
    static $cache = [];
    if (array_key_exists($cityId, $cache)) return $cache[$cityId];
    try {
        if (!$map instanceof PDO) {
            $path = env_value('MAP_DB_PATH', dirname(__DIR__) . '/database/map.sqlite');
            if (!is_file($path) || !is_readable($path)) return $cache[$cityId] = '';
            $map = new PDO('sqlite:' . $path, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        }
        $row = fetch_one($map, <<<'SQL'
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

run_endpoint(function (): array {
    require_method('GET');
    $db = database();
    $rows = execute_sql($db, <<<'SQL'
        SELECT s.*
        FROM Specialists AS s
        INNER JOIN Users AS u ON u.id = s.user_id
        WHERE s.user_id IS NOT NULL AND s.status = 'active'
        ORDER BY s.created_at DESC, s.id DESC
        SQL)->fetchAll();

    $listings = [];
    foreach ($rows as $row) {
        $expiresAt = (string) ($row['expires_at'] ?? '');
        if ($expiresAt !== '' && strtotime($expiresAt) !== false && strtotime($expiresAt) <= time()) {
            continue;
        }
        $specialtyRows = execute_sql($db, <<<'SQL'
            SELECT r.title, sr.is_primary
            FROM SpecialistRecords AS sr
            INNER JOIN Catalog_record AS r ON r.id = sr.catalog_record_id
            WHERE sr.specialist_id = ? AND r.enabled = 1
            ORDER BY sr.is_primary DESC, sr.sort_order, sr.id
            SQL, [(int) $row['id']])->fetchAll();
        if ($specialtyRows === [] && $row['catalog_record_id'] !== null) {
            $fallback = fetch_one($db, 'SELECT title, 1 AS is_primary FROM Catalog_record WHERE id = ? AND enabled = 1', [(int) $row['catalog_record_id']]);
            if ($fallback !== null) $specialtyRows[] = $fallback;
        }
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

        $formats = decode_string_list($row['formats_json'] ?? '');
        $nosologies = decode_string_list($row['nosologies_json'] ?? '');
        $cityId = clean_text($row['city'] ?? '', 80);
        $name = clean_text($row['name'] ?? '', 160);
        if ($specialties === []) $specialties = ['Фахівець'];
        $primarySpecialty = $specialties[0] ?? 'Фахівець';
        $bio = clean_text($row['bio'] ?? '', 2000);
        $listings[] = [
            'id' => (int) $row['id'],
            'name' => $name,
            'initials' => clean_text($row['initials'] ?? '', 12),
            'specialty' => $primarySpecialty,
            'specialties' => $specialties,
            'regionId' => listing_region_id($cityId),
            'city' => $cityId,
            'district' => clean_text($row['district'] ?? '', 160),
            'formats' => $formats,
            'rating' => (float) ($row['rating'] ?? 0),
            'reviews' => count($reviews),
            'price' => (int) ($row['price'] ?? 0),
            'duration' => (int) ($row['duration_minutes'] ?? 60),
            'next' => clean_text($row['schedule'] ?? '', 160) ?: 'За домовленістю',
            'createdAt' => substr((string) ($row['created_at'] ?? ''), 0, 10),
            'expiresAt' => $expiresAt,
            'status' => clean_text($row['status'] ?? 'active', 40),
            'verified' => false,
            'headline' => $primarySpecialty,
            'education' => clean_text($row['education'] ?? '', 1000) ?: 'Не вказано',
            'experience' => clean_text($row['experience'] ?? '', 1000) ?: 'Не вказано',
            'worksWith' => $nosologies !== [] ? implode(', ', $nosologies) : 'Не вказано',
            'nosologies' => $nosologies,
            'audience' => 'Не вказано',
            'response' => clean_text($row['response_time'] ?? '', 160) ?: 'Не вказано',
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
    return ['listings' => $listings];
});
