// import { IpcMain, ipcMain } from 'electron';
// import { actualizarRepuestoMaterial, eliminarRepuestoMaterial, guardarRepuestosExcel, guardarRepuestosMateriales, obtenerRepuestosMateriales } from '../services/repuestosMateriales/repuestoMateriales';
// import { filtrarRepuestoDetalle, filtrarRepuestoMarca, filtrarRepuestoModelo } from '../services/repuestosMateriales/filtrosRepuestosMateriales';

// export function handleRepuestosMateriales(IpcMain: IpcMain) {

//     ipcMain.handle('obtener-repuestos-materiales', async (event) => {
//         return await obtenerRepuestosMateriales();
//     })
//     ipcMain.handle('guardar-repuestos-materiales', async (event, data) => {
//         return await guardarRepuestosMateriales(data)
//     })
//     ipcMain.handle('actualizar-repuesto-material', async (event, repuestoMaterial) => {
//         return await actualizarRepuestoMaterial(repuestoMaterial)
//     });
//     ipcMain.handle('eliminar-repuesto-material', async (event, repuestoMaterialId) => {
//         return await eliminarRepuestoMaterial(repuestoMaterialId)
//     })
//     ipcMain.handle('filtrar-repuestos-por-detalle', async (event, data) => {
//         return await filtrarRepuestoDetalle(data)
//     })
//     ipcMain.handle('filtrar-repuestos-por-marca', async (event, data) => {
//         return await filtrarRepuestoMarca(data)
//     })
//     ipcMain.handle('filtrar-repuestos-por-modelo', async (event, data) => {
//         return await filtrarRepuestoModelo(data)
//     })
//     ipcMain.handle('guardar-repuestos-excel', async (event, data) => {
//         return await guardarRepuestosExcel(data)
//     })

// }