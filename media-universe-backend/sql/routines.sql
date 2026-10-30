-- sql/routines.sql — stored procedure and trigger (Advanced SQL features).
-- Run AFTER MediaDB_ALL_IN_ONE.sql. Keep the DELIMITER lines in Workbench.
USE MediaDB;

-- =====================================================================
-- Stored procedure: get_universe_media(p_universe_id)
-- Returns every movie / series in one universe, oldest first, already joined
-- with its type, genre, director and universe name. The Universe page
-- (GET /universes/:id) runs  CALL get_universe_media(?)  instead of
-- writing this six-table join in Node.
-- =====================================================================
DROP PROCEDURE IF EXISTS get_universe_media;
DELIMITER //
CREATE PROCEDURE get_universe_media(IN p_universe_id INT)
BEGIN
  SELECT m.id, m.title, m.publish_date, m.age_rating, m.status, m.synopsis,
         m.category, m.country, m.rating,
         CASE WHEN mv.id IS NOT NULL THEN 'Movie'
              WHEN s.id  IS NOT NULL THEN 'Series'
              ELSE 'Other' END AS media_type,
         mv.duration, s.episode_number,
         m.main_genre_id, g.genre_name AS main_genre,
         m.director_id,   d.director_name,
         m.universe_id,   u.universe_name,
         m.sequel_parent_id, m.remake_parent_id
  FROM Media m
  LEFT JOIN Movies mv  ON mv.id = m.id
  LEFT JOIN Series s   ON s.id  = m.id
  LEFT JOIN Genre g    ON g.genre_id    = m.main_genre_id
  LEFT JOIN Director d ON d.director_id = m.director_id
  LEFT JOIN Universe u ON u.universe_id = m.universe_id
  WHERE m.universe_id = p_universe_id
  ORDER BY m.publish_date;
END //
DELIMITER ;

-- =====================================================================
-- Trigger: media_inherit_universe
-- "Automatically update if a new object has more adaptations."
-- When a new media is added as a sequel or remake of another media and the
-- admin did not choose a universe, it joins its parent's universe.
-- Example: add "Iron Man 4" with sequel_parent_id = 18 and no universe_id
--          -> it lands in the Marvel Cinematic Universe by itself.
-- =====================================================================
DROP TRIGGER IF EXISTS media_inherit_universe;
DELIMITER //
CREATE TRIGGER media_inherit_universe
BEFORE INSERT ON Media
FOR EACH ROW
BEGIN
  IF NEW.universe_id IS NULL AND NEW.sequel_parent_id IS NOT NULL THEN
    SET NEW.universe_id = (SELECT universe_id FROM Media WHERE id = NEW.sequel_parent_id);
  END IF;
  IF NEW.universe_id IS NULL AND NEW.remake_parent_id IS NOT NULL THEN
    SET NEW.universe_id = (SELECT universe_id FROM Media WHERE id = NEW.remake_parent_id);
  END IF;
END //
DELIMITER ;

-- ---------------------------------------------------------------------
-- Try them in Workbench:
--   CALL get_universe_media(3);
--   SHOW TRIGGERS FROM MediaDB;
-- ---------------------------------------------------------------------
