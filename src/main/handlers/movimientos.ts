import { dialog, IpcMain } from 'electron';
import { guardarExcelMovimientos, guardarMovimiento, obtenerMovimientos, obtenerMovimientosArticulo, obtenerUltimoMovimiento, eliminarMovimiento, actualizarMovimiento } from '../services/movimientos/movimientosService';
import fs from 'fs';

export function handleMovimientos(ipcMain: IpcMain) {

    ipcMain.handle('obtener-movimientos', async (event) => {    
        return await obtenerMovimientos();
    });
    ipcMain.handle('obtener-movimientos-articulo', async (event, articulo_id) => {    
      return await obtenerMovimientosArticulo(articulo_id);
  });
    ipcMain.handle('guardar-movimiento', async (event, movimiento) => {    
        return await guardarMovimiento(movimiento);
    });
    ipcMain.handle('actualizar-movimiento', async (event, movimiento) => {    
      return await actualizarMovimiento(movimiento);
  });
    ipcMain.handle('eliminar-movimiento', async (event, idMovimiento) => {    
      return await eliminarMovimiento(idMovimiento);
  });
    ipcMain.handle('obtener-ultimo-movimiento', async (event) => {
        return await obtenerUltimoMovimiento();
    });
    ipcMain.handle('guardar-excel-movimientos', async (event, data) => {    
        return await guardarExcelMovimientos(data);
    });
    ipcMain.handle('guardar-pdf', async (event, pdfArrayBuffer) => {

            const fechaActual = new Date();
            const anio = fechaActual.getFullYear();
            const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
            const dia = String(fechaActual.getDate()).padStart(2, '0');
            const nombrePdf = `MOVINV-${anio}-${mes}-${dia}.pdf`;

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