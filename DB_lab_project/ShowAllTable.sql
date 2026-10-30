SELECT 
    m.id,
    m.title,
    m.publish_date,
    m.age_rating,
    m.status,
    m.category,
    m.country,
    m.rating,
    CASE 
        WHEN mov.id IS NOT NULL THEN 'Movie'
        WHEN ser.id IS NOT NULL THEN 'Series'
        ELSE 'Other'
    END AS media_type,
    mov.duration,
    ser.episode_number,
    g.genre_name AS main_genre,
    d.director_name,
    u.universe_name
FROM Media m
LEFT JOIN Movies mov ON m.id = mov.id
LEFT JOIN Series ser ON m.id = ser.id
LEFT JOIN Genre g ON m.main_genre_id = g.genre_id
LEFT JOIN Director d ON m.director_id = d.director_id
LEFT JOIN Universe u ON m.universe_id = u.universe_id;

-- Query แสดง Media และ Platform
SELECT 
    m.id AS media_id,
    m.title AS media_title,
    m.category,
    g.genre_name AS main_genre,
    GROUP_CONCAT(p.platform_name ORDER BY p.platform_id SEPARATOR ', ') AS available_platforms
FROM Media m
JOIN Media_Platform mp ON m.id = mp.id
JOIN Platform p ON mp.platform_id = p.platform_id
LEFT JOIN Genre g ON m.main_genre_id = g.genre_id
GROUP BY m.id, m.title, m.category, g.genre_name
ORDER BY m.id ASC;

-- Query แสดง Media และ Book
SELECT
    m.id AS media_id,
    m.title AS media_title,
    b.ISBN,
    b.book_title,
    b.volume,
    b.book_type,
    a.author_name,
    p.publisher_name
FROM Media m
JOIN Media_Book mb ON m.id = mb.id
JOIN Book b ON mb.ISBN = b.ISBN
LEFT JOIN Author a ON b.author_id = a.author_id
LEFT JOIN Publisher p ON b.publisher_id = p.publisher_id
ORDER BY m.id, b.volume;

SELECT * FROM Book;

-- media - actor --
SELECT
    m.id,
    m.title,
    GROUP_CONCAT(a.actor_name ORDER BY a.actor_id SEPARATOR ', ') AS actors
FROM Media m
JOIN Media_Actor ma ON m.id = ma.id
JOIN Actor a ON ma.actor_id = a.actor_id
GROUP BY m.id, m.title
ORDER BY m.id;

-- sub-main --
SELECT
    m.id,
    m.title,
    g.genre_name AS main_genre,
    GROUP_CONCAT(
        sg.genre_name
        ORDER BY sg.genre_name
        SEPARATOR ', '
    ) AS subgenres
FROM Media m
JOIN Genre g
    ON m.main_genre_id = g.genre_id
LEFT JOIN Subgenre s
    ON m.id = s.id
LEFT JOIN Genre sg
    ON s.genre_id = sg.genre_id
GROUP BY m.id, m.title, g.genre_name
ORDER BY m.id;

-- remake, Sequel
SELECT
    m.id,
    m.title,
    CASE
        WHEN m.sequel_parent_id IS NOT NULL THEN 'Sequel'
        WHEN m.remake_parent_id IS NOT NULL THEN 'Remake'
    END AS relationship_type,
    p.id AS parent_id,
    p.title AS parent_title
FROM Media m
JOIN Media p
    ON p.id = COALESCE(m.sequel_parent_id, m.remake_parent_id)
ORDER BY m.id;