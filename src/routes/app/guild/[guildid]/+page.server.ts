import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { Token } from "$lib/server/token";
import { DatabaseConnection } from "$lib/server/database/connection";
import type { Guild } from "$lib/server/guild";
import type { IChannel } from "$lib/server/database/types";

export const load: PageServerLoad = async ({ cookies, params, url }) => {
  // Get User
  const token = cookies.get('token');
  if (!token) redirect(302, `/app/login?redirect=${url.pathname}`);

  const user = await Token.getUserFromToken(token);
  if (!user) redirect(302, `/app/login?redirect=${url.pathname}`);

  const guild = await DatabaseConnection.queryOne<Guild>('SELECT * FROM guilds WHERE id = $1::integer', params.guildid);
  if (!guild) redirect(302, '/app');

  const channels = await DatabaseConnection.query<IChannel>('SELECT * FROM channel WHERE guildid = $1::integer', guild.id);

  const guilds = await DatabaseConnection.query<Guild>('SELECT guilds.* FROM guildmembers INNER JOIN guilds ON guildmembers.guildid = guilds.id');

  // Check if user is allowed to view guild
  if (!guilds.find(g => g.id == guild.id)) redirect(302, '/app');

  return {
    guild,
    guilds,
    channels
  }
};