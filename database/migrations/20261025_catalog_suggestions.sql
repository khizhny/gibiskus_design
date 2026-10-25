CREATE TABLE IF NOT EXISTS CatalogSuggestions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  group_id BIGINT UNSIGNED NOT NULL,
  group_title VARCHAR(255) NOT NULL,
  record_title VARCHAR(255) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME NULL,
  reviewed_by BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_catalog_suggestions_status (status, created_at),
  KEY idx_catalog_suggestions_user (user_id),
  KEY idx_catalog_suggestions_group (group_id),
  CONSTRAINT fk_catalog_suggestions_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  CONSTRAINT fk_catalog_suggestions_group FOREIGN KEY (group_id) REFERENCES Catalog_groups(id) ON DELETE CASCADE,
  CONSTRAINT fk_catalog_suggestions_reviewer FOREIGN KEY (reviewed_by) REFERENCES Users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
