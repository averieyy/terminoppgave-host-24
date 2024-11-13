import { DatabaseConnection } from "$lib/server/database/connection";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const token = cookies.get('token');
  const user = await Token.getUserFromToken(token);
  
  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  let { name, description, colour }: {name: string, description: string, colour: string} = await request.json();

  name = name.trim();
  description = description.trim();

  if (!colour.match(/^#[a-fA-F0-9]{6}$/)) return json({ message: 'Colour has faulty formatting' }, { status: 400 });
  
  if (!name) return json({ message: 'Name cannot be empty' }, { status: 400 });

  // Create guild in database
  const idresponse = await DatabaseConnection.queryOne<{id: number}>('INSERT INTO guilds (name, description, colour) VALUES ($1::text, $2::text, $3::text) RETURNING id;', name, description, colour);
  if (!idresponse) return json({ message: 'An error occured while trying to create guild' }, { status: 500 });

  // Make user join guild
  await DatabaseConnection.execute('INSERT INTO guildmembers (userid, guildid) VALUES ($1::integer, $2::integer)', user.id, idresponse.id);

  return json({ id: idresponse.id }, { status: 200 });
}