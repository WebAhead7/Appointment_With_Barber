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
myFavorites TEXT,
myAppointments TEXT
);


CREATE TABLE business(
    id SERIAL PRIMARY KEY,
    businessName VARCHAR(255) NOT NULL,
    ownerId INTEGER REFERENCES users(id),
    phone VARCHAR(255) NOT NULL,
    businessAddress VARCHAR(255) NOT NULL,
    geoLocation VARCHAR(255) NOT NULL
);







COMMIT;
