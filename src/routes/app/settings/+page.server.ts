import { Token } from "$lib/server/token";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies, url }) => {
  const user = await Token.getUserFromToken(cookies);
  if (!user) redirect(302, `/app/login?redirect=${url.pathname}`);

  return {
    user: {
      id: user.id,
      username: user.username
    }
  }
};