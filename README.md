# Discord clone

WIP

## Running the program

> [!NOTE]
> Make sure you have npm and node installed. You will also need PostgreSQL.

<details>

<summary>Creating the database</summary>

> [!NOTE]
> Make sure you have the latest version on Postgresql installed.

Create a postgres database. Usually, you can do this by running `createdb <database>`, but in some cases, this command is not available. If it isn't, simply open a psql shell an type in 
```sql
CREATE DATABASE <name>;  -- <name> should be your database name.
```

Copy the contents of `src/db.sql` into a psql shell.

If you are using bash (or unix-like systems), you should be able to run

```bash
cat src/db.sql | psql -U <username> <database>
```

Otherwise, just open a psql shell and copy the contetns of `src/db.sql`. Make sure to copy everything.

Create a file called `.env` with the contents
```bash
DBNAME="<database name>"
DBUSER="<username>"
DBHOST="<hostname (localhost)>"
DBPASSWD="<user password in postgres>"
```

</details>

- Run ```npm install``` to install required dependencies
- Then, run ```npm run dev``` to start a dev server
- Open <http://localhost:5173/app/login> in your web browser.

## About the project

### Database Structure

Users||||
-|-|-|-
id|username|hash|salt
serial (int)|text|text|text

Guilds|||||
-|-|-|-|-
id|name|description|colour|deleted
serial (int)|text|text|text|boolean (default false)

Channel|||
-|-|-
id|name|guildid
serial (int)|text|int

Messages|||||
-|-|-|-|-
id|content|senderid|channelid|sentat
serial (int)|text|int|int|timestamp

Tokens||||
-|-|-|-
id|content|userid|expires
serial (int)|text|int|timestamp

Guildmembers|||
-|-|-
userid|guildid|administrator
int|int|boolean

Invitation||
-|-
guildid|uuid
int|text

Guildsettings||
-|-
guildid|discoverable
int|boolean

Textcontent|||
-|-|-
id|content|messageid
serial (int)|text|int

Files|||||
-|-|-|-|-
id|path|displayname|mime|uploaded
serial (int)|text|text|text|timestamp

Filecontent|||
-|-|-
id|fileid|messageid
serial (int)|int|int

Bannedmembers|||
-|-|-
userid|guildid
int|int

### Route explanation

- Everything under `/app` is reserved for the app itself.
- Everything under `/api` is *(obviously)* reserved for api endpoints.
- Everything else is for new users, or general informations (home page, about page). Is the directory structure, this is under `/src/routes/(about)/`.

### API endpoints

All API endpoints return errors with the structure
```json
{
  "message": string
}
```
This should be consistent throughout the application.

Example:

```json
{
  "message": "Unauthorized"
}
```
This means that the user either does not exist, or they do not meet the required permissions.

---

> POST /api/channel/create

Create new channel

```json
{
  "guildid": number,
  "name": string
}
```

```json
{
  "id": number
}
```

> DELETE /api/channel/delete

Delete channel

```json
{
  "guildid": number,
  "channelid": number
}
```

```json
{
  "message": "Channel deleted"
}
```

> PUT /api/channel/edit

Edit channel

```json
{
  "guildid": number,
  "channelid": number,
  "name": string
}
```

```json
{
  "message": "Channel edited"
}
```

> GET /api/channel/\[channelid\]

Get an event stream to a channel

> DELETE /api/channel/\[channelid\]/delete

Delete a message from channel

```json
{
  "messageid": number
}
```

```json
{
  "message": "Deleted message"
}
```

> PUT /api/channel/\[channelid\]/edit

Edit a channel message

```json
{
  "messageid": number,
  "messagecontent": content[],
  "replyto": number | undefined
}
```

```json
{
  "message": "Edited message"
}
```

> POST /api/channel/\[channelid\]/send

Send a message in a channel

```json
{
  "content": string,
  "datetime": number, // UTC milliseconds
  "replyto": number | undefined
}
```

```json
{
  "message": "Message sent in channel"
}
```

> POST /api/guild/ban

Ban member

```json
{
  "guildid": number,
  "userid": number
}
```

```json
{
  "message": "Banned member"
}
```

> POST /api/guild/create

Create new guild

```json
{
  "name": string,
  "description": string,
  "colour": string
}
```

```json
{
  "id": number
}
```

> DELETE /api/guild/delete

Delete guild

```json
{
  "guildid": number
}
```

```json
{
  "message": "Deleted guild"
}
```

> POST /api/guild/demote

Demote a guild member

```json
{
  "userid": number,
  "guildid": number
}
```

```json
{
  "message": "Successfully demoted member"
}
```

> POST /api/guild/invite

Create invitation

```json
{
  "guildid": number
}
```

```json
{
  "uuid": string
}
```

> POST /api/guild/invite/custom

Create invitation with custom link

```json
{
  "guildid": number,
  "custom": string
}
```

```json
{
  "custom": string
}
```

> POST /api/guild/join

Join a guild (from invite link)

```json
{
  "uuid": string
}
```

```json
{
  "message": "Joined server"
}
```

> POST /api/guild/join/discovery

Join a guild (from the discovery page)

```json
{
  "guildid": number
}
```

```json
{
  "message": "Joined guild"
}
```

> POST /api/guild/kick

Kick member

```json
{
  "guildid": number,
  "userid": number,
}
```

```json
{
  "message": "Kicked member"
}
```

> POST /api/guild/leave

Leave a guild

```json
{
  "guildid": number
}
```

```json
{
  "message": "Left guild"
}
```

> POST /api/guild/promote

Promote a guild member

```json
{
  "userid": number,
  "guildid": number
}
```

```json
{
  "message": "Successfully promoted member"
}
```

> PUT /api/guild/settings

Update settings for a guild

```json
{
  "guildid": number,
  "guild": Guild,
  "guildsettings": IGuildSettings
}
```

```json
{
  "message": "Updated"
}
```

> POST /api/guild/unban

Unban member

```json
{
  "guildid": number,
  "userid": string
}
```

```json
{
  "message": "Unbanned member"
}
```

> POST /api/login

Log in

```json
{
  "username": string,
  "password": string
}
```

```json
{
  "message": "Logged in as <username>"
}
```

> GET /api/online

Register yourselves as online (Event stream endpoint)

> POST /api/register

Register user (sign up)

```json
{
  "username": string,
  "password": string
}
```

```json
{
  "message": "Registered new user successfully"
}
```

> POST /api/upload

Upload files

Body is form data.
file: File

```json
{
  "path": string
}
```

> GET /api/upload\[fileid\]

Get the contents of an uploaded file

Response is the binary contents of the file, with the correct MIME type as Content-Type header.

> GET /api/upload/\[fileid\]/info

Get metadata of an uploaded file

```json
{
  "displayname": string,
  "mime": string,
  "uploaded": date (as string),
  "path": string
}
```