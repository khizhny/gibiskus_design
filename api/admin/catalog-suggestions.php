<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

function catalog_suggestion_items(PDO $db): array
{
    $rows = execute_sql($db, <<<'SQL'
        SELECT cs.id, cs.group_id, cs.group_title, cs.record_title, cs.status, cs.created_at,
          g.title AS section_title, u.name AS suggested_by
        FROM CatalogSuggestions AS cs
        INNER JOIN Catalog_groups AS g ON g.id = cs.group_id
        INNER JOIN Users AS u ON u.id = cs.user_id
        WHERE cs.status = 'pending'
        ORDER BY cs.created_at DESC, cs.id DESC
        SQL)->fetchAll();

    return array_map(static fn(array $row): array => [
        'id' => (int) $row['id'],
        'groupId' => (int) $row['group_id'],
        'sectionTitle' => (string) $row['section_title'],
        'groupTitle' => (string) $row['group_title'],
        'recordTitle' => (string) ($row['record_title'] ?? ''),
        'suggestedBy' => (string) $row['suggested_by'],
        'suggestedAt' => substr((string) $row['created_at'], 0, 10),
        'status' => (string) $row['status'],
        'enabled' => false,
    ], $rows);
}

run_endpoint(function (): array {
    $method = $_SERVER['REQUEST_METHOD'] ?? '';
    $admin = require_admin();
    $db = database();

    if ($method === 'GET') return ['items' => catalog_suggestion_items($db)];
    if ($method !== 'POST') {
        header('Allow: GET, POST');
        throw new ApiError(405, 'Method not allowed');
    }

    require_same_origin();
    $payload = read_json();
    $suggestionId = filter_var($payload['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($suggestionId === false) throw new ApiError(400, 'Некоректна пропозиція.');
    $action = clean_text($payload['action'] ?? '', 20);
    if (!in_array($action, ['approve', 'reject'], true)) throw new ApiError(400, 'Некоректна дія.');

    transaction(function (PDO $db) use ($suggestionId, $action, $payload, $admin): void {
        $suggestion = fetch_one($db, 'SELECT * FROM CatalogSuggestions WHERE id = ? AND status = \'pending\' FOR UPDATE', [(int) $suggestionId]);
        if ($suggestion === null) throw new ApiError(404, 'Пропозицію не знайдено або вже опрацьовано.');

        if ($action === 'reject') {
            execute_sql($db, "UPDATE CatalogSuggestions SET status = 'rejected', reviewed_at = CURRENT_TIMESTAMP, reviewed_by = ? WHERE id = ?", [(int) $admin['id'], (int) $suggestionId]);
            return;
        }

        $groupTitle = clean_text($payload['groupTitle'] ?? $suggestion['group_title'], 255);
        $recordTitle = clean_text($payload['recordTitle'] ?? $suggestion['record_title'], 255);
        if ($groupTitle === '') throw new ApiError(400, 'Вкажіть назву категорії.');

        $subgroup = fetch_one($db, 'SELECT id FROM Catalog_subgroups WHERE group_id = ? AND LOWER(title) = LOWER(?) LIMIT 1', [(int) $suggestion['group_id'], $groupTitle]);
        if ($subgroup === null) {
            $sortOrder = (int) (fetch_one($db, 'SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM Catalog_subgroups WHERE group_id = ?', [(int) $suggestion['group_id']])['next_order'] ?? 1);
            execute_sql($db, 'INSERT INTO Catalog_subgroups (group_id, title, description, sort_order, enabled) VALUES (?, ?, ?, ?, 1)', [(int) $suggestion['group_id'], $groupTitle, 'Запропоновано користувачем.', $sortOrder]);
            $subgroupId = (int) $db->lastInsertId();
        } else {
            $subgroupId = (int) $subgroup['id'];
            execute_sql($db, 'UPDATE Catalog_subgroups SET title = ?, enabled = 1 WHERE id = ?', [$groupTitle, $subgroupId]);
        }

        if ($recordTitle !== '') {
            $record = fetch_one($db, 'SELECT id FROM Catalog_record WHERE subgroup_id = ? AND LOWER(title) = LOWER(?) LIMIT 1', [$subgroupId, $recordTitle]);
            if ($record === null) {
                $sortOrder = (int) (fetch_one($db, 'SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM Catalog_record WHERE subgroup_id = ?', [$subgroupId])['next_order'] ?? 1);
                execute_sql($db, 'INSERT INTO Catalog_record (subgroup_id, title, sort_order, enabled) VALUES (?, ?, ?, 1)', [$subgroupId, $recordTitle, $sortOrder]);
            } else {
                execute_sql($db, 'UPDATE Catalog_record SET title = ?, enabled = 1 WHERE id = ?', [$recordTitle, (int) $record['id']]);
            }
        }

        execute_sql($db, "UPDATE CatalogSuggestions SET group_title = ?, record_title = NULLIF(?, ''), status = 'approved', reviewed_at = CURRENT_TIMESTAMP, reviewed_by = ? WHERE id = ?", [$groupTitle, $recordTitle, (int) $admin['id'], (int) $suggestionId]);
    });

    return [
        'items' => catalog_suggestion_items($db),
        'message' => $action === 'approve' ? 'Категорію та спеціальність додано до каталогу.' : 'Пропозицію відхилено.',
    ];
});
