import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { Token } from "$lib/server/token";

export const load: PageServerLoad = async ({ cookies, params, url }) => {
  // Get user
  const token = cookies.get('token');
  if (!token) redirect(302, `/app/login?redirect=${url.pathname}`);

  const user = await Token.getUserFromToken(token);
  if (!user) redirect(302, `/app/login?redirect=${url.pathname}`)
};