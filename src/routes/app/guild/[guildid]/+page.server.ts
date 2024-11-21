import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { Token } from "$lib/server/token";
import { DatabaseConnection } from "$lib/server/database/connection";
import type { Guild } from "$lib/server/guild";
import type { IChannel, IGuildMember } from "$lib/server/database/types";
import { ChannelMembers, Member, OnlineMemberIds } from "$lib/server/user";

export const load: PageServerLoad = async ({ cookies, params, url }) => {
  // Get User
  const user = await Token.getUserFromToken(cookies);
  if (!user) redirect(302, `/app/login?redirect=${url.pathname}`);

  const guild = await DatabaseConnection.queryOne<Guild>('SELECT * FROM guilds WHERE id = $1::integer', params.guildid);
  if (!guild) redirect(302, '/app');

  const channels = await DatabaseConnection.query<IChannel>('SELECT * FROM channel WHERE guildid = $1::integer', guild.id);

  const guilds = await DatabaseConnection.query<Guild & IGuildMember>('SELECT * FROM guildmembers INNER JOIN guilds ON guildmembers.guildid = guilds.id WHERE guildmembers.userid = $1::integer', user.id);

  const members = await DatabaseConnection.query<{username: string, userid: number}>('SELECT users.username, guildmembers.userid FROM guildmembers INNER JOIN users ON guildmembers.userid = users.id WHERE guildmembers.guildid = $1::integer', guild.id);
  
  const onlinemembers = members.map(m => {return {
    username: m.username,
    online: OnlineMemberIds.includes(m.userid) || user.id == m.userid
  }});

  let admin: boolean = false;
  
  // Check if user is allowed to view guild
  if (!guilds.find(g => {
    if (g.id == guild.id) {
      
      admin = g.administrator;

      return true;
    }
  })) redirect(302, '/app');

  return {
    guild,
    guilds,
    channels,
    admin,
    members: onlinemembers
  }
};