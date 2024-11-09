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

  public static async query<T extends pg.QueryResultRow> (query: string, ...values: any[]): Promise<T[]> {
    return (await this.pool.query<T>(query, values)).rows;
  }

  public static async queryOne<T extends pg.QueryResultRow> (query: string, ...values: any[]): Promise<T | undefined> {
    return (await this.pool.query<T>(query, values)).rows[0];
  }

  public static async execute(query: string, ...values: any[]) {
    (await this.pool).query(query, values);
  }
}