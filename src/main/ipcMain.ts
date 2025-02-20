import { BrowserWindow, ipcMain } from "electron";
// import { handleInformeServicios } from './handlers/informeServicios';
// import { handleRepuestosMateriales } from "./handlers/repuestosMateriales";
// import { handleCorrectivos } from "./handlers/correctivos";
// import { handleRequerimientos } from "./handlers/requerimientos";
import Database from 'better-sqlite3';
// import { handleDevoluciones } from "./handlers/devoluciones";

export function ipcMainProcess(win: BrowserWindow) {
  ipcMain.handle('ping', async (event, value) => {
    console.log(`[*] preload -> ipcMain, ipcMain receive data from preload: ${value}`);
    const db = new Database('database.db');
    const result = db.prepare('SELECT * FROM example_table').all();
    db.close();
    return result;
  });
  // handleInformeServicios(ipcMain);
  // handleRepuestosMateriales(ipcMain);
  // handleCorrectivos(ipcMain);
  // handleRequerimientos(ipcMain);
  // handleDevoluciones(ipcMain);


}
