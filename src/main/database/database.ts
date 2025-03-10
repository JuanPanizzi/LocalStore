import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
//const dbPath = path.join(__dirname, '../../ls_database.db');
const dbPath = app.isPackaged
  ? path.join(process.resourcesPath, 'ls_database.db')
  : path.join(__dirname, '../../ls_database.db');



let db;

try {
  db = new Database(dbPath);
  console.log('✅ Conexión exitosa a la base de datos SQLite.');
} catch (error) {
  console.error('❌ Error al conectar a la base de datos SQLite:', error);
  process.exit(1); // Termina el proceso si no puedes conectar
}

export default db;
