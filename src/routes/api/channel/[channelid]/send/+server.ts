import { Channel } from "$lib/server/channel";
import { DatabaseConnection } from "$lib/server/database/connection";
import { Message } from "$lib/server/message";
import { type MessageContent, TextContent } from "$lib/server/messagecontent";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST : RequestHandler = async ({ cookies, params, request }) => {
  const channelid = params.channelid;
  if (!channelid) return json({ message: 'Channel not found' }, { status: 404 });
  
  const channel = await Channel.byId(parseInt(channelid));
  if (!channel) return json({ message: 'Channel not found' }, { status: 404 });

  const cookie = cookies.get('token');
  if (!cookie) return json({ message: 'Not authenticated token' }, { status: 403 });

  const user = await Token.getUserFromToken(cookie);
  if (!user) return json({ message: 'Not authenticated user' }, { status: 403 });

  let { content, datetime } : { content: MessageContent[], datetime: number } = await request.json();
  
  if (!content || content.length == 0) return json({ message: 'Requires body field "content"' }, { status: 400 });
  if (content.map(c => c.type === "text").includes(false)) return json({ message: 'Content has the wrong format' }, { status: 400 });

  const typedcontent = content.map(c => {
    if (TextContent.isTextContent(c)) return c;
  }).filter(c => !!c);

  if(typedcontent.length == 0) return json({ message: 'Content has the wrong formatting' }, { status: 400 });

  const messageobject = new Message(typedcontent, user, new Date(datetime));

  // Log to database
  const messageidobj = await DatabaseConnection.queryOne<{id: number}>(
    'INSERT INTO messages (senderid, channelid, sentat) VALUES ($1::integer, $2::integer, $3::timestamp) RETURNING id',
    messageobject.sender.id,
    channelid,
    messageobject.datetime);

  const msgid = messageidobj?.id;

  if (!msgid) return json({ message: 'An err' }, { status: 500 });

  // Log messagecontent to database
  for (const messagecontent of content) {
    if (messagecontent instanceof TextContent) {
      await DatabaseConnection.execute(
        'INSERT INTO textcontent (content, messageid) VALUES ($1::text, $2::integer)',
        messagecontent.content,
        msgid
      );
    }
  }

  channel.broadcast(messageobject.toSendable(), 'channelmessage');

  return json({ message: 'Message sent in channel' }, { status: 200 });
}