SET NAMES utf8mb4;
START TRANSACTION;

INSERT INTO Users (name, first_name, last_name, registered_at, last_active)
SELECT seed.name, 'Тест', seed.last_name, UTC_TIMESTAMP(), UTC_TIMESTAMP()
FROM (
  SELECT 'Тестовий фахівець 01' AS name, 'Фахівець 01' AS last_name UNION ALL
  SELECT 'Тестовий фахівець 02', 'Фахівець 02' UNION ALL
  SELECT 'Тестовий фахівець 03', 'Фахівець 03' UNION ALL
  SELECT 'Тестовий фахівець 04', 'Фахівець 04' UNION ALL
  SELECT 'Тестовий фахівець 05', 'Фахівець 05' UNION ALL
  SELECT 'Тестовий фахівець 06', 'Фахівець 06' UNION ALL
  SELECT 'Тестовий фахівець 07', 'Фахівець 07' UNION ALL
  SELECT 'Тестовий фахівець 08', 'Фахівець 08' UNION ALL
  SELECT 'Тестовий фахівець 09', 'Фахівець 09' UNION ALL
  SELECT 'Тестовий фахівець 10', 'Фахівець 10' UNION ALL
  SELECT 'Тестовий фахівець 11', 'Фахівець 11' UNION ALL
  SELECT 'Тестовий фахівець 12', 'Фахівець 12' UNION ALL
  SELECT 'Тестовий фахівець 13', 'Фахівець 13' UNION ALL
  SELECT 'Тестовий фахівець 14', 'Фахівець 14' UNION ALL
  SELECT 'Тестовий фахівець 15', 'Фахівець 15' UNION ALL
  SELECT 'Тестовий фахівець 16', 'Фахівець 16' UNION ALL
  SELECT 'Тестовий фахівець 17', 'Фахівець 17' UNION ALL
  SELECT 'Тестовий фахівець 18', 'Фахівець 18' UNION ALL
  SELECT 'Тестовий фахівець 19', 'Фахівець 19' UNION ALL
  SELECT 'Тестовий фахівець 20', 'Фахівець 20'
) AS seed
WHERE NOT EXISTS (
  SELECT 1 FROM Users AS existing_user WHERE BINARY existing_user.name = BINARY seed.name
);

INSERT INTO Specialists (
  user_id, city, price, duration_minutes,
  rating, reviews_count, online, bio, education, experience, created_at,
  expires_at, status
)
SELECT
  u.id,
  'UA63120270010096107',
  400 + CAST(RIGHT(u.name, 2) AS UNSIGNED) * 25,
  CASE MOD(CAST(RIGHT(u.name, 2) AS UNSIGNED), 3) WHEN 0 THEN 45 WHEN 1 THEN 60 ELSE 90 END,
  4.00 + MOD(CAST(RIGHT(u.name, 2) AS UNSIGNED), 10) / 10,
  CAST(RIGHT(u.name, 2) AS UNSIGNED),
  CASE WHEN MOD(CAST(RIGHT(u.name, 2) AS UNSIGNED), 3) IN (0, 2) THEN 1 ELSE 0 END,
  CONCAT('Тестове оголошення для перевірки пошуку та пагінації №', RIGHT(u.name, 2), '.'),
  'Тестові дані',
  CAST(RIGHT(u.name, 2) AS UNSIGNED),
  UTC_TIMESTAMP(),
  NULL,
  'active'
FROM Users AS u
LEFT JOIN Specialists AS existing_specialist ON existing_specialist.user_id = u.id
WHERE BINARY u.name LIKE BINARY 'Тестовий фахівець %'
  AND existing_specialist.id IS NULL;

INSERT IGNORE INTO Districts (specialist_id, district_id, client_site)
SELECT s.id, e.l5_parent_id, seed.client_site
FROM Specialists AS s
INNER JOIN Users AS u ON u.id = s.user_id
INNER JOIN (
  SELECT 'Немишлянський' AS district_name, 0 AS client_site UNION ALL
  SELECT 'Основ’янський', 1 UNION ALL
  SELECT 'Слобідський', 1
) AS seed
INNER JOIN entries AS e
  ON e.type = 9 AND e.l4_parent_id = s.city AND BINARY e.name = BINARY seed.district_name
WHERE BINARY u.name LIKE BINARY 'Тестовий фахівець %';

INSERT INTO SpecialistRecords (specialist_id, catalog_record_id, is_primary, sort_order)
SELECT s.id, 5, 1, 0
FROM Specialists AS s
INNER JOIN Users AS u ON u.id = s.user_id
WHERE BINARY u.name LIKE BINARY 'Тестовий фахівець %'
  AND NOT EXISTS (
    SELECT 1
    FROM SpecialistRecords AS existing_record
    WHERE existing_record.specialist_id = s.id AND existing_record.catalog_record_id = 5
  );

COMMIT;
