import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { DatabaseConnection } from "$lib/server/database/connection";
import { User } from "$lib/server/user";

export const load: PageServerLoad = async ({ cookies, params, url }) => {
  // Get user
  const token = cookies.get('token');
  if (!token) redirect(302, `/app/login?redirect=${url.pathname}`);

  const user = User.getFromCookie(token);
  if (!user) redirect(302, `/app/login?redirect=${url.pathname}`)
};