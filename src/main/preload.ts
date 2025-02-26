import { contextBridge, ipcRenderer } from "electron";


//expose global window.electronAPI for font-end by contextBridge 
contextBridge.exposeInMainWorld('electronAPI', {
  modifyTitle: (newTitle: string) => { ipcRenderer.send('setTitle', newTitle) },
  ping: async (data: string) => {
    const result = await ipcRenderer.invoke('ping', data);
    return result;
  },
  // insertData: (data: { name: string; age: number }) => ipcRenderer.invoke('insert-data', data),
  // getData: () => ipcRenderer.invoke('get-data'),
  obtenerMovimientos: () => ipcRenderer.invoke('obtener-movimientos'),
  obtenerArticulos: () => ipcRenderer.invoke('obtener-articulos'),
  guardarMovimiento: (movimiento)=> ipcRenderer.invoke('guardar-movimiento', movimiento),
  crearArticulo: (nuevoArticulo) => ipcRenderer.invoke('nuevo-articulo', nuevoArticulo),
  eliminarArticulo: (articuloId)=> ipcRenderer.invoke('eliminar-articulo', articuloId),
  guardarExcelMovimientos: (data: any) => ipcRenderer.invoke('guardar-excel-movimientos', data),
  seleccionarImagen: ()=> ipcRenderer.invoke('seleccionar-imagen-articulo'),
  actualizarArticulo: (articuloActualizado) => ipcRenderer.invoke('actualizar-articulo', articuloActualizado),
  obtenerUltimoMovimiento: ()=> ipcRenderer.invoke('obtener-ultimo-movimiento'),
});