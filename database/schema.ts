import * as SQLite from 'expo-sqlite';

export const getDatabase = async () => {
  return await SQLite.openDatabaseAsync('markers.db');
};

export const initializeDatabase = async () => {
  const db = await getDatabase();
  try {
    await db.execAsync(`PRAGMA journal_mode = WAL;`);
    await db.execAsync(`PRAGMA foreign_keys = ON;`);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS markers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS marker_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        marker_id INTEGER NOT NULL,
        uri TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (marker_id) REFERENCES markers (id) ON DELETE CASCADE
      );
    `);
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};