import * as SQLite from "expo-sqlite";

export const openAndInitDatabase = async (db: SQLite.SQLiteDatabase) => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT,
      total_score INTEGER
    );
  `);
};

// export const openAndInitDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
//   const db = await SQLite.openDatabaseAsync("myGame.db");

//   await db.withTransactionAsync(async () => {
//     await db.execAsync(`
//       CREATE TABLE IF NOT EXISTS players (
//         id TEXT PRIMARY KEY NOT NULL,
//         name TEXT,
//         total_score INTEGER
//       );
//     `);
//   });

//   return db;
// };

// use const db = await openAndInitDatabase(); in the main application layout file to initialize the database.

// Insert a player
export const insertPlayer = async (
  db: SQLite.SQLiteDatabase,
  id: string,
  name: string,
  score: number
) => {
  await db.runAsync(
    "INSERT INTO players (id, name, total_score) VALUES (?, ?, ?);",
    id,
    name,
    score
  );
};

// Get all players
export const getPlayers = async (db: SQLite.SQLiteDatabase): Promise<any[]> => {
  const players = await db.getAllAsync("SELECT * FROM players;");
  return players;
};
