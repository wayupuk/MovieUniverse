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
