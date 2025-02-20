import { IpcMain } from 'electron';
import { guardarExcelMovimientos, obtenerMovimientos } from '../services/movimientos/movimientosService';

export function handleMovimientos(ipcMain: IpcMain) {

    ipcMain.handle('obtener-movimientos', async (event) => {    
        return await obtenerMovimientos();
    });
    ipcMain.handle('guardar-excel-movimientos', async (event, data) => {    
        return await guardarExcelMovimientos(data);
    });

}