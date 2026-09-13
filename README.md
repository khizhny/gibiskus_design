# Пошук фахівця

Каталог фахівців та заявок для людей з ООП із PHP 8 та SQLite.

## Вимоги

- PHP 8.1 або новіший;
- розширення `pdo_sqlite`, `curl`, `json`, `openssl` і `mbstring`;
- Composer;
- право PHP-процесу читати й записувати файл SQLite та його каталог.

## Встановлення

1. Встановіть PHP-залежності:

   ```bash
   composer install --no-dev --optimize-autoloader
   ```

2. Скопіюйте конфігурацію:

   ```bash
   cp config.example.php config.php
   ```

3. Відредагуйте `config.php`. Вкажіть абсолютний шлях до SQLite та Google Client ID.

4. Перенесіть `site.sqlite` за межі публічного каталогу сайту. Це важливо для nginx, тому що nginx ігнорує правила `.htaccess`:

   ```bash
   mkdir -p ~/private
   cp database/site.sqlite ~/private/site.sqlite
   chmod 660 ~/private/site.sqlite
   chmod 770 ~/private
   ```

   Користувач PHP-FPM повинен мати доступ до цього каталогу. Вкажіть фактичний абсолютний шлях у `config.php`.

5. Відкрийте `/register.php` або `/auth.php`. Саме PHP-сторінки надсилають заголовок `Cross-Origin-Opener-Policy: same-origin-allow-popups`, потрібний для Google popup.

Для локального запуску:

```bash
php -S localhost:8000
```

## Google OAuth

У Google Cloud Console додайте точні адреси до **Authorized JavaScript origins**:

```text
http://localhost:8000
https://dev.oop.net.ua
```

Без завершального `/`. OAuth Client Secret у браузерні файли додавати не потрібно. PHP перевіряє Google ID-токен через офіційну бібліотеку `google/auth`, перевіряє audience/issuer/signature/expiration та зберігає Google `sub` у `Users.external_id`.

Frontend використовує endpoint `/api/auth/google.php`, тому nginx rewrite або reverse proxy не потрібні — потрібна лише стандартна підтримка `.php` на VPS.

## PHP API

- `POST /api/auth/google.php` — Google-реєстрація або вхід;
- `POST /api/auth/register.php` — email-реєстрація;
- `POST /api/auth/login.php` — email-вхід;
- `GET /api/auth/me.php` — поточна PHP-сесія;
- `POST /api/auth/logout.php` — вихід;
- `GET /api/account/index.php` — профіль, контакти, оголошення і сповіщення;
- `POST /api/account/profile.php` — оновлення профілю;
- `POST /api/account/contacts.php` — додавання контакту;
- `POST /api/account/delete-contact.php` — видалення контакту;
- `POST /api/account/listings.php` — створення оголошення;
- `POST /api/account/delete.php` — видалення акаунта.

POST-запити приймаються лише з того самого origin. Сесія зберігається стандартним механізмом PHP у cookie `site_php_session` з `HttpOnly`, `SameSite=Lax` і `Secure` на HTTPS.

## Старі паролі Python

Google-акаунти й усі дані SQLite продовжують працювати без змін. Старі email-паролі Python були записані у власному форматі `scrypt`, який неможливо безпечно перетворити без знання пароля. Для таких користувачів установіть новий PHP-хеш командою:

```bash
php tools/set-password.php user@example.com 'new strong password'
```

Нові паролі зберігаються через PHP `password_hash()` з Argon2id, а за його відсутності — bcrypt.

## Перевірка після публікації

```bash
curl -i https://dev.oop.net.ua/auth.php
curl -i https://dev.oop.net.ua/api/auth/me.php
curl -i -X POST \
  -H 'Origin: https://dev.oop.net.ua' \
  -H 'Content-Type: application/json' \
  -d '{}' \
  https://dev.oop.net.ua/api/auth/google.php
```

Очікується:

- `auth.php` — `200` і заголовок `Cross-Origin-Opener-Policy: same-origin-allow-popups`;
- `me.php` без сесії — `401` JSON;
- `google.php` із порожніми даними — `400` JSON, а не nginx `404` HTML.
