import * as SQLite from "expo-sqlite";

export const openAndInitDatabase = async (db: SQLite.SQLiteDatabase) => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    total_score INTEGER DEFAULT 0,
    games_played INTEGER DEFAULT 0,
    games_won INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS games (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT,  
    current_round INTEGER,
    status TEXT,
    winner_id TEXT,
    created_at TEXT,
    updated_at TEXT
  );
  CREATE TABLE IF NOT EXISTS gameplayers (
    id TEXT PRIMARY KEY NOT NULL,
    game_id TEXT NOT NULL,
    player_id TEXT NOT NULL,
    total_score INTEGER DEFAULT 0,
    games_played INTEGER DEFAULT 0,
    games_won INTEGER DEFAULT 0,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS rounds (
    id TEXT PRIMARY KEY NOT NULL,
    game_id TEXT NOT NULL,
    player_id TEXT NOT NULL,
    round_number INTEGER,
    melds_score INTEGER DEFAULT 0,
    cards_score INTEGER DEFAULT 0,
    bonus_clean_books INTEGER DEFAULT 0,
    bonus_dirty_books INTEGER DEFAULT 0,
    bonus_red_threes INTEGER DEFAULT 0,
    penalty_cards_left INTEGER DEFAULT 0,
    went_out BOOLEAN DEFAULT 0,
    round_total INTEGER DEFAULT 0,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
  );
    CREATE INDEX IF NOT EXISTS idx_gameplayers_game_id ON gameplayers(game_id);
    CREATE INDEX IF NOT EXISTS idx_rounds_game_id ON rounds(game_id);
    CREATE INDEX IF NOT EXISTS idx_rounds_player_id ON rounds(player_id);
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
