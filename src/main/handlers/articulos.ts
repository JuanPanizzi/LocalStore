import { IpcMain } from "electron";
import { nuevoArticulo, obtenerArticulos } from "../services/articulos/articulosService";

export function handleArticulos(ipcMain: IpcMain) {
        ipcMain.handle('obtener-articulos', async () => {
            return await obtenerArticulos();
        });
        ipcMain.handle('nuevo-articulo', async (event, nuevoArticulo) => {
            return await nuevoArticulo(nuevoArticulo);
        });
    }