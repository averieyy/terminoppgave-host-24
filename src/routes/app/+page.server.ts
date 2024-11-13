import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { Token } from "$lib/server/token";
import { DatabaseConnection } from "$lib/server/database/connection";
import type { Guild } from "$lib/server/guild";

export const load: PageServerLoad = async ({ cookies, url }) => {
  // Get user
  const token = cookies.get('token');
  if (!token) redirect(302, `/app/login?redirect=${url.pathname}`);

  const user = await Token.getUserFromToken(token);
  if (!user) redirect(302, `/app/login?redirect=${url.pathname}`);

  const guilds = await DatabaseConnection.query<Guild>('SELECT guilds.* FROM guildmembers INNER JOIN guilds ON guildmembers.guildid = guilds.id WHERE guildmembers.userid = $1::integer', user.id);

  return {
    guilds
  };
};