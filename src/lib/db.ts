import { Pool } from 'pg';
import type { QueryResult } from 'pg';
import type { QueryConfig } from './types/db';

let pool: Pool|null = null;

export function maybeInitializePool() : Pool {
    console.log(process.env.DB_URL);
    console.log(parseInt(process.env.DB_CLIENTS || '22'));
  if (!pool) {
    console.log('🐘 Initializing Postgres connection!');
    pool = new Pool({
      connectionString: process.env.DB_URL || 'postgres://admin:admin@localhost:54321/chat',
      max: parseInt(process.env.DB_CLIENTS || '10'),
    });
  }
  return pool;
}

export async function query(incomingQuery: string, params: any[] = [], config: QueryConfig = {}) : Promise<QueryResult | null> {
    maybeInitializePool();

  const timingStart = new Date();

  if (config.debug) {
    console.info('----');
    console.info(`🔰 Query: ${incomingQuery}`);
    console.info('📊 Data: ', params);
  }

  if(pool) {
    const results = await pool.query(incomingQuery, params);
    if (config.debug) {
      console.info('⏰ Postgres query execution time: %dms', (new Date().getTime() - timingStart.getTime()));
      console.info('----');
    }

    return results;
  } else {
   return null; 
  }
}

export async function disconnect() : Promise<void> {
  if (pool !== null) {
    console.log('😵 Disconnecting from Postgres!');
    const thisPool = pool;
    pool = undefined;
    return await thisPool.end();
  }

  return;
}
