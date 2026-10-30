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


