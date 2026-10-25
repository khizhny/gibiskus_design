<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

run_endpoint(function (): array {
    $method = $_SERVER['REQUEST_METHOD'] ?? '';
    $user = current_user(true);
    $db = database();

    if ($method === 'GET') {
        $activeRows = execute_sql($db, <<<'SQL'
            SELECT g.id AS group_id, s.title AS group_title
            FROM Catalog_groups AS g
            INNER JOIN Catalog_subgroups AS s ON s.group_id = g.id AND s.enabled = 1
            WHERE g.enabled = 1
            ORDER BY g.sort_order, g.id, s.sort_order, s.id
            SQL)->fetchAll();
        $pendingRows = execute_sql($db, <<<'SQL'
            SELECT DISTINCT group_id, group_title
            FROM CatalogSuggestions
            WHERE user_id = ? AND status = 'pending' AND record_title IS NULL
            ORDER BY group_title
            SQL, [(int) $user['id']])->fetchAll();
        $categories = [];
        $seen = [];
        foreach ($activeRows as $row) {
            $key = (int) $row['group_id'] . ':' . strtolower((string) $row['group_title']);
            $seen[$key] = true;
            $categories[] = ['groupId' => (int) $row['group_id'], 'groupTitle' => (string) $row['group_title'], 'pending' => false];
        }
        foreach ($pendingRows as $row) {
            $key = (int) $row['group_id'] . ':' . strtolower((string) $row['group_title']);
            if (isset($seen[$key])) continue;
            $categories[] = ['groupId' => (int) $row['group_id'], 'groupTitle' => (string) $row['group_title'], 'pending' => true];
        }
        return ['categories' => $categories];
    }

    if ($method !== 'POST') {
        header('Allow: GET, POST');
        throw new ApiError(405, 'Method not allowed');
    }

    require_same_origin();
    $payload = read_json();

    $groupId = filter_var($payload['groupId'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($groupId === false) throw new ApiError(400, 'Оберіть розділ каталогу.');

    $groupTitle = clean_text($payload['groupTitle'] ?? '', 255);
    $recordTitle = clean_text($payload['recordTitle'] ?? '', 255);
    if ($groupTitle === '' && $recordTitle === '') {
        throw new ApiError(400, 'Введіть нову категорію або спеціальність.');
    }

    $section = fetch_one($db, 'SELECT id FROM Catalog_groups WHERE id = ? AND enabled = 1', [(int) $groupId]);
    if ($section === null) throw new ApiError(404, 'Розділ каталогу не знайдено.');

    $subgroup = fetch_one($db, 'SELECT id FROM Catalog_subgroups WHERE group_id = ? AND LOWER(title) = LOWER(?) LIMIT 1', [(int) $groupId, $groupTitle]);
    if ($subgroup !== null && $recordTitle === '') {
        throw new ApiError(409, 'Така категорія вже є в каталозі.');
    }
    if ($subgroup !== null && $recordTitle !== '') {
        $record = fetch_one($db, 'SELECT id FROM Catalog_record WHERE subgroup_id = ? AND LOWER(title) = LOWER(?) AND enabled = 1 LIMIT 1', [(int) $subgroup['id'], $recordTitle]);
        if ($record !== null) throw new ApiError(409, 'Така спеціальність уже є в каталозі.');
    }

    $duplicate = fetch_one($db, <<<'SQL'
        SELECT id
        FROM CatalogSuggestions
        WHERE status = 'pending' AND group_id = ?
          AND LOWER(group_title) = LOWER(?)
          AND LOWER(COALESCE(record_title, '')) = LOWER(?)
        LIMIT 1
        SQL, [(int) $groupId, $groupTitle, $recordTitle]);
    if ($duplicate !== null) {
        return [
            'message' => 'Така пропозиція вже очікує затвердження.',
            'id' => (int) $duplicate['id'],
            'category' => ['groupId' => (int) $groupId, 'groupTitle' => $groupTitle, 'pending' => true],
        ];
    }

    execute_sql($db, <<<'SQL'
        INSERT INTO CatalogSuggestions (user_id, group_id, group_title, record_title, status)
        VALUES (?, ?, ?, NULLIF(?, ''), 'pending')
        SQL, [(int) $user['id'], (int) $groupId, $groupTitle, $recordTitle]);

    return [
        'message' => 'Пропозицію надіслано адміністратору.',
        'id' => (int) $db->lastInsertId(),
        'category' => ['groupId' => (int) $groupId, 'groupTitle' => $groupTitle, 'pending' => true],
        '_status' => 201,
    ];
});
