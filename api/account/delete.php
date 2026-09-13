<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/bootstrap.php';
run_endpoint(function (): array {
    require_method('POST'); require_same_origin();
    $user = current_user(true);
    $payload = read_json();
    if (($payload['confirmation'] ?? '') !== 'DELETE_ACCOUNT' || ($payload['confirmations'] ?? null) !== 2) throw new ApiError(400, 'Two deletion confirmations are required');
    transaction(function (PDO $db) use ($user): void {
        $statement = execute_sql($db, 'DELETE FROM Users WHERE id = ?', [(int) $user['id']]);
        if ($statement->rowCount() !== 1) throw new ApiError(400, 'User account was not found');
    });
    destroy_current_session();
    return ['deleted' => true];
});
