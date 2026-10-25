CREATE TABLE GoogleId (
  user_id BIGINT UNSIGNED NOT NULL,
  external_id VARCHAR(255) NOT NULL,
  UNIQUE KEY uq_google_id_external_id (external_id),
  KEY idx_google_id_user_id (user_id),
  CONSTRAINT fk_google_id_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO GoogleId (user_id, external_id)
SELECT id, external_id
FROM Users
WHERE external_id IS NOT NULL AND TRIM(external_id) <> '';

ALTER TABLE Users
  DROP INDEX uq_users_external_id,
  DROP COLUMN external_id;
