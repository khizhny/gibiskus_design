SET NAMES utf8mb4;

DROP TEMPORARY TABLE IF EXISTS load_test_sequence;
CREATE TEMPORARY TABLE load_test_sequence (
  n INT NOT NULL PRIMARY KEY
);

INSERT INTO load_test_sequence (n)
SELECT ones.n + tens.n * 10 + hundreds.n * 100 + thousands.n * 1000 + 1
FROM (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS ones
CROSS JOIN (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS tens
CROSS JOIN (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS hundreds
CROSS JOIN (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS thousands;

DROP TEMPORARY TABLE IF EXISTS load_test_catalog;
CREATE TEMPORARY TABLE load_test_catalog AS
SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS position
FROM Catalog_record
WHERE enabled = 1;

SET @load_test_catalog_count = (SELECT COUNT(*) FROM load_test_catalog);

DROP TEMPORARY TABLE IF EXISTS load_test_users;
CREATE TEMPORARY TABLE load_test_users (
  n INT NOT NULL PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  UNIQUE KEY uq_load_test_users_user_id (user_id)
);

START TRANSACTION;

INSERT INTO Users (name, first_name, last_name, registered_at, last_active)
SELECT
  CONCAT('Тест навантаження ', LPAD(seq.n, 5, '0')),
  'Тест',
  CONCAT('Навантаження ', LPAD(seq.n, 5, '0')),
  DATE_SUB(UTC_TIMESTAMP(), INTERVAL MOD(seq.n, 365) DAY),
  DATE_SUB(UTC_TIMESTAMP(), INTERVAL MOD(seq.n, 30) DAY)
FROM load_test_sequence AS seq
WHERE NOT EXISTS (
  SELECT 1
  FROM Emails AS existing_email
  WHERE existing_email.email = CONCAT('loadtest', LPAD(seq.n, 5, '0'), '@example.invalid')
);

INSERT INTO load_test_users (n, user_id)
SELECT CAST(RIGHT(u.name, 5) AS UNSIGNED), u.id
FROM Users AS u
WHERE u.name REGEXP '^Тест навантаження [0-9]{5}$';

INSERT INTO Emails (user_id, email)
SELECT
  load_user.user_id,
  CONCAT('loadtest', LPAD(seq.n, 5, '0'), '@example.invalid')
FROM load_test_sequence AS seq
INNER JOIN load_test_users AS load_user ON load_user.n = seq.n
LEFT JOIN Emails AS existing_email ON existing_email.user_id = load_user.user_id
WHERE existing_email.id IS NULL;

INSERT INTO Specialists (
  user_id, city, price, duration_minutes, rating, reviews_count, online,
  bio, education, experience, created_at, expires_at, status
)
SELECT
  load_user.user_id,
  'UA63120270010096107',
  350 + MOD(seq.n, 47) * 25,
  CASE MOD(seq.n, 3) WHEN 0 THEN 45 WHEN 1 THEN 60 ELSE 90 END,
  3.00 + MOD(seq.n, 21) / 10,
  MOD(seq.n, 151),
  MOD(seq.n, 3) <> 1,
  CONCAT('Оголошення для навантажувального тестування №', LPAD(seq.n, 5, '0'), '.'),
  'Тестові дані для перевірки роботи каталогу під навантаженням.',
  MOD(seq.n, 41),
  DATE_SUB(UTC_TIMESTAMP(), INTERVAL MOD(seq.n, 365) DAY),
  NULL,
  'active'
FROM load_test_sequence AS seq
INNER JOIN load_test_users AS load_user ON load_user.n = seq.n
WHERE NOT EXISTS (
  SELECT 1 FROM Specialists AS existing_specialist WHERE existing_specialist.user_id = load_user.user_id
);

INSERT IGNORE INTO SpecialistRecords (specialist_id, catalog_record_id, is_primary, sort_order)
SELECT specialist.id, catalog.id, 1, 1
FROM load_test_sequence AS seq
INNER JOIN load_test_users AS load_user ON load_user.n = seq.n
INNER JOIN Specialists AS specialist ON specialist.user_id = load_user.user_id
INNER JOIN load_test_catalog AS catalog
  ON catalog.position = MOD(seq.n - 1, @load_test_catalog_count) + 1;

INSERT IGNORE INTO Districts (specialist_id, district_id, client_site)
SELECT specialist.id, district.l5_parent_id, site.client_site
FROM load_test_sequence AS seq
INNER JOIN load_test_users AS load_user ON load_user.n = seq.n
INNER JOIN Specialists AS specialist ON specialist.user_id = load_user.user_id
CROSS JOIN (
  SELECT 'Немишлянський' AS name UNION ALL
  SELECT 'Основ’янський' UNION ALL
  SELECT 'Слобідський'
) AS district_name
INNER JOIN entries AS district
  ON district.type = 9
  AND district.l4_parent_id = specialist.city
  AND BINARY district.name = BINARY district_name.name
CROSS JOIN (SELECT 0 AS client_site UNION ALL SELECT 1) AS site;

COMMIT;

DROP TEMPORARY TABLE load_test_catalog;
DROP TEMPORARY TABLE load_test_users;
DROP TEMPORARY TABLE load_test_sequence;
