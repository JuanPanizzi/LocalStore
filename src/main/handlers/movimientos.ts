import { IpcMain } from 'electron';
import { guardarExcelMovimientos } from '../services/movimientos/movimientosService';

export function handleMovimientos(ipcMain: IpcMain) {

    ipcMain.handle('guardar-excel-movimientos', async (event, data) => {    
        return await guardarExcelMovimientos(data);
    });

}