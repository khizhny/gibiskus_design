<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

run_endpoint(function (): array {
    require_method('GET');
    $db = database();
    $resource = clean_text($_GET['resource'] ?? '', 40);

    if ($resource === 'regions') {
        return ['items' => execute_sql($db, <<<'SQL'
            SELECT l1_parent_id AS oblast_id, name
            FROM entries
            WHERE l2_parent_id IS NULL
            ORDER BY name
            SQL)->fetchAll()];
    }
    if ($resource === 'cities') {
        $region = clean_text($_GET['region'] ?? '', 80);
        if ($region === '') throw new ApiError(400, 'Region is required');
        return ['items' => execute_sql($db, <<<'SQL'
            SELECT name AS city_name, COALESCE(l4_parent_id, l1_parent_id) AS city_id
            FROM entries
            WHERE type IN (2, 5) AND l1_parent_id = ?
            ORDER BY type ASC, name
            SQL, [$region])->fetchAll()];
    }
    if ($resource === 'districts') {
        $city = clean_text($_GET['city'] ?? '', 80);
        if ($city === '') throw new ApiError(400, 'City is required');
        return ['items' => execute_sql($db, <<<'SQL'
            SELECT name AS district_name, l5_parent_id AS district_id
            FROM entries
            WHERE type = 9 AND l4_parent_id = ?
            ORDER BY name
            SQL, [$city])->fetchAll()];
    }
    if ($resource === 'city') {
        $city = clean_text($_GET['city'] ?? '', 80);
        if ($city === '') throw new ApiError(400, 'City is required');
        $item = fetch_one($db, <<<'SQL'
            SELECT name, l1_parent_id AS region_id
            FROM entries
            WHERE type IN (2, 5, 7, 8) AND (l4_parent_id = ? OR l1_parent_id = ?)
            ORDER BY type ASC
            LIMIT 1
            SQL, [$city, $city]);
        return ['item' => $item];
    }
    if ($resource === 'catalog') {
        return ['items' => execute_sql($db, <<<'SQL'
            SELECT
              g.id AS group_id, g.title AS group_title, g.sort_order AS group_sort,
              s.id AS subgroup_id, s.title AS subgroup_title,
              s.description AS subgroup_description, s.sort_order AS subgroup_sort,
              r.id AS record_id, r.title AS record_title, r.sort_order AS record_sort
            FROM Catalog_groups AS g
            INNER JOIN Catalog_subgroups AS s ON s.group_id = g.id AND s.enabled = 1
            INNER JOIN Catalog_record AS r ON r.subgroup_id = s.id AND r.enabled = 1
            WHERE g.enabled = 1
            ORDER BY g.sort_order, g.id, s.sort_order, s.id, r.sort_order, r.id
            SQL)->fetchAll()];
    }

    throw new ApiError(400, 'Unknown reference resource');
});
