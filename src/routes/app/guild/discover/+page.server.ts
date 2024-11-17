import { Token } from "$lib/server/token";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { DatabaseConnection } from "$lib/server/database/connection";
import type { Guild } from "$lib/server/guild";

export const load: PageServerLoad = async ({ cookies }) => {
  const user = await Token.getUserFromToken(cookies);
  if (!user) redirect(302, '/app/login?redirect=/app/guild/discover');

  const guilds = await DatabaseConnection.query<Guild>('SELECT guilds.* FROM guildmembers INNER JOIN guilds ON guilds.id = guildmembers.guildid WHERE guildmembers.userid = $1::integer', user.id);

  const discoverableguilds = (await DatabaseConnection.query<Guild>('SELECT guilds.* FROM guildsettings INNER JOIN guilds ON guilds.id = guildsettings.guildid WHERE guildsettings.discoverable = TRUE;'))
    .filter(guild => !guilds.find(g => g.id == guild.id));

  return {
    guilds,
    discoverableguilds
  }
};