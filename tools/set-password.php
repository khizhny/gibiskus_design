<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require_once dirname(__DIR__) . '/api/bootstrap.php';

if ($argc !== 3) {
    fwrite(STDERR, "Usage: php tools/set-password.php user@example.com 'new password'\n");
    exit(2);
}

$email = normalize_email($argv[1]);
$password = validate_password($argv[2]);
$db = database();
$user = fetch_one($db, 'SELECT id AS user_id FROM Users WHERE lower(email) = lower(?) LIMIT 1', [$email]);
if ($user === null) {
    fwrite(STDERR, "Account not found.\n");
    exit(1);
}
$algorithm = defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_BCRYPT;
$hash = password_hash($password, $algorithm);
if ($hash === false) {
    fwrite(STDERR, "Password hashing failed.\n");
    exit(1);
}
execute_sql($db, <<<'SQL'
    INSERT INTO UserCredentials (user_id, password_hash, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET password_hash = excluded.password_hash, updated_at = CURRENT_TIMESTAMP
    SQL, [(int) $user['user_id'], $hash]);
fwrite(STDOUT, "Password updated.\n");
