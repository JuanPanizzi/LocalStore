
import db from '../../database/database'

export async function obtenerMovimientos() {

  try {

    const result = db.prepare(`
      SELECT * FROM movimientos_materiales
      ORDER BY 
        CAST(SUBSTR(numero_movimiento, 1, INSTR(numero_movimiento || '-', '-') - 1) AS INTEGER) DESC, 
        SUBSTR(numero_movimiento, INSTR(numero_movimiento, '-') + 1) DESC
    `).all();

    return { success: true, data: result }

  } catch (error) {
    console.log('error al obtener los datos', error)
    return { success: false, error }
  }
}

export const obtenerMovimientosArticulo = (articulo_id) => {
  try {

    const stmt = db.prepare(`SELECT * FROM movimientos_materiales WHERE articulo_id = ?`);
    const result = stmt.all(articulo_id);

    return { success: true, data: result }

  } catch (error) {
    console.log('error al obtener los datos', error)
    return { success: false, error }
  }

}

export const eliminarMovimiento = (idMovimiento) => { 
  
  try {
      const stmt = db.prepare(`DELETE FROM movimientos_materiales WHERE id = ?`)
      const result = stmt.run(idMovimiento)
    return {success: true, data: result}
  
  } catch (error) {
    return {success: false}  
  }

 }

// export async function guardarExcelMovimientos(data) {

//   try {


//     // Eliminar todos los registros existentes
//     db.prepare(`DELETE FROM movimientos_materiales`).run();

//     // Preparar la inserción de nuevos datos (no se esta pasando documento_referencia ni observaciones)
//     const insert = db.prepare(`
//       INSERT INTO movimientos_materiales 
//       (fecha, tipo_movimiento, origen, destino, material_repuesto, marca, articulo_id, cantidad, permiso_trabajo_asociado, informe_asociado, orden_trabajo_asociada, remito, numero_almacenes,  numero_movimiento, modelo_serie) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,? ,? ,? ,? )
//     `);

//     // fecha // tipo_movimiento // origen // destino // material_repuesto // marca // articulo_id // cantidad // permiso_trabajo_asociado
//     // informe_asociado // orden_trabajo_asociada // remito // numero_almacenes // numero_serie // numero_movimiento 
//     // modelo_serie

//     const insertMany = db.transaction((movimientos) => {
//       for (const movimiento of movimientos) {
//         insert.run(
//           movimiento.fecha,
//           movimiento.tipo_movimiento,
//           movimiento.origen,
//           movimiento.destino,
//           movimiento.material_repuesto,
//           movimiento.marca,
//           movimiento.articulo_id,
//           movimiento.cantidad,
//           movimiento.permiso_trabajo_asociado,
//           movimiento.informe_asociado,
//           movimiento.orden_trabajo_asociada,
//           movimiento.remito,
//           movimiento.numero_almacenes,
//           movimiento.numero_movimiento,
//           movimiento.modelo_serie
//         );
//       }
//     });

//     insertMany(data);

//     // Obtener los datos insertados junto con el ID generado
//     const insertedData = db.prepare("SELECT * FROM movimientos_materiales").all();

//     if (insertedData.length === 0) {
//       return { success: false, error: "No se insertaron los datos" };
//     }

//     return { success: true, data: insertedData };


//   } catch (error) {

//     console.error('[!] Hubo un error  al reemplazar datos:', error);
//     return { success: false, error: error };
//   }
// }

// export async function guardarExcelMovimientos(data) {
//   try {
//     // 1. Eliminar los registros existentes en movimientos_materiales
//     db.prepare(`DELETE FROM movimientos_materiales`).run();

//     // 2. Preparar la inserción de nuevos datos en movimientos_materiales
//     const insert = db.prepare(`
//       INSERT INTO movimientos_materiales 
//       (fecha, tipo_movimiento, origen, destino, material_repuesto, marca, articulo_id, cantidad, permiso_trabajo_asociado, informe_asociado, orden_trabajo_asociada, remito, numero_almacenes, numero_movimiento, modelo_serie) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,? ,? ,? ,? )
//     `);

//     const insertMany = db.transaction((movimientos) => {
//       for (const movimiento of movimientos) {
//         insert.run(
//           movimiento.fecha,
//           movimiento.tipo_movimiento,
//           movimiento.origen,
//           movimiento.destino,
//           movimiento.material_repuesto,
//           movimiento.marca,
//           movimiento.articulo_id,
//           movimiento.cantidad,
//           movimiento.permiso_trabajo_asociado,
//           movimiento.informe_asociado,
//           movimiento.orden_trabajo_asociada,
//           movimiento.remito,
//           movimiento.numero_almacenes,
//           movimiento.numero_movimiento,
//           movimiento.modelo_serie
//         );
//       }
//     });

//     insertMany(data);

//     // 3. Obtener los datos insertados (para enviar al frontend)
//     const insertedData = db.prepare("SELECT * FROM movimientos_materiales").all();
//     if (insertedData.length === 0) {
//       return { success: false, error: "No se insertaron los datos" };
//     }

//     // 4. Agrupar por artículo para obtener el último movimiento de cada uno
//     const ultimosMovimientos = new Map();
//     data.forEach((movimiento) => {
//       // Clave única para cada artículo: combinación de marca y modelo_serie
//       const key = `${movimiento.marca}_${movimiento.modelo_serie}`;
//       if (!ultimosMovimientos.has(key)) {
//         ultimosMovimientos.set(key, movimiento);
//       } else {
//         // console.log('movimiento,fecha', movimiento.fecha)
//         // Comparar fechas (se asume formato YYYY-MM-DD)
//         const fechaActual = new Date(movimiento.fecha);
//         // console.log('fechaActual', fechaActual);
//         const fechaGuardada = new Date(ultimosMovimientos.get(key).fecha);
//         // console.log('fechaGuardada', fechaGuardada);

//         if (fechaActual > fechaGuardada) {
//           ultimosMovimientos.set(key, movimiento);
//         }
//       }
//     });

//     // 5. Verificar existencia de cada artículo en la tabla articulos y procesar
//     let warnings: string[] = [];
//     ultimosMovimientos.forEach((movimiento, key) => {
//       // Se asume que la combinación marca/modelo_serie es única para cada artículo
//       const articuloExistente = db
//         .prepare("SELECT * FROM articulos WHERE marca = ? AND modelo_serie = ?")
//         .get(movimiento.marca, movimiento.modelo_serie);

//       if (!articuloExistente) {
//         // Insertar nuevo artículo con la cantidad del último movimiento
//         db.prepare(
//           "INSERT INTO articulos (material_repuesto, marca, modelo_serie, cantidad, imagen) VALUES (?, ?, ?, ?, ?)"
//         ).run(
//           movimiento.material_repuesto,
//           movimiento.marca,
//           movimiento.modelo_serie,
//           movimiento.cantidad, // Se usa la cantidad del último movimiento
//           null
//         );
//       } else {
//         // Si el artículo existe, comparar la cantidad del último movimiento con la cantidad guardada
//         if (articuloExistente.cantidad !== movimiento.cantidad) {
//           warnings.push(
//             `El artículo (Marca: ${movimiento.marca}, Modelo/Serie: ${movimiento.modelo_serie}) tiene cantidad en BD: ${articuloExistente.cantidad} y el último movimiento en Excel indica: ${movimiento.cantidad}.`
//           );
//         }
//       }
//     });

//     // 6. Retornar el resultado junto con las advertencias (si existen)
//     return { success: true, data: insertedData, warnings };
//   } catch (error) {
//     console.error('[!] Hubo un error al reemplazar datos:', error);
//     return { success: false, error: error };
//   }
// }


export async function guardarExcelMovimientos(data) {
  try {
    // 1. Eliminar todos los registros existentes en movimientos_materiales
    db.prepare(`DELETE FROM movimientos_materiales`).run();

    // 2. Preparar la inserción de nuevos datos en movimientos_materiales
    const insert = db.prepare(`
      INSERT INTO movimientos_materiales 
      (fecha, tipo_movimiento, origen, destino, material_repuesto, marca, articulo_id, cantidad, permiso_trabajo_asociado, informe_asociado, orden_trabajo_asociada, remito, numero_almacenes, numero_movimiento, modelo_serie) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,? ,? ,? ,? )
    `);

    const insertMany = db.transaction((movimientos) => {
      for (const movimiento of movimientos) {
        // Se inserta sin asignar el articulo_id (podría ser null)
        insert.run(
          movimiento.fecha,
          movimiento.tipo_movimiento,
          movimiento.origen,
          movimiento.destino,
          movimiento.material_repuesto,
          movimiento.marca,
          movimiento.articulo_id, // En este momento puede estar vacío
          movimiento.cantidad,
          movimiento.permiso_trabajo_asociado,
          movimiento.informe_asociado,
          movimiento.orden_trabajo_asociada,
          movimiento.remito,
          movimiento.numero_almacenes,
          movimiento.numero_movimiento,
          movimiento.modelo_serie
        );
      }
    });

    insertMany(data);

    // 3. Obtener los datos insertados para enviarlos al frontend
    const insertedData = db.prepare("SELECT * FROM movimientos_materiales").all();
    if (insertedData.length === 0) {
      return { success: false, error: "No se insertaron los datos" };
    }

    // 4. Agrupar por artículo para obtener el último movimiento de cada uno (basado en la fecha)
    const ultimosMovimientos = new Map();
    data.forEach((movimiento) => {
      // Definir la clave única para cada artículo: combinación de marca y modelo_serie
      const key = `${movimiento.marca}_${movimiento.modelo_serie}`;
      if (!ultimosMovimientos.has(key)) {
        ultimosMovimientos.set(key, movimiento);
      } else {
        const fechaActual = new Date(movimiento.fecha);
        const fechaGuardada = new Date(ultimosMovimientos.get(key).fecha);
        if (fechaActual > fechaGuardada) {
          ultimosMovimientos.set(key, movimiento);
        }
      }
    });

    // 5. Procesar cada grupo de artículo para verificar su existencia y actualizar movimientos
    let warnings: string[] = [];
    ultimosMovimientos.forEach((movimiento, key) => {
      // Buscar el artículo en la tabla articulos por la combinación marca y modelo_serie
      const articuloExistente = db
        .prepare("SELECT * FROM articulos WHERE marca = ? AND modelo_serie = ?")
        .get(movimiento.marca, movimiento.modelo_serie);

      if (!articuloExistente) {
        // Insertar un nuevo artículo usando la cantidad del último movimiento
        const result = db.prepare(
          "INSERT INTO articulos (material_repuesto, marca, modelo_serie, cantidad, imagen) VALUES (?, ?, ?, ?, ?)"
        ).run(
          movimiento.material_repuesto,
          movimiento.marca,
          movimiento.modelo_serie,
          movimiento.cantidad, // Se usa la cantidad del último movimiento
          null
        );
        // Obtener el ID del artículo insertado
        const newArticleId = result.lastInsertRowid;
        // Actualizar los movimientos que corresponden a este artículo
        db.prepare("UPDATE movimientos_materiales SET articulo_id = ? WHERE marca = ? AND modelo_serie = ?")
          .run(newArticleId, movimiento.marca, movimiento.modelo_serie);
      } else {
        // Actualizar los movimientos para que tengan el ID del artículo existente
        db.prepare("UPDATE movimientos_materiales SET articulo_id = ? WHERE marca = ? AND modelo_serie = ?")
          .run(articuloExistente.id, movimiento.marca, movimiento.modelo_serie);
        // Comparar la cantidad del último movimiento con la cantidad del artículo en BD y generar una advertencia si difieren
        if (articuloExistente.cantidad !== movimiento.cantidad) {
          warnings.push(
            `El artículo (Marca: ${movimiento.marca}, Modelo/Serie: ${movimiento.modelo_serie}) tiene cantidad en BD: ${articuloExistente.cantidad} y el último movimiento en Excel indica: ${movimiento.cantidad}.`
          );
        }
      }
    });

    // 6. Retornar el resultado junto con las advertencias (si existen)
    return { success: true, data: insertedData, warnings };
  } catch (error) {
    console.error('[!] Hubo un error al reemplazar datos:', error);
    return { success: false, error: error };
  }
}



export const guardarMovimiento = async (movimiento) => {

  const { numero_movimiento, fecha, tipo_movimiento, origen, destino, cantidad, permiso_trabajo_asociado, informe_asociado, orden_trabajo_asociada, remito, numero_almacenes, material_repuesto, marca, modelo_serie, observaciones, id: articulo_id } = movimiento;


  // console.log('movimiento', movimiento)
  try {


    const registroExistente = db.prepare(`
      SELECT * FROM movimientos_materiales WHERE numero_movimiento = ?
    `).get(numero_movimiento);



    if (registroExistente) {
      return { success: false, error: 'numero de informe repetido' };
    }



    db.prepare("BEGIN TRANSACTION").run(); // Iniciar la transacción






    // Verificar si el artículo existe
    const articulo = db.prepare("SELECT cantidad FROM articulos WHERE id = ?").get(articulo_id);
    if (!articulo) {
      db.prepare("ROLLBACK").run(); // Revertir cambios si el artículo no existe
      return { success: false, error: "El artículo no existe" };
    }

    let nuevaCantidad = articulo.cantidad;

    // Determinar nueva cantidad según el tipo de movimiento
    if (tipo_movimiento === "INGRESO") {
      nuevaCantidad += 1; // Sumar 1
    } else if (tipo_movimiento === "SALIDA") {
      if (articulo.cantidad < 1) {
        db.prepare("ROLLBACK").run(); // Revertir cambios si no hay suficiente stock
        return { success: false, error: "Stock insuficiente para realizar la salida" };
      }
      nuevaCantidad -= 1; // Restar 1
    } else {
      db.prepare("ROLLBACK").run(); // Revertir si el tipo de movimiento es inválido
      return { success: false, error: "Tipo de movimiento inválido" };
    }

    // Actualizar la cantidad del artículo en la base de datos
    const updateStmt = db.prepare("UPDATE articulos SET cantidad = ? WHERE id = ?");
    const updateResult = updateStmt.run(nuevaCantidad, articulo_id);

    if (updateResult.changes === 0) {
      db.prepare("ROLLBACK").run(); // Revertir si la actualización falla
      return { success: false, error: "No se pudo actualizar la cantidad del artículo" };
    }




    const stmt = db.prepare(`INSERT INTO movimientos_materiales (numero_movimiento, fecha, tipo_movimiento, origen, destino, cantidad, permiso_trabajo_asociado, informe_asociado, orden_trabajo_asociada, remito, numero_almacenes, material_repuesto, marca, modelo_serie, observaciones, articulo_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

    const result = stmt.run(
      numero_movimiento, fecha, tipo_movimiento, origen, destino, nuevaCantidad, permiso_trabajo_asociado, informe_asociado, orden_trabajo_asociada, remito, numero_almacenes, material_repuesto, marca, modelo_serie, observaciones, articulo_id
    )

    if (result.changes === 0) {
      db.prepare("ROLLBACK").run(); // Revertir si la inserción del movimiento falla
      return { success: false, error: "No se pudo registrar el movimiento" };
    }


    db.prepare("COMMIT").run(); // Confirmar transacción si todo salió bien

    const movimientoCreado = {
      id: result.lastInsertRowid,
      numero_movimiento,
      fecha,
      tipo_movimiento,
      origen,
      destino,
      cantidad: nuevaCantidad,
      permiso_trabajo_asociado,
      informe_asociado,
      orden_trabajo_asociada,
      remito,
      numero_almacenes,
      material_repuesto,
      marca,
      modelo_serie,
      observaciones,
      articulo_id
    }



    return { success: true, data: movimientoCreado }


  } catch (error) {
    db.prepare("ROLLBACK").run(); // Si hay un error, deshacer todos los cambios
    console.log('Error al insertar movimiento:', error);
    return { success: false, error: "Error en la base de datos" };
  }

}

export const obtenerUltimoMovimiento = async () => {
  try {
    const result = db
      .prepare(`
              SELECT numero_movimiento 
              FROM movimientos_materiales 
              ORDER BY CAST(numero_movimiento AS INTEGER) DESC, numero_movimiento DESC 
              LIMIT 1
          `)
      .get();

    if (!result || !result.numero_movimiento) {
      return { success: true, data: 0 };
    }

    const maxNumero = result.numero_movimiento;

    return { success: true, data: maxNumero };
  } catch (error) {
    console.error('Error al obtener el número de movimiento:', error);
    return { success: false, error: error || 'Error al obtener el número de movimiento' };
  }
};
