ALTER TABLE entries
  DROP INDEX idx_entries_l5_parent_id,
  ADD UNIQUE KEY uq_entries_l5_parent_id (l5_parent_id);

CREATE TABLE Districts (
  specialist_id BIGINT UNSIGNED NOT NULL,
  district_id VARCHAR(80) NOT NULL,
  client_site TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (specialist_id, district_id, client_site),
  KEY idx_districts_district_id (district_id),
  CONSTRAINT fk_districts_specialist FOREIGN KEY (specialist_id) REFERENCES Specialists(id) ON DELETE CASCADE,
  CONSTRAINT fk_districts_district FOREIGN KEY (district_id) REFERENCES entries(l5_parent_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO Districts (specialist_id, district_id, client_site)
SELECT s.id, e.l5_parent_id, 0
FROM Specialists AS s
INNER JOIN JSON_TABLE(
  CASE WHEN JSON_VALID(s.notes) THEN s.notes ELSE '{}' END,
  '$.specialistDistricts[*]' COLUMNS (district_name VARCHAR(255) PATH '$')
) AS selected_district
INNER JOIN entries AS e
  ON e.type = 9
 AND e.l4_parent_id = s.city
 AND BINARY e.name = BINARY selected_district.district_name;

INSERT IGNORE INTO Districts (specialist_id, district_id, client_site)
SELECT s.id, e.l5_parent_id, 1
FROM Specialists AS s
INNER JOIN JSON_TABLE(
  CASE WHEN JSON_VALID(s.notes) THEN s.notes ELSE '{}' END,
  '$.studentDistricts[*]' COLUMNS (district_name VARCHAR(255) PATH '$')
) AS selected_district
INNER JOIN entries AS e
  ON e.type = 9
 AND e.l4_parent_id = s.city
 AND BINARY e.name = BINARY selected_district.district_name;

INSERT IGNORE INTO Districts (specialist_id, district_id, client_site)
SELECT s.id, e.l5_parent_id, site.client_site
FROM Specialists AS s
INNER JOIN entries AS e
  ON e.type = 9
 AND e.l4_parent_id = s.city
 AND FIND_IN_SET(e.name, REPLACE(COALESCE(s.district, ''), ', ', ',')) > 0
INNER JOIN (
  SELECT 0 AS client_site, 'У фахівця' AS format_name
  UNION ALL
  SELECT 1, 'У учня'
) AS site
  ON JSON_VALID(s.formats_json) AND JSON_CONTAINS(s.formats_json, JSON_QUOTE(site.format_name))
WHERE NOT JSON_CONTAINS_PATH(
  CASE WHEN JSON_VALID(s.notes) THEN s.notes ELSE '{}' END,
  'one',
  CASE WHEN site.client_site = 1 THEN '$.studentDistricts' ELSE '$.specialistDistricts' END
);

UPDATE Specialists
SET notes = JSON_REMOVE(notes, '$.specialistDistricts', '$.studentDistricts')
WHERE JSON_VALID(notes) = 1;

ALTER TABLE Specialists DROP COLUMN district;
