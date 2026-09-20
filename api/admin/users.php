<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/bootstrap.php';
run_endpoint(function (): array {
    $method = $_SERVER['REQUEST_METHOD'] ?? '';
    $admin = require_admin();
    if ($method === 'GET') {
        return ['users' => admin_users_data((int) $admin['id'])];
    }
    if ($method === 'POST') {
        require_same_origin();
        $payload = read_json();
        if (($payload['confirmation'] ?? '') !== 'DELETE_USER') {
            throw new ApiError(400, 'User deletion confirmation is required');
        }
        return ['deleted' => true, 'userId' => delete_user_as_admin((int) $admin['id'], $payload['userId'] ?? null)];
    }
    header('Allow: GET, POST');
    throw new ApiError(405, 'Method not allowed');
});
