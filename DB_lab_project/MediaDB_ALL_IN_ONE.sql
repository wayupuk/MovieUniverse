-- Run this script on a fresh MediaDB; existing tables will be dropped.
CREATE DATABASE IF NOT EXISTS MediaDB;
USE MediaDB;

DROP TABLE IF EXISTS Watchlist, Media_Actor, Media_Platform, Media_Book, Subgenre;
DROP TABLE IF EXISTS Movies, Series, Book;
DROP TABLE IF EXISTS Media;
DROP TABLE IF EXISTS Developer, Admin, Normal_User, User;
DROP TABLE IF EXISTS Universe, Director, Genre, Author, Publisher, Actor, Platform;

CREATE TABLE User (
    accountID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(60) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    gmail VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Developer (
    accountID INT PRIMARY KEY,
    contract VARCHAR(250) NOT NULL,
    FOREIGN KEY (accountID) REFERENCES User(accountID)
);

CREATE TABLE Admin (
    accountID INT PRIMARY KEY,
    contract VARCHAR(250) NOT NULL,
    FOREIGN KEY (accountID) REFERENCES User(accountID)
);

CREATE TABLE Normal_User (
    accountID INT PRIMARY KEY,
    FOREIGN KEY (accountID) REFERENCES User(accountID)
);

CREATE TABLE Universe (
    universe_id INT AUTO_INCREMENT PRIMARY KEY,
    universe_name VARCHAR(100) NOT NULL
);

CREATE TABLE Director (
    director_id INT AUTO_INCREMENT PRIMARY KEY,
    director_name VARCHAR(100) NOT NULL
);

CREATE TABLE Genre (
    genre_id INT AUTO_INCREMENT PRIMARY KEY,
    genre_name VARCHAR(45) NOT NULL
);

CREATE TABLE Media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    publish_date DATE NOT NULL,
    age_rating VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL,
    synopsis VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    rating DECIMAL(2,1) NOT NULL,

    universe_id INT ,
    director_id INT NOT NULL,
    main_genre_id INT NOT NULL,
    sequel_parent_id INT,
    remake_parent_id INT,

    FOREIGN KEY (universe_id) REFERENCES Universe(universe_id),
    FOREIGN KEY (director_id) REFERENCES Director(director_id),
    FOREIGN KEY (main_genre_id) REFERENCES Genre(genre_id),
    FOREIGN KEY (sequel_parent_id) REFERENCES Media(id),
    FOREIGN KEY (remake_parent_id) REFERENCES Media(id)
);

CREATE TABLE Movies (
    id INT PRIMARY KEY,
    duration DECIMAL(5,2) NOT NULL,
	FOREIGN KEY (id) REFERENCES Media(id)
);

CREATE TABLE Series (
    id INT PRIMARY KEY,
    episode_number INT NOT NULL,
    FOREIGN KEY (id) REFERENCES Media(id)
);

CREATE TABLE Author (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(100) NOT NULL
);

CREATE TABLE Publisher (
    publisher_id INT AUTO_INCREMENT PRIMARY KEY,
    publisher_name VARCHAR(100) NOT NULL
);

CREATE TABLE Book (
    ISBN VARCHAR(20) PRIMARY KEY,
    book_title VARCHAR(100) NOT NULL,
    volume INT NOT NULL,
    book_type VARCHAR(50) NOT NULL,
    publish_date DATE NOT NULL,

    publisher_id INT ,
    author_id INT ,

    FOREIGN KEY (publisher_id) REFERENCES Publisher(publisher_id),
    FOREIGN KEY (author_id) REFERENCES Author(author_id)
);

CREATE TABLE Actor (
    actor_id INT AUTO_INCREMENT PRIMARY KEY,
    actor_name VARCHAR(100) NOT NULL
);

CREATE TABLE Platform (
    platform_id INT AUTO_INCREMENT PRIMARY KEY,
    platform_name VARCHAR(45) NOT NULL
);

-- M:N between Media and Genre
CREATE TABLE Subgenre (
    id INT NOT NULL,
    genre_id INT NOT NULL,

    PRIMARY KEY (id, genre_id),

    FOREIGN KEY (id) REFERENCES Media(id),

    FOREIGN KEY (genre_id) REFERENCES Genre(genre_id)
);

-- M:N between Normal User and Media
CREATE TABLE Watchlist (
    accountID INT NOT NULL,
    id INT NOT NULL,

    PRIMARY KEY (accountID, id),

    FOREIGN KEY (accountID) REFERENCES Normal_User(accountID),
    FOREIGN KEY (id) REFERENCES Media(id)
);

-- M:N between Media and Actor
CREATE TABLE Media_Actor (
    id INT NOT NULL,
    actor_id INT NOT NULL,

    PRIMARY KEY (id, actor_id),

    FOREIGN KEY (id) REFERENCES Media(id),
    FOREIGN KEY (actor_id) REFERENCES Actor(actor_id)
);

-- M:N between Media and Platform
CREATE TABLE Media_Platform (
    id INT NOT NULL,
    platform_id INT NOT NULL,

    PRIMARY KEY (id, platform_id),

    FOREIGN KEY (id) REFERENCES Media(id),
    FOREIGN KEY (platform_id) REFERENCES Platform(platform_id)
);

-- M:N between Media and Book
CREATE TABLE Media_Book (
    id INT NOT NULL,
    ISBN VARCHAR(20) NOT NULL,

    PRIMARY KEY (id, ISBN),

    FOREIGN KEY (id) REFERENCES Media(id),
    FOREIGN KEY (ISBN) REFERENCES Book(ISBN)
);

INSERT INTO Genre (genre_id, genre_name) VALUES
(1, 'Fantasy'),
(2, 'Romance'),
(3, 'Sci-Fi'),
(4, 'Action'),
(5, 'Drama'),
(6, 'Thriller'),
(7, 'Comedy'),
(8, 'Adventure'),
(9, 'Mystery'),
(10, 'Horror'),
(11, 'Crime'),
(12, 'Historical'),
(13, 'Supernatural'),
(14, 'Family'),
(16, 'Biography');
 

INSERT INTO Universe (universe_id, universe_name) VALUES
(1, 'Harry Potter'),
(2, 'Game of Thrones Universe'),
(3, 'Marvel Cinematic Universe');

INSERT INTO Director (director_id, director_name) VALUES
(1, 'Chris Columbus'),
(2, 'Alfonso Cuarón'),
(3, 'Mike Newell'), 
(4, 'David Yates'), 
(5, 'James Cameron'), 

(6, 'Matt Duffer'), 
(7, 'David Nutter'), 
(8, 'Miguel Sapochnik'),
(9, 'Jon Favreau'),    
(10, 'Joss Whedon'),   

(11, 'Anthony Russo'),
(12, 'Shane Black'),
(13, 'Jon Watts'),
(14, 'Roger Allers'),
(15, 'Lee Kwok-lap'), 

(16, 'Kim Kyu-tae'),
(17, 'Christopher Nolan'),                
(18, 'Bong Joon-ho'),
(19, 'Greta Gerwig'),
(20, 'Tetsurō Araki');

-- Status:     Upcoming / Ongoing / Completed
-- Category:   Animation 3D / Animation 2D / Live action
-- rating: G / PG / PG-13 / R


INSERT INTO Media (title, 
publish_date, age_rating, status, 
synopsis, 
category, country, rating, 
universe_id, director_id, main_genre_id) VALUES

-- Harry Potter Universe --
('Harry Potter and the Philosopher''s Stone',
 '2001-11-16', 'PG', 'Completed',
 'Harry begins his first year at Hogwarts and discovers the wizarding world.',
 'Live action', 'USA', 7.6,
 1, 1, 1),

('Harry Potter and the Chamber of Secrets',
 '2002-11-15', 'PG', 'Completed',
 'Harry returns to Hogwarts and investigates the mysterious Chamber of Secrets.',
 'Live action', 'USA', 7.4,
 1, 1, 1),

('Harry Potter and the Prisoner of Azkaban',
 '2004-06-04', 'PG', 'Completed',
 'Harry learns about Sirius Black, an escaped prisoner connected to his past.',
 'Live action', 'USA', 7.9,
 1, 2, 1),

('Harry Potter and the Goblet of Fire',
 '2005-11-18', 'PG-13', 'Completed',
 'Harry is unexpectedly chosen to compete in the dangerous Triwizard Tournament.',
 'Live action', 'USA', 7.7,
 1, 3, 1),

('Harry Potter and the Order of the Phoenix',
 '2007-07-11', 'PG-13', 'Completed',
 'Harry and his friends prepare to fight against the return of Lord Voldemort.',
 'Live action', 'USA', 7.5,
 1, 4, 1),

('Harry Potter and the Half-Blood Prince',
 '2009-07-15', 'PG', 'Completed',
 'Harry learns more about Voldemort''s past and the secret of the Horcruxes.',
 'Live action', 'USA', 7.6,
 1, 4, 1),

('Harry Potter and the Deathly Hallows - Part 1',
 '2010-11-19', 'PG-13', 'Completed',
 'Harry, Ron, and Hermione search for Horcruxes while Voldemort gains power.',
 'Live action', 'USA', 7.7,
 1, 4, 1),

('Harry Potter and the Deathly Hallows - Part 2',
 '2011-07-15', 'PG-13', 'Completed',
 'Harry and his friends return to Hogwarts for the final battle against Voldemort.',
 'Live action', 'USA', 8.1,
 1, 4, 1),

('Fantastic Beasts and Where to Find Them',
 '2016-11-18', 'PG-13', 'Completed',
 'Newt Scamander arrives in New York with a suitcase containing magical creatures.',
 'Live action', 'USA', 7.2,
 1, 4, 1),

('Fantastic Beasts: The Crimes of Grindelwald',
 '2018-11-16', 'PG-13', 'Completed',
 'Newt Scamander joins Dumbledore in an effort to stop the dark wizard Grindelwald.',
 'Live action', 'USA', 6.5,
 1, 4, 1),

('Fantastic Beasts: The Secrets of Dumbledore',
 '2022-04-15', 'PG-13', 'Completed',
 'Dumbledore sends Newt and his allies on a mission against Grindelwald.',
 'Live action', 'USA', 6.2,
 1, 4, 1),

-- Standalone --
('Titanic',
 '1997-12-19', 'PG-13', 'Completed',
 'A young couple from different social classes fall in love aboard the Titanic during its tragic voyage.',
 'Live action', 'USA', 7.9,
 NULL, 5, 2),

('Stranger Things',
 '2016-07-15', 'PG-13', 'Completed',
 'A group of friends uncover supernatural mysteries and secret experiments in their small town.',
 'Live action', 'USA', 8.6,
 NULL, 6, 3),

-- Game of Thrones Universe --
('Game of Thrones',
 '2011-04-17', 'R', 'Completed',
 'Noble families fight for control of the Iron Throne while an ancient threat rises.',
 'Live action', 'USA', 9.2,
 2, 7, 1),

('House of the Dragon',
 '2022-08-21', 'R', 'Ongoing',
 'House Targaryen faces an internal struggle for succession to the Iron Throne.',
 'Live action', 'USA', 8.3,
 2, 8, 1),

-- Marvel Cinematic Universe --
('Iron Man',
 '2008-05-02', 'PG-13', 'Completed',
 'Tony Stark builds a powerful armored suit and becomes the superhero Iron Man.',
 'Live action', 'USA', 7.9,
 3, 9, 4),

('Iron Man 2',
 '2010-05-07', 'PG-13', 'Completed',
 'Tony Stark faces new enemies while dealing with pressure surrounding his Iron Man technology.',
 'Live action', 'USA', 6.9,
 3, 9, 4),

('Iron Man 3',
 '2013-05-03', 'PG-13', 'Completed',
 'Tony Stark faces a powerful enemy while struggling with the consequences of past events.',
 'Live action', 'USA', 7.1,
 3, 12, 4),

('The Avengers',
 '2012-05-04', 'PG-13', 'Completed',
 'Earth''s mightiest heroes unite to stop Loki and an alien invasion.',
 'Live action', 'USA', 8.0,
 3, 10, 4),

('Avengers: Age of Ultron',
 '2015-05-01', 'PG-13', 'Completed',
 'The Avengers battle Ultron, an artificial intelligence created to protect the world.',
 'Live action', 'USA', 7.3,
 3, 10, 4),

('Avengers: Infinity War',
 '2018-04-27', 'PG-13', 'Completed',
 'The Avengers and their allies fight to stop Thanos from collecting the Infinity Stones.',
 'Live action', 'USA', 8.4,
 3, 11, 4),

('Avengers: Endgame',
 '2019-04-26', 'PG-13', 'Completed',
 'The surviving Avengers attempt to reverse the destruction caused by Thanos.',
 'Live action', 'USA', 8.4,
 3, 11, 4),

('Spider-Man: Homecoming',
 '2017-07-07', 'PG-13', 'Completed',
 'Peter Parker balances high school life with being Spider-Man while facing the Vulture.',
 'Live action', 'USA', 7.4,
 3, 13, 4),

('Spider-Man: Far From Home',
 '2019-07-02', 'PG-13', 'Completed',
 'Peter Parker travels to Europe and faces new threats while dealing with the loss of Tony Stark.',
 'Live action', 'USA', 7.4,
 3, 13, 4),

('Spider-Man: No Way Home',
 '2021-12-17', 'PG-13', 'Completed',
 'Peter Parker asks Doctor Strange for help after his identity as Spider-Man is revealed.',
 'Live action', 'USA', 8.2,
 3, 13, 4),

-- Remake: The Lion King (1994) -> The Lion King (2019) --
('The Lion King',
 '1994-06-24', 'G', 'Completed',
 'A young lion prince must overcome tragedy and reclaim his place as king.',
 'Animation 2D', 'USA', 8.5,
 NULL, 14, 14),

('The Lion King',
 '2019-07-19', 'PG', 'Completed',
 'A young lion prince returns to reclaim his kingdom after the death of his father.',
 'Animation 3D', 'USA', 6.8,
 NULL, 9, 14),

-- Remake: Scarlet Heart -> Moon Lovers --
('Scarlet Heart',
 '2011-09-10', 'PG-13', 'Completed',
 'A modern woman travels back to the Qing Dynasty and becomes involved in a struggle among imperial princes.',
 'Live action', 'China', 8.0,
 NULL, 15, 2),

('Moon Lovers: Scarlet Heart Ryeo',
 '2016-08-29', 'PG-13', 'Completed',
 'A modern woman travels back to the Goryeo era and becomes involved in love and conflict among royal princes.',
 'Live action', 'South Korea', 8.6,
 NULL, 16, 2),

-- Standalone Movies --
('Oppenheimer',
 '2023-07-21', 'R', 'Completed',
 'A physicist leads the development of the atomic bomb during World War II.',
 'Live action', 'USA', 8.2,
 NULL, 17, 5),

('Parasite',
 '2019-05-30', 'R', 'Completed',
 'A struggling family becomes involved with a wealthy household with unexpected consequences.',
 'Live action', 'South Korea', 8.5,
 NULL, 18, 6),

('Barbie',
 '2023-07-21', 'PG-13', 'Completed',
 'Barbie leaves Barbie Land and enters the real world on a journey of self-discovery.',
 'Live action', 'USA', 6.8,
 NULL, 19, 7),

-- Anime --
('Attack on Titan',
 '2013-04-07', 'R', 'Completed',
 'Humanity fights for survival against giant humanoid creatures known as Titans.',
 'Animation 2D', 'Japan', 9.1,
 NULL, 20, 4);
 
UPDATE Media SET sequel_parent_id = 1 WHERE id = 2; -- HP2 is sequel of HP1
UPDATE Media SET sequel_parent_id = 2 WHERE id = 3; -- HP3 is sequel of HP2
UPDATE Media SET sequel_parent_id = 3 WHERE id = 4;
UPDATE Media SET sequel_parent_id = 4 WHERE id = 5;
UPDATE Media SET sequel_parent_id = 5 WHERE id = 6;
UPDATE Media SET sequel_parent_id = 6 WHERE id = 7;
UPDATE Media SET sequel_parent_id = 7 WHERE id = 8;
UPDATE Media SET remake_parent_id = 26 WHERE id = 27; -- Lion King 2019 is remake of 1994
UPDATE Media SET remake_parent_id = 28 WHERE id = 29; -- Moon Lovers is remake of Scarlet Heart

-- FANTASTIC BEASTS SEQUELS --
UPDATE Media SET sequel_parent_id = 9 WHERE id = 10;
UPDATE Media SET sequel_parent_id = 10 WHERE id = 11;
-- IRON MAN SEQUELS --
UPDATE Media SET sequel_parent_id = 16 WHERE id = 17;
UPDATE Media SET sequel_parent_id = 17 WHERE id = 18;
-- AVENGERS SEQUELS (NOT RELEASE ORDER OF ALL MCU MOVIES) --
UPDATE Media SET sequel_parent_id = 19 WHERE id = 20;
UPDATE Media SET sequel_parent_id = 20 WHERE id = 21;
UPDATE Media SET sequel_parent_id = 21 WHERE id = 22;
-- SPIDER-MAN SEQUELS --
UPDATE Media SET sequel_parent_id = 23 WHERE id = 24;
UPDATE Media SET sequel_parent_id = 24 WHERE id = 25;

-- MAP SUB-ENTITIES: MOVIES & SERIES
INSERT INTO Movies (id, duration) VALUES
(1, 152.00), (2, 161.00), (3, 142.00), (4, 157.00), (5, 138.00), (6, 153.00), (7, 146.00), (8, 130.00),
(9, 132.00), (10, 134.00), (11, 142.00), (12, 194.00), (16, 126.00), (17, 124.00), (18, 130.00), (19, 143.00),
(20, 141.00), (21, 149.00), (22, 181.00), (23, 133.00), (24, 129.00), (25, 148.00), (26, 88.00), (27, 118.00),
(30, 180.00), (31, 132.00), (32, 114.00);

INSERT INTO Series (id, episode_number) VALUES
(13, 42), (14, 73), (15, 18), (28, 35), (29, 20), (33, 89);

INSERT INTO Subgenre (id, genre_id) VALUES
-- HARRY POTTER AND THE PHILOSOPHER'S STONE --
(1, 8), (1, 14),
-- HARRY POTTER AND THE CHAMBER OF SECRETS --
(2, 8), (2, 9),
-- HARRY POTTER AND THE PRISONER OF AZKABAN --
(3, 8), (3, 9),
-- HARRY POTTER AND THE GOBLET OF FIRE --
(4, 8), (4, 9),
-- HARRY POTTER AND THE ORDER OF THE PHOENIX --
(5, 8), (5, 5),
-- HARRY POTTER AND THE HALF-BLOOD PRINCE --
(6, 8), (6, 9), (6, 2),
-- HARRY POTTER AND THE DEATHLY HALLOWS PART 1 --
(7, 8), (7, 5),
-- HARRY POTTER AND THE DEATHLY HALLOWS PART 2 --
(8, 8), (8, 4),
-- FANTASTIC BEASTS AND WHERE TO FIND THEM --
(9, 8), (9, 14),
-- FANTASTIC BEASTS: THE CRIMES OF GRINDELWALD --
(10, 8), (10, 5),
-- FANTASTIC BEASTS: THE SECRETS OF DUMBLEDORE --
(11, 8), (11, 4),
-- TITANIC --
(12, 5), (12, 12),
-- STRANGER THINGS --
(13, 9), (13, 10), (13, 13),
-- GAME OF THRONES --
(14, 4), (14, 8), (14, 5),
-- HOUSE OF THE DRAGON --
(15, 4), (15, 5), (15, 8),
-- IRON MAN --
(16, 3), (16, 8),
-- IRON MAN 2 --
(17, 3), (17, 8),
-- IRON MAN 3 --
(18, 3), (18, 6),
-- THE AVENGERS --
(19, 3), (19, 8),
-- AVENGERS: AGE OF ULTRON --
(20, 3), (20, 8),
-- AVENGERS: INFINITY WAR --
(21, 3), (21, 8), (21, 5),
-- AVENGERS: ENDGAME --
(22, 3), (22, 8), (22, 5),
-- SPIDER-MAN: HOMECOMING --
(23, 3), (23, 7), (23, 8),
-- SPIDER-MAN: FAR FROM HOME --
(24, 3), (24, 8), (24, 7),
-- SPIDER-MAN: NO WAY HOME --
(25, 3), (25, 8), (25, 5),
-- THE LION KING (1994) --
(26, 8), (26, 5),
-- THE LION KING (2019) --
(27, 8), (27, 5),
-- SCARLET HEART --
(28, 5), (28, 12),
-- MOON LOVERS: SCARLET HEART RYEO --
(29, 5), (29, 12),
-- OPPENHEIMER --
(30, 12), (30, 16),
-- PARASITE --
(31, 5), (31, 7),
-- BARBIE --
(32, 1), (32, 8),
-- ATTACK ON TITAN --
(33, 1), (33, 9), (33, 10);


INSERT INTO Author (author_id, author_name) VALUES
(1, 'J.K. Rowling'),
(2, 'George R.R. Martin'),
(3, 'Tong Hua'),
(4, 'Hajime Isayama'),
(5, 'Warren Ellis'),
(6, 'Jim Starlin'),
(7, 'Kai Bird'),
(8, 'Brian Michael Bendis'),
(9, 'Jonathan Hickman'),
(10, 'Bob Layton'),
(11, 'Will Corona Pilgrim'),
(12, 'J. Michael Straczynski');

INSERT INTO Publisher (publisher_id, publisher_name) VALUES
(1, 'Bloomsbury'),
(2, 'Bantam Books'),
(3, 'Ocean Press'),
(4, 'Kodansha'),
(5, 'Marvel Comics'),
(6, 'Vintage');

INSERT INTO Book
(ISBN, book_title, volume, book_type, publish_date, publisher_id, author_id) VALUES

-- HARRY POTTER (English) [7] --
('9780747532699',
 'Harry Potter and the Philosopher''s Stone',
 1, 'Novel', '1997-06-26', 1, 1),

('9780747538493',
 'Harry Potter and the Chamber of Secrets',
 2, 'Novel', '1998-07-02', 1, 1),

('9780747542155',
 'Harry Potter and the Prisoner of Azkaban',
 3, 'Novel', '1999-07-08', 1, 1),

('9780747546245',
 'Harry Potter and the Goblet of Fire',
 4, 'Novel', '2000-07-08', 1, 1),

('9780747551003',
 'Harry Potter and the Order of the Phoenix',
 5, 'Novel', '2003-06-21', 1, 1),

('9780747581086',
 'Harry Potter and the Half-Blood Prince',
 6, 'Novel', '2005-07-16', 1, 1),

('9780747591054',
 'Harry Potter and the Deathly Hallows',
 7, 'Novel', '2007-07-21', 1, 1),

-- GAME OF THRONES (English) [5 published] --
('9780553103540',
 'A Game of Thrones',
 1, 'Novel', '1996-08-01', 2, 2),

('9780553108033',
 'A Clash of Kings',
 2, 'Novel', '1998-11-16', 2, 2),

('9780553106633',
 'A Storm of Swords',
 3, 'Novel', '2000-08-08', 2, 2),

('9780553801507',
 'A Feast for Crows',
 4, 'Novel', '2005-10-17', 2, 2),

('9780553801477',
 'A Dance with Dragons',
 5, 'Novel', '2011-07-12', 2, 2),

-- HOUSE OF THE DRAGON (English) --
('9781524796280',
 'Fire & Blood',
 1, 'Novel', '2018-11-20', 2, 2),

-- IRON MAN (English) --
('9780785143314',
 'Iron Man: Extremis',
 1, 'Comic', '2010-09-01', 5, 5),

-- IRON MAN 2 (English) --
('9781302961817',
 'Iron Man: Demon in a Bottle',
 1, 'Comic', '2025-09-02', 5, 10),

-- AVENGERS: AGE OF ULTRON (English) --
('9780785155669',
 'Age of Ultron',
 1, 'Comic', '2014-05-06', 5, 8),

-- AVENGERS: INFINITY WAR (English) --
('9780785156598',
 'The Infinity Gauntlet',
 1, 'Comic', '2011-09-13', 5, 6),

('9780785184232',
 'Infinity',
 1, 'Comic', '2014-09-02', 5, 9),

-- SPIDER-MAN (English) --
('9781302918866',
 'Ultimate Spider-Man: Power and Responsibility',
 1, 'Comic', '2019-10-22', 5, 8),

-- SPIDER-MAN: HOMECOMING (English) --
('9781302905163',
 'Spider-Man: Homecoming Prelude',
 1, 'Comic', '2017-06-01', 5, 11),

-- SPIDER-MAN: FAR FROM HOME (English) --
('9781302917852',
 'Spider-Man: Far From Home Prelude',
 1, 'Comic', '2019-06-05', 5, 11),

-- SPIDER-MAN: NO WAY HOME (English) --
('9780785126348',
 'Spider-Man: One More Day',
 1, 'Comic', '2008-08-01', 5, 12),

-- SCARLET HEART / MOON LOVERS (Chinese) --
('9787539940124',
 'Bu Bu Jing Xin',
 1, 'Novel', '2005-01-01', 3, 3),

('9787539940131',
 'Bu Bu Jing Xin',
 2, 'Novel', '2005-01-01', 3, 3),

-- OPPENHEIMER (English) --
('9780375726262',
 'American Prometheus',
 1, 'Biography', '2006-04-11', 6, 7),

-- ATTACK ON TITAN (Japanese) [34] --
('9784063842760',
 'Attack on Titan',
 1, 'Manga', '2010-03-17', 4, 4),

('9784063843385',
 'Attack on Titan',
 2, 'Manga', '2010-07-16', 4, 4),

('9784063844108',
 'Attack on Titan',
 3, 'Manga', '2010-12-09', 4, 4),

('9784063844696',
 'Attack on Titan',
 4, 'Manga', '2011-04-08', 4, 4),

('9784063845136',
 'Attack on Titan',
 5, 'Manga', '2011-08-09', 4, 4);
 

INSERT INTO Media_Book (id, ISBN) VALUES

-- HARRY POTTER --
(1, '9780747532699'),
(2, '9780747538493'),
(3, '9780747542155'),
(4, '9780747546245'),
(5, '9780747551003'),
(6, '9780747581086'),
(7, '9780747591054'),
(8, '9780747591054'),

-- GAME OF THRONES --
(14, '9780553103540'),
(14, '9780553108033'),
(14, '9780553106633'),
(14, '9780553801507'),
(14, '9780553801477'),

-- HOUSE OF THE DRAGON --
(15, '9781524796280'),

-- IRON MAN --
(16, '9780785143314'),

-- IRON MAN 2 --
(17, '9781302961817'),

-- IRON MAN 3 --
(18, '9780785143314'),

-- AVENGERS: AGE OF ULTRON --
(20, '9780785155669'),

-- AVENGERS: INFINITY WAR --
(21, '9780785156598'),
(21, '9780785184232'),

-- AVENGERS: ENDGAME --
(22, '9780785156598'),

-- SPIDER-MAN: HOMECOMING --
(23, '9781302918866'),
(23, '9781302905163'),

-- SPIDER-MAN: FAR FROM HOME --
(24, '9781302918866'),
(24, '9781302917852'),

-- SPIDER-MAN: NO WAY HOME --
(25, '9781302918866'),
(25, '9780785126348'),

-- SCARLET HEART / MOON LOVERS --
(28, '9787539940124'),
(28, '9787539940131'),
(29, '9787539940124'),
(29, '9787539940131'),

-- OPPENHEIMER --
(30, '9780375726262'),

-- ATTACK ON TITAN --
(33, '9784063842760'),
(33, '9784063843385'),
(33, '9784063844108'),
(33, '9784063844696'),
(33, '9784063845136');



INSERT INTO Platform (platform_name) VALUES
('Netflix'),
('Disney+'),
('HBO Max'),
('Amazon Prime Video'),
('Apple TV'),
('iQIYI'),
('WeTV'),
('Viu'),
('Monomax'),
('TrueVisions'),
('YouTube');


INSERT INTO Media_Platform (id, platform_id) VALUES
-- Harry Potter 1-8 (HBO Max)
(1, 3), (2, 3), (3, 3), (4, 3), (5, 3), (6, 3), (7, 3), (8, 3),
-- Fantastic Beasts 1-3 (HBO Max)
(9, 3), (10, 3), (11, 3),
-- Titanic (Disney+, Apple TV)
(12, 2), (12, 5),
-- Stranger Things (Netflix)
(13, 1),
-- (HBO Max)
(14, 3), -- Game of Thrones
(15, 3), -- House of the Dragon
-- (Disney+)
(16, 2), -- Iron Man
(17, 2), -- Iron Man 2
(18, 2), -- Iron Man 3
(19, 2), -- The Avengers
(20, 2), -- Avengers: Age of Ultron
(21, 2), -- Avengers: Infinity War
(22, 2), -- Avengers: Endgame
-- (Netflix, Prime Video)
(23, 1), (23, 4), -- Spider-Man: Homecoming
(24, 1), (24, 4), -- Spider-Man: Far From Home
(25, 1), (25, 4), -- Spider-Man: No Way Home
-- (Disney+)
(26, 2), -- Lion King 1994
(27, 2), -- Lion King 2019
-- Scarlet Heart (iQIYI, WeTV)
(28, 6), (28, 7),
-- Moon Lovers: Scarlet Heart Ryeo (Viu)
(29, 8),
-- Oppenheimer (HBO Max, Prime Video)
(30, 3), (30, 4),
-- Parasite (Netflix, Viu, Prime Video)
(31, 1), (31, 4), (31, 8),
-- Barbie (HBO Max, Prime Video)
(32, 3), (32, 4),
-- Attack on Titan (Netflix, Prime Video, iQIYI)
(33, 1), (33, 4), (33, 6);


INSERT INTO Actor (actor_id, actor_name) VALUES
-- HARRY POTTER --
(1, 'Daniel Radcliffe'),
(2, 'Emma Watson'),
(3, 'Rupert Grint'),
(4, 'Tom Felton'),
(5, 'Alan Rickman'),
(6, 'Ralph Fiennes'),
-- FANTASTIC BEASTS --
(7, 'Eddie Redmayne'),
(8, 'Katherine Waterston'),
(9, 'Dan Fogler'),
(10, 'Alison Sudol'),
(11, 'Jude Law'),
(12, 'Johnny Depp'),
(13, 'Mads Mikkelsen'),
-- TITANIC --
(14, 'Leonardo DiCaprio'),
(15, 'Kate Winslet'),
(16, 'Billy Zane'),
-- STRANGER THINGS --
(17, 'Millie Bobby Brown'),
(18, 'Finn Wolfhard'),
(19, 'Winona Ryder'),
(20, 'David Harbour'),
-- GAME OF THRONES --
(21, 'Emilia Clarke'),
(22, 'Kit Harington'),
(23, 'Peter Dinklage'),
(24, 'Lena Headey'),
-- HOUSE OF THE DRAGON --
(25, 'Emma D''Arcy'),
(26, 'Matt Smith'),
(27, 'Olivia Cooke'),
(28, 'Paddy Considine'),
-- IRON MAN / AVENGERS --
(29, 'Robert Downey Jr.'),
(30, 'Gwyneth Paltrow'),
(31, 'Don Cheadle'),
(32, 'Mickey Rourke'),
(33, 'Guy Pearce'),
(34, 'Chris Evans'),
(35, 'Chris Hemsworth'),
(36, 'Scarlett Johansson'),
(37, 'Mark Ruffalo'),
(38, 'Jeremy Renner'),
(39, 'James Spader'),
(40, 'Josh Brolin'),
(41, 'Tom Hiddleston'),
-- SPIDER-MAN --
(42, 'Tom Holland'),
(43, 'Zendaya'),
(44, 'Jacob Batalon'),
(45, 'Michael Keaton'),
(46, 'Jake Gyllenhaal'),
(47, 'Benedict Cumberbatch'),
(48, 'Willem Dafoe'),
(49, 'Alfred Molina'),
-- THE LION KING --
(50, 'Matthew Broderick'),
(51, 'James Earl Jones'),
(52, 'Jeremy Irons'),
(53, 'Donald Glover'),
(54, 'Beyonce Knowles-Carter'),
(55, 'Chiwetel Ejiofor'),
-- SCARLET HEART --
(56, 'Liu Shishi'),
(57, 'Nicky Wu'),
(58, 'Kevin Cheng'),
-- MOON LOVERS --
(59, 'Lee Joon-gi'),
(60, 'Lee Ji-eun'),
(61, 'Kang Ha-neul'),
-- OPPENHEIMER --
(62, 'Cillian Murphy'),
(63, 'Emily Blunt'),
(64, 'Florence Pugh'),
(65, 'Matt Damon'),
-- PARASITE --
(66, 'Song Kang-ho'),
(67, 'Choi Woo-shik'),
(68, 'Park So-dam'),
(69, 'Lee Sun-kyun'),
-- BARBIE --
(70, 'Margot Robbie'),
(71, 'Ryan Gosling'),
(72, 'America Ferrera'),
-- ATTACK ON TITAN (Japanese Voice Actors) --
(73, 'Yuki Kaji'),
(74, 'Yui Ishikawa'),
(75, 'Marina Inoue'),
(76, 'Hiroshi Kamiya');


INSERT INTO Media_Actor (id, actor_id) VALUES
-- HARRY POTTER AND THE PHILOSOPHER'S STONE --
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
-- HARRY POTTER AND THE CHAMBER OF SECRETS --
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5),
-- HARRY POTTER AND THE PRISONER OF AZKABAN --
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5),
-- HARRY POTTER AND THE GOBLET OF FIRE --
(4, 1), (4, 2), (4, 3), (4, 4), (4, 6),
-- HARRY POTTER AND THE ORDER OF THE PHOENIX --
(5, 1), (5, 2), (5, 3), (5, 5), (5, 6),
-- HARRY POTTER AND THE HALF-BLOOD PRINCE --
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5),
-- HARRY POTTER AND THE DEATHLY HALLOWS PART 1 --
(7, 1), (7, 2), (7, 3), (7, 5), (7, 6),
-- HARRY POTTER AND THE DEATHLY HALLOWS PART 2 --
(8, 1), (8, 2), (8, 3), (8, 5), (8, 6),
-- FANTASTIC BEASTS AND WHERE TO FIND THEM --
(9, 7), (9, 8), (9, 9), (9, 10),
-- FANTASTIC BEASTS: THE CRIMES OF GRINDELWALD --
(10, 7), (10, 8), (10, 11), (10, 12),
-- FANTASTIC BEASTS: THE SECRETS OF DUMBLEDORE --
(11, 7), (11, 9), (11, 11), (11, 13),
-- TITANIC --
(12, 14), (12, 15), (12, 16),
-- STRANGER THINGS --
(13, 17), (13, 18), (13, 19), (13, 20),
-- GAME OF THRONES --
(14, 21), (14, 22), (14, 23), (14, 24),
-- HOUSE OF THE DRAGON --
(15, 25), (15, 26), (15, 27), (15, 28),
-- IRON MAN --
(16, 29), (16, 30),
-- IRON MAN 2 --
(17, 29), (17, 30), (17, 31), (17, 32),
-- IRON MAN 3 --
(18, 29), (18, 30), (18, 31), (18, 33),
-- THE AVENGERS --
(19, 29), (19, 34), (19, 35),
(19, 36), (19, 37), (19, 38), (19, 41),
-- AVENGERS: AGE OF ULTRON --
(20, 29), (20, 34), (20, 35),
(20, 36), (20, 37), (20, 38), (20, 39),
-- AVENGERS: INFINITY WAR --
(21, 29), (21, 34), (21, 35),
(21, 36), (21, 37), (21, 40), (21, 42),
-- AVENGERS: ENDGAME --
(22, 29), (22, 34), (22, 35),
(22, 36), (22, 37), (22, 38), (22, 40),
-- SPIDER-MAN: HOMECOMING --
(23, 42), (23, 43), (23, 44), (23, 45),
(23, 29),
-- SPIDER-MAN: FAR FROM HOME --
(24, 42), (24, 43), (24, 44), (24, 46),
-- SPIDER-MAN: NO WAY HOME --
(25, 42), (25, 43), (25, 44),
(25, 47), (25, 48), (25, 49),
-- THE LION KING (1994) --
(26, 50), (26, 51), (26, 52),
-- THE LION KING (2019) --
(27, 53), (27, 54), (27, 51), (27, 55),
-- SCARLET HEART --
(28, 56), (28, 57), (28, 58),
-- MOON LOVERS: SCARLET HEART RYEO --
(29, 59), (29, 60), (29, 61),
-- OPPENHEIMER --
(30, 62), (30, 63), (30, 64),
(30, 65), (30, 29),
-- PARASITE --
(31, 66), (31, 67), (31, 68), (31, 69),
-- BARBIE --
(32, 70), (32, 71), (32, 72),
-- ATTACK ON TITAN --
(33, 73), (33, 74), (33, 75), (33, 76);
