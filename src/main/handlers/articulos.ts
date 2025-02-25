import { dialog, IpcMain } from "electron";
import { actualizarArticulo, crearArticulo, eliminarArticulo, obtenerArticulos } from "../services/articulos/articulosService";

export function handleArticulos(ipcMain: IpcMain) {
        ipcMain.handle('obtener-articulos', async () => {
            return await obtenerArticulos();
        });
        ipcMain.handle('nuevo-articulo', async (event, nuevoArticulo) => {
            return await crearArticulo(nuevoArticulo);
        });
        ipcMain.handle('eliminar-articulo', async (event, articuloId) => {
            return await eliminarArticulo(articuloId);
        });
        ipcMain.handle('actualizar-articulo', async (event, articulo) => {
            console.log('articulo que llega en handler', articulo)
            return await actualizarArticulo(articulo);
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