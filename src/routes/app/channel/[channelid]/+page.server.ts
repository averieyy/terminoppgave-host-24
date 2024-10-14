import type { Actions } from "@sveltejs/kit";
import type { PageServerData } from "./$types";

export const actions: Actions = {
  send: async ({ cookies, request }) => {
    const formdata = request.formData;
  }
}