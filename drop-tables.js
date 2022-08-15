// Drops tables locally.
import pg from 'pg';

(async () => {
  const client = new pg.Client({
    connectionString: 'postgres://admin:admin@localhost:54321/chat',
  });

  try {
    await client.connect();

    await client.query('DROP TABLE IF EXISTS "messages";')
    await client.query('DROP TABLE IF EXISTS "users";')
    await client.query('DROP TABLE IF EXISTS "chats";')
    await client.query('DROP TABLE IF EXISTS "migrations";')
    // Add more tables here...
    
    console.log('😵 Dropped all tables');
  } finally {
    await client.end();
  }
})();