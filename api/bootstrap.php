<?php

declare(strict_types=1);

const SESSION_COOKIE_NAME = 'site_php_session';
const SESSION_TTL_SECONDS = 604800;
const DEFAULT_GOOGLE_CLIENT_ID = '151504652377-jn5pfpqgf7vc4k04ce9bkmph653d88ad.apps.googleusercontent.com';
const EMAIL_ACTIVATION_TTL_SECONDS = 900;
const EMAIL_ACTIVATION_RESEND_SECONDS = 60;
const EMAIL_ACTIVATION_MAX_ATTEMPTS = 5;

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

function normalize_optional_phone(mixed $value): string
{
    if (clean_text($value, 40) === '') {
        return '';
    }
    return normalize_phone($value);
}

function normalize_experience_years(mixed $value): ?int
{
    $text = clean_text($value, 3);
    if ($text === '') return null;
    if (!ctype_digit($text)) throw new ApiError(400, 'Досвід роботи має бути вказаний цілим числом років');
    $years = (int) $text;
    if ($years > 100) throw new ApiError(400, 'Досвід роботи не може перевищувати 100 років');
    return $years;
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
    if (!extension_loaded('pdo_mysql')) {
        throw new RuntimeException('PHP extension pdo_mysql is required');
    }
    $host = env_value('DB_HOST', '127.0.0.1');
    $port = env_value('DB_PORT', '3306');
    $name = env_value('DB_NAME', 'website');
    $user = env_value('DB_USER', 'website');
    $password = env_value('DB_PASSWORD');
    if (!preg_match('/^[A-Za-z0-9_]+$/', $name) || !ctype_digit($port)) {
        throw new RuntimeException('Invalid MySQL database configuration');
    }
    try {
        $connection = new PDO(
            "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4",
            $user,
            $password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_STRINGIFY_FETCHES => false,
            ]
        );
    } catch (PDOException $error) {
        error_log('MySQL connection failed: ' . $error->getMessage());
        throw new ApiError(503, 'Database is unavailable. Check MySQL settings');
    }
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
        SELECT u.id,
          (SELECT g.external_id FROM GoogleId AS g WHERE g.user_id = u.id LIMIT 1) AS external_id,
          u.name, u.first_name, u.last_name,
          (SELECT e.email FROM Emails AS e WHERE e.user_id = u.id ORDER BY e.id LIMIT 1) AS email,
          EXISTS(SELECT 1 FROM Admins AS a WHERE a.user_id = u.id) AS is_admin,
          (SELECT phone FROM Phones WHERE user_id = u.id ORDER BY id LIMIT 1) AS phone
        FROM Users AS u
        WHERE u.id = ?
        SQL, [$userId]);
    if ($row === null) {
        throw new ApiError(404, 'User account was not found');
    }
    return [
        'id' => (int) $row['id'],
        'externalId' => (string) ($row['external_id'] ?? ''),
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

function admin_users_data(): array
{
    $rows = execute_sql(database(), <<<'SQL'
        SELECT u.id, u.name, u.first_name, u.last_name, u.registered_at, u.last_active, u.created_at,
          (SELECT e.email FROM Emails AS e WHERE e.user_id = u.id ORDER BY e.id LIMIT 1) AS email,
          EXISTS(SELECT 1 FROM Admins AS a WHERE a.user_id = u.id) AS is_admin,
          (SELECT phone FROM Phones WHERE user_id = u.id ORDER BY id LIMIT 1) AS phone,
          (SELECT count(*) FROM Specialists WHERE user_id = u.id) AS specialist_count,
          (SELECT count(*) FROM Requests WHERE user_id = u.id) AS request_count,
          (SELECT count(*) FROM Comments WHERE user_id = u.id) AS comment_count,
          (SELECT count(*) FROM Messages WHERE sender_user_id = u.id OR recipient_user_id = u.id) AS message_count
        FROM Users AS u
        ORDER BY coalesce(u.registered_at, u.created_at) DESC, u.id DESC
        SQL)->fetchAll();
    return array_map(static function (array $row): array {
        $isAdmin = (int) $row['is_admin'] === 1;
        return [
            'id' => (int) $row['id'],
            'name' => (string) $row['name'],
            'firstName' => (string) ($row['first_name'] ?? ''),
            'lastName' => (string) ($row['last_name'] ?? ''),
            'email' => (string) ($row['email'] ?? ''),
            'phone' => (string) ($row['phone'] ?? ''),
            'isAdmin' => $isAdmin,
            'registeredAt' => (string) (($row['registered_at'] ?? '') ?: ($row['created_at'] ?? '')),
            'lastActive' => (string) ($row['last_active'] ?? ''),
            'specialists' => (int) $row['specialist_count'],
            'requests' => (int) $row['request_count'],
            'comments' => (int) $row['comment_count'],
            'messages' => (int) $row['message_count'],
        ];
    }, $rows);
}

function delete_user_as_admin(int $currentAdminId, mixed $targetValue): int
{
    $targetId = filter_var($targetValue, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($targetId === false) {
        throw new ApiError(400, 'Select a valid user');
    }
    if ((int) $targetId === $currentAdminId) {
        throw new ApiError(400, 'You cannot delete your own active administrator account');
    }
    transaction(function (PDO $db) use ($targetId): void {
        if (fetch_one($db, 'SELECT user_id FROM Admins WHERE user_id = ?', [(int) $targetId]) !== null) {
            throw new ApiError(400, 'Administrator accounts cannot be deleted from the users page');
        }
        $statement = execute_sql($db, 'DELETE FROM Users WHERE id = ?', [(int) $targetId]);
        if ($statement->rowCount() !== 1) {
            throw new ApiError(404, 'User account was not found');
        }
    });
    return (int) $targetId;
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

function set_user_email(PDO $db, int $userId, string $email): void
{
    $conflict = fetch_one($db, 'SELECT id FROM Emails WHERE lower(email) = lower(?) AND user_id != ? LIMIT 1', [$email, $userId]);
    if ($conflict !== null) {
        throw new ApiError(400, 'This email is already used by another account');
    }
    $stored = fetch_one($db, 'SELECT id FROM Emails WHERE user_id = ? ORDER BY id LIMIT 1', [$userId]);
    if ($stored === null) {
        execute_sql($db, 'INSERT INTO Emails (user_id, email) VALUES (?, ?)', [$userId, $email]);
    } else {
        execute_sql($db, 'UPDATE Emails SET email = ? WHERE id = ?', [$email, (int) $stored['id']]);
    }
    execute_sql($db, 'UPDATE Users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [$userId]);
}

function set_user_google_id(PDO $db, int $userId, string $externalId): void
{
    $conflict = fetch_one($db, 'SELECT user_id FROM GoogleId WHERE external_id = ? AND user_id != ? LIMIT 1', [$externalId, $userId]);
    if ($conflict !== null) {
        throw new ApiError(400, 'This Google account is already linked to another account');
    }
    $stored = fetch_one($db, 'SELECT external_id FROM GoogleId WHERE user_id = ? LIMIT 1', [$userId]);
    if ($stored === null) {
        execute_sql($db, 'INSERT INTO GoogleId (user_id, external_id) VALUES (?, ?)', [$userId, $externalId]);
    } else {
        execute_sql($db, 'UPDATE GoogleId SET external_id = ? WHERE user_id = ? AND external_id = ?', [$externalId, $userId, (string) $stored['external_id']]);
    }
    execute_sql($db, 'UPDATE Users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [$userId]);
}

function add_user_phone(PDO $db, int $userId, string $phone): void
{
    $stored = fetch_one($db, 'SELECT id FROM Phones WHERE user_id = ? AND phone = ? LIMIT 1', [$userId, $phone]);
    if ($stored === null) {
        execute_sql($db, 'INSERT INTO Phones (user_id, phone) VALUES (?, ?)', [$userId, $phone]);
    }
}

function replace_specialist_districts(PDO $db, int $specialistId, string $cityId, array $specialistDistricts, array $studentDistricts): void
{
    execute_sql($db, 'DELETE FROM Districts WHERE specialist_id = ?', [$specialistId]);
    foreach ([[0, $specialistDistricts], [1, $studentDistricts]] as [$clientSite, $districtNames]) {
        foreach (array_values(array_unique($districtNames)) as $districtName) {
            $district = fetch_one($db, <<<'SQL'
                SELECT l5_parent_id AS district_id
                FROM entries
                WHERE type = 9 AND l4_parent_id = ? AND BINARY name = BINARY ?
                LIMIT 1
                SQL, [$cityId, $districtName]);
            if ($district === null || clean_text($district['district_id'] ?? '', 80) === '') {
                throw new ApiError(400, 'Selected district does not belong to the chosen city');
            }
            execute_sql($db, 'INSERT INTO Districts (specialist_id, district_id, client_site) VALUES (?, ?, ?)', [$specialistId, $district['district_id'], $clientSite]);
        }
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
        $existing = fetch_one($db, <<<'SQL'
            SELECT u.id
            FROM GoogleId AS g
            INNER JOIN Users AS u ON u.id = g.user_id
            WHERE g.external_id = ?
            LIMIT 1
            SQL, [$subject]);
        $emailOwner = fetch_one($db, <<<'SQL'
            SELECT u.id,
              (SELECT g.external_id FROM GoogleId AS g WHERE g.user_id = u.id LIMIT 1) AS external_id
            FROM Emails AS e
            INNER JOIN Users AS u ON u.id = e.user_id
            WHERE lower(e.email) = lower(?)
            LIMIT 1
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
            set_user_google_id($db, (int) $emailOwner['id'], $subject);
            $existing = fetch_one($db, 'SELECT id FROM Users WHERE id = ?', [(int) $emailOwner['id']]);
        }
        $now = gmdate('c');
        if ($mode === 'login') {
            if ($existing === null) {
                throw new ApiError(404, 'Google account is not registered. Create an account first');
            }
            $userId = (int) $existing['id'];
            execute_sql($db, 'UPDATE Users SET last_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [$now, $userId]);
            set_user_email($db, $userId, $email);
            return user_record($db, $userId);
        }
        if ($registration === null) {
            throw new ApiError(400, 'Registration profile is required');
        }
        $nickname = clean_text($registration['nickname'] ?? '', 160);
        $firstName = clean_text($registration['firstName'] ?? '', 80);
        $lastName = clean_text($registration['lastName'] ?? '', 80);
        $phone = normalize_optional_phone($registration['phone'] ?? '');
        if ($nickname === '' || $firstName === '' || $lastName === '') {
            throw new ApiError(400, 'Missing or invalid registration data');
        }
        if ($existing !== null) {
            $userId = (int) $existing['id'];
            execute_sql($db, 'UPDATE Users SET name = ?, first_name = ?, last_name = ?, last_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [$nickname, $firstName, $lastName, $now, $userId]);
        } else {
            execute_sql($db, 'INSERT INTO Users (name, first_name, last_name, registered_at, last_active) VALUES (?, ?, ?, ?, ?)', [$nickname, $firstName, $lastName, $now, $now]);
            $userId = (int) $db->lastInsertId();
            set_user_google_id($db, $userId, $subject);
        }
        set_user_email($db, $userId, $email);
        if ($phone !== '') {
            add_user_phone($db, $userId, $phone);
        }
        return user_record($db, $userId);
    });
}

function register_email_user(array $payload): array
{
    $nickname = clean_text($payload['nickname'] ?? '', 160);
    $firstName = clean_text($payload['firstName'] ?? '', 80);
    $lastName = clean_text($payload['lastName'] ?? '', 80);
    if ($nickname === '' || $firstName === '' || $lastName === '') {
        throw new ApiError(400, 'Missing or invalid registration data');
    }
    if (($payload['privacyAccepted'] ?? false) !== true) {
        throw new ApiError(400, 'Privacy policy consent is required');
    }
    $email = normalize_email($payload['email'] ?? '');
    $phone = normalize_optional_phone($payload['phone'] ?? '');
    $password = validate_password($payload['password'] ?? '');
    return transaction(function (PDO $db) use ($nickname, $firstName, $lastName, $email, $phone, $password): array {
        $emailOwner = fetch_one($db, <<<'SQL'
            SELECT u.id AS user_id, v.verified_at, v.last_sent_at
            FROM Emails AS e
            INNER JOIN Users AS u ON u.id = e.user_id
            LEFT JOIN EmailVerifications AS v ON v.user_id = u.id
            WHERE lower(e.email) = lower(?)
            LIMIT 1
            SQL, [$email]);
        $nowTimestamp = time();
        if ($emailOwner !== null) {
            if ($emailOwner['verified_at'] !== null || $emailOwner['last_sent_at'] === null) {
                throw new ApiError(400, 'This email is already registered. Use the login page');
            }
            $retryAfter = EMAIL_ACTIVATION_RESEND_SECONDS - ($nowTimestamp - (int) $emailOwner['last_sent_at']);
            if ($retryAfter > 0) {
                throw new ApiError(429, 'Please wait before requesting another activation code');
            }
        }
        $now = gmdate('c');
        if ($emailOwner !== null) {
            $userId = (int) $emailOwner['user_id'];
            execute_sql($db, 'UPDATE Users SET name = ?, first_name = ?, last_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [$nickname, $firstName, $lastName, $userId]);
            if ($phone !== '') {
                add_user_phone($db, $userId, $phone);
            }
        } else {
            execute_sql($db, 'INSERT INTO Users (name, first_name, last_name, registered_at, last_active) VALUES (?, ?, ?, ?, ?)', [$nickname, $firstName, $lastName, $now, $now]);
            $userId = (int) $db->lastInsertId();
            set_user_email($db, $userId, $email);
            if ($phone !== '') {
                add_user_phone($db, $userId, $phone);
            }
        }
        $hash = password_hash_for_storage($password);
        execute_sql($db, <<<'SQL'
            INSERT INTO UserCredentials (user_id, password_hash)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), updated_at = CURRENT_TIMESTAMP
            SQL, [$userId, $hash]);

        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $codeHash = password_hash($code, PASSWORD_DEFAULT);
        if ($codeHash === false) {
            throw new RuntimeException('Activation code hashing failed');
        }
        execute_sql($db, <<<'SQL'
            INSERT INTO EmailVerifications (user_id, code_hash, expires_at, attempt_count, last_sent_at, verified_at)
            VALUES (?, ?, ?, 0, ?, NULL)
            ON DUPLICATE KEY UPDATE
              code_hash = VALUES(code_hash),
              expires_at = VALUES(expires_at),
              attempt_count = 0,
              last_sent_at = VALUES(last_sent_at),
              verified_at = NULL,
              updated_at = CURRENT_TIMESTAMP
            SQL, [$userId, $codeHash, $nowTimestamp + EMAIL_ACTIVATION_TTL_SECONDS, $nowTimestamp]);

        send_activation_email($email, $nickname, $code);
        return [
            'requiresActivation' => true,
            'email' => $email,
            'expiresIn' => EMAIL_ACTIVATION_TTL_SECONDS,
        ];
    });
}

function send_activation_email(string $email, string $name, string $code): void
{
    $siteName = clean_text(app_setting('SITE_NAME', 'Пошук фахівця'), 100);
    $subjectText = 'Код активації — ' . $siteName;
    $body = "Вітаємо, {$name}!\n\n"
        . "Ваш код активації: {$code}\n\n"
        . "Введіть цей код на сторінці реєстрації. Код дійсний 15 хвилин.\n"
        . "Якщо ви не створювали акаунт, просто проігноруйте цей лист.\n";
    send_site_email($email, $subjectText, $body);
}

function send_site_email(string $email, string $subjectText, string $body): void
{
    $siteName = clean_text(app_setting('SITE_NAME', 'Пошук фахівця'), 100);
    $from = app_setting('MAIL_FROM', 'no-reply@' . preg_replace('/:\d+$/', '', (string) ($_SERVER['HTTP_HOST'] ?? 'localhost')));
    if (filter_var($from, FILTER_VALIDATE_EMAIL) === false) {
        throw new ApiError(503, 'Email delivery is not configured. Set MAIL_FROM to a valid sender address');
    }
    $subject = '=?UTF-8?B?' . base64_encode($subjectText) . '?=';
    $encodedSiteName = '=?UTF-8?B?' . base64_encode($siteName) . '?=';
    $headers = [
        'From: ' . $encodedSiteName . ' <' . $from . '>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ];
    $transport = $GLOBALS['MAIL_TRANSPORT'] ?? null;
    if (is_callable($transport)) {
        $sent = (bool) $transport($email, $subject, $body, $headers);
    } elseif (app_setting('SMTP_HOST') !== '') {
        send_smtp_email($email, $subject, $body, $headers, $from);
        $sent = true;
    } else {
        $sent = mail($email, $subject, $body, implode("\r\n", $headers));
    }
    if (!$sent) {
        throw new ApiError(503, 'Email could not be sent. Configure PHP mail delivery on the server');
    }
}

function password_hash_for_storage(string $password): string
{
    $algorithm = defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_BCRYPT;
    $hash = password_hash($password, $algorithm);
    if ($hash === false) {
        throw new RuntimeException('Password hashing failed');
    }
    return $hash;
}

function change_account_password(int $userId, array $payload): array
{
    $currentPassword = (string) ($payload['currentPassword'] ?? '');
    $newPassword = validate_password($payload['newPassword'] ?? '');
    if ($newPassword !== (string) ($payload['newPasswordConfirm'] ?? '')) {
        throw new ApiError(400, 'New passwords do not match');
    }
    transaction(function (PDO $db) use ($userId, $currentPassword, $newPassword): void {
        $credential = fetch_one($db, 'SELECT password_hash FROM UserCredentials WHERE user_id = ?', [$userId]);
        if ($credential !== null) {
            $currentHash = (string) $credential['password_hash'];
            if (str_starts_with($currentHash, 'scrypt$')) {
                throw new ApiError(409, 'Use password recovery before changing this legacy password');
            }
            if (!password_verify($currentPassword, $currentHash)) {
                throw new ApiError(400, 'Current password is incorrect');
            }
        }
        $hash = password_hash_for_storage($newPassword);
        execute_sql($db, <<<'SQL'
            INSERT INTO UserCredentials (user_id, password_hash)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), updated_at = CURRENT_TIMESTAMP
            SQL, [$userId, $hash]);
    });
    return ['message' => 'Password changed successfully'];
}

function temporary_password(int $length = 16): string
{
    $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    $password = '';
    $max = strlen($alphabet) - 1;
    for ($index = 0; $index < $length; $index++) {
        $password .= $alphabet[random_int(0, $max)];
    }
    return $password;
}

function request_password_reset(mixed $emailValue): array
{
    $email = normalize_email($emailValue);
    $genericMessage = 'If an account with this email exists, a temporary password has been sent';
    return transaction(function (PDO $db) use ($email, $genericMessage): array {
        $account = fetch_one($db, <<<'SQL'
            SELECT u.id, u.name, v.user_id AS verification_user_id, v.verified_at, r.last_requested_at
            FROM Emails AS e
            INNER JOIN Users AS u ON u.id = e.user_id
            LEFT JOIN EmailVerifications AS v ON v.user_id = u.id
            LEFT JOIN PasswordResetRequests AS r ON r.user_id = u.id
            WHERE lower(e.email) = lower(?)
            LIMIT 1
            SQL, [$email]);
        if ($account === null || ($account['verification_user_id'] !== null && $account['verified_at'] === null)) {
            return ['message' => $genericMessage];
        }
        $lastRequestedAt = (int) ($account['last_requested_at'] ?? 0);
        if ($lastRequestedAt > 0 && time() - $lastRequestedAt < 600) {
            return ['message' => $genericMessage];
        }
        $password = temporary_password();
        $hash = password_hash_for_storage($password);
        $name = clean_text($account['name'] ?? '', 160);
        $siteName = clean_text(app_setting('SITE_NAME', 'Пошук фахівця'), 100);
        $body = "Вітаємо, {$name}!\n\n"
            . "Ваш тимчасовий пароль: {$password}\n\n"
            . "Увійдіть із цим паролем і відразу змініть його в особистому кабінеті.\n"
            . "Якщо ви не запитували відновлення пароля, зверніться до адміністратора сайту.\n";
        send_site_email($email, 'Новий пароль — ' . $siteName, $body);
        $userId = (int) $account['id'];
        execute_sql($db, <<<'SQL'
            INSERT INTO UserCredentials (user_id, password_hash)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), updated_at = CURRENT_TIMESTAMP
            SQL, [$userId, $hash]);
        execute_sql($db, <<<'SQL'
            INSERT INTO PasswordResetRequests (user_id, last_requested_at)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE last_requested_at = VALUES(last_requested_at)
            SQL, [$userId, time()]);
        return ['message' => $genericMessage];
    });
}

/** @param resource $connection */
function smtp_read_response($connection, array $expectedCodes): string
{
    $response = '';
    while (($line = fgets($connection, 2048)) !== false) {
        $response .= $line;
        if (preg_match('/^(\d{3})([ -])/', $line, $matches) !== 1) {
            continue;
        }
        if ($matches[2] === '-') {
            continue;
        }
        $code = (int) $matches[1];
        if (!in_array($code, $expectedCodes, true)) {
            error_log('SMTP server rejected a command: ' . trim($response));
            throw new ApiError(503, 'The email server rejected the message');
        }
        return $response;
    }
    throw new ApiError(503, 'The email server closed the connection unexpectedly');
}

/** @param resource $connection */
function smtp_command($connection, string $command, array $expectedCodes): string
{
    if (fwrite($connection, $command . "\r\n") === false) {
        throw new ApiError(503, 'Could not communicate with the email server');
    }
    return smtp_read_response($connection, $expectedCodes);
}

function send_smtp_email(string $recipient, string $subject, string $body, array $headers, string $from): void
{
    $host = app_setting('SMTP_HOST');
    $port = filter_var(app_setting('SMTP_PORT', '465'), FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1, 'max_range' => 65535],
    ]);
    $username = app_setting('SMTP_USERNAME');
    $password = app_setting('SMTP_PASSWORD');
    $encryption = strtolower(app_setting('SMTP_ENCRYPTION', 'ssl'));
    if ($host === '' || $port === false || $username === '' || $password === '') {
        throw new ApiError(503, 'SMTP is not fully configured. Set SMTP_HOST, SMTP_PORT, SMTP_USERNAME and SMTP_PASSWORD');
    }
    if (!in_array($encryption, ['ssl', 'tls', 'none'], true)) {
        throw new ApiError(503, 'SMTP_ENCRYPTION must be ssl, tls or none');
    }

    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
            'peer_name' => $host,
            'SNI_enabled' => true,
        ],
    ]);
    $remote = ($encryption === 'ssl' ? 'ssl://' : 'tcp://') . $host . ':' . $port;
    $errorNumber = 0;
    $errorMessage = '';
    $connection = @stream_socket_client($remote, $errorNumber, $errorMessage, 15, STREAM_CLIENT_CONNECT, $context);
    if ($connection === false) {
        error_log("SMTP connection failed ({$errorNumber}): {$errorMessage}");
        throw new ApiError(503, 'Could not connect to the email server');
    }

    try {
        stream_set_timeout($connection, 15);
        smtp_read_response($connection, [220]);
        $heloHost = preg_replace('/:\d+$/', '', (string) ($_SERVER['HTTP_HOST'] ?? 'localhost'));
        $helo = preg_replace('/[^a-z0-9.-]/i', '', $heloHost) ?: 'localhost';
        smtp_command($connection, 'EHLO ' . $helo, [250]);
        if ($encryption === 'tls') {
            smtp_command($connection, 'STARTTLS', [220]);
            if (stream_socket_enable_crypto($connection, true, STREAM_CRYPTO_METHOD_TLS_CLIENT) !== true) {
                throw new ApiError(503, 'Could not establish a secure connection to the email server');
            }
            smtp_command($connection, 'EHLO ' . $helo, [250]);
        }
        smtp_command($connection, 'AUTH LOGIN', [334]);
        smtp_command($connection, base64_encode($username), [334]);
        smtp_command($connection, base64_encode($password), [235]);
        smtp_command($connection, 'MAIL FROM:<' . $from . '>', [250]);
        smtp_command($connection, 'RCPT TO:<' . $recipient . '>', [250, 251]);
        smtp_command($connection, 'DATA', [354]);

        $messageHeaders = array_merge([
            'Date: ' . date(DATE_RFC2822),
            'To: <' . $recipient . '>',
            'Subject: ' . $subject,
        ], $headers);
        $normalizedBody = preg_replace('/\r\n|\r|\n/', "\r\n", $body) ?? $body;
        $normalizedBody = preg_replace('/(^|\r\n)\./', '$1..', $normalizedBody) ?? $normalizedBody;
        $message = implode("\r\n", $messageHeaders) . "\r\n\r\n" . $normalizedBody;
        if (fwrite($connection, $message . "\r\n.\r\n") === false) {
            throw new ApiError(503, 'Could not send data to the email server');
        }
        smtp_read_response($connection, [250]);
        smtp_command($connection, 'QUIT', [221]);
    } finally {
        fclose($connection);
    }
}

function app_setting(string $key, string $default = ''): string
{
    $row = fetch_one(database(), 'SELECT setting_value FROM AppSettings WHERE setting_key = ?', [$key]);
    if ($row !== null) {
        return (string) $row['setting_value'];
    }
    return env_value($key, $default);
}

function smtp_settings_data(): array
{
    return [
        'siteName' => app_setting('SITE_NAME', 'Пошук фахівця'),
        'mailFrom' => app_setting('MAIL_FROM'),
        'host' => app_setting('SMTP_HOST', 'mx1.mirohost.net'),
        'port' => (int) app_setting('SMTP_PORT', '465'),
        'encryption' => app_setting('SMTP_ENCRYPTION', 'ssl'),
        'username' => app_setting('SMTP_USERNAME'),
        'passwordConfigured' => app_setting('SMTP_PASSWORD') !== '',
    ];
}

function save_smtp_settings(array $payload): array
{
    $siteName = clean_text($payload['siteName'] ?? '', 100);
    $mailFrom = normalize_email($payload['mailFrom'] ?? '');
    $host = strtolower(clean_text($payload['host'] ?? '', 255));
    $port = filter_var($payload['port'] ?? null, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1, 'max_range' => 65535],
    ]);
    $encryption = strtolower(clean_text($payload['encryption'] ?? '', 10));
    $username = clean_text($payload['username'] ?? '', 320);
    $password = (string) ($payload['password'] ?? '');
    if ($siteName === '' || $host === '' || preg_match('/^[a-z0-9.-]+$/', $host) !== 1 || $port === false || $username === '') {
        throw new ApiError(400, 'Enter valid SMTP settings');
    }
    if (!in_array($encryption, ['ssl', 'tls', 'none'], true)) {
        throw new ApiError(400, 'SMTP encryption must be ssl, tls or none');
    }
    if (str_contains($username, "\r") || str_contains($username, "\n") || strlen($password) > 1024) {
        throw new ApiError(400, 'Enter valid SMTP credentials');
    }
    if ($password === '' && app_setting('SMTP_PASSWORD') === '') {
        throw new ApiError(400, 'Enter the SMTP password');
    }

    $settings = [
        'SITE_NAME' => $siteName,
        'MAIL_FROM' => $mailFrom,
        'SMTP_HOST' => $host,
        'SMTP_PORT' => (string) $port,
        'SMTP_ENCRYPTION' => $encryption,
        'SMTP_USERNAME' => $username,
    ];
    if ($password !== '') {
        $settings['SMTP_PASSWORD'] = $password;
    }
    transaction(function (PDO $db) use ($settings): void {
        foreach ($settings as $key => $value) {
            execute_sql($db, <<<'SQL'
                INSERT INTO AppSettings (setting_key, setting_value)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = CURRENT_TIMESTAMP
                SQL, [$key, $value]);
        }
    });
    return smtp_settings_data();
}

function activate_email_user(mixed $emailValue, mixed $codeValue): array
{
    $email = normalize_email($emailValue);
    $code = preg_replace('/\D/', '', (string) ($codeValue ?? '')) ?? '';
    if (!preg_match('/^\d{6}$/', $code)) {
        throw new ApiError(400, 'Enter the six-digit activation code');
    }

    $result = transaction(function (PDO $db) use ($email, $code): array {
        $verification = fetch_one($db, <<<'SQL'
            SELECT u.id AS user_id, v.code_hash, v.expires_at, v.attempt_count, v.verified_at
            FROM Emails AS e
            INNER JOIN Users AS u ON u.id = e.user_id
            JOIN EmailVerifications AS v ON v.user_id = u.id
            WHERE lower(e.email) = lower(?)
            LIMIT 1
            SQL, [$email]);
        if ($verification === null) {
            throw new ApiError(400, 'No pending registration was found for this email');
        }
        if ($verification['verified_at'] !== null) {
            throw new ApiError(400, 'This email has already been activated');
        }
        if ((int) $verification['expires_at'] < time()) {
            throw new ApiError(410, 'The activation code has expired. Register again to receive a new code');
        }
        if ((int) $verification['attempt_count'] >= EMAIL_ACTIVATION_MAX_ATTEMPTS) {
            throw new ApiError(429, 'Too many invalid attempts. Register again to receive a new code');
        }
        $userId = (int) $verification['user_id'];
        if (!password_verify($code, (string) $verification['code_hash'])) {
            execute_sql($db, 'UPDATE EmailVerifications SET attempt_count = attempt_count + 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?', [$userId]);
            return ['activationError' => 'The activation code is incorrect'];
        }
        $now = gmdate('c');
        execute_sql($db, 'UPDATE EmailVerifications SET code_hash = NULL, expires_at = NULL, verified_at = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?', [$now, $userId]);
        execute_sql($db, 'UPDATE Users SET last_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [$now, $userId]);
        return user_record($db, $userId);
    });
    if (isset($result['activationError'])) {
        throw new ApiError(400, (string) $result['activationError']);
    }
    return $result;
}

function authenticate_email_user(mixed $emailValue, mixed $passwordValue): array
{
    $email = normalize_email($emailValue);
    $password = validate_password($passwordValue);
    $statement = execute_sql(database(), <<<'SQL'
        SELECT u.id, c.password_hash, v.verified_at, v.user_id AS verification_user_id
        FROM Emails AS e
        INNER JOIN Users AS u ON u.id = e.user_id
        JOIN UserCredentials AS c ON c.user_id = u.id
        LEFT JOIN EmailVerifications AS v ON v.user_id = u.id
        WHERE lower(e.email) = lower(?) ORDER BY u.id
        SQL, [$email]);
    $legacyHash = false;
    while (($row = $statement->fetch()) !== false) {
        $hash = (string) $row['password_hash'];
        if (str_starts_with($hash, 'scrypt$')) {
            $legacyHash = true;
            continue;
        }
        if (password_verify($password, $hash)) {
            if ($row['verification_user_id'] !== null && $row['verified_at'] === null) {
                throw new ApiError(403, 'Activate your account with the code sent by email before signing in');
            }
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

function city_display_name(string $city): string
{
    $city = trim($city);
    if ($city === '' || !str_starts_with($city, 'UA')) {
        return $city;
    }

    static $names = [];
    if (array_key_exists($city, $names)) {
        return $names[$city];
    }

    try {
        $row = fetch_one(database(), <<<'SQL'
            SELECT name
            FROM entries
            WHERE type IN (2, 5, 7, 8) AND (l4_parent_id = ? OR l1_parent_id = ?)
            ORDER BY type ASC
            LIMIT 1
            SQL, [$city, $city]);
        $name = clean_text($row['name'] ?? '', 160);
        $names[$city] = $name !== '' ? $name : $city;
    } catch (Throwable $error) {
        error_log('Cannot resolve city name: ' . $error->getMessage());
        $names[$city] = $city;
    }

    return $names[$city];
}

function account_data(int $userId): array
{
    $db = database();
    $user = user_record($db, $userId);
    $registered = fetch_one($db, 'SELECT registered_at, created_at FROM Users WHERE id = ?', [$userId]);
    $phones = execute_sql($db, 'SELECT id, phone AS value FROM Phones WHERE user_id = ? ORDER BY id', [$userId])->fetchAll();
    foreach ($phones as &$item) { $item['id'] = (int) $item['id']; }
    unset($item);
    $listings = execute_sql($db, <<<'SQL'
        SELECT s.id, 'specialist' AS kind, u.name AS title, s.status, s.created_at, NULL AS expires_at, s.city, s.price AS amount
        FROM Specialists AS s
        INNER JOIN Users AS u ON u.id = s.user_id
        WHERE s.user_id = ?
        UNION ALL
        SELECT id, 'request' AS kind, title, status, created_at, NULL AS expires_at, city, budget AS amount
        FROM Requests WHERE user_id = ? ORDER BY created_at DESC, id DESC
        SQL, [$userId, $userId])->fetchAll();
    foreach ($listings as &$listing) {
        $listing['cityId'] = (string) ($listing['city'] ?? '');
        $listing['city'] = city_display_name($listing['cityId']);
        $listing['editable'] = $listing['kind'] === 'specialist';
        if ($listing['kind'] === 'specialist') {
            $details = fetch_one($db, <<<'SQL'
                SELECT bio, education, experience, duration_minutes, online
                FROM Specialists
                WHERE id = ? AND user_id = ?
                SQL, [(int) $listing['id'], $userId]);
            $specialtyRows = execute_sql($db, <<<'SQL'
                SELECT r.title
                FROM SpecialistRecords AS sr
                INNER JOIN Catalog_record AS r ON r.id = sr.catalog_record_id
                WHERE sr.specialist_id = ? AND r.enabled = 1
                ORDER BY sr.is_primary DESC, sr.sort_order, sr.id
                SQL, [(int) $listing['id']])->fetchAll();
            $listing['description'] = (string) ($details['bio'] ?? '');
            $listing['education'] = (string) ($details['education'] ?? '');
            $listing['experience'] = $details['experience'] === null ? '' : (int) $details['experience'];
            $listing['durationMinutes'] = (int) ($details['duration_minutes'] ?? 60);
            $listing['specialties'] = array_values(array_filter(array_map(
                fn(array $item): string => clean_text($item['title'] ?? '', 160),
                $specialtyRows
            )));
            $districtRows = execute_sql($db, <<<'SQL'
                SELECT d.client_site, e.name
                FROM Districts AS d
                INNER JOIN entries AS e ON e.l5_parent_id = d.district_id
                WHERE d.specialist_id = ?
                ORDER BY e.name
                SQL, [(int) $listing['id']])->fetchAll();
            $listing['specialistDistricts'] = [];
            $listing['studentDistricts'] = [];
            foreach ($districtRows as $districtRow) {
                $districtName = clean_text($districtRow['name'] ?? '', 120);
                if ($districtName === '') continue;
                if ((int) $districtRow['client_site'] === 1) {
                    $listing['studentDistricts'][] = $districtName;
                } else {
                    $listing['specialistDistricts'][] = $districtName;
                }
            }
            $listing['districts'] = array_values(array_unique([...$listing['specialistDistricts'], ...$listing['studentDistricts']]));
            $listing['formats'] = [];
            if ((int) ($details['online'] ?? 0) === 1) $listing['formats'][] = 'Онлайн';
            if ($listing['specialistDistricts'] !== []) $listing['formats'][] = 'У фахівця';
            if ($listing['studentDistricts'] !== []) $listing['formats'][] = 'У учня';
            $listing['phones'] = array_values(array_map(
                fn(array $item): string => (string) $item['value'],
                $phones
            ));
        }
    }
    unset($listing);
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
    $user['hasPassword'] = fetch_one($db, 'SELECT user_id FROM UserCredentials WHERE user_id = ?', [$userId]) !== null;
    return ['profile' => $user, 'phones' => $phones, 'listings' => $listings, 'notifications' => $notifications];
}

function update_account_profile(int $userId, array $payload): array
{
    $firstName = clean_text($payload['firstName'] ?? '', 80);
    $lastName = clean_text($payload['lastName'] ?? '', 80);
    if ($firstName === '' || $lastName === '') {
        throw new ApiError(400, 'First name and last name are required');
    }
    transaction(function (PDO $db) use ($userId, $firstName, $lastName): void {
        execute_sql($db, 'UPDATE Users SET first_name = ?, last_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [$firstName, $lastName, $userId]);
    });
    return account_data($userId);
}

function add_account_contact(int $userId, array $payload): array
{
    $type = clean_text($payload['type'] ?? '', 10);
    transaction(function (PDO $db) use ($userId, $payload, $type): void {
        if ($type === 'phone') {
            $value = normalize_phone($payload['value'] ?? '');
            if (fetch_one($db, 'SELECT id FROM Phones WHERE user_id = ? AND phone = ? LIMIT 1', [$userId, $value]) !== null) {
                throw new ApiError(400, 'Цей номер телефону вже додано до вашого акаунта');
            }
            execute_sql($db, 'INSERT INTO Phones (user_id, phone) VALUES (?, ?)', [$userId, $value]);
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
    if ($contactId === false || $contactId === null || $type !== 'phone') {
        throw new ApiError(400, 'Некоректний контакт');
    }
    transaction(function (PDO $db) use ($userId, $contactId): void {
        $contact = fetch_one($db, 'SELECT id FROM Phones WHERE id = ? AND user_id = ?', [(int) $contactId, $userId]);
        if ($contact === null) throw new ApiError(400, 'Контакт не знайдено');
        execute_sql($db, 'DELETE FROM Phones WHERE id = ? AND user_id = ?', [(int) $contactId, $userId]);
    });
    return account_data($userId);
}

function create_specialist_listing(int $userId, array $payload): array
{
    $db = database();
    $user = user_record($db, $userId);
    $name = clean_text($user['name'] ?? '', 160);
    $description = clean_text($payload['description'] ?? '', 2000);
    $education = clean_text($payload['education'] ?? '', 1000);
    $experience = normalize_experience_years($payload['experience'] ?? '');
    $city = clean_text($payload['city'] ?? '', 80);
    foreach (['specialties', 'formats', 'districts'] as $field) {
        if (!isset($payload[$field]) || !is_array($payload[$field])) throw new ApiError(400, 'Invalid listing collections');
    }
    $specialties = array_values(array_filter(array_map(fn($v) => clean_text($v, 160), $payload['specialties'])));
    $formats = array_values(array_filter(array_map(fn($v) => clean_text($v, 80), $payload['formats'])));
    $districts = array_values(array_filter(array_map(fn($v) => clean_text($v, 120), $payload['districts'])));
    $specialistDistricts = isset($payload['specialistDistricts']) && is_array($payload['specialistDistricts'])
        ? array_values(array_unique(array_filter(array_map(fn($v) => clean_text($v, 120), $payload['specialistDistricts']))))
        : (in_array('У фахівця', $formats, true) ? $districts : []);
    $studentDistricts = isset($payload['studentDistricts']) && is_array($payload['studentDistricts'])
        ? array_values(array_unique(array_filter(array_map(fn($v) => clean_text($v, 120), $payload['studentDistricts']))))
        : (in_array('У учня', $formats, true) ? $districts : []);
    if (!in_array('У фахівця', $formats, true)) $specialistDistricts = [];
    if (!in_array('У учня', $formats, true)) $studentDistricts = [];
    if (in_array('У фахівця', $formats, true) && $specialistDistricts === []) throw new ApiError(400, 'Оберіть район для занять у фахівця');
    if (in_array('У учня', $formats, true) && $studentDistricts === []) throw new ApiError(400, 'Оберіть район для занять у учня');
    $online = in_array('Онлайн', $formats, true) ? 1 : 0;
    $email = normalize_email($payload['email'] ?? '');
    if ($email !== normalize_email($user['email'] ?? '')) throw new ApiError(400, 'Email must match the account email');
    if ($name === '' || $description === '' || $specialties === []) throw new ApiError(400, 'Profile name, description and at least one specialty are required');
    $price = max(0, (int) ((float) ($payload['price'] ?? 0)));
    $durationMinutes = (int) ($payload['durationMinutes'] ?? 60);
    if ($durationMinutes < 15 || $durationMinutes > 480) throw new ApiError(400, 'Invalid session duration');
    return transaction(function (PDO $db) use ($userId, $name, $description, $education, $experience, $city, $specialties, $online, $specialistDistricts, $studentDistricts, $price, $durationMinutes): array {
        $catalogIds = [];
        foreach (array_slice($specialties, 0, 20) as $title) {
            $row = fetch_one($db, 'SELECT id FROM Catalog_record WHERE enabled = 1 AND lower(title) = lower(?) ORDER BY id LIMIT 1', [$title]);
            if ($row !== null && !in_array((int) $row['id'], $catalogIds, true)) $catalogIds[] = (int) $row['id'];
        }
        if ($catalogIds === []) throw new ApiError(400, 'Оберіть спеціальність із каталогу');
        $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
        execute_sql($db, <<<'SQL'
            INSERT INTO Specialists (user_id, city, price, duration_minutes,
              rating, reviews_count, online, bio,
              education, experience, created_at, expires_at, status)
            VALUES (?, ?, ?, ?, 0, 0, ?, ?, ?, ?, ?, NULL, 'active')
            SQL, [$userId, $city, $price, $durationMinutes, $online, $description, $education, $experience, $now->format(DateTimeInterface::ATOM)]);
        $specialistId = (int) $db->lastInsertId();
        replace_specialist_districts($db, $specialistId, $city, $specialistDistricts, $studentDistricts);
        foreach ($catalogIds as $index => $catalogId) {
            execute_sql($db, 'INSERT INTO SpecialistRecords (specialist_id, catalog_record_id, is_primary, sort_order) VALUES (?, ?, ?, ?)', [$specialistId, $catalogId, $index === 0 ? 1 : 0, $index + 1]);
        }
        return ['id' => $specialistId, 'status' => 'active', 'name' => $name];
    });
}

function update_specialist_listing(int $userId, array $payload): array
{
    $listingId = filter_var($payload['id'] ?? null, FILTER_VALIDATE_INT);
    if ($listingId === false || $listingId === null) throw new ApiError(400, 'Некоректне оголошення');
    $user = user_record(database(), $userId);
    $description = clean_text($payload['description'] ?? '', 2000);
    $education = clean_text($payload['education'] ?? '', 1000);
    $experience = normalize_experience_years($payload['experience'] ?? '');
    if ($description === '') throw new ApiError(400, 'Додайте короткий опис');
    $city = clean_text($payload['city'] ?? '', 80);
    if ($city === '') throw new ApiError(400, 'Оберіть місто');
    if (!isset($payload['specialties']) || !is_array($payload['specialties'])) throw new ApiError(400, 'Оберіть спеціальність');
    $specialties = array_values(array_unique(array_filter(array_map(
        fn(mixed $value): string => clean_text($value, 160),
        $payload['specialties']
    ))));
    if ($specialties === []) throw new ApiError(400, 'Оберіть хоча б одну спеціальність');
    $price = max(0, (int) ((float) ($payload['price'] ?? 0)));
    $durationMinutes = (int) ($payload['durationMinutes'] ?? 60);
    if ($durationMinutes < 15 || $durationMinutes > 480) throw new ApiError(400, 'Некоректна тривалість заняття');
    if (!isset($payload['formats']) || !is_array($payload['formats'])) throw new ApiError(400, 'Оберіть формат занять');
    $allowedFormats = ['Онлайн', 'У фахівця', 'У учня'];
    $formats = array_values(array_unique(array_filter(array_map(
        fn(mixed $value): string => clean_text($value, 80),
        $payload['formats']
    ), fn(string $value): bool => in_array($value, $allowedFormats, true))));
    if ($formats === []) throw new ApiError(400, 'Оберіть хоча б один формат занять');
    if (!isset($payload['districts']) || !is_array($payload['districts'])) throw new ApiError(400, 'Некоректний перелік районів');
    $districts = array_values(array_unique(array_filter(array_map(
        fn(mixed $value): string => clean_text($value, 120),
        $payload['districts']
    ))));
    $specialistDistricts = isset($payload['specialistDistricts']) && is_array($payload['specialistDistricts'])
        ? array_values(array_unique(array_filter(array_map(fn(mixed $value): string => clean_text($value, 120), $payload['specialistDistricts']))))
        : (in_array('У фахівця', $formats, true) ? $districts : []);
    $studentDistricts = isset($payload['studentDistricts']) && is_array($payload['studentDistricts'])
        ? array_values(array_unique(array_filter(array_map(fn(mixed $value): string => clean_text($value, 120), $payload['studentDistricts']))))
        : (in_array('У учня', $formats, true) ? $districts : []);
    if (!in_array('У фахівця', $formats, true)) $specialistDistricts = [];
    if (!in_array('У учня', $formats, true)) $studentDistricts = [];
    if (in_array('У фахівця', $formats, true) && $specialistDistricts === []) throw new ApiError(400, 'Оберіть район для занять у фахівця');
    if (in_array('У учня', $formats, true) && $studentDistricts === []) throw new ApiError(400, 'Оберіть район для занять у учня');
    $online = in_array('Онлайн', $formats, true) ? 1 : 0;
    $email = normalize_email($payload['email'] ?? '');
    if ($email !== normalize_email($user['email'] ?? '')) throw new ApiError(400, 'Email не відповідає акаунту');
    transaction(function (PDO $db) use ($userId, $listingId, $description, $education, $experience, $city, $specialties, $price, $durationMinutes, $online, $specialistDistricts, $studentDistricts): void {
        $listing = fetch_one($db, 'SELECT id FROM Specialists WHERE id = ? AND user_id = ?', [(int) $listingId, $userId]);
        if ($listing === null) throw new ApiError(404, 'Оголошення не знайдено');
        $catalogIds = [];
        foreach (array_slice($specialties, 0, 20) as $title) {
            $row = fetch_one($db, 'SELECT id FROM Catalog_record WHERE enabled = 1 AND lower(title) = lower(?) ORDER BY id LIMIT 1', [$title]);
            if ($row !== null && !in_array((int) $row['id'], $catalogIds, true)) $catalogIds[] = (int) $row['id'];
        }
        if ($catalogIds === []) throw new ApiError(400, 'Оберіть спеціальність із каталогу');
        execute_sql($db, <<<'SQL'
            UPDATE Specialists
            SET city = ?, bio = ?, education = ?, experience = ?, price = ?, duration_minutes = ?,
                online = ?, expires_at = NULL, status = 'active'
            WHERE id = ? AND user_id = ?
            SQL, [
                $city,
                $description,
                $education,
                $experience,
                $price,
                $durationMinutes,
                $online,
                (int) $listingId,
                $userId,
            ]);
        replace_specialist_districts($db, (int) $listingId, $city, $specialistDistricts, $studentDistricts);
        execute_sql($db, 'DELETE FROM SpecialistRecords WHERE specialist_id = ?', [(int) $listingId]);
        foreach ($catalogIds as $index => $catalogId) {
            execute_sql($db, 'INSERT INTO SpecialistRecords (specialist_id, catalog_record_id, is_primary, sort_order) VALUES (?, ?, ?, ?)', [(int) $listingId, $catalogId, $index === 0 ? 1 : 0, $index + 1]);
        }
    });
    return account_data($userId);
}

$configPath = dirname(__DIR__) . '/config.php';
$GLOBALS['APP_CONFIG'] = is_file($configPath) ? (require $configPath) : [];
if (!is_array($GLOBALS['APP_CONFIG'])) {
    throw new RuntimeException('config.php must return an array');
}

header('Referrer-Policy: no-referrer-when-downgrade');
header('Cross-Origin-Opener-Policy: same-origin-allow-popups');
header('X-Content-Type-Options: nosniff');
