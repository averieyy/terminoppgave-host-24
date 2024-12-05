import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { Token } from "$lib/server/token";
import { DatabaseConnection } from "$lib/server/database/connection";
import type { IGuildMember, IChannel } from "$lib/server/database/types";
import { Guild } from "$lib/server/guild";
import { OnlineMemberIds, User } from "$lib/server/user";

export const load: PageServerLoad = async ({ cookies, params, url }) => {
  // Get user
  const user = await Token.getUserFromToken(cookies);
  if (!user) redirect(302, `/app/login?redirect=${url.pathname}`);

  const channel = await DatabaseConnection.queryOne<IChannel>('SELECT * FROM channel WHERE id = $1::integer', params.channelid);
  if (!channel) redirect(302, '/app');

  const guilds = await DatabaseConnection.query<Guild>('SELECT guilds.* FROM guildmembers INNER JOIN guilds ON guildmembers.guildid = guilds.id WHERE guildmembers.userid = $1::integer', user.id);

  const guild = guilds.find(g => g.id == channel.guildid);
  if (!guild) redirect(302, '/app');

  const allmembers = await DatabaseConnection.query<{username: string, userid: number, pfp?: string, administrator: boolean, bio: string}>(
    "SELECT u.username, g.userid, f.path as pfp, u.bio FROM guildmembers g INNER JOIN users u ON g.userid = u.id LEFT OUTER JOIN pfp p ON p.userid = g.userid LEFT OUTER JOIN files f ON f.id = p.fileid WHERE g.guildid = $1::integer", guild.id);

  const members: {username: string, online: boolean, bio: string}[] = allmembers.map(m => { return {username: m.username, online: OnlineMemberIds.includes(m.userid) || user.id == m.userid, pfp: m.pfp, bio: m.bio}});
  const member = allmembers.find(m => m.userid == user.id);
  if (!member) redirect(302, '/app');

  return {
    channel,
    members,
    userid: user.id,
    admin: member.administrator,
    guild
  }
};