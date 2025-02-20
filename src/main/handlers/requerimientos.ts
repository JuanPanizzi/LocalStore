// import { cerrarRequerimiento, guardarExcelRequerimientos, modificarEstadoRequerimiento, guardarRequerimientos, obtenerRequerimientos, actualizarRequerimiento, eliminarRequerimiento } from '../services/requerimientos/requerimientos';
// import { filtrarRequerimientoInsumo, filtrarRequerimientoInsumoRango, filtrarRequerimientoNumReq, filtrarRequerimientoSector, filtrarRequerimientoSectorRango } from '../services/requerimientos/filtrosRequerimientos';

// import { IpcMain, dialog, shell } from 'electron';
// export function handleRequerimientos(ipcMain: IpcMain) {

//    ipcMain.handle('obtener-requerimientos-repuestos', async (event) => {
//       return await obtenerRequerimientos();
//    });
//    ipcMain.handle('guardar-requerimientos-repuestos', async (event, data) => {
//       return await guardarRequerimientos(data);
//    });
//    ipcMain.handle('actualizar-requerimiento-repuestos', async (event, requerimiento) => {
//       return await actualizarRequerimiento(requerimiento);
//    });
//    ipcMain.handle('eliminar-requerimiento-repuestos', async (event, requerimiento) => {
//       return await eliminarRequerimiento(requerimiento);
//    });
//    ipcMain.handle('filtrar-por-numero-requerimiento', async (event, numeroRequerimiento: string | number) => {
//       return await filtrarRequerimientoNumReq(numeroRequerimiento);
//    });
//    ipcMain.handle('filtrar-requerimientos-por-insumos', async (event, filtros: any) => {
//       return await filtrarRequerimientoInsumo(filtros);
//    });
//    ipcMain.handle('filtrar-requerimientos-por-insumos-rango', async (event, insumo, fechaInicio, fechaFin: any) => {
//       return await filtrarRequerimientoInsumoRango(insumo, fechaInicio, fechaFin);
//    });
//    ipcMain.handle('filtrar-requerimientos-por-sector', async (event, filtros) => {
//       return await filtrarRequerimientoSector(filtros);
//    });
//    ipcMain.handle('filtrar-requerimientos-por-sector-rango', async (event, sector, fechaInicio, fechaFin) => {
//       return await filtrarRequerimientoSectorRango(sector, fechaInicio, fechaFin);
//    });
//    ipcMain.handle('cerrar-requerimiento', async (event, numeroRequerimiento: string, movimientoMaterial: string) => {
//       return await cerrarRequerimiento(numeroRequerimiento, movimientoMaterial);
//    });
//    ipcMain.handle('guardar-excel-requerimientos', async (event, data) => {
//       return await guardarExcelRequerimientos(data);
//    });
//    ipcMain.handle('modificar-estado-requerimiento', async (event, data) => {
//       return await modificarEstadoRequerimiento(data);
//    });
//    ipcMain.handle('seleccionar-archivo-ref-externa', async () => {
//       const { filePaths } = await dialog.showOpenDialog({
//          properties: ['openFile'],
//       });

//       return filePaths[0];
//    });
//    ipcMain.handle('abrir-hipervinculo-requerimiento', async (_, filePath) => {
//       console.log('filepath que llega', filePath)
//       if (filePath) {
//          await shell.openPath(filePath);
//       }
//    });



// }