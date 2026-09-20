<?php

declare(strict_types=1);

const SESSION_COOKIE_NAME = 'site_php_session';
const SESSION_TTL_SECONDS = 604800;
const DEFAULT_GOOGLE_CLIENT_ID = '151504652377-jn5pfpqgf7vc4k04ce9bkmph653d88ad.apps.googleusercontent.com';

final class ApiError extends RuntimeException
{
    public function __construct(public readonly int $status, string $message)
    {
        parent::__construct($message);
    }
}

function env_value(string $name, string $default = ''): string
{
    $configured = $GLOBALS['APP_CONFIG'][$name] ?? null;
    if (is_string($configured) && trim($configured) !== '') {
        return trim($configured);
    }
    $value = getenv($name);
    return $value === false ? $default : trim((string) $value);
}

function json_response(int $status, array $payload): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    exit;
}

function run_endpoint(callable $handler): never
{
    try {
        $result = $handler();
        if (is_array($result) && array_key_exists('_status', $result)) {
            $status = (int) $result['_status'];
            unset($result['_status']);
            json_response($status, $result);
        }
        json_response(200, is_array($result) ? $result : []);
    } catch (ApiError $error) {
        json_response($error->status, ['message' => $error->getMessage()]);
    } catch (Throwable $error) {
        error_log('PHP API failure: ' . $error->getMessage());
        json_response(500, ['message' => 'The service is temporarily unavailable']);
    }
}

function require_method(string $method): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== $method) {
        header('Allow: ' . $method);
        throw new ApiError(405, 'Method not allowed');
    }
}

function require_same_origin(): void
{
    $origin = trim((string) ($_SERVER['HTTP_ORIGIN'] ?? ''));
    $host = strtolower(trim((string) ($_SERVER['HTTP_HOST'] ?? '')));
    if ($origin === '' || $host === '') {
        throw new ApiError(403, 'Cross-origin request rejected');
    }
    $originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
    $originPort = parse_url($origin, PHP_URL_PORT);
    $originAuthority = $originHost . ($originPort === null ? '' : ':' . $originPort);
    $scheme = strtolower((string) parse_url($origin, PHP_URL_SCHEME));
    if (!in_array($scheme, ['http', 'https'], true) || !hash_equals($host, $originAuthority)) {
        throw new ApiError(403, 'Cross-origin request rejected');
    }
}

function read_json(): array
{
    $length = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($length <= 0 || $length > 1_000_000) {
        throw new ApiError(400, 'Invalid request size');
    }
    $raw = file_get_contents('php://input');
    if ($raw === false) {
        throw new ApiError(400, 'Request body could not be read');
    }
    try {
        $payload = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        throw new ApiError(400, 'Request body must be valid JSON');
    }
    if (!is_array($payload)) {
        throw new ApiError(400, 'Request body must be a JSON object');
    }
    return $payload;
}

function clean_text(mixed $value, int $maxLength): string
{
    $text = trim((string) ($value ?? ''));
    $text = preg_replace('/\s+/u', ' ', $text) ?? '';
    return function_exists('mb_substr') ? mb_substr($text, 0, $maxLength) : substr($text, 0, $maxLength);
}

function normalize_email(mixed $value): string
{
    $email = strtolower(clean_text($value, 320));
    if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        throw new ApiError(400, 'Enter a valid email address');
    }
    return $email;
}

function normalize_phone(mixed $value): string
{
    $phone = preg_replace('/[\s()\-]/', '', clean_text($value, 40)) ?? '';
    if (!preg_match('/^\+380[0-9]{9}$/', $phone)) {
        throw new ApiError(400, 'Введіть номер телефону у форматі +380XXXXXXXXX');
    }
    return $phone;
}

function validate_password(mixed $value): string
{
    $password = (string) ($value ?? '');
    $length = strlen($password);
    if ($length < 8 || $length > 128) {
        throw new ApiError(400, 'Password must contain between 8 and 128 characters');
    }
    return $password;
}

function database(): PDO
{
    static $connection = null;
    if ($connection instanceof PDO) {
        return $connection;
    }
    if (!extension_loaded('pdo_sqlite')) {
        throw new RuntimeException('PHP extension pdo_sqlite is required');
    }
    $path = env_value('SITE_DB_PATH', dirname(__DIR__) . '/database/site.sqlite');
    if (!is_file($path)) {
        throw new RuntimeException('SQLite database not found: ' . $path);
    }
    $connection = new PDO('sqlite:' . $path, null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT => 10,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    $connection->exec('PRAGMA foreign_keys = ON');
    $connection->exec('PRAGMA busy_timeout = 10000');
    $connection->exec(<<<'SQL'
        CREATE TABLE IF NOT EXISTS Admins (
          user_id INTEGER PRIMARY KEY,
          FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
        )
        SQL);
    $connection->exec(<<<'SQL'
        CREATE TABLE IF NOT EXISTS UserCredentials (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
        )
        SQL);
    $columns = $connection->query('PRAGMA table_info(Users)')->fetchAll();
    $columnNames = array_column($columns, 'name');
    if (in_array('role', $columnNames, true)) {
        $connection->exec("INSERT OR IGNORE INTO Admins (user_id) SELECT id FROM Users WHERE role = 'admin'");
    }
    if (!in_array('first_name', $columnNames, true)) $connection->exec('ALTER TABLE Users ADD COLUMN first_name TEXT');
    if (!in_array('last_name', $columnNames, true)) $connection->exec('ALTER TABLE Users ADD COLUMN last_name TEXT');
    $connection->exec('CREATE UNIQUE INDEX IF NOT EXISTS uq_emails_email_nocase ON Emails(lower(email))');
    return $connection;
}

function transaction(callable $callback): mixed
{
    $db = database();
    $db->beginTransaction();
    try {
        $result = $callback($db);
        $db->commit();
        return $result;
    } catch (Throwable $error) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        throw $error;
    }
}

function fetch_one(PDO $db, string $sql, array $params = []): ?array
{
    $statement = $db->prepare($sql);
    $statement->execute($params);
    $row = $statement->fetch();
    return $row === false ? null : $row;
}

function execute_sql(PDO $db, string $sql, array $params = []): PDOStatement
{
    $statement = $db->prepare($sql);
    $statement->execute($params);
    return $statement;
}

function initialise_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $forwardedProto = strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? ''));
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $forwardedProto === 'https';
    session_name(SESSION_COOKIE_NAME);
    session_set_cookie_params([
        'lifetime' => SESSION_TTL_SECONDS,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.gc_maxlifetime', (string) SESSION_TTL_SECONDS);
    session_start();
}

function landing_page_for_user(array $user): string
{
    return ($user['isAdmin'] ?? false) === true ? 'admin.html' : 'index.html';
}

function user_record(PDO $db, int $userId): array
{
    $row = fetch_one($db, <<<'SQL'
        SELECT u.id, u.external_id, u.name, u.first_name, u.last_name,
          EXISTS(SELECT 1 FROM Admins AS a WHERE a.user_id = u.id) AS is_admin,
          (SELECT email FROM Emails WHERE user_id = u.id ORDER BY is_primary DESC, id LIMIT 1) AS email,
          (SELECT phone FROM Phones WHERE user_id = u.id ORDER BY is_primary DESC, id LIMIT 1) AS phone
        FROM Users AS u
        WHERE u.id = ?
        SQL, [$userId]);
    if ($row === null) {
        throw new ApiError(404, 'User account was not found');
    }
    return [
        'id' => (int) $row['id'],
        'externalId' => (string) ($row['external_id'] ?? ''),
        'role' => ((int) $row['is_admin'] === 1) ? 'admin' : 'user',
        'isAdmin' => (int) $row['is_admin'] === 1,
        'name' => (string) $row['name'],
        'firstName' => (string) ($row['first_name'] ?? ''),
        'lastName' => (string) ($row['last_name'] ?? ''),
        'email' => (string) ($row['email'] ?? ''),
        'phone' => (string) ($row['phone'] ?? ''),
    ];
}

function current_user(bool $required = false): ?array
{
    initialise_session();
    $userId = filter_var($_SESSION['user_id'] ?? null, FILTER_VALIDATE_INT);
    if ($userId === false || $userId === null) {
        if ($required) {
            throw new ApiError(401, 'Authentication required');
        }
        return null;
    }
    try {
        return user_record(database(), (int) $userId);
    } catch (ApiError) {
        unset($_SESSION['user_id'], $_SESSION['is_admin']);
        if ($required) {
            throw new ApiError(401, 'Authentication required');
        }
        return null;
    }
}

function require_admin(): array
{
    $user = current_user(true);
    if (($user['isAdmin'] ?? false) !== true) {
        throw new ApiError(403, 'Administrator permission required');
    }
    return $user;
}

function authenticated_response(array $user): array
{
    initialise_session();
    session_regenerate_id(true);
    $_SESSION['user_id'] = (int) $user['id'];
    $_SESSION['is_admin'] = ($user['isAdmin'] ?? false) === true;
    $_SESSION['authenticated_at'] = time();
    return ['user' => $user, 'redirect' => landing_page_for_user($user)];
}

function destroy_current_session(): void
{
    initialise_session();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', [
            'expires' => time() - 42000,
            'path' => $params['path'],
            'domain' => $params['domain'],
            'secure' => $params['secure'],
            'httponly' => $params['httponly'],
            'samesite' => $params['samesite'] ?? 'Lax',
        ]);
    }
    session_destroy();
}

function set_primary_email(PDO $db, int $userId, string $email): void
{
    $conflict = fetch_one($db, 'SELECT user_id FROM Emails WHERE lower(email) = lower(?) AND user_id != ? LIMIT 1', [$email, $userId]);
    if ($conflict !== null) {
        throw new ApiError(400, 'This email is already used by another account');
    }
    execute_sql($db, 'UPDATE Emails SET is_primary = 0 WHERE user_id = ?', [$userId]);
    $stored = fetch_one($db, 'SELECT id FROM Emails WHERE user_id = ? AND lower(email) = lower(?) LIMIT 1', [$userId, $email]);
    if ($stored !== null) {
        execute_sql($db, 'UPDATE Emails SET email = ?, is_primary = 1 WHERE id = ?', [$email, (int) $stored['id']]);
    } else {
        execute_sql($db, 'INSERT INTO Emails (user_id, email, is_primary) VALUES (?, ?, 1)', [$userId, $email]);
    }
}

function set_primary_phone(PDO $db, int $userId, string $phone): void
{
    execute_sql($db, 'UPDATE Phones SET is_primary = 0 WHERE user_id = ?', [$userId]);
    $stored = fetch_one($db, 'SELECT id FROM Phones WHERE user_id = ? AND phone = ? LIMIT 1', [$userId, $phone]);
    if ($stored !== null) {
        execute_sql($db, 'UPDATE Phones SET is_primary = 1 WHERE id = ?', [(int) $stored['id']]);
    } else {
        execute_sql($db, 'INSERT INTO Phones (user_id, phone, is_primary) VALUES (?, ?, 1)', [$userId, $phone]);
    }
}

function verify_google_credential(string $credential): array
{
    $autoload = dirname(__DIR__) . '/vendor/autoload.php';
    if (!is_file($autoload)) {
        throw new RuntimeException('Google API client is not installed; run composer install');
    }
    require_once $autoload;
    try {
        $keySet = new Firebase\JWT\CachedKeySet(
            'https://www.googleapis.com/oauth2/v3/certs',
            new GuzzleHttp\Client(),
            new GuzzleHttp\Psr7\HttpFactory(),
            new Google\Auth\Cache\MemoryCacheItemPool()
        );
        $profile = (array) Firebase\JWT\JWT::decode($credential, $keySet);
    } catch (Throwable) {
        throw new ApiError(401, 'Google account could not be verified');
    }
    $clientId = env_value('GOOGLE_CLIENT_ID', DEFAULT_GOOGLE_CLIENT_ID);
    $audience = $profile['aud'] ?? '';
    $audienceMatches = is_array($audience)
        ? in_array($clientId, $audience, true)
        : hash_equals($clientId, (string) $audience);
    if (!$audienceMatches) throw new ApiError(401, 'Google token audience is invalid');
    if (!in_array($profile['iss'] ?? '', ['accounts.google.com', 'https://accounts.google.com'], true)) {
        throw new ApiError(401, 'Unexpected Google token issuer');
    }
    return $profile;
}

function save_google_user(?array $registration, array $googleProfile, string $mode): array
{
    $subject = clean_text($googleProfile['sub'] ?? '', 255);
    $email = normalize_email($googleProfile['email'] ?? '');
    $verified = in_array($googleProfile['email_verified'] ?? false, [true, 'true', 1, '1'], true);
    if ($subject === '' || !$verified) {
        throw new ApiError(400, 'Google account must provide a verified email address');
    }
    return transaction(function (PDO $db) use ($registration, $googleProfile, $mode, $subject, $email): array {
        $existing = fetch_one($db, 'SELECT id FROM Users WHERE external_id = ?', [$subject]);
        $emailOwner = fetch_one($db, <<<'SQL'
            SELECT u.id, u.external_id FROM Users AS u
            JOIN Emails AS e ON e.user_id = u.id
            WHERE lower(e.email) = lower(?) LIMIT 1
            SQL, [$email]);
        if ($existing !== null && $emailOwner !== null && (int) $existing['id'] !== (int) $emailOwner['id']) {
            throw new ApiError(400, 'Google email belongs to another account');
        }
        if ($existing === null && $emailOwner !== null) {
            $external = (string) ($emailOwner['external_id'] ?? '');
            $synthetic = $external === '' || preg_match('/^(admin|specialist|parent|system):/', $external) === 1;
            if ($external !== '' && !$synthetic && $external !== $subject) {
                throw new ApiError(400, 'Google email belongs to another account');
            }
            execute_sql($db, 'UPDATE Users SET external_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [$subject, (int) $emailOwner['id']]);
            $existing = fetch_one($db, 'SELECT id FROM Users WHERE id = ?', [(int) $emailOwner['id']]);
        }
        $now = gmdate('c');
        if ($mode === 'login') {
            if ($existing === null) {
                throw new ApiError(404, 'Google account is not registered. Create an account first');
            }
            $userId = (int) $existing['id'];
            execute_sql($db, 'UPDATE Users SET last_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [$now, $userId]);
            set_primary_email($db, $userId, $email);
            return user_record($db, $userId);
        }
        if ($registration === null) {
            throw new ApiError(400, 'Registration profile is required');
        }
        $firstName = clean_text($registration['firstName'] ?? '', 80);
        $lastName = clean_text($registration['lastName'] ?? '', 80);
        $phone = normalize_phone($registration['phone'] ?? '');
        if ($firstName === '' || $lastName === '') {
            throw new ApiError(400, 'Missing or invalid registration data');
        }
        $fullName = clean_text($firstName . ' ' . $lastName, 160);
        if ($existing !== null) {
            $userId = (int) $existing['id'];
            execute_sql($db, 'UPDATE Users SET name = ?, first_name = ?, last_name = ?, last_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [$fullName, $firstName, $lastName, $now, $userId]);
        } else {
            $legacyRole = in_array('role', array_column($db->query('PRAGMA table_info(Users)')->fetchAll(), 'name'), true);
            if ($legacyRole) {
                execute_sql($db, "INSERT INTO Users (external_id, role, name, first_name, last_name, registered_at, last_active, notes) VALUES (?, 'parent', ?, ?, ?, ?, ?, ?)", [$subject, $fullName, $firstName, $lastName, $now, $now, 'Google Identity Services']);
            } else {
                execute_sql($db, 'INSERT INTO Users (external_id, name, first_name, last_name, registered_at, last_active, notes) VALUES (?, ?, ?, ?, ?, ?, ?)', [$subject, $fullName, $firstName, $lastName, $now, $now, 'Google Identity Services']);
            }
            $userId = (int) $db->lastInsertId();
        }
        set_primary_email($db, $userId, $email);
        set_primary_phone($db, $userId, $phone);
        return user_record($db, $userId);
    });
}

function register_email_user(array $payload): array
{
    $firstName = clean_text($payload['firstName'] ?? '', 80);
    $lastName = clean_text($payload['lastName'] ?? '', 80);
    if ($firstName === '' || $lastName === '') {
        throw new ApiError(400, 'Missing or invalid registration data');
    }
    if (($payload['privacyAccepted'] ?? false) !== true) {
        throw new ApiError(400, 'Privacy policy consent is required');
    }
    $email = normalize_email($payload['email'] ?? '');
    $phone = normalize_phone($payload['phone'] ?? '');
    $password = validate_password($payload['password'] ?? '');
    return transaction(function (PDO $db) use ($firstName, $lastName, $email, $phone, $password): array {
        if (fetch_one($db, 'SELECT user_id FROM Emails WHERE lower(email) = lower(?) LIMIT 1', [$email]) !== null) {
            throw new ApiError(400, 'This email is already registered. Use the login page');
        }
        $now = gmdate('c');
        $fullName = clean_text($firstName . ' ' . $lastName, 160);
        $legacyRole = in_array('role', array_column($db->query('PRAGMA table_info(Users)')->fetchAll(), 'name'), true);
        if ($legacyRole) {
            execute_sql($db, "INSERT INTO Users (role, name, first_name, last_name, registered_at, last_active, notes) VALUES ('parent', ?, ?, ?, ?, ?, ?)", [$fullName, $firstName, $lastName, $now, $now, 'Email registration']);
        } else {
            execute_sql($db, 'INSERT INTO Users (name, first_name, last_name, registered_at, last_active, notes) VALUES (?, ?, ?, ?, ?, ?)', [$fullName, $firstName, $lastName, $now, $now, 'Email registration']);
        }
        $userId = (int) $db->lastInsertId();
        set_primary_email($db, $userId, $email);
        set_primary_phone($db, $userId, $phone);
        $algorithm = defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_BCRYPT;
        $hash = password_hash($password, $algorithm);
        if ($hash === false) {
            throw new RuntimeException('Password hashing failed');
        }
        execute_sql($db, 'INSERT INTO UserCredentials (user_id, password_hash) VALUES (?, ?)', [$userId, $hash]);
        return user_record($db, $userId);
    });
}

function authenticate_email_user(mixed $emailValue, mixed $passwordValue): array
{
    $email = normalize_email($emailValue);
    $password = validate_password($passwordValue);
    $statement = execute_sql(database(), <<<'SQL'
        SELECT u.id, c.password_hash FROM Users AS u
        JOIN Emails AS e ON e.user_id = u.id
        JOIN UserCredentials AS c ON c.user_id = u.id
        WHERE lower(e.email) = lower(?) ORDER BY e.is_primary DESC, u.id
        SQL, [$email]);
    $legacyHash = false;
    while (($row = $statement->fetch()) !== false) {
        $hash = (string) $row['password_hash'];
        if (str_starts_with($hash, 'scrypt$')) {
            $legacyHash = true;
            continue;
        }
        if (password_verify($password, $hash)) {
            $userId = (int) $row['id'];
            execute_sql(database(), 'UPDATE Users SET last_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [gmdate('c'), $userId]);
            return user_record(database(), $userId);
        }
    }
    if ($legacyHash) {
        throw new ApiError(409, 'This account uses the old password format. Reset its password before signing in with PHP');
    }
    throw new ApiError(401, 'Invalid email or password');
}

function replace_primary_email(PDO $db, int $userId, string $email): void
{
    $primary = fetch_one($db, 'SELECT id FROM Emails WHERE user_id = ? AND is_primary = 1 ORDER BY id LIMIT 1', [$userId]);
    $stored = fetch_one($db, 'SELECT id FROM Emails WHERE user_id = ? AND lower(email) = lower(?) ORDER BY id LIMIT 1', [$userId, $email]);
    if ($stored === null && fetch_one($db, 'SELECT user_id FROM Emails WHERE lower(email) = lower(?) AND user_id != ? LIMIT 1', [$email, $userId]) !== null) {
        throw new ApiError(400, 'This email is already used by another account');
    }
    execute_sql($db, 'UPDATE Emails SET is_primary = 0 WHERE user_id = ?', [$userId]);
    if ($stored !== null) {
        execute_sql($db, 'UPDATE Emails SET email = ?, is_primary = 1 WHERE id = ?', [$email, (int) $stored['id']]);
        if ($primary !== null && (int) $primary['id'] !== (int) $stored['id']) {
            execute_sql($db, 'DELETE FROM Emails WHERE id = ?', [(int) $primary['id']]);
        }
    } elseif ($primary !== null) {
        execute_sql($db, 'UPDATE Emails SET email = ?, is_primary = 1 WHERE id = ?', [$email, (int) $primary['id']]);
    } else {
        execute_sql($db, 'INSERT INTO Emails (user_id, email, is_primary) VALUES (?, ?, 1)', [$userId, $email]);
    }
}

function replace_primary_phone(PDO $db, int $userId, string $phone): void
{
    $primary = fetch_one($db, 'SELECT id FROM Phones WHERE user_id = ? AND is_primary = 1 ORDER BY id LIMIT 1', [$userId]);
    $stored = fetch_one($db, 'SELECT id FROM Phones WHERE user_id = ? AND phone = ? ORDER BY id LIMIT 1', [$userId, $phone]);
    execute_sql($db, 'UPDATE Phones SET is_primary = 0 WHERE user_id = ?', [$userId]);
    if ($stored !== null) {
        execute_sql($db, 'UPDATE Phones SET is_primary = 1 WHERE id = ?', [(int) $stored['id']]);
        if ($primary !== null && (int) $primary['id'] !== (int) $stored['id']) {
            execute_sql($db, 'DELETE FROM Phones WHERE id = ?', [(int) $primary['id']]);
        }
    } elseif ($primary !== null) {
        execute_sql($db, 'UPDATE Phones SET phone = ?, is_primary = 1 WHERE id = ?', [$phone, (int) $primary['id']]);
    } else {
        execute_sql($db, 'INSERT INTO Phones (user_id, phone, is_primary) VALUES (?, ?, 1)', [$userId, $phone]);
    }
}

function account_data(int $userId): array
{
    $db = database();
    $user = user_record($db, $userId);
    $registered = fetch_one($db, 'SELECT registered_at, created_at FROM Users WHERE id = ?', [$userId]);
    $emails = execute_sql($db, 'SELECT id, email AS value, is_primary FROM Emails WHERE user_id = ? ORDER BY is_primary DESC, id', [$userId])->fetchAll();
    $phones = execute_sql($db, 'SELECT id, phone AS value, is_primary FROM Phones WHERE user_id = ? ORDER BY is_primary DESC, id', [$userId])->fetchAll();
    foreach ($emails as &$item) { $item['id'] = (int) $item['id']; $item['primary'] = (bool) $item['is_primary']; unset($item['is_primary']); }
    unset($item);
    foreach ($phones as &$item) { $item['id'] = (int) $item['id']; $item['primary'] = (bool) $item['is_primary']; unset($item['is_primary']); }
    unset($item);
    $listings = execute_sql($db, <<<'SQL'
        SELECT id, 'specialist' AS kind, name AS title, status, created_at, expires_at, city, price AS amount
        FROM Specialists WHERE user_id = ?
        UNION ALL
        SELECT id, 'request' AS kind, title, status, created_at, NULL AS expires_at, city, budget AS amount
        FROM Requests WHERE user_id = ? ORDER BY created_at DESC, id DESC
        SQL, [$userId, $userId])->fetchAll();
    $notifications = execute_sql($db, <<<'SQL'
        SELECT id, 'message' AS kind, body AS text, created_at,
          coalesce((SELECT name FROM Users WHERE id = m.sender_user_id), 'Системне повідомлення') AS author
        FROM Messages AS m WHERE recipient_user_id = ? AND deleted_at IS NULL
        UNION ALL
        SELECT c.id, 'review' AS kind, c.body AS text, c.created_at,
          coalesce((SELECT name FROM Users WHERE id = c.user_id), 'Новий відгук') AS author
        FROM Comments AS c JOIN Specialists AS s ON s.id = c.specialist_id
        WHERE s.user_id = ? ORDER BY created_at DESC, id DESC LIMIT 20
        SQL, [$userId, $userId])->fetchAll();
    $user['registeredAt'] = (string) (($registered['registered_at'] ?? '') ?: ($registered['created_at'] ?? ''));
    return ['profile' => $user, 'emails' => $emails, 'phones' => $phones, 'listings' => $listings, 'notifications' => $notifications];
}

function update_account_profile(int $userId, array $payload): array
{
    $firstName = clean_text($payload['firstName'] ?? '', 80);
    $lastName = clean_text($payload['lastName'] ?? '', 80);
    if ($firstName === '' || $lastName === '') {
        throw new ApiError(400, 'First name and last name are required');
    }
    $email = normalize_email($payload['email'] ?? '');
    $phone = normalize_phone($payload['phone'] ?? '');
    transaction(function (PDO $db) use ($userId, $firstName, $lastName, $email, $phone): void {
        execute_sql($db, 'UPDATE Users SET name = ?, first_name = ?, last_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [clean_text($firstName . ' ' . $lastName, 160), $firstName, $lastName, $userId]);
        replace_primary_email($db, $userId, $email);
        replace_primary_phone($db, $userId, $phone);
    });
    return account_data($userId);
}

function add_account_contact(int $userId, array $payload): array
{
    $type = clean_text($payload['type'] ?? '', 10);
    transaction(function (PDO $db) use ($userId, $payload, $type): void {
        if ($type === 'email') {
            $value = normalize_email($payload['value'] ?? '');
            $existing = fetch_one($db, 'SELECT user_id FROM Emails WHERE lower(email) = lower(?) LIMIT 1', [$value]);
            if ($existing !== null) {
                throw new ApiError(400, (int) $existing['user_id'] === $userId ? 'Цей email уже додано до вашого акаунта' : 'Цей email уже використовується іншим акаунтом');
            }
            execute_sql($db, 'INSERT INTO Emails (user_id, email, is_primary) VALUES (?, ?, 0)', [$userId, $value]);
        } elseif ($type === 'phone') {
            $value = normalize_phone($payload['value'] ?? '');
            if (fetch_one($db, 'SELECT id FROM Phones WHERE user_id = ? AND phone = ? LIMIT 1', [$userId, $value]) !== null) {
                throw new ApiError(400, 'Цей номер телефону вже додано до вашого акаунта');
            }
            execute_sql($db, 'INSERT INTO Phones (user_id, phone, is_primary) VALUES (?, ?, 0)', [$userId, $value]);
        } else {
            throw new ApiError(400, 'Невідомий тип контакту');
        }
    });
    return account_data($userId);
}

function delete_account_contact(int $userId, array $payload): array
{
    $type = clean_text($payload['type'] ?? '', 10);
    $contactId = filter_var($payload['id'] ?? null, FILTER_VALIDATE_INT);
    if ($contactId === false || $contactId === null || !isset(['email' => true, 'phone' => true][$type])) {
        throw new ApiError(400, 'Некоректний контакт');
    }
    $table = $type === 'email' ? 'Emails' : 'Phones';
    transaction(function (PDO $db) use ($userId, $contactId, $table): void {
        $contact = fetch_one($db, "SELECT id, is_primary FROM {$table} WHERE id = ? AND user_id = ?", [(int) $contactId, $userId]);
        if ($contact === null) throw new ApiError(400, 'Контакт не знайдено');
        if ((bool) $contact['is_primary']) throw new ApiError(400, 'Основний контакт не можна видалити');
        execute_sql($db, "DELETE FROM {$table} WHERE id = ? AND user_id = ?", [(int) $contactId, $userId]);
    });
    return account_data($userId);
}

function create_specialist_listing(int $userId, array $payload): array
{
    $name = clean_text($payload['name'] ?? '', 160);
    $description = clean_text($payload['description'] ?? '', 2000);
    $city = clean_text($payload['city'] ?? '', 80);
    foreach (['specialties', 'formats', 'districts'] as $field) {
        if (!isset($payload[$field]) || !is_array($payload[$field])) throw new ApiError(400, 'Invalid listing collections');
    }
    $specialties = array_values(array_filter(array_map(fn($v) => clean_text($v, 160), $payload['specialties'])));
    $formats = array_values(array_filter(array_map(fn($v) => clean_text($v, 80), $payload['formats'])));
    $districts = array_values(array_filter(array_map(fn($v) => clean_text($v, 120), $payload['districts'])));
    if ($name === '' || $description === '' || $specialties === []) throw new ApiError(400, 'Name, description and at least one specialty are required');
    $price = max(0, (int) ((float) ($payload['price'] ?? 0)));
    $days = (int) ($payload['autoDeleteDays'] ?? 30);
    if (!in_array($days, [30, 60, 90], true)) throw new ApiError(400, 'Invalid listing lifetime');
    return transaction(function (PDO $db) use ($userId, $payload, $name, $description, $city, $specialties, $formats, $districts, $price, $days): array {
        $catalogIds = [];
        foreach (array_slice($specialties, 0, 20) as $title) {
            $row = fetch_one($db, 'SELECT id FROM Catalog_record WHERE enabled = 1 AND lower(title) = lower(?) ORDER BY id LIMIT 1', [$title]);
            if ($row !== null && !in_array((int) $row['id'], $catalogIds, true)) $catalogIds[] = (int) $row['id'];
        }
        $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
        $expires = $now->modify('+' . $days . ' days');
        $parts = preg_split('/\s+/u', $name, -1, PREG_SPLIT_NO_EMPTY) ?: [];
        $initials = '';
        foreach ($parts as $part) $initials .= function_exists('mb_substr') ? mb_substr($part, 0, 1) : substr($part, 0, 1);
        $initials = function_exists('mb_strtoupper') ? mb_strtoupper(mb_substr($initials, 0, 3)) : strtoupper(substr($initials, 0, 3));
        execute_sql($db, <<<'SQL'
            INSERT INTO Specialists (user_id, catalog_record_id, city, name, initials, price, duration_minutes,
              rating, reviews_count, district, formats_json, nosologies_json, schedule, response_time, bio,
              education, experience, created_at, expires_at, status, notes)
            VALUES (?, ?, ?, ?, ?, ?, 60, 0, 0, ?, ?, '[]', '', '', ?, '', '', ?, ?, 'active', ?)
            SQL, [$userId, $catalogIds[0] ?? null, $city, $name, $initials, $price, implode(', ', array_values(array_unique($districts))), json_encode($formats, JSON_UNESCAPED_UNICODE), $description, $now->format(DateTimeInterface::ATOM), $expires->format(DateTimeInterface::ATOM), clean_text($payload['paymentType'] ?? '', 80)]);
        $specialistId = (int) $db->lastInsertId();
        foreach ($catalogIds as $index => $catalogId) {
            execute_sql($db, 'INSERT INTO SpecialistRecords (specialist_id, catalog_record_id, is_primary, sort_order) VALUES (?, ?, ?, ?)', [$specialistId, $catalogId, $index === 0 ? 1 : 0, $index + 1]);
        }
        return ['id' => $specialistId, 'status' => 'active'];
    });
}

$configPath = dirname(__DIR__) . '/config.php';
$GLOBALS['APP_CONFIG'] = is_file($configPath) ? (require $configPath) : [];
if (!is_array($GLOBALS['APP_CONFIG'])) {
    throw new RuntimeException('config.php must return an array');
}

header('Referrer-Policy: no-referrer-when-downgrade');
header('Cross-Origin-Opener-Policy: same-origin-allow-popups');
header('X-Content-Type-Options: nosniff');
