// import { IpcMain } from "electron";
// import {  actualizarDevolucion, eliminarDevolucion, guardarDevolucion, guardarExcelDevoluciones, obtenerDevoluciones } from "../services/devoluciones/devoluciones";
// import { filtrarDevolucionesFecha, filtrarDevolucionesMarca, filtrarDevolucionesMaterial, filtrarDevolucionesModelo, filtrarDevolucionesProcedencia, filtrarDevolucionesRangoFecha } from "../services/devoluciones/filtrosDevoluciones";



// export function handleDevoluciones(ipcMain: IpcMain) {

//     ipcMain.handle('obtener-devoluciones', async (event) => {
//         return await obtenerDevoluciones();
//     });
//     ipcMain.handle('guardar-devolucion', async (event, data) => {  
//         return await guardarDevolucion(data);
//     });
//     ipcMain.handle('actualizar-devolucion', async (event, devolucion) => {  
//         return await actualizarDevolucion(devolucion);
//     });
//     ipcMain.handle('eliminar-devolucion', async (event, devolucionId: string | number) => {  
//         return await eliminarDevolucion(devolucionId);
//     });
//     ipcMain.handle('filtrar-devoluciones-rango-fecha', async (event,  fechaInicio: string, fechaFin: string) => {  
//         return await filtrarDevolucionesRangoFecha(fechaInicio, fechaFin);
//     });
//     ipcMain.handle('filtrar-devoluciones-fecha', async (event, fecha: string) => {  
//         return await filtrarDevolucionesFecha(fecha);
//     });
//     ipcMain.handle('filtrar-devoluciones-material-equipo', async (event, materialEquipo: string, fechaInicio: string, fechaFin: string) => {  
//         return await filtrarDevolucionesMaterial(materialEquipo, fechaInicio, fechaFin);
//     });
//     ipcMain.handle('filtrar-devoluciones-marca', async (event, marca: string, fechaInicio: string, fechaFin: string) => {  
//         return await filtrarDevolucionesMarca(marca, fechaInicio, fechaFin);
//     });
//     ipcMain.handle('filtrar-devoluciones-modelo', async (event, modelo: string, fechaInicio: string, fechaFin: string) => {  
//         return await filtrarDevolucionesModelo(modelo, fechaInicio, fechaFin);
//     });
//     ipcMain.handle('filtrar-devoluciones-procedencia', async (event, procedencia: string, fechaInicio: string, fechaFin: string) => {  
//         return await filtrarDevolucionesProcedencia(procedencia, fechaInicio, fechaFin);
//     });
//     ipcMain.handle('guardar-excel-devoluciones', async (event, data) => {  
//         return await guardarExcelDevoluciones(data);
//     });
    
// }