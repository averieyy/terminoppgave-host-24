import { Channel } from "$lib/server/channel";
import { DatabaseConnection } from "$lib/server/database/connection";
import type { IMessage, IGuildMember } from "$lib/server/database/types";
import { Message } from "$lib/server/message";
import { FileContent, TextContent, type MessageContent } from "$lib/server/messagecontent";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";

export const PUT: RequestHandler = async ({ cookies, request, params }) => {
  const user = await Token.getUserFromToken(cookies);
  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  if (!params.channelid) return json({ message: 'Missing channelid' }, { status: 400 }); // Should not happen

  const channel = await Channel.byId(parseInt(params.channelid));
  if (!channel) return json({ message: 'Channel not found' }, { status: 404 });

  const member = await DatabaseConnection.queryOne<IGuildMember>('SELECT guildmembers.* FROM channel INNER JOIN guildmembers ON channel.guildid = guildmembers.guildid WHERE channel.id = $1::integer AND guildmembers.userid = $2::integer', params.channelid, user.id);
  if (!member) return json({ message: 'Unauthorized' }, { status: 403 });
  
  const { messageid, messagecontent }: { messageid: number, messagecontent: MessageContent[] } = await request.json();
  const message = await DatabaseConnection.queryOne<IMessage>('SELECT * FROM messages WHERE channelid = $1::integer AND id = $2::integer', params.channelid, messageid);
  if (!message || member.userid != message.senderid)
    return json({ message: 'Unauthorized' }, { status: 403 });

  await DatabaseConnection.execute('DELETE FROM textcontent WHERE messageid = $1::integer', messageid);
  await DatabaseConnection.execute('DELETE FROM filecontent WHERE messageid = $1::integer', messageid);

  for (let content of messagecontent) {
    if (TextContent.isTextContent(content))
      await DatabaseConnection.execute('INSERT INTO textcontent (content, messageid) VALUES ($1::text, $2::integer)',
        content.content,
        messageid
      );
    else if (FileContent.isFileContent(content)) {
      const fileid = await DatabaseConnection.queryOne<{ id: number }>('SELECT id FROM files WHERE path = $1::text', content.path);
      if (!fileid) continue;

      await DatabaseConnection.execute('INSERT INTO filecontent (fileid, messageid) VALUES ($1::integer, $2::integer)',
        fileid.id,
        messageid
      );
    }
  }

  const messageobj = await Message.fromIMessage(message);
  if (!messageobj) return json({ message: 'An error occured while trying to edit message' }, { status: 500 });

  for (let content of messageobj.content) {
    if (TextContent.isTextContent(content)) await DatabaseConnection.execute('INSERT INTO textcontent (content, messageid) VALUES ($1::text, $2::integer)', content.content, messageid);
    if (FileContent.isFileContent(content)) await DatabaseConnection.execute('INSERT INTO filecontent (fileid, messageid) VALUES ((SELECT id FROM filecontent INNER JOIN files ON files.id = filecontent.fileid WHERE files.path = $1::text), $2::integer)', content.path, messageid);
  }
  
  channel.broadcast(messageobj.toSendable(), 'messageedit');
  
  return json({ message: 'Deleted message' }, { status: 200 });
}