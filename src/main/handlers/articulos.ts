import { dialog, IpcMain } from "electron";
import { crearArticulo, obtenerArticulos } from "../services/articulos/articulosService";

export function handleArticulos(ipcMain: IpcMain) {
        ipcMain.handle('obtener-articulos', async () => {
            return await obtenerArticulos();
        });
        ipcMain.handle('nuevo-articulo', async (event, nuevoArticulo) => {
            return await crearArticulo(nuevoArticulo);
        });
        ipcMain.handle('seleccionar-imagen-articulo', async () => {
            const resultadoSeleccion = await dialog.showOpenDialog( {
                properties: ['openFile']
              }).then(result => {
                  // console.log('result, canceled',result.canceled)
                // console.log('result filePaths', result.filePaths)
                return result;
            }).catch(err => {
                console.log(err)
            })
            console.log('resultadoSeleccion selecchionar imagen', resultadoSeleccion)
            return resultadoSeleccion;
        })}
        // ipcMain.handle('seleccionar-hipervinculo-permiso-trabajo', async () => {
        //     const { filePaths, canceled } = await dialog.showOpenDialog({
        //         properties: ['openFile'],
        //     });
        //     return filePaths[0];
        // });