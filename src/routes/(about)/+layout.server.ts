import { Token } from "$lib/server/token";
import type { LayoutServerLoad } from "./$types";

export const ssr = true;

export const load: LayoutServerLoad = async ({ cookies }) => {
  const user = await Token.getUserFromToken(cookies);

  return {
    loggedin: !!user
  }
};