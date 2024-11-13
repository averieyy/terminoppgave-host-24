CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL CONSTRAINT unique_username UNIQUE,
  hash TEXT NOT NULL,
  salt TEXT NOT NULL
);

CREATE TABLE guilds (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  colour TEXT NOT NULL CONSTRAINT colour_hex_constraint CHECK (colour ~* '^#[a-f0-9]{6}$') -- Only valid hex colours allowed
);

CREATE TABLE channel (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  guildid INT NOT NULL REFERENCES guilds(id)
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
  content TEXT NOT NULL CONSTRAINT unique_token UNIQUE,
  userid INT NOT NULL REFERENCES users(id),
  expires TIMESTAMP NOT NULL
);

CREATE TABLE guildmembers (
  userid INT NOT NULL REFERENCES users(id),
  guildid iNT NOT NULL REFERENCES guilds(id),
  administrator BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT guildmembers_unique UNIQUE (userid, guildid)
);

CREATE TABLE invitation (
  guildid INT NOT NULL REFERENCES guilds(id),
  uuid TEXT NOT NULL CONSTRAINT invitation_unique UNIQUE
);