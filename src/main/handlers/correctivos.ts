// import { IpcMain } from 'electron';
// import { actualizarCorrectivo, eliminarCorrectivo, guardarCorrectivos, guardarCorrectivosExcel, obtenerCorrectivos } from '../services/correctivos/correctivos';
// import { filtrarCorrectivosFecha, filtrarCorrectivosMarca, filtrarCorrectivosModelo, filtrarCorrectivosOrdenTrabajo, filtrarCorrectivosPermisoTrabajo, filtrarCorrectivosRangoFechas, filtrarCorrectivosRepuesto, filtrarCorrectivosSector } from '../services/correctivos/filtrosCorrectivos';

// export function handleCorrectivos(ipcMain: IpcMain) {

//     ipcMain.handle('obtener-correctivos', async (event) => {    
//         return await obtenerCorrectivos();
//     });
//     ipcMain.handle('guardar-correctivos', async (event, data) => { 
//         return await guardarCorrectivos(data);
//     });
//     ipcMain.handle('eliminar-correctivo', async (event, correctivoId) => { 
//         return await eliminarCorrectivo(correctivoId);
//     });
//     ipcMain.handle('actualizar-correctivo', async (event, correctivo) => { 
//         return await actualizarCorrectivo(correctivo);
//     });
//     ipcMain.handle('filtrar-correctivos-fecha', async (event, fecha) => { 
//         return await filtrarCorrectivosFecha(fecha);
//     });
//     ipcMain.handle('filtrar-correctivos-rango-fecha', async (event, fechaInicio: string, fechaFin: string) => { 
//         return await filtrarCorrectivosRangoFechas(fechaInicio, fechaFin);
//     });
//     ipcMain.handle('filtrar-correctivos-repuesto-material', async (event, repuesoMaterial, fechaInicio, fechaFin) => { 
//         return await filtrarCorrectivosRepuesto(repuesoMaterial, fechaInicio, fechaFin);
//     });
//     ipcMain.handle('filtrar-correctivos-sector', async (event, sector, fechaInicio, fechaFin) => { 
//         return await filtrarCorrectivosSector(sector, fechaInicio, fechaFin);
//     });
//     ipcMain.handle('filtrar-correctivos-marca', async (event, marca, fechaInicio, fechaFin) => { 
//         return await filtrarCorrectivosMarca(marca, fechaInicio, fechaFin);
//     });
//     ipcMain.handle('filtrar-correctivos-modelo', async (event, modelo, fechaInicio, fechaFin) => {
//         return await filtrarCorrectivosModelo(modelo, fechaInicio, fechaFin);
//     });
//     ipcMain.handle('filtrar-correctivos-permiso-trabajo', async (event, permisoTrabajo) => {
//         return await filtrarCorrectivosPermisoTrabajo(permisoTrabajo);
//     });
//     ipcMain.handle('filtrar-correctivos-orden-trabajo', async (event, ordenTrabajo) => {
//         return await filtrarCorrectivosOrdenTrabajo(ordenTrabajo);
//     });
//     ipcMain.handle('guardar-correctivos-excel', async (event, data) => {
//         return await guardarCorrectivosExcel(data);
//     });
// }