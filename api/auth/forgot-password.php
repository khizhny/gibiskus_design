<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/bootstrap.php';
run_endpoint(function (): array {
    require_method('POST');
    require_same_origin();
    $payload = read_json();
    return request_password_reset($payload['email'] ?? '');
});
