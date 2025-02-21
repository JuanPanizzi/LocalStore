import { IpcMain } from "electron";
import { obtenerArticulos } from "../services/articulos/articulosService";

export function handleArticulos(ipcMain: IpcMain) {
        ipcMain.handle('obtener-articulos', async () => {
            return await obtenerArticulos();
        });
    }