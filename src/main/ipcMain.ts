import { BrowserWindow, ipcMain } from "electron";
import Database from 'better-sqlite3';
import { handleMovimientos } from "./handlers/movimientos";
import { handleArticulos } from "./handlers/articulos";

export function ipcMainProcess(win: BrowserWindow) {
  
  ipcMain.handle('ping', async (event, value) => {
    console.log(`[*] preload -> ipcMain, ipcMain receive data from preload: ${value}`);
    const db = new Database('ls_database.db');
    const result = db.prepare('SELECT * FROM example_table').all();
    
    db.close();
    return result;
  });
  
  

    handleMovimientos(ipcMain);
    handleArticulos(ipcMain);



}
