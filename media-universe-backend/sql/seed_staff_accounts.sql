-- sql/seed_staff_accounts.sql — demo staff accounts (run AFTER MediaDB_ALL_IN_ONE.sql).
-- Passwords are bcrypt hashes. Plain text for the demo:
--   admin     / admin123
--   developer / dev12345
-- Normal users sign up themselves through POST /accounts/register.
USE MediaDB;

INSERT INTO User (accountID, username, password, gmail) VALUES
(1, 'admin',     '$2a$10$D8hQJ3/vThSDK043xkcyZOW.QzG.GzFPkOfGDSJpjljDBzIgxsiYa', 'admin@mediauniverse.com'),
(2, 'developer', '$2a$10$rMoUaahK4/ZjjYaM0fkDCuyNWDGNonrn.xGwVlPdTMQ8Nx3JcL1WG', 'dev@mediauniverse.com');

INSERT INTO Admin (accountID, contract) VALUES
(1, 'Content administrator - manages media data and inspects statistics');

INSERT INTO Developer (accountID, contract) VALUES
(2, 'Project developer - full database access');
