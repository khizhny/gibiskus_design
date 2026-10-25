SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP VIEW IF EXISTS oblasti;
DROP TABLE IF EXISTS entries;
DROP TABLE IF EXISTS entry_types;
DROP TABLE IF EXISTS Abuses;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Messages;
DROP TABLE IF EXISTS Requests;
DROP TABLE IF EXISTS SpecialistRecords;
DROP TABLE IF EXISTS Specialists;
DROP TABLE IF EXISTS Catalog_record;
DROP TABLE IF EXISTS Catalog_subgroups;
DROP TABLE IF EXISTS Catalog_groups;
DROP TABLE IF EXISTS UserCredentials;
DROP TABLE IF EXISTS EmailVerifications;
DROP TABLE IF EXISTS AppSettings;
DROP TABLE IF EXISTS PasswordResetRequests;
DROP TABLE IF EXISTS Admins;
DROP TABLE IF EXISTS Phones;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  external_id VARCHAR(255) NULL,
  email VARCHAR(320) NULL,
  name VARCHAR(160) NOT NULL,
  first_name VARCHAR(80) NULL,
  last_name VARCHAR(80) NULL,
  registered_at DATETIME NULL,
  last_active DATETIME NULL,
  notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_external_id (external_id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE Phones (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  phone VARCHAR(40) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_phones_user_id (user_id),
  CONSTRAINT fk_phones_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE Admins (
  user_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_admins_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE UserCredentials (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_credentials_user_id (user_id),
  CONSTRAINT fk_credentials_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE EmailVerifications (
  user_id BIGINT UNSIGNED NOT NULL,
  code_hash VARCHAR(255) NULL,
  expires_at BIGINT NULL,
  attempt_count INT NOT NULL DEFAULT 0,
  last_sent_at BIGINT NULL,
  verified_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_verifications_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE AppSettings (
  setting_key VARCHAR(191) NOT NULL,
  setting_value TEXT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE PasswordResetRequests (
  user_id BIGINT UNSIGNED NOT NULL,
  last_requested_at BIGINT NOT NULL,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_password_resets_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE Catalog_groups (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  enabled TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_catalog_groups_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE Catalog_subgroups (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  group_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  enabled TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_catalog_subgroups_group_title (group_id, title),
  CONSTRAINT fk_catalog_subgroups_group FOREIGN KEY (group_id) REFERENCES Catalog_groups(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE Catalog_record (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  subgroup_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  enabled TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_catalog_record_subgroup_title (subgroup_id, title),
  CONSTRAINT fk_catalog_record_subgroup FOREIGN KEY (subgroup_id) REFERENCES Catalog_subgroups(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE Specialists (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  catalog_record_id BIGINT UNSIGNED NULL,
  city VARCHAR(80) NULL,
  name VARCHAR(160) NOT NULL,
  initials VARCHAR(20) NULL,
  price INT NULL,
  duration_minutes INT NULL,
  rating DECIMAL(4,2) NULL,
  reviews_count INT NOT NULL DEFAULT 0,
  district VARCHAR(255) NULL,
  formats_json TEXT NULL,
  nosologies_json TEXT NULL,
  schedule VARCHAR(255) NULL,
  response_time VARCHAR(255) NULL,
  bio TEXT NULL,
  education TEXT NULL,
  experience TEXT NULL,
  created_at DATETIME NULL,
  expires_at DATETIME NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'active',
  notes TEXT NULL,
  PRIMARY KEY (id),
  KEY idx_specialists_user_id (user_id),
  KEY idx_specialists_catalog_record_id (catalog_record_id),
  CONSTRAINT fk_specialists_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  CONSTRAINT fk_specialists_catalog_record FOREIGN KEY (catalog_record_id) REFERENCES Catalog_record(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE SpecialistRecords (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  specialist_id BIGINT UNSIGNED NOT NULL,
  catalog_record_id BIGINT UNSIGNED NOT NULL,
  is_primary TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_specialist_records_specialist_record (specialist_id, catalog_record_id),
  KEY idx_specialist_records_catalog_record_id (catalog_record_id),
  CONSTRAINT fk_specialist_records_specialist FOREIGN KEY (specialist_id) REFERENCES Specialists(id) ON DELETE CASCADE,
  CONSTRAINT fk_specialist_records_catalog_record FOREIGN KEY (catalog_record_id) REFERENCES Catalog_record(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE Requests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  catalog_record_id BIGINT UNSIGNED NULL,
  city VARCHAR(80) NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  budget INT NULL,
  urgent TINYINT(1) NOT NULL DEFAULT 0,
  available_time VARCHAR(255) NULL,
  formats_json TEXT NULL,
  tags_json TEXT NULL,
  created_at DATETIME NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'active',
  PRIMARY KEY (id),
  KEY idx_requests_user_id (user_id),
  KEY idx_requests_catalog_record_id (catalog_record_id),
  CONSTRAINT fk_requests_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  CONSTRAINT fk_requests_catalog_record FOREIGN KEY (catalog_record_id) REFERENCES Catalog_record(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE Messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  sender_user_id BIGINT UNSIGNED NULL,
  recipient_user_id BIGINT UNSIGNED NULL,
  specialist_id BIGINT UNSIGNED NULL,
  request_id BIGINT UNSIGNED NULL,
  body TEXT NOT NULL,
  is_reply TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  dislike_count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_messages_sender_user_id (sender_user_id),
  KEY idx_messages_recipient_user_id (recipient_user_id),
  KEY idx_messages_specialist_id (specialist_id),
  KEY idx_messages_request_id (request_id),
  CONSTRAINT fk_messages_sender FOREIGN KEY (sender_user_id) REFERENCES Users(id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_recipient FOREIGN KEY (recipient_user_id) REFERENCES Users(id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_specialist FOREIGN KEY (specialist_id) REFERENCES Specialists(id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_request FOREIGN KEY (request_id) REFERENCES Requests(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE Comments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  specialist_id BIGINT UNSIGNED NULL,
  body TEXT NOT NULL,
  rating DECIMAL(4,2) NULL,
  likes INT NOT NULL DEFAULT 0,
  dislikes INT NOT NULL DEFAULT 0,
  moderated TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NULL,
  PRIMARY KEY (id),
  KEY idx_comments_user_id (user_id),
  KEY idx_comments_specialist_id (specialist_id),
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_specialist FOREIGN KEY (specialist_id) REFERENCES Specialists(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE Abuses (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  reporter_user_id BIGINT UNSIGNED NULL,
  specialist_id BIGINT UNSIGNED NULL,
  request_id BIGINT UNSIGNED NULL,
  message_id BIGINT UNSIGNED NULL,
  comment_id BIGINT UNSIGNED NULL,
  reason TEXT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'new',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_abuses_reporter_user_id (reporter_user_id),
  KEY idx_abuses_specialist_id (specialist_id),
  KEY idx_abuses_request_id (request_id),
  KEY idx_abuses_message_id (message_id),
  KEY idx_abuses_comment_id (comment_id),
  CONSTRAINT fk_abuses_reporter FOREIGN KEY (reporter_user_id) REFERENCES Users(id) ON DELETE CASCADE,
  CONSTRAINT fk_abuses_specialist FOREIGN KEY (specialist_id) REFERENCES Specialists(id) ON DELETE CASCADE,
  CONSTRAINT fk_abuses_request FOREIGN KEY (request_id) REFERENCES Requests(id) ON DELETE CASCADE,
  CONSTRAINT fk_abuses_message FOREIGN KEY (message_id) REFERENCES Messages(id) ON DELETE CASCADE,
  CONSTRAINT fk_abuses_comment FOREIGN KEY (comment_id) REFERENCES Comments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE entry_types (
  id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  code CHAR(1) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_entry_types_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE entries (
  l1_parent_id VARCHAR(80) NULL,
  l2_parent_id VARCHAR(80) NULL,
  l3_parent_id VARCHAR(80) NULL,
  l4_parent_id VARCHAR(80) NULL,
  l5_parent_id VARCHAR(80) NULL,
  type INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  KEY idx_entries_l1_parent_id (l1_parent_id),
  KEY idx_entries_l2_parent_id (l2_parent_id),
  KEY idx_entries_l3_parent_id (l3_parent_id),
  KEY idx_entries_l4_parent_id (l4_parent_id),
  KEY idx_entries_l5_parent_id (l5_parent_id),
  KEY idx_entries_name (name),
  KEY idx_entries_type (type),
  CONSTRAINT fk_entries_type FOREIGN KEY (type) REFERENCES entry_types(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE VIEW oblasti AS
SELECT l1_parent_id AS oblast_id, name
FROM entries
WHERE l2_parent_id IS NULL;

SET FOREIGN_KEY_CHECKS = 1;
