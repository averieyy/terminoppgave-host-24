import { Token } from "$lib/server/token";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { DatabaseConnection } from "$lib/server/database/connection";
import { Guild } from "$lib/server/guild";

export const load: PageServerLoad = async ({ cookies, params, url }) => {
  const token = cookies.get('token');
  const user = await Token.getUserFromToken(token);

  if (!user) redirect(302, `/app/login?redirect=${url.pathname}`);

  // Get guild from invite
  const uuid = params.uuid;
  const guild = await DatabaseConnection.queryOne<Guild>('SELECT guilds.* FROM invitation INNER JOIN guilds ON invitation.guildid = guilds.id WHERE invitation.uuid = $1::text', uuid);
  if (!guild) redirect(302, '/app');

  return {
    guild,
    uuid
  }
};