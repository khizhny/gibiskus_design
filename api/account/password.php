<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/bootstrap.php';
run_endpoint(function (): array {
    require_method('POST');
    require_same_origin();
    $user = current_user(true);
    return change_account_password((int) $user['id'], read_json());
});
