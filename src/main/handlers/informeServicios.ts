// import { IpcMain, dialog, shell } from 'electron';
// import { actualizarInforme, agregarHipervinculoPermiso, eliminarInforme, guardarInforme, guardarInformesExcel, obtenerInformeServicios } from '../services/informeServicios/informeServicios';
// import { filtrarInformeServiciosCodInforme, filtrarInformeServiciosFecha, filtrarInformeServiciosNumInforme, filtrarInformeServiciosRangoFecha, filtrarInformeServiciosSector, filtrarInformeServiciosSectorRango, filtrarInformeServicioTipoServicio } from '../services/informeServicios/filtrosInformeServicios';

// export function handleInformeServicios(ipcMain: IpcMain) {
//     ipcMain.handle('obtener-informe-servicios', async () => {
//         return await obtenerInformeServicios();
//     });
//     ipcMain.handle('guardar-informe-servicios', async (event, data) => {
//         return await guardarInforme(data);
//     });
//     ipcMain.handle('actualizar-informe-servicios', async (event, registroInforme) => { 
//         return await actualizarInforme(registroInforme);
//     });
//     ipcMain.handle('eliminar-informe-servicios', async (event, id) => {
//         return await eliminarInforme(id);
//     });
//     ipcMain.handle('filtrar-informe-servicios-fecha', async (event, fecha: string) => {
//         return await filtrarInformeServiciosFecha(fecha);
//     });
//     ipcMain.handle('filtrar-informe-servicios-rango-fecha', async (event, fechaInicio: string, fechaFin: string) => {
//         return await filtrarInformeServiciosRangoFecha(fechaInicio, fechaFin);
//     });
//     ipcMain.handle('filtrar-informe-servicios-numero-informe', async (event, numInforme: string | number) => {
//         return await filtrarInformeServiciosNumInforme(numInforme)
//     });
//     ipcMain.handle('filtrar-informe-servicios-codigo-informe', async (event, codigoInforme: string | number) => {
//         return await filtrarInformeServiciosCodInforme(codigoInforme);
//     });
//     ipcMain.handle('filtrar-informe-servicios-sector', async (event, filtros) => {
//         return await filtrarInformeServiciosSector(filtros);
//     });
//     ipcMain.handle('filtrar-informe-servicios-sector-rango', async (event, sector, fechaInicio, fechaFin) => {
//         return await filtrarInformeServiciosSectorRango(sector, fechaInicio, fechaFin);
//     });
//     ipcMain.handle('filtrar-informe-servicios-tipo-servicio', async (event, servicio) => {
//         return await filtrarInformeServicioTipoServicio(servicio)
//     });
//     ipcMain.handle('guardar-informe-servicios-excel', async (event, data) => {
//         return await guardarInformesExcel(data)
//     });
//     ipcMain.handle('agregar-hipervinculo-permiso-trabajo', async (event, data) => {
//         return await agregarHipervinculoPermiso(data)
//     });
    // ipcMain.handle('seleccionar-hipervinculo-permiso-trabajo', async () => {
    //     const { filePaths } = await dialog.showOpenDialog({
    //         properties: ['openFile'],
    //     });
    //     return filePaths[0];
    // });
//     ipcMain.handle('abrir-hipervinculo-permiso-trabajo', async (_, filePath) => {
//         console.log('fileparth en informes ', filePath)
//         if (filePath) {
//           await shell.openPath(filePath);
//         }
//     });

// }