"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const config_1 = require("./config");
const databasePath = (0, node_path_1.isAbsolute)(config_1.config.databaseFile)
    ? config_1.config.databaseFile
    : (0, node_path_1.resolve)(process.cwd(), config_1.config.databaseFile);
(0, node_fs_1.mkdirSync)((0, node_path_1.dirname)(databasePath), { recursive: true });
exports.database = new better_sqlite3_1.default(databasePath);
exports.database.pragma("journal_mode = WAL");
exports.database.exec(`
  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    product_id INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);
