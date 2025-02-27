import { IpcMain } from 'electron';
import { guardarExcelMovimientos, guardarMovimiento, obtenerMovimientos, obtenerUltimoMovimiento } from '../services/movimientos/movimientosService';

export function handleMovimientos(ipcMain: IpcMain) {

    ipcMain.handle('obtener-movimientos', async (event) => {    
        return await obtenerMovimientos();
    });
    ipcMain.handle('guardar-movimiento', async (event, movimiento) => {    
        return await guardarMovimiento(movimiento);
    });
    ipcMain.handle('obtener-ultimo-movimiento', async (event) => {
        return await obtenerUltimoMovimiento();
    });
    ipcMain.handle('guardar-excel-movimientos', async (event, data) => {    
        return await guardarExcelMovimientos(data);
    });

}