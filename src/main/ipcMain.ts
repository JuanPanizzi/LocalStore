import { BrowserWindow, ipcMain } from "electron";
// import { handleInformeServicios } from './handlers/informeServicios';
// import { handleRepuestosMateriales } from "./handlers/repuestosMateriales";
// import { handleCorrectivos } from "./handlers/correctivos";
// import { handleRequerimientos } from "./handlers/requerimientos";
import path from 'path';
import Database from 'better-sqlite3';
import { handleMovimientos } from "./handlers/movimientos";
// import { handleDevoluciones } from "./handlers/devoluciones";

export function ipcMainProcess(win: BrowserWindow) {
  
  ipcMain.handle('ping', async (event, value) => {
    console.log(`[*] preload -> ipcMain, ipcMain receive data from preload: ${value}`);
    const db = new Database('ls_database.db');
    const result = db.prepare('SELECT * FROM example_table').all();
    
    db.close();
    return result;
  });
  
  

    handleMovimientos(ipcMain);
  // handleInformeServicios(ipcMain);
  // handleRepuestosMateriales(ipcMain);
  // handleCorrectivos(ipcMain);
  // handleRequerimientos(ipcMain);
  // handleDevoluciones(ipcMain);


}
