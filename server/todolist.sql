CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(64) UNIQUE NOT NULL,
    password VARCHAR(64) NOT NULL,
    name VARCHAR(64) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL
    );

CREATE TABLE Columns (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(64),
    user_id INT NOT NULL,
    head INT DEFAULT NULL,
    FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE cascade
    );

CREATE TABLE Note (
	id INT PRIMARY KEY AUTO_INCREMENT,
    columns_id INT NOT NULL,
    content varchar(300) NOT NULL,
    next_note INT DEFAULT NULL,
    addedBy INT NOT NULL,
    FOREIGN KEY(columns_id) REFERENCES Columns(id) ON DELETE cascade,
    FOREIGN KEY(addedBy) REFERENCES Users(id)
    );

ALTER TABLE Columns ADD CONSTRAINT Head_note FOREIGN KEY(head) REFERENCES Note(id);

CREATE TABLE Log (
	id INT PRIMARY KEY AUTO_INCREMENT,
    action VARCHAR(64),
    user_id INT NOT NULL,
    subject varchar(300) NOT NULL,
    from_column VARCHAR(64),
    to_column VARCHAR(64),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE cascade
    );
