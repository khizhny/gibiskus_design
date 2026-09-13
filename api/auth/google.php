<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/bootstrap.php';
run_endpoint(function (): array {
    require_method('POST');
    require_same_origin();
    $payload = read_json();
    $credential = clean_text($payload['credential'] ?? '', 20000);
    $mode = clean_text($payload['mode'] ?? '', 20);
    if ($credential === '' || !in_array($mode, ['login', 'register'], true)) throw new ApiError(400, 'Missing or invalid Google authentication data');
    $registration = null;
    if ($mode === 'register') {
        if (($payload['privacyAccepted'] ?? false) !== true) throw new ApiError(400, 'Missing or invalid registration data');
        $registration = $payload;
    }
    return authenticated_response(save_google_user($registration, verify_google_credential($credential), $mode));
});

