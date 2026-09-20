<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

run_endpoint(function (): array {
    require_method('POST');
    require_same_origin();
    $user = current_user(true);
    return update_specialist_listing((int) $user['id'], read_json());
});
