CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL CONSTRAINT unique_username UNIQUE,
  hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  bio TEXT
);

CREATE TABLE guilds (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  colour TEXT NOT NULL CONSTRAINT colour_hex_constraint CHECK (colour ~* '^#[a-f0-9]{6}$'), -- Only valid hex colours allowed
  deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE channel (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  guildid INT NOT NULL REFERENCES guilds(id)
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  senderid INT NOT NULL REFERENCES users(id),
  channelid INT NOT NULL REFERENCES channel(id),
  sentat TIMESTAMP NOT NULL,
  deleted BOOLEAN NOT NULL DEFAULT FALSE,
  replyto INT REFERENCES messages(id),
  edited BOOLEAN NOT NULL DEFAULT FALSE
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
  uuid TEXT NOT NULL CONSTRAINT invitation_unique UNIQUE,
  customlink TEXT UNIQUE
);

CREATE TABLE guildsettings (
  guildid INT NOT NULL REFERENCES guilds(id),
  discoverable BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE textcontent (
  id SERIAL NOT NULL PRIMARY KEY,
  content TEXT NOT NULL,
  messageid INT NOT NULL REFERENCES messages(id)
);

CREATE TABLE files (
  id SERIAL NOT NULL PRIMARY KEY,
  path TEXT NOT NULL UNIQUE,
  displayname TEXT NOT NULL,
  mime TEXT NOT NULL,
  uploaded TIMESTAMP NOT NULL
);

CREATE TABLE filecontent (
  id SERIAL NOT NULL PRIMARY KEY,
  fileid INT NOT NULL REFERENCES files(id),
  messageid INT NOT NULL REFERENCES messages(id)
);

CREATE TABLE bannedmembers (
  userid INT NOT NULL REFERENCES users(id),
  guildid INT NOT NULL REFERENCES guilds(id),
  PRIMARY KEY (userid, guildid)
);

CREATE TABLE pfp (
  fileid INT NOT NULL REFERENCES files(id),
  userid INT NOT NULL REFERENCES users(id),
  PRIMARY KEY (fileid, userid)
);