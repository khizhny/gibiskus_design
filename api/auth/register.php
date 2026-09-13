<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/bootstrap.php';
run_endpoint(function (): array {
    require_method('POST');
    require_same_origin();
    return authenticated_response(register_email_user(read_json()));
});

