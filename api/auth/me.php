<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/bootstrap.php';
run_endpoint(function (): array {
    require_method('GET');
    $user = current_user();
    if ($user === null) throw new ApiError(401, 'Authentication required');
    return ['authenticated' => true, 'user' => $user];
});

