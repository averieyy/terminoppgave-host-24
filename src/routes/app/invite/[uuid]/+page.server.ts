import { Token } from "$lib/server/token";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { DatabaseConnection } from "$lib/server/database/connection";
import { Guild } from "$lib/server/guild";
import type { IGuild } from "$lib/server/database/types";

export const load: PageServerLoad = async ({ cookies, params, url }) => {
  const user = await Token.getUserFromToken(cookies);
  if (!user) redirect(302, `/app/login?redirect=${url.pathname}`);

  // Get guild from invite
  const uuid = params.uuid;
  const guild = await DatabaseConnection.queryOne<Guild>('SELECT guilds.* FROM invitation INNER JOIN guilds ON invitation.guildid = guilds.id WHERE invitation.uuid = $1::text', uuid);
  if (!guild) redirect(302, '/app');
  
  // Get unavailable guilds (the guilds they are already a part of or are banned from)
  const bannedGuilds = await DatabaseConnection.query<{guildid: number}>('SELECT guildid FROM bannedmembers WHERE userid = $1::integer', user.id);
  const guilds = await DatabaseConnection.query<IGuild>('SELECT guilds.* FROM guildmembers INNER JOIN guilds ON guilds.id guildmembers.guildid =  WHERE guildmembers.userid = $1::integer', user.id);
  
  if (bannedGuilds.find(b => b.guildid == guild.id) || guilds.find(g => g.id == guild.id))
    redirect(302, '/app');

  return {
    guild,
    uuid
  }
};