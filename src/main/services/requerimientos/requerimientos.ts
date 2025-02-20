import Database from 'better-sqlite3';

export async function obtenerRequerimientos() {
  const db = new Database('database.db');
  try {

    const result = db.prepare('SELECT * FROM requerimientos_repuestos ORDER BY fecha DESC').all();


    const updatedResult = result.map(item => {
      const [year, month, day] = item.fecha.split('-');
      item.fecha = `${day}/${month}/${year}`;
      return item;
    });

    return { success: true, data: updatedResult };
  } catch (error) {
    // console.error('[!] Error al obtener datos:', error);
    return { success: false, error: error };
  } finally { 
    db.close();

  }
}

export async function guardarRequerimientos(data) {

  const db = new Database('database.db');

  try {
    // const numeroRequerimientoFormateado = data.numeroRequerimiento.toString().padStart(4, '0');

    const registroExistente = db.prepare(`
      SELECT * FROM requerimientos_repuestos WHERE numero_requerimiento = ?
    `).get(data.numeroRequerimiento);



    if (registroExistente) {
      return { success: false, error: 'numero de requerimiento repetido.' };
    }



    const insert = db.prepare(`
          INSERT INTO requerimientos_repuestos 
          (remitente, documento_referencia, planta, sector, cantidad, insumo_material_repuesto, observacion, fecha, numero_requerimiento, estado) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);


    const result = insert.run(
      data.remitente,
      data.documentoReferencia,
      data.planta,
      data.sector,
      data.cantidad,
      data.insumoMaterial,
      data.observacion,
      data.fecha,
      data.numeroRequerimiento,
      data.estado
    );

    const nuevoRegistro = {
      id: result.lastInsertRowid,
      remitente: data.remitente,
      documento_referencia: data.documentoReferencia,
      planta: data.planta,
      sector: data.sector,
      cantidad: data.cantidad,
      insumo_material_repuesto: data.insumoMaterial,
      observacion: data.observacion,
      fecha: data.fecha,
      numero_requerimiento: data.numeroRequerimiento,
      estado: data.estado
    };



    return { success: true, data: nuevoRegistro };
  } catch (error) {
    // console.error('[!] Error al insertar datos:', error);
    return { success: false, error: error };
  } finally {
    if (db.open) {
      db.close();
    }
  }
}


export async function cerrarRequerimiento(
  numeroRequerimiento: string,
  movimientoMaterial: string
) {
  try {
    const db = new Database('database.db');

    // Actualizar el campo movimiento_materiales
    const update = db.prepare(`
      UPDATE requerimientos_repuestos
      SET movimiento_materiales = ?
      WHERE numero_requerimiento = ?
    `);

    const result = update.run(movimientoMaterial, numeroRequerimiento);

    if (result.changes === 0) {
      return {
        success: false,
        error: 'No se encontró ningún registro con el número de requerimiento proporcionado.',
      };
    }

    // Recuperar el registro actualizado y devolverlo como un array
    const query = db.prepare(`
      SELECT * FROM requerimientos_repuestos
      WHERE numero_requerimiento = ?
    `);

    const updatedRecords = query.all(numeroRequerimiento);

    db.close();
    return { success: true, data: updatedRecords }; // Retornar un array como `filtrarRequerimientoNumReq`
  } catch (error) {
    // console.error('[!] Error al actualizar el campo movimiento_materiales:', error);
    return { success: false, error };
  }
}

export async function guardarExcelRequerimientos(data) {
  const db = new Database("database.db");

  try {

    for (const requerimiento of data) {
      const camposRequeridos = [
        'remitente', 'documento_referencia', 'planta', 'sector', 'insumo_material_repuesto', 'fecha', 'numero_requerimiento', 'estado'
      ];

      // Recorre los campos requeridos
      for (const field of camposRequeridos) {
        if (!requerimiento[field]) {
          // console.error(`[!] Campo vacío: ${field}, requerimiento[field]`, requerimiento[field]);
          let campoIncompleto;

          switch (field) {
            case 'remitente':
              campoIncompleto = 'Dirigido a';
              break;
            case 'documento_referencia':
              campoIncompleto = 'Documento de referencia';
              break;
            case 'planta':
              campoIncompleto = 'Planta / Sector Destino';
              break;
            case 'sector':
              campoIncompleto = 'Sector Destino';
              break;

            case 'insumo_material_repuesto':
              campoIncompleto = 'Detalle de Repuesto / Material';
              break;

            case 'fecha':
              campoIncompleto = 'Fecha';
              break;
            case 'numero_requerimiento':
              campoIncompleto = 'Número de requerimiento';
              break;
            case 'estado':
              campoIncompleto = 'Estado';
              break;
            default:
              campoIncompleto = 'Campo desconocido';
              break;
          }

          return { success: false, error: 'Campos incompletos', campoIncompleto };
        }
      }
    }

    // Eliminar todos los registros existentes
    db.prepare("DELETE FROM requerimientos_repuestos").run();

    // Preparar la inserción de nuevos datos
    const insert = db.prepare(
      `INSERT INTO requerimientos_repuestos
        (numero_requerimiento, remitente, documento_referencia, planta, sector,  insumo_material_repuesto,  fecha, estado) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const insertMany = db.transaction((requerimientos) => {
      for (const req of requerimientos) {
        insert.run(
          req.numero_requerimiento,
          req.remitente,
          req.documento_referencia,
          req.planta,
          req.sector,
          // req.cantidad,
          req.insumo_material_repuesto,
          // req.observacion,
          req.fecha,
          req.estado,
          // req.referencia_externa,
        );
      }
    });

    insertMany(data);

     // Obtener los datos insertados junto con el ID generado
     const insertedData = db.prepare("SELECT * FROM requerimientos_repuestos").all();

      if (insertedData.length === 0) {
        return { success: false, error: "No se insertaron los datos" };
      }

     return { success: true, data: insertedData };

  } catch (error) {
    // console.error("[!] Error al guardar datos:", error);
    return { success: false, error: error };
  } finally {
    db.close();
  }
}


export async function modificarEstadoRequerimiento(data: any) {
  const { numero_requerimiento, referencia_externa, estado } = data;
  const db = new Database("database.db");

  try {
    const stmt = db.prepare(`
      UPDATE requerimientos_repuestos 
      SET referencia_externa = ?, estado = ?
      WHERE numero_requerimiento = ?
    `);

    const result = stmt.run(referencia_externa, estado, numero_requerimiento);

    if (result.changes === 0) {
      throw new Error("No se encontró el requerimiento con el número proporcionado.");
    }

    return { success: true };
  } catch (error) {
    // console.error("Error al guardar la referencia externa:", error);
    return { success: false, error };
  } finally {
    db.close();
  }
}

export const actualizarRequerimiento = async (requerimiento) => {

  const { id, remitente, documento_referencia, planta, sector, insumo_material_repuesto, fecha, numero_requerimiento, estado, referencia_externa } = requerimiento;

  const db = new Database('database.db');

  try {

    const result = db.prepare(`UPDATE requerimientos_repuestos SET remitente = ?, documento_referencia = ?, planta = ?, sector = ?, insumo_material_repuesto = ?, fecha = ?, numero_requerimiento = ?, estado = ?, referencia_externa = ? WHERE id = ?`).run(remitente, documento_referencia, planta, sector, insumo_material_repuesto, fecha, numero_requerimiento, estado, referencia_externa, id);

    if (result.changes === 0) {
      return { success: false, error: 'No se encontró el requerimiento' }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error };
  } finally {
    db.close();
  }

}

export const eliminarRequerimiento = async (requerimientoId) => {


  const db = new Database('database.db');
  try {
    const result = db.prepare(`DELETE FROM requerimientos_repuestos WHERE id = ?`).run(requerimientoId);
   
    if (result.changes === 0) {
      return { success: false, error: 'No se encontró el requerimiento' }
    }
 
    return { success: true };
 
  } catch (error) {

    return { success: false, error: error };
  
  } finally {
    db.close();
  }
}