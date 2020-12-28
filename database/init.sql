BEGIN;

DROP TABLE IF EXISTS users,business CASCADE;

CREATE TABLE users(
id SERIAL PRIMARY KEY,
email VARCHAR(255) ,
phone VARCHAR(255) NOT NULL,
firstname VARCHAR(255) NOT NULL,
lastname VARCHAR(255) NOT NULL,
pass VARCHAR(255) NOT NULL,
isBusinessOwner BOOLEAN NOT NULL,
myBusinesses TEXT,
myFavorites TEXT
);


CREATE TABLE business(
    id SERIAL PRIMARY KEY,
    businessName VARCHAR(255) NOT NULL,
    ownerId INTEGER REFERENCES users(id),
    phone VARCHAR(255) NOT NULL,
    businessAddress VARCHAR(255) NOT NULL,
    geoLocation VARCHAR(255) NOT NULL
);



INSERT INTO users (email,phone,firstname,lastname,pass,isBusinessOwner)
VALUES ('mhmd@gmail.com','5610321053','muhammad','awwad','123321',false),
('hammode@gmail.com','123456789','hammode','awwad','65156156',true);




COMMIT;
