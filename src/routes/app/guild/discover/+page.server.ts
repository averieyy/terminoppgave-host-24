import { Token } from "$lib/server/token";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { DatabaseConnection } from "$lib/server/database/connection";
import type { Guild } from "$lib/server/guild";

export const load: PageServerLoad = async ({ cookies, url }) => {
  const user = await Token.getUserFromToken(cookies);
  if (!user) redirect(302, `/app/login?redirect=${url.pathname}`);

  const guilds = await DatabaseConnection.query<Guild>('SELECT guilds.* FROM guildmembers INNER JOIN guilds ON guilds.id = guildmembers.guildid WHERE guildmembers.userid = $1::integer', user.id);

  const bannedGuilds = await DatabaseConnection.query<{guildid: number}>('SELECT * FROM bannedmembers WHERE userid = $1::integer', user.id);

  const discoverableguilds = (await DatabaseConnection.query<Guild>('SELECT guilds.* FROM guildsettings INNER JOIN guilds ON guilds.id = guildsettings.guildid WHERE guildsettings.discoverable = TRUE;'))
    .filter(guild => !guilds.find(g => g.id == guild.id))
    .filter(guild => !bannedGuilds.find(g => g.guildid == guild.id));

  return {
    guilds,
    discoverableguilds
  }
};