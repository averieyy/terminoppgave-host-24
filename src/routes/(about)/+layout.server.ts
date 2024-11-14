import { Token } from "$lib/server/token";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
  const token = cookies.get('token');
  const user = Token.getUserFromToken(token);

  return {
    loggedin: !!user
  }
};