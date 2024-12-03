import { Token } from "$lib/server/token";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { DatabaseConnection } from "$lib/server/database/connection";

export const load: PageServerLoad = async ({ cookies, url }) => {
  const user = await Token.getUserFromToken(cookies);
  if (!user) redirect(302, `/app/login?redirect=${url.pathname}`);

  const pfp = await DatabaseConnection.queryOne<{ path: string }>('SELECT f.path FROM pfp p INNER JOIN files f ON f.id = p.fileid WHERE p.userid = $1::integer', user.id);

  return {
    user: {
      id: user.id,
      username: user.username,
      pfp: pfp?.path
    }
  }
};