# Discord clone

WIP

## Running the program

> [!NOTE]
> Make sure you have npm and node installed.

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
serial|text|int

Files|||||
-|-|-|-|-
id|path|displayname|mime|uploaded
serial|text|text|text|timestamp

Filecontent|||
-|-|-
id|fileid|messageid
serial|int|int

Imagecontent|||
-|-|-
id|fileid|messageid
serial|int|int

Textfilecontent|||
-|-|-
id|fileid|messageid
serial|int|int

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
  "guildid": string,
  "name": string
}
```

```json
{
  "id": number
}
```

> GET /api/channel/\[channelid\]

Get an event stream to a channel

> POST /api/channel/\[channelid\]/send

Send a message in a channel

```json
{
  "content": string,
  "datetime": number // UTC milliseconds
}
```

```json
{
  "message": "Message sent in channel"
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

> POST /api/guild/join/discover

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

Upload an image

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