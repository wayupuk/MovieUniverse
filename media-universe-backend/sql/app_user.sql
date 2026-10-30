-- sql/app_user.sql — least-privilege MySQL account for the Node app (run as root).
-- The app can only read and change rows and CALL procedures. It cannot DROP,
-- ALTER or CREATE anything, so even a bug cannot destroy the schema.
-- Use the same password here and in .env (DB_PASS).
DROP USER IF EXISTS 'media_app'@'localhost';
CREATE USER 'media_app'@'localhost' IDENTIFIED BY 'MediaApp#2026';
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON MediaDB.* TO 'media_app'@'localhost';
SHOW GRANTS FOR 'media_app'@'localhost';
