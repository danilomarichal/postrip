DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS comments CASCADE;


CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255)
);


CREATE TABLE posts (
id SERIAL PRIMARY KEY,
country VARCHAR(255) NOT NULL,
image_one VARCHAR (255) NOT NULL,
image_two VARCHAR (255) NOT NULL,
image_three VARCHAR (255) NOT NULL,
comment VARCHAR(5000) NOT NULL,
place VARCHAR(5000) NOT NULL,
suggestion VARCHAR(5000) NOT NULL,
restaurant VARCHAR(5000) NOT NULL,
user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE
);

CREATE TABLE favorites (
id SERIAL PRIMARY KEY,
country VARCHAR(255) NOT NULL,
image_one VARCHAR (255) NOT NULL,
image_two VARCHAR (255) NOT NULL,
image_three VARCHAR (255) NOT NULL,
comment VARCHAR(5000) NOT NULL,
place VARCHAR(5000) NOT NULL,
suggestion VARCHAR(5000) NOT NULL,
restaurant VARCHAR(5000) NOT NULL,
post_id INTEGER REFERENCES posts(id) ON UPDATE CASCADE
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  comment VARCHAR(1000),
  user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE
);


