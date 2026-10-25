<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

function admin_catalog_items(PDO $db): array
{
    return execute_sql($db, <<<'SQL'
        SELECT
          g.id AS group_id, g.title AS group_title, g.sort_order AS group_sort,
          s.id AS subgroup_id, s.title AS subgroup_title,
          s.description AS subgroup_description, s.sort_order AS subgroup_sort,
          r.id AS record_id, r.title AS record_title, r.sort_order AS record_sort,
          (
            SELECT COUNT(*)
            FROM Specialists AS sp
            WHERE EXISTS (
                 SELECT 1
                 FROM SpecialistRecords AS sr
                 WHERE sr.specialist_id = sp.id AND sr.catalog_record_id = r.id
               )
          ) AS specialist_count
        FROM Catalog_groups AS g
        INNER JOIN Catalog_subgroups AS s ON s.group_id = g.id AND s.enabled = 1
        INNER JOIN Catalog_record AS r ON r.subgroup_id = s.id AND r.enabled = 1
        WHERE g.enabled = 1
        ORDER BY g.sort_order, g.id, s.sort_order, s.id, r.sort_order, r.id
        SQL)->fetchAll();
}

function positive_catalog_id(mixed $value, string $label): int
{
    $id = filter_var($value, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($id === false) {
        throw new ApiError(400, $label . ' is invalid');
    }
    return (int) $id;
}

function require_catalog_subgroup(PDO $db, mixed $value): int
{
    $subgroupId = positive_catalog_id($value, 'Catalog subgroup');
    $subgroup = fetch_one($db, <<<'SQL'
        SELECT s.id
        FROM Catalog_subgroups AS s
        INNER JOIN Catalog_groups AS g ON g.id = s.group_id
        WHERE s.id = ? AND s.enabled = 1 AND g.enabled = 1
        SQL, [$subgroupId]);
    if ($subgroup === null) {
        throw new ApiError(404, 'Catalog subgroup was not found');
    }
    return $subgroupId;
}

function require_unique_catalog_title(PDO $db, int $subgroupId, string $title, int $exceptRecordId = 0): void
{
    $duplicate = fetch_one($db, <<<'SQL'
        SELECT id
        FROM Catalog_record
        WHERE subgroup_id = ? AND enabled = 1 AND LOWER(title) = LOWER(?) AND id <> ?
        LIMIT 1
        SQL, [$subgroupId, $title, $exceptRecordId]);
    if ($duplicate !== null) {
        throw new ApiError(409, 'Такий запис уже є в цій категорії.');
    }
}

run_endpoint(function (): array {
    $method = $_SERVER['REQUEST_METHOD'] ?? '';
    require_admin();
    $db = database();

    if ($method === 'GET') {
        return ['items' => admin_catalog_items($db)];
    }

    if ($method !== 'POST') {
        header('Allow: GET, POST');
        throw new ApiError(405, 'Method not allowed');
    }

    require_same_origin();
    $payload = read_json();
    $action = clean_text($payload['action'] ?? '', 20);

    if ($action === 'create') {
        $subgroupId = require_catalog_subgroup($db, $payload['subgroupId'] ?? null);
        $title = clean_text($payload['title'] ?? '', 255);
        if ($title === '') throw new ApiError(400, 'Вкажіть назву запису.');
        require_unique_catalog_title($db, $subgroupId, $title);
        $sortOrder = (int) (fetch_one($db, 'SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM Catalog_record WHERE subgroup_id = ?', [$subgroupId])['next_order'] ?? 1);
        execute_sql($db, 'INSERT INTO Catalog_record (subgroup_id, title, sort_order, enabled) VALUES (?, ?, ?, 1)', [$subgroupId, $title, $sortOrder]);
        return ['items' => admin_catalog_items($db), 'message' => 'Запис додано.', '_status' => 201];
    }

    $recordId = positive_catalog_id($payload['recordId'] ?? null, 'Catalog record');
    $record = fetch_one($db, 'SELECT id, subgroup_id, title FROM Catalog_record WHERE id = ? AND enabled = 1', [$recordId]);
    if ($record === null) throw new ApiError(404, 'Запис каталогу не знайдено.');

    if ($action === 'update') {
        $subgroupId = require_catalog_subgroup($db, $payload['subgroupId'] ?? null);
        $title = clean_text($payload['title'] ?? '', 255);
        if ($title === '') throw new ApiError(400, 'Вкажіть назву запису.');
        require_unique_catalog_title($db, $subgroupId, $title, $recordId);
        execute_sql($db, 'UPDATE Catalog_record SET subgroup_id = ?, title = ? WHERE id = ?', [$subgroupId, $title, $recordId]);
        return ['items' => admin_catalog_items($db), 'message' => 'Запис оновлено.'];
    }

    if ($action === 'delete') {
        $usage = fetch_one($db, <<<'SQL'
            SELECT
              (SELECT COUNT(*) FROM SpecialistRecords WHERE catalog_record_id = ?) +
              (SELECT COUNT(*) FROM Requests WHERE catalog_record_id = ?) AS usage_count
            SQL, [$recordId, $recordId]);
        if ((int) ($usage['usage_count'] ?? 0) > 0) {
            throw new ApiError(409, 'Неможливо видалити: до цього напрямку прив’язані записи.');
        }
        execute_sql($db, 'DELETE FROM Catalog_record WHERE id = ?', [$recordId]);
        return ['items' => admin_catalog_items($db), 'message' => 'Запис видалено.'];
    }

    throw new ApiError(400, 'Unknown catalog action');
});
