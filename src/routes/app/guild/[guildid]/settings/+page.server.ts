import { Token } from "$lib/server/token";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { DatabaseConnection } from "$lib/server/database/connection";
import { Guild } from "$lib/server/guild";
import type { IGuildSettings, IGuildMember } from "$lib/server/database/types";

export const load: PageServerLoad = async ({ cookies, params }) => {
  const token = cookies.get('token');
  const user = await Token.getUserFromToken(token);
  if (!user) redirect(302, `/app/guild/${params.guildid}`);

  // Get the guild
  const guild = await DatabaseConnection.queryOne<Guild>(
    'SELECT * FROM guilds WHERE id = $1::integer',
    params.guildid);

  if (!guild) redirect(302, `/app`);

  // Check if user is an administrator of the guild
  const member = await DatabaseConnection.queryOne<IGuildMember>(
    'SELECT * FROM guildmembers WHERE administrator = TRUE AND guildid = $1::integer AND userid = $2::integer',
    params.guildid, user.id);
  
  let guildsettings = await DatabaseConnection.queryOne<IGuildSettings>('SELECT * from guildsettings WHERE guildid = $1::integer', params.guildid);
  if (!guildsettings) {
    await DatabaseConnection.execute('INSERT INTO guildsettings (guildid, discoverable) VALUES ($1::integer, $2::boolean)', guild.id, false);

    guildsettings = {
      guildid: guild.id,
      discoverable: false
    }
  }

  const guilds = await DatabaseConnection.query<Guild>('SELECT guilds.* FROM guildmembers INNER JOIN guilds ON guilds.id = guildmembers.guildid WHERE guildmembers.userid = $1::integer', user.id);

  if (!member) redirect(302, `/app/guild/${params.guildid}`);

  return {
    guild,
    guilds,
    guildsettings
  }
};