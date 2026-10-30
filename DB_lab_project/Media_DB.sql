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

