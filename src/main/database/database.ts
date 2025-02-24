import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../ls_database.db');
const db = new Database(dbPath);

export default db;
