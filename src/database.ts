import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { config } from "./config";

const databasePath = isAbsolute(config.databaseFile)
  ? config.databaseFile
  : resolve(process.cwd(), config.databaseFile);

mkdirSync(dirname(databasePath), { recursive: true });

export const database = new Database(databasePath);
database.pragma("journal_mode = WAL");
database.exec(`
  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    product_id INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);