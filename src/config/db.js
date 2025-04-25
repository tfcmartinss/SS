import sqlite3Module from 'sqlite3';
const sqlite3 = sqlite3Module.verbose();

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, "database.sqlite");

// Create or open the database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error connecting to SQLite database:", err.message);
    } 
    else {
        console.log("Connected to the SQLite database.");
    }
});

// Initialize the schema (create the user table if it doesn't exist)
const init = () => {
    db.run(`
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error("Error creating user table:", err.message);
        } 
        else {
            console.log("User table is ready (if it did not already exist).");
        }
    });
};

init();

export { db };