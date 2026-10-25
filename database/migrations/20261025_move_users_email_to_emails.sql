CREATE TABLE Emails (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  email VARCHAR(320) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_emails_email (email),
  KEY idx_emails_user_id (user_id),
  CONSTRAINT fk_emails_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO Emails (user_id, email)
SELECT id, email
FROM Users
WHERE email IS NOT NULL AND TRIM(email) <> '';

ALTER TABLE Users
  DROP INDEX uq_users_email,
  DROP COLUMN email;
