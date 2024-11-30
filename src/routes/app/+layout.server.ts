import { DatabaseConnection } from "$lib/server/database/connection";
import type { IGuild } from "$lib/server/database/types";
import { Token } from "$lib/server/token";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
  const user = await Token.getUserFromToken(cookies);

  const guilds = user && await DatabaseConnection.query<IGuild>('SELECT g.* FROM guildmembers m INNER JOIN guilds g ON m.guildid = g.id WHERE m.userid = $1::integer', user.id);

  return {
    loggedin: !!user,
    guilds
  }
};