import 'dotenv/config';
import pg from "pg";

export class DatabaseConnection {
  public static pool: pg.Pool = new pg.Pool(this.createConfig());

  private static createConfig () : pg.PoolConfig  {
    const { DBNAME, DBUSER, DBPASSWD, DBHOST } = process.env;

    return {
      database: DBNAME,
      user: DBUSER,
      password: DBPASSWD,
      host: DBHOST,
    }
  }
}