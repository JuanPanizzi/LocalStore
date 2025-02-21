
import db from '../../database/database'

export async function obtenerMovimientos() {
  
try {
    
  const result = db.prepare(`SELECT * FROM movimientos_materiales`).all(); 
  
  return {success: true, data: result}

} catch (error) {
  // console.log('error al obtener los datos', error)
  return {success: false, error}
}
    

}


export async function guardarExcelMovimientos(data) {
  
  
  
  try {

      
    // Eliminar todos los registros existentes
    db.prepare(`DELETE FROM movimientos_materiales`).run();

    // Preparar la inserción de nuevos datos (no se esta pasando documento_referencia ni observaciones)
    const insert = db.prepare(`
      INSERT INTO movimientos_materiales 
      (fecha, tipo_movimiento, origen, destino, material_repuesto, marca, articulo_id, cantidad, permiso_trabajo_asociado, informe_asociado, orden_trabajo_asociada, remito, numero_almacenes, numero_serie, numero_movimiento, modelo_serie) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,? ,? ,? ,? , ? )
    `);

    // fecha // tipo_movimiento // origen // destino // material_repuesto // marca // articulo_id // cantidad // permiso_trabajo_asociado
    // informe_asociado // orden_trabajo_asociada // remito // numero_almacenes // numero_serie // numero_movimiento 
    // modelo_serie

    const insertMany = db.transaction((movimientos) => {
      for (const movimiento of movimientos) {
        insert.run(
          movimiento.fecha,
          movimiento.tipo_movimiento,
          movimiento.origen,
          movimiento.destino,
          movimiento.material_repuesto,
          movimiento.marca,
          movimiento.articulo_id,
          movimiento.cantidad,
          movimiento.permiso_trabajo_asociado,
          movimiento.informe_asociado,
          movimiento.orden_trabajo_asociada,
          movimiento.remito,
          movimiento.numero_almacenes,
          movimiento.numero_serie,
          movimiento.numero_movimiento,
          movimiento.modelo_serie
        );
      }
    });

    insertMany(data);

    // Obtener los datos insertados junto con el ID generado
    const insertedData = db.prepare("SELECT * FROM movimientos_materiales").all();

    if (insertedData.length === 0) {
      return { success: false, error: "No se insertaron los datos" };
    }

    return { success: true, data: insertedData };


  } catch (error) {
    
    console.error('[!] Hubo un error  al reemplazar datos:', error);
    return { success: false, error: error };
  } 
}