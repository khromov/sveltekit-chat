// We could also use "ts-node migrate.ts" as an alternative if we want TypeScript.
import path from 'path';
import { fileURLToPath } from 'url';
import pgMigrate from 'postgres-migrations';
import pg from 'pg';

// https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const client = new pg.Client({
    connectionString: 'postgres://admin:admin@localhost:54321/chat',
  });

  await client.connect();

  try {
    const migrations = await pgMigrate.migrate({ client }, `${__dirname}/migrations`);

    migrations.forEach((migration) => console.log(`✅ ${migration.fileName}`));
    console.log('🏁 Migrations completed');
  } finally {
    await client.end();
  }
})();