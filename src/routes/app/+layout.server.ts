import { Token } from "$lib/server/token";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
  const user = Token.getUserFromToken(cookies);

  return {
    loggedin: !!user
  }
};