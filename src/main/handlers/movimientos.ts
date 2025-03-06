import { dialog, IpcMain } from 'electron';
import { guardarExcelMovimientos, guardarMovimiento, obtenerMovimientos, obtenerUltimoMovimiento } from '../services/movimientos/movimientosService';
import fs from 'fs';

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
    ipcMain.handle('guardar-pdf', async (event, pdfArrayBuffer) => {

      const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const nombrePdf = `MOVINV-${yyyy}-${mm}-${dd}.pdf`;

        const { canceled, filePath } = await dialog.showSaveDialog({
          title: 'Guardar PDF',
          defaultPath: nombrePdf,
          filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
        });
        
        if (canceled || !filePath) {
          return { success: false };
        }
        
        // Convertimos el ArrayBuffer a Buffer
        const buffer = Buffer.from(pdfArrayBuffer);
        try {
          fs.writeFileSync(filePath, buffer);
          return { success: true };
        } catch (err) {
          console.error('Error al guardar el PDF:', err);
          return { success: false, error: err };
        }
      });

}