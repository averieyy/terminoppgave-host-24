import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { Token } from "$lib/server/token";
import { DatabaseConnection } from "$lib/server/database/connection";
import type { IChannel } from "$lib/server/database/types";
import { Guild } from "$lib/server/guild";

export const load: PageServerLoad = async ({ cookies, params, url }) => {
  // Get user
  const token = cookies.get('token');
  if (!token) redirect(302, `/app/login?redirect=${url.pathname}`);

  const user = await Token.getUserFromToken(token);
  if (!user) redirect(302, `/app/login?redirect=${url.pathname}`);

  const channel = await DatabaseConnection.queryOne<IChannel>('SELECT * FROM channel WHERE id = $1::integer', params.channelid);
  if (!channel) redirect(302, '/app');

  const guilds = await DatabaseConnection.query<Guild>('SELECT guilds.* FROM guildmembers INNER JOIN guilds ON guildmembers.guildid = guilds.id WHERE guildmembers.userid = $1::integer', user.id);

  if (!guilds.find(g => g.id == channel.guildid)) redirect(302, '/app');

  return {
    channel,
    guilds: guilds.map(g => { return{
      name: g.name,
      id: g.id,
      description: g.description,
      colour: g.colour
    }})
  }
};