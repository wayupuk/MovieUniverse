-- sql/visits.sql — one row per visit to an information page (run as root, AFTER MediaDB_ALL_IN_ONE.sql).
-- A row per visit, not a counter column, so the Statistics page can plot visits over time.
USE MediaDB;

CREATE TABLE IF NOT EXISTS Media_Visit (
    visit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL,
    visited_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES Media(id),
    INDEX idx_visit_media_time (id, visited_at),
    INDEX idx_visit_time (visited_at)
);
