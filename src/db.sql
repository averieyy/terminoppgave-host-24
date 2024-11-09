CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL CONSTRAINT unique_username UNIQUE,
  hash TEXT NOT NULL,
  salt TEXT NOT NULL
);

CREATE TABLE channel (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  senderid INT NOT NULL REFERENCES users(id),
  channelid INT NOT NULL REFERENCES channel(id),
  sentat TIMESTAMP NOT NULL
);

CREATE TABLE tokens (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  userid INT NOT NULL REFERENCES users(id),
  expires TIMESTAMP NOT NULL
);