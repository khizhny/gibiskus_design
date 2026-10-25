UPDATE Specialists
SET notes = JSON_REMOVE(notes, '$.email')
WHERE JSON_VALID(notes) = 1
  AND CASE
    WHEN JSON_VALID(notes) = 1 THEN JSON_CONTAINS_PATH(notes, 'one', '$.email')
    ELSE 0
  END = 1;
