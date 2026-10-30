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