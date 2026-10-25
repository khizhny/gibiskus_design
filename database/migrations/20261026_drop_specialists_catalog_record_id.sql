ALTER TABLE Specialists
  DROP FOREIGN KEY fk_specialists_catalog_record,
  DROP INDEX idx_specialists_catalog_record_id,
  DROP COLUMN catalog_record_id;
