import { Channel } from "$lib/server/channel";
import { DatabaseConnection } from "$lib/server/database/connection";
import type { IMessage } from "$lib/server/database/types";
import { Message } from "$lib/server/message";
import { FileContent, type MessageContent, TextContent } from "$lib/server/messagecontent";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST : RequestHandler = async ({ cookies, params, request }) => {
  const channelid = params.channelid;
  if (!channelid) return json({ message: 'Channel not found' }, { status: 404 });
  
  const channel = await Channel.byId(parseInt(channelid));
  if (!channel) return json({ message: 'Channel not found' }, { status: 404 });

  const user = await Token.getUserFromToken(cookies);
  if (!user) return json({ message: 'Not authenticated user' }, { status: 403 });

  let { content, datetime, replyto } : { content: MessageContent[], datetime: number, replyto?: number } = await request.json();
  
  if (!content || content.length == 0) return json({ message: 'Requires body field "content"' }, { status: 400 });
  if (content.map(c => !!c.type).includes(false)) return json({ message: 'Content has the wrong format' }, { status: 400 });

  const typedcontent = content.map(c => {
    if (TextContent.isTextContent(c)) return c;
    if (FileContent.isFileContent(c)) return c;
  }).filter(c => !!c);

  if(typedcontent.length == 0) return json({ message: 'Content has the wrong formatting' }, { status: 400 });

  const dt = new Date(datetime);

  // Log to database
  const messageidobj = await DatabaseConnection.queryOne<{id: number}>(
    'INSERT INTO messages (senderid, channelid, sentat, replyto) VALUES ($1::integer, $2::integer, $3::timestamp, $4) RETURNING id',
    user.id,
    channelid,
    dt,
    replyto || null
  );
    
  const msgid = messageidobj?.id;
  if (!msgid) return json({ message: 'An err' }, { status: 500 });

  const reply: IMessage | undefined = await DatabaseConnection.queryOne<IMessage>('SELECT * FROM messages WHERE id = $1::integer', replyto);

  const messageobject = new Message(typedcontent, user, new Date(datetime), msgid, reply && await Message.fromIMessage(reply));
  
  // Log messagecontent to database
  for (const messagecontent of content) {
    if (TextContent.isTextContent(messagecontent))
      await DatabaseConnection.execute(
        'INSERT INTO textcontent (content, messageid) VALUES ($1::text, $2::integer)',
        messagecontent.content,
        msgid
      );
    else if (FileContent.isFileContent(messagecontent)) {
      await DatabaseConnection.execute(
        'INSERT INTO filecontent (fileid, messageid) VALUES ((SELECT id FROM files WHERE path = $1::text), $2::integer)',
        messagecontent.path,
        msgid
      );
    }
  }

  channel.broadcast(messageobject.toSendable(), 'channelmessage');

  return json({ message: 'Message sent in channel' }, { status: 200 });
}