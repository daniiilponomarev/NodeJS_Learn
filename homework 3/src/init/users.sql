DROP TABLE IF EXISTS "User";
CREATE TABLE "User"
(
    id VARCHAR(150) PRIMARY KEY,
    login VARCHAR(150) NOT NULL,
    password VARCHAR(150) NOT NULL,
    age INT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT '0'
);
INSERT INTO "User"
	(id, login, password, age, "isDeleted")
VALUES
	('2', 'login2', 'password2', 25, '0'),
	('3', 'login3', 'password3', 30, '0'),
	('1', 'login1', 'password1', 20, '0')
