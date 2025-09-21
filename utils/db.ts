import * as SQLite from "expo-sqlite";

export const openAndInitDatabase = async () => {
  const db = await SQLite.openDatabaseAsync("myGame.db");

  await db.withTransactionAsync(async () => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS players (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT,
        total_score INTEGER
      );
    `);
  });

  return db;
};

// use const db = await openAndInitDatabase(); in the main application layout file to initialize the database.

export const insertPlayer = (id: string, name: string, score: number) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO players (id, name, total_score) VALUES (?, ?, ?);",
      [id, name, score]
    );
  });
};

export const getPlayers = (callback: (players: any[]) => void) => {
  db.transaction((tx) => {
    tx.executeSql("SELECT * FROM players;", [], (_, result) => {
      callback(result.rows._array);
    });
  });
};
