<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/bootstrap.php';
run_endpoint(function (): array {
    $method = $_SERVER['REQUEST_METHOD'] ?? '';
    require_admin();
    if ($method === 'GET') {
        return ['settings' => smtp_settings_data()];
    }
    if ($method === 'POST') {
        require_same_origin();
        return ['settings' => save_smtp_settings(read_json())];
    }
    header('Allow: GET, POST');
    throw new ApiError(405, 'Method not allowed');
});
