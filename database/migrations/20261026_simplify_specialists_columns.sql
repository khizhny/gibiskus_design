ALTER TABLE Specialists
  ADD COLUMN online TINYINT(1) NOT NULL DEFAULT 0 AFTER reviews_count;

UPDATE Specialists
SET online = CASE
  WHEN JSON_VALID(formats_json) AND JSON_CONTAINS(formats_json, JSON_QUOTE('Онлайн')) THEN 1
  ELSE 0
END;

UPDATE Specialists
SET experience = NULLIF(REGEXP_SUBSTR(COALESCE(experience, ''), '[0-9]+'), '');

ALTER TABLE Specialists
  MODIFY COLUMN experience INT NULL,
  DROP COLUMN formats_json,
  DROP COLUMN nosologies_json,
  DROP COLUMN schedule,
  DROP COLUMN response_time;
