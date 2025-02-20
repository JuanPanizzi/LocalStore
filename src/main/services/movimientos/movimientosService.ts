import Database from 'better-sqlite3';
// import { formatFecha } from '../../utils/funcionesFecha'


export async function guardarExcelMovimientos(data) {

  // console.log('data a ahora reemplazar bd', data);
  
  const db = new Database('database.db');

  try {

    // for (const correctivo of data) {
   
    //     const camposRequeridos = [
    //     'fecha', 'solicitante', 'planta', 'sector', 'sistemas', 'tipo_numero_permiso_trabajo',
    //     'repuesto_material', 'marca', 'modelo', 'documento_intervencion', 'fecha_intervencion',
    //     'dias_transcurridos', 'orden_trabajo', 'nivel_criticidad', 'plazo_estimado', 'plazo_cumplido', 
    //     'fecha_referencia',
    //   ];
    //   // Recorre los campos requeridos
    //   for (const campo of camposRequeridos) {
    //     if (correctivo[campo] === null || correctivo[campo] === undefined || correctivo[campo] === '' || (!isNaN(correctivo[campo]) && correctivo[campo] < 0 )) {
    //       // console.error(`[!] Campo vacío: ${campo}, correctivo[campo]`, correctivo[campo], 'correctivo', correctivo);
    //       let campoIncompleto;

    //       switch (campo) {
    //         case 'fecha':
    //           campoIncompleto = 'Fecha';
    //           break;
    //         default:
    //           campoIncompleto = 'Campo desconocido';
    //           break;
    //       }

    //       return { success: false, error: 'Campos incompletos', campoIncompleto };
    //     }
    //   }
    // }


    // Eliminar todos los registros existentes
    db.prepare(`DELETE FROM movimientos_materiales`).run();

    // Preparar la inserción de nuevos datos (no se esta pasando documento_referencia ni observaciones)
    const insert = db.prepare(`
      INSERT INTO movimientos_materiales 
      (fecha, tipo_movimiento, origen, destino, material_repuesto, marca, articulo_id, cantidad, permiso_trabajo_asociado, informe_asociado, orden_trabajo_asociada, remito, numero_almacenes, numero_serie, instrumento, numero_movimiento, modelo_serie) 
      VALUES (?, ?, )
    `);

 // fecha // tipo_movimiento // origen // destino // material_repuesto // marca // articulo_id // cantidad // permiso_trabajo_asociado
                    // informe_asociado // orden_trabajo_asociada // remito // numero_almacenes // numero_serie // instrumento// numero_movimiento 
                    // modelo_serie

    const insertMany = db.transaction((correctivos) => {
      for (const correctivo of correctivos) {
        insert.run(
          correctivo.fecha,
          correctivo.solicitante,
          correctivo.planta,
          correctivo.sector,
          correctivo.sistemas,
          correctivo.tipo_numero_permiso_trabajo,
          correctivo.repuesto_material,
          correctivo.marca,
          correctivo.modelo,
          correctivo.documento_intervencion,
          correctivo.fecha_intervencion,
          correctivo.dias_transcurridos,
          String(correctivo.orden_trabajo),
          correctivo.nivel_criticidad,
          correctivo.plazo_estimado,
          correctivo.plazo_cumplido,
          // correctivo.observaciones,
          // correctivo.documento_referencia,
          correctivo.fecha_referencia
        );
      }
    });

    insertMany(data);

      // Obtener los datos insertados junto con el ID generado
      const insertedData = db.prepare("SELECT * FROM correctivos").all();

      if (insertedData.length === 0) {
        return { success: false, error: "No se insertaron los datos" };
      }

     return { success: true, data: insertedData };


  } catch (error) {
    console.error('[!] Error al reemplazar datos:', error);
    return { success: false, error: error };
  } finally {
    db.close();

  }
}