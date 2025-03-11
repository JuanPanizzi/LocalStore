// import Database from 'better-sqlite3';
// import path from 'path';
// import fs from 'fs';
// import { app } from 'electron';
// //const dbPath = path.join(__dirname, '../../ls_database.db');

// // const dbPath = app.isPackaged
// //   ? path.join(process.resourcesPath, 'ls_database.db')
// //   : path.join(__dirname, '../../ls_database.db');

// // const dbPath = app.isPackaged
// //   ? path.join(process.resourcesPath, 'main', 'database', 'ls_database.db')
// //   : path.join(__dirname, 'ls_database.db');

// // Definimos la ruta para desarrollo y producción
// let dbPath: string;




// // if (app.isPackaged) {
//   //   // Producción: la base de datos está dentro de resources
//   //   const packagedDbPath = path.join(process.resourcesPath, 'ls_database.db');
    
//   //   // (Opcional) copiarla a la carpeta de usuario si quieres poder escribir en ella
//   //   const userDataPath = app.getPath('userData');
//   //   dbPath = path.join(userDataPath, 'ls_database.db');
  
//   //   if (!fs.existsSync(dbPath)) {
//     //     // Copiamos la base de datos empaquetada a la carpeta de usuario
//     //     fs.copyFileSync(packagedDbPath, dbPath);
//   //   }
//   // } else {
//   //   // Desarrollo
//   //   dbPath = path.join(process.cwd(), 'src', 'main', 'database', 'ls_database.db');
//   // }

//   if (app.isPackaged) {
//     // Producción
//     dbPath = path.join(process.resourcesPath, 'ls_database.db');
//     console.log('DB Path final =>', dbPath);
//   } else {
//     // Desarrollo
//     dbPath = path.join(process.cwd(), 'ls_database.db');
//     console.log('DB Path final produccion =>', dbPath);
    
//   }
  
// let db;


// try {
//   db = new Database(dbPath);
//   console.log('✅ Conexión exitosa a la base de datos SQLite.');
// } catch (error) {
//   console.error('❌ Error al conectar a la base de datos SQLite:', error);
//   process.exit(1); // Termina el proceso si no puedes conectar
// }

// // Creamos las tablas si no existen
// db.exec(`
//   CREATE TABLE IF NOT EXISTS articulos (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     material_repuesto TEXT,
//     marca TEXT,
//     modelo_serie TEXT,
//     imagen TEXT,
//     cantidad INTEGER
//   );

//   CREATE TABLE IF NOT EXISTS movimientos_materiales (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     fecha TEXT,
//     tipo_movimiento TEXT,
//     origen TEXT,
//     destino TEXT,
//     articulo_id INTEGER,
//     cantidad INTEGER,
//     permiso_trabajo_asociado TEXT,
//     informe_asociado TEXT,
//     orden_trabajo_asociada TEXT,
//     remito TEXT,
//     material_repuesto TEXT,
//     marca TEXT,
//     modelo_serie TEXT,
//     numero_movimiento INTEGER,
//     numero_almacenes TEXT,
//     observaciones TEXT
//   );
// `);


// export default db;

import sqlite3 from 'better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';


// let dbPath: string;
// if (app.isPackaged) {
//   dbPath = path.join(process.resourcesPath, 'ls_database.db');
// } else {
//   dbPath = 'ls_database.db'
// }

const dbPath = process.env.NODE_ENV === "development" ? "ls_database.db" : path.join(process.resourcesPath, "ls_database.db")

let db: Database.Database;

try {
  db = new sqlite3(dbPath);
  console.log('✅ Conexión exitosa a la base de datos SQLite.');
} catch (error) {
  console.error('❌ Error al conectar a la base de datos SQLite:', error);
  process.exit(1);
}

// === CREAR LA TABLA "articulos" SI NO EXISTE ===
const createArticulosSQL = `
  CREATE TABLE IF NOT EXISTS articulos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    material_repuesto TEXT,
    marca TEXT,
    modelo_serie TEXT,
    imagen TEXT,
    cantidad INTEGER
  );
`;
try {
  db.exec(createArticulosSQL);
  console.log('✅ Tabla "articulos" verificada/creada.');
} catch (error) {
  console.error('❌ Error creando la tabla "articulos":', error);
}

// === INSERTAR DATOS EN "articulos" SI ESTÁ VACÍA ===
let countArticulos: number;
try {
  countArticulos = db.prepare('SELECT COUNT(*) AS count FROM articulos').get().count;
} catch (error) {
  console.error('❌ Error al contar registros de "articulos":', error);
  countArticulos = 0;
}

if (countArticulos === 0) {
  const insertArticulosSQL = `
    WITH RECURSIVE series(n) AS (
      SELECT 1
      UNION ALL
      SELECT n + 1 FROM series WHERE n < 50
    )
    INSERT INTO articulos (material_repuesto, marca, modelo_serie, imagen, cantidad)
    SELECT 
      CASE (ABS(RANDOM()) % 5)
        WHEN 0 THEN 'Tornillo'
        WHEN 1 THEN 'Tuerca'
        WHEN 2 THEN 'Cable'
        WHEN 3 THEN 'Resistencia'
        WHEN 4 THEN 'Conector'
      END,
      'Marca-' || (ABS(RANDOM()) % 10 + 1),
      'Modelo-' || (ABS(RANDOM()) % 100 + 1000),
      NULL,
      (ABS(RANDOM()) % 50 + 1)
    FROM series;
  `;
  try {
    db.exec(insertArticulosSQL);
    console.log('✅ Datos insertados en "articulos".');
  } catch (error) {
    console.error('❌ Error insertando datos en "articulos":', error);
  }
} else {
  console.log('Tabla "articulos" ya tiene datos.');
}

// === CREAR LA TABLA "movimientos_materiales" SI NO EXISTE ===
const createMovimientosSQL = `
  CREATE TABLE IF NOT EXISTS movimientos_materiales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_movimiento TEXT,
    fecha TEXT,
    tipo_movimiento TEXT CHECK(tipo_movimiento IN ('INGRESO', 'SALIDA')),
    origen TEXT,
    destino TEXT,
    cantidad INTEGER,
    permiso_trabajo_asociado TEXT,
    informe_asociado TEXT,
    orden_trabajo_asociada TEXT,
    remito TEXT,
    numero_almacenes INTEGER,
    material_repuesto TEXT,
    marca TEXT,
    modelo_serie TEXT,
    observaciones TEXT,
    articulo_id INTEGER
  );
`;
try {
  db.exec(createMovimientosSQL);
  console.log('✅ Tabla "movimientos_materiales" verificada/creada.');
} catch (error) {
  console.error('❌ Error creando la tabla "movimientos_materiales":', error);
}

// === INSERTAR DATOS EN "movimientos_materiales" SI ESTÁ VACÍA ===
let countMovimientos: number;
try {
  countMovimientos = db.prepare('SELECT COUNT(*) AS count FROM movimientos_materiales').get().count;
} catch (error) {
  console.error('❌ Error al contar registros de "movimientos_materiales":', error);
  countMovimientos = 0;
}

if (countMovimientos === 0) {
  const insertMovimientosSQL = `
    WITH RECURSIVE series(n) AS (
      SELECT 1
      UNION ALL
      SELECT n + 1 FROM series WHERE n < 4000
    )
    INSERT INTO movimientos_materiales (
      numero_movimiento, fecha, tipo_movimiento, origen, destino, cantidad, 
      permiso_trabajo_asociado, informe_asociado, orden_trabajo_asociada, remito, 
      numero_almacenes, material_repuesto, marca, modelo_serie, observaciones, articulo_id
    )
    SELECT 
      CASE (ABS(RANDOM()) % 2)
           WHEN 0 THEN CAST(n AS TEXT)
           ELSE CAST(n AS TEXT) || '-B'
      END AS numero_movimiento,
      date('now', '-' || (ABS(RANDOM()) % 365) || ' days') AS fecha,
      CASE (ABS(RANDOM()) % 2)
           WHEN 0 THEN 'INGRESO'
           ELSE 'SALIDA'
      END AS tipo_movimiento,
      'Origen-' || (ABS(RANDOM()) % 10 + 1) AS origen,
      'Destino-' || (ABS(RANDOM()) % 10 + 1) AS destino,
      (ABS(RANDOM()) % 20 + 1) AS cantidad,
      'PT-' || (ABS(RANDOM()) % 1000 + 1) AS permiso_trabajo_asociado,
      'Informe-' || (ABS(RANDOM()) % 500 + 1) AS informe_asociado,
      'Orden-' || (ABS(RANDOM()) % 300 + 1) AS orden_trabajo_asociada,
      'Remito-' || (ABS(RANDOM()) % 200 + 1) AS remito,
      (ABS(RANDOM()) % 5 + 1) AS numero_almacenes,
      CASE (ABS(RANDOM()) % 5)
           WHEN 0 THEN 'Tornillo'
           WHEN 1 THEN 'Tuerca'
           WHEN 2 THEN 'Cable'
           WHEN 3 THEN 'Resistencia'
           WHEN 4 THEN 'Conector'
      END AS material_repuesto,
      'Marca-' || (ABS(RANDOM()) % 10 + 1) AS marca,
      'Modelo-' || (ABS(RANDOM()) % 100 + 1000) AS modelo_serie,
      'Observaciones sobre el movimiento ' || n AS observaciones,
      (SELECT id FROM articulos LIMIT 1 OFFSET (ABS(RANDOM()) % (SELECT COUNT(*) FROM articulos)))
    FROM series;
  `;
  try {
    db.exec(insertMovimientosSQL);
    console.log('✅ Datos insertados en "movimientos_materiales".');
  } catch (error) {
    console.error('❌ Error insertando datos en "movimientos_materiales":', error);
  }
} else {
  console.log('Tabla "movimientos_materiales" ya tiene datos.');
}

export default db;
