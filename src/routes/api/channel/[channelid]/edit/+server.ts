import { Channel } from "$lib/server/channel";
import { DatabaseConnection } from "$lib/server/database/connection";
import type { IMessage, IGuildMember, IFile } from "$lib/server/database/types";
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

  const oldFiles = await DatabaseConnection.query<IFile>('SELECT files.* FROM filecontent INNER JOIN files ON files.id = filecontent.fileid WHERE filecontent.messageid = $1::integer', messageid);

  const filecontent = messagecontent.filter(f => FileContent.isFileContent(f));

  const diffFiles = oldFiles.filter(f => !filecontent.find(c => c.path == f.path));

  await DatabaseConnection.execute('DELETE FROM textcontent WHERE messageid = $1::integer', messageid);
  
  for (let file of diffFiles) {
    await DatabaseConnection.execute('DELETE FROM filecontent WHERE fileid = $1::integer', file.id);
  }

  for (let textcontent of messagecontent.filter(t => TextContent.isTextContent(t))) {
    await DatabaseConnection.execute('INSERT INTO textcontent (content, messageid) VALUES ($1::text, $2::integer)', textcontent.content, messageid);    
  }

  for (let file of filecontent.filter(f => !oldFiles.find(d => d.path == f.path))) {
    const fileobj = await DatabaseConnection.queryOne<IFile>('SELECT * FROM files WHERE path = $1::text', file.path);
    if (!fileobj) continue;
    await DatabaseConnection.execute('INSERT INTO filecontent (fileid, messageid) VALUES ($1::integer, $2::integer)', fileobj.id, messageid);    
  }

  const messageobj = new Message(messagecontent, user, message.sentat, message.id);

  channel.broadcast({message: messageobj.toSendable()}, 'messageedit');
  
  return json({ message: 'Edited message' }, { status: 200 });
}