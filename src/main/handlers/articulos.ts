import { IpcMain } from "electron";
import { crearArticulo, obtenerArticulos } from "../services/articulos/articulosService";

export function handleArticulos(ipcMain: IpcMain) {
        ipcMain.handle('obtener-articulos', async () => {
            return await obtenerArticulos();
        });
        ipcMain.handle('nuevo-articulo', async (event, nuevoArticulo) => {
            return await crearArticulo(nuevoArticulo);
        });
    }