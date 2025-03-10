import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';
//const dbPath = path.join(__dirname, '../../ls_database.db');

// const dbPath = app.isPackaged
//   ? path.join(process.resourcesPath, 'ls_database.db')
//   : path.join(__dirname, '../../ls_database.db');

// const dbPath = app.isPackaged
//   ? path.join(process.resourcesPath, 'main', 'database', 'ls_database.db')
//   : path.join(__dirname, 'ls_database.db');

// Definimos la ruta para desarrollo y producción
let dbPath: string;

if (app.isPackaged) {
  // En producción: Copia la base de datos a un directorio escribible (userData) si no existe
  const userDataPath = app.getPath('userData');
  dbPath = path.join(userDataPath, 'ls_database.db');
  if (!fs.existsSync(dbPath)) {
    const packagedDbPath = path.join(__dirname, 'database', 'ls_database.db');
    if (fs.existsSync(packagedDbPath)) {
      fs.copyFileSync(packagedDbPath, dbPath);
      console.log('✅ Base de datos copiada a:', dbPath);
    } else {
      console.error('❌ No se encontró la base de datos empaquetada en:', packagedDbPath);
    }
  }
} else {
  // En desarrollo, usar el archivo de la carpeta src directamente
  // Ajusta la ruta según la estructura de tu proyecto
  dbPath = path.join(process.cwd(), 'src', 'main', 'database', 'ls_database.db');
}

let db;


try {
  db = new Database(dbPath);
  console.log('✅ Conexión exitosa a la base de datos SQLite.');
} catch (error) {
  console.error('❌ Error al conectar a la base de datos SQLite:', error);
  process.exit(1); // Termina el proceso si no puedes conectar
}

export default db;
