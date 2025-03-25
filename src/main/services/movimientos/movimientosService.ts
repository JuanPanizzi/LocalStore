
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

    const stmt = db.prepare(`SELECT * FROM movimientos_materiales WHERE articulo_id = ? 
      ORDER BY 
        CASE 
          WHEN instr(numero_movimiento, '-') > 0 THEN CAST(substr(numero_movimiento, 1, instr(numero_movimiento, '-') - 1) AS INTEGER)
          ELSE CAST(numero_movimiento AS INTEGER)
        END DESC,
        CASE 
          WHEN instr(numero_movimiento, '-') > 0 THEN substr(numero_movimiento, instr(numero_movimiento, '-') + 1)
          ELSE ''
        END DESC
    `);
    const result = stmt.all(articulo_id);

    return { success: true, data: result }

  } catch (error) {
    console.log('error al obtener los datos', error)
    return { success: false, error }
  }

}

export const eliminarMovimiento = (movimiento) => {

  const { tipo_movimiento, cantidad, articulo_id, id } = movimiento


  try {

    db.exec("BEGIN TRANSACTION");


    if (tipo_movimiento == 'INGRESO' || tipo_movimiento == 'ENTRADA') {

      const stmtActualizar = db.prepare(`UPDATE articulos SET cantidad = cantidad - ? WHERE id = ?`);
      stmtActualizar.run(cantidad, articulo_id)

    } else if (tipo_movimiento == 'SALIDA') {

      const stmtActualizar = db.prepare(`UPDATE articulos SET cantidad = cantidad + ? WHERE id = ?`);
      stmtActualizar.run(cantidad, articulo_id)

    } else {
      throw new Error("Tipo de movimiento desconocido");
    }


    const stmtEliminar = db.prepare(`DELETE FROM movimientos_materiales WHERE id = ?`);
    const result = stmtEliminar.run(movimiento.id);

    db.exec("COMMIT");

    return { success: true, data: result }

  } catch (error) {
    console.log('error', error)
    db.exec("ROLLBACK");
    return { success: false }
  }

}




// export async function guardarExcelMovimientos(data) {
//   console.log('data movimientosService: 92', data)
//   try {


//     db.prepare("BEGIN TRANSACTION").run();

//     // Eliminar todos los registros existentes
//     db.prepare(`DELETE FROM movimientos_materiales`).run();
//     db.prepare(`DELETE FROM articulos`).run();

//     // Preparar la inserción de nuevos datos en movimientos_materiales
//     const insert = db.prepare(`
//       INSERT INTO movimientos_materiales 
//       (fecha, tipo_movimiento, origen, destino, material_repuesto, marca, articulo_id, cantidad, permiso_trabajo_asociado, informe_asociado, orden_trabajo_asociada, remito, numero_almacenes, numero_movimiento, modelo_serie, unidad_medida, inventario_remanente) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,? ,? ,? ,?, ?, ? )
//     `);


//     for (const movimiento of data) {
//       insert.run(
//         movimiento.fecha,
//         movimiento.tipo_movimiento ? movimiento.tipo_movimiento.toUpperCase() : null,
//         movimiento.origen,
//         movimiento.destino,
//         movimiento.material_repuesto,
//         movimiento.marca,
//         movimiento.articulo_id, // Puede ser null en este momento
//         movimiento.cantidad,
//         movimiento.permiso_trabajo_asociado,
//         movimiento.informe_asociado,
//         movimiento.orden_trabajo_asociada,
//         movimiento.remito,
//         movimiento.numero_almacenes,
//         movimiento.numero_movimiento,
//         movimiento.modelo_serie,
//         movimiento.unidad_medida,
//         movimiento.inventario_remanente
//       );
//     }

//     //  Obtener los datos insertados para enviarlos al frontend
//     const insertedData = db.prepare("SELECT * FROM movimientos_materiales").all();
//     if (insertedData.length === 0) {
//       throw new Error("No se insertaron los datos");
//     }

//     //  Agrupar por artículo para obtener el último movimiento de cada uno (basado en la fecha)
//     const ultimosMovimientos = new Map();
//     data.forEach((movimiento) => {
//       const key = `${movimiento.marca}_${movimiento.modelo_serie}`;
//       if (!ultimosMovimientos.has(key)) {
//         ultimosMovimientos.set(key, movimiento);
//       } else {
//         const fechaActual = new Date(movimiento.fecha);
//         const fechaGuardada = new Date(ultimosMovimientos.get(key).fecha);
//         if (fechaActual > fechaGuardada) {
//           ultimosMovimientos.set(key, movimiento);
//         }
//       }
//     });

//     // Procesar cada grupo de artículo para verificar su existencia y actualizar movimientos
//     let warnings: string[] = [];
//     ultimosMovimientos.forEach((movimiento) => {
//       // Buscar el artículo en la tabla articulos por la combinación marca y modelo_serie
//       const articuloExistente = db
//         .prepare("SELECT * FROM articulos WHERE marca = ? AND modelo_serie = ?")
//         .get(movimiento.marca, movimiento.modelo_serie);

//       if (!articuloExistente) {
//         // Insertar un nuevo artículo usando la cantidad del último movimiento
//         const result = db.prepare(
//           "INSERT INTO articulos (material_repuesto, marca, modelo_serie, cantidad, imagen, unidad_medida) VALUES (?, ?, ?, ?, ?, ?)"
//         ).run(
//           movimiento.material_repuesto,
//           movimiento.marca,
//           movimiento.modelo_serie,
//           0, // Se inicia en 0
//           null, // imagen
//           movimiento.unidad_medida
//         );
//         const newArticleId = result.lastInsertRowid;
//         // Actualizar los movimientos correspondientes a este artículo
//         db.prepare("UPDATE movimientos_materiales SET articulo_id = ? WHERE marca = ? AND modelo_serie = ?")
//           .run(newArticleId, movimiento.marca, movimiento.modelo_serie);
//       } else {
//         // Actualizar los movimientos con el ID del artículo existente
//         db.prepare("UPDATE movimientos_materiales SET articulo_id = ? WHERE marca = ? AND modelo_serie = ?")
//           .run(articuloExistente.id, movimiento.marca, movimiento.modelo_serie);
//         // Comparar la cantidad y generar advertencia si difieren
//         if (articuloExistente.cantidad !== movimiento.cantidad) {
//           warnings.push(
//             `El artículo (Marca: ${movimiento.marca}, Modelo/Serie: ${movimiento.modelo_serie}) tiene cantidad en BD: ${articuloExistente.cantidad} y el último movimiento en Excel indica: ${movimiento.cantidad}.`
//           );
//         }
//       }
//     });

//     // Confirmar la transacción
//     db.prepare("COMMIT").run();

//     // Retornar el resultado junto con las advertencias (si existen)
//     return { success: true, data: insertedData, warnings };

//   } catch (error) {
//     // En caso de error, revertir todas las operaciones realizadas en la transacción
//     db.prepare("ROLLBACK").run();
//     console.error('[!] Hubo un error al reemplazar datos:', error);
//     return { success: false, error: error };
//   }
// }
// export async function guardarExcelMovimientos(data) {
//   try {
//     db.prepare("BEGIN TRANSACTION").run();

//     // 1) Eliminar todos los registros existentes
//     db.prepare(`DELETE FROM movimientos_materiales`).run();
//     db.prepare(`DELETE FROM articulos`).run();

//     // 2) Insertar todos los movimientos en movimientos_materiales
//     const insert = db.prepare(`
//       INSERT INTO movimientos_materiales 
//         (fecha, tipo_movimiento, origen, destino, material_repuesto, marca, articulo_id, cantidad,
//          permiso_trabajo_asociado, informe_asociado, orden_trabajo_asociada, remito,
//          numero_almacenes, numero_movimiento, modelo_serie, unidad_medida, inventario_remanente) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `);

//     for (const movimiento of data) {
//       insert.run(
//         movimiento.fecha,
//         movimiento.tipo_movimiento ? movimiento.tipo_movimiento.toUpperCase() : null,
//         movimiento.origen,
//         movimiento.destino,
//         movimiento.material_repuesto,
//         movimiento.marca,
//         null, // articulo_id se seteará luego
//         movimiento.cantidad,
//         movimiento.permiso_trabajo_asociado,
//         movimiento.informe_asociado,
//         movimiento.orden_trabajo_asociada,
//         movimiento.remito,
//         movimiento.numero_almacenes,
//         movimiento.numero_movimiento,
//         movimiento.modelo_serie,
//         movimiento.unidad_medida,
//         movimiento.inventario_remanente
//       );
//     }

//     // Verificar que se hayan insertado movimientos
//     const insertedData = db.prepare("SELECT * FROM movimientos_materiales").all();
//     if (insertedData.length === 0) {
//       throw new Error("No se insertaron los datos en movimientos_materiales.");
//     }

//     // 3) Crear o actualizar artículos (inicialmente con cantidad = 0)
//     //    agrupa por (marca, modelo_serie)
//     const articuloMap = new Map(); // key: "marca_modelo_serie", value: movimiento (último)

//     for (const movimiento of data) {
//       const key = `${movimiento.marca}__${movimiento.modelo_serie}`;
//       if (!articuloMap.has(key)) {
//         articuloMap.set(key, movimiento);
//       }
//     }

//     for (const [key, movimiento] of articuloMap.entries()) {
//       // Verificar si ya existe el artículo
//       const articuloExistente = db.prepare(`
//         SELECT * FROM articulos
//         WHERE marca = ? AND modelo_serie = ?
//       `).get(movimiento.marca, movimiento.modelo_serie);

//       if (!articuloExistente) {
//         // Insertar el artículo con cantidad 0
//         const result = db.prepare(`
//           INSERT INTO articulos (material_repuesto, marca, modelo_serie, cantidad, imagen, unidad_medida)
//           VALUES (?, ?, ?, ?, ?, ?)
//         `).run(
//           movimiento.material_repuesto,
//           movimiento.marca,
//           movimiento.modelo_serie,
//           0,     // Stock inicial en 0
//           null,  // Sin imagen
//           movimiento.unidad_medida
//         );
//         const newArticleId = result.lastInsertRowid;

//         // Actualizar los movimientos con ese ID de artículo
//         db.prepare(`
//           UPDATE movimientos_materiales
//           SET articulo_id = ?
//           WHERE marca = ? AND modelo_serie = ?
//         `).run(newArticleId, movimiento.marca, movimiento.modelo_serie);

//       } else {
//         // El artículo ya existe, así que solo actualizamos el articulo_id en movimientos_materiales
//         db.prepare(`
//           UPDATE movimientos_materiales
//           SET articulo_id = ?
//           WHERE marca = ? AND modelo_serie = ?
//         `).run(articuloExistente.id, movimiento.marca, movimiento.modelo_serie);
//       }
//     }

//     // 4) Actualizar la columna 'cantidad' en 'articulos' con el inventario_remanente
//     //    del último movimiento (basado en el mayor numero_movimiento) para cada artículo.
//     //
//     //    *Aquí asumimos que "último movimiento" se identifica por el mayor valor de numero_movimiento.*

//     const lastMovements = db.prepare(`
//       SELECT mm.marca, mm.modelo_serie, mm.inventario_remanente, mm.articulo_id
//       FROM movimientos_materiales mm
//       JOIN (
//         SELECT marca, modelo_serie, MAX(numero_movimiento) AS max_mov
//         FROM movimientos_materiales
//         GROUP BY marca, modelo_serie
//       ) sub ON sub.marca = mm.marca
//            AND sub.modelo_serie = mm.modelo_serie
//            AND sub.max_mov = mm.numero_movimiento
//     `).all();

//     for (const row of lastMovements) {
//       // row.articulo_id es el ID del artículo
//       db.prepare(`
//         UPDATE articulos
//         SET cantidad = ?
//         WHERE id = ?
//       `).run(row.inventario_remanente, row.articulo_id);
//     }

//     // Confirmar transacción
//     db.prepare("COMMIT").run();

//     return { success: true, data: insertedData };

//   } catch (error) {
//     db.prepare("ROLLBACK").run();
//     console.error('[!] Hubo un error al reemplazar datos:', error);
//     return { success: false, error: error };
//   }
// }


export async function guardarExcelMovimientos(data) {
  try {
    db.prepare("BEGIN TRANSACTION").run();

    // 1) Limpiar tablas
    db.prepare("DELETE FROM movimientos_materiales").run();
    db.prepare("DELETE FROM articulos").run();

    // 2) Insertar todos los movimientos en la tabla movimientos_materiales
    const insertMov = db.prepare(`
      INSERT INTO movimientos_materiales
      (
        fecha,
        tipo_movimiento,
        origen,
        destino,
        material_repuesto,
        marca,
        articulo_id,
        cantidad,
        permiso_trabajo_asociado,
        informe_asociado,
        orden_trabajo_asociada,
        remito,
        numero_almacenes,
        numero_movimiento,
        modelo_serie,
        unidad_medida,
        inventario_remanente
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const movimiento of data) {
      insertMov.run(
        movimiento.fecha,
        movimiento.tipo_movimiento ? movimiento.tipo_movimiento.toUpperCase() : null,
        movimiento.origen,
        movimiento.destino,
        movimiento.material_repuesto,
        movimiento.marca,
        null, // Se completa luego con el ID del artículo
        movimiento.cantidad,
        movimiento.permiso_trabajo_asociado,
        movimiento.informe_asociado,
        movimiento.orden_trabajo_asociada,
        movimiento.remito,
        movimiento.numero_almacenes,
        movimiento.numero_movimiento.toString(), //Converitr a string porque sino las comparaciones entre numeros con sufijo -X dan erróneas
        movimiento.modelo_serie,
        movimiento.unidad_medida,
        movimiento.inventario_remanente
      );
    }

    const insertedData = db.prepare("SELECT * FROM movimientos_materiales").all();
    if (insertedData.length === 0) {
      throw new Error("No se insertaron datos en movimientos_materiales.");
    }

    // 3) Crear o actualizar artículos (stock = 0 inicialmente)
    //    Agrupamos por (marca, modelo_serie) para insertar en 'articulos'
    const articuloMap = new Map(); // key = "marca__modelo_serie"

    for (const mov of data) {
      const key = `${mov.marca}__${mov.modelo_serie}`;
      if (!articuloMap.has(key)) {
        articuloMap.set(key, mov);
      }
    }

    for (const [key, mov] of articuloMap.entries()) {
      // Revisar si el artículo ya existe
      const articuloExistente = db.prepare(`
        SELECT * FROM articulos
        WHERE marca = ? AND modelo_serie = ?
      `).get(mov.marca, mov.modelo_serie);

      if (!articuloExistente) {
        // Insertar artículo con stock = 0
        const result = db.prepare(`
          INSERT INTO articulos
            (material_repuesto, marca, modelo_serie, cantidad, imagen, unidad_medida)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(
          mov.material_repuesto,
          mov.marca,
          mov.modelo_serie,
          0,     // stock inicial
          null,  // imagen
          mov.unidad_medida
        );
        const newArticleId = result.lastInsertRowid;

        // Actualizar en movimientos_materiales el artículo correspondiente
        db.prepare(`
          UPDATE movimientos_materiales
          SET articulo_id = ?
          WHERE marca = ? AND modelo_serie = ?
        `).run(newArticleId, mov.marca, mov.modelo_serie);

      } else {
        // Si existe, solo actualizamos el articulo_id en los movimientos
        db.prepare(`
          UPDATE movimientos_materiales
          SET articulo_id = ?
          WHERE marca = ? AND modelo_serie = ?
        `).run(articuloExistente.id, mov.marca, mov.modelo_serie);
      }
    }

    // 4) Recuperamos todos los movimientos desde la tabla para
    //    elegir el "último" según una comparación personalizada de numero_movimiento.
    const allMovements = db.prepare(`
      SELECT * FROM movimientos_materiales
    `).all();

    // Agrupamos movimientos por (marca, modelo_serie)
    const grouped = new Map<string, any[]>();
    for (const mov of allMovements) {
      const key = `${mov.marca}__${mov.modelo_serie}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(mov);
    }


    // Función para parsear el numero_movimiento (por ej. "1147-B", "1150", etc.)
    function parseNumeroMov(numMov: string) {
      // Regex que separa la parte numérica y el posible sufijo
      const str = numMov.toString();
      const match = str.match(/^(\d+)(?:-(.*))?$/);
      if (!match) {
        // Si no hace match, lo consideramos como sufijo completo y numérico = 0 (o algo)
        return { numeric: 0, suffix: numMov };
      }
      const numeric = parseInt(match[1], 10);
      const suffix = match[2] || ""; // si no hay sufijo, ""
      return { numeric, suffix };
    }

    // Comparación personalizada: 
    //  1) Compara la parte numérica
    //  2) Si es igual, aquel sin sufijo se considera "mayor" (más reciente)
    //  3) Si ambos tienen sufijo, comparar alfabéticamente
    function compareNumeroMov(a: string, b: string) {



      const pa = parseNumeroMov(a);
      const pb = parseNumeroMov(b);

      if (pa.numeric !== pb.numeric) {
        // Comparamos parte numérica
        return pa.numeric - pb.numeric;
      } else {
        // La parte numérica es la misma
        if (pa.suffix === "" && pb.suffix !== "") {
          // "1147" > "1147-B"
          return 1;
        }
        if (pb.suffix === "" && pa.suffix !== "") {
          // "1147-B" < "1147"
          return -1;
        }
        // Ambos tienen sufijo o ambos sin sufijo
        // Comparamos alfabéticamente
        return pa.suffix.localeCompare(pb.suffix);
      }
    }

    // Por cada grupo, encontrar el movimiento con numero_movimiento "mayor" según la comparación
    for (const [key, movimientos] of grouped.entries()) {
      let ultimo = movimientos[0];
      // console.log("Grupo:", key);
      movimientos.forEach(m => {
        // console.log("   => numero_movimiento:", m.numero_movimiento, 
        //             "marca:", `"${m.marca}"`, 
        //             "modelo:", `"${m.modelo_serie}"`);
      });
      for (let i = 1; i < movimientos.length; i++) {
        const current = movimientos[i];
        // Si current es "mayor" que ultimo, lo reemplazamos
        if (compareNumeroMov(current.numero_movimiento, ultimo.numero_movimiento) > 0) {
          // console.log('ultimo', current)
          ultimo = current;
        }
      }

      // Ahora 'ultimo' es el movimiento más reciente para este artículo
      // Actualizamos la columna 'cantidad' de la tabla 'articulos'
      db.prepare(`
        UPDATE articulos
        SET cantidad = ?
        WHERE id = ?
      `).run(ultimo.inventario_remanente, ultimo.articulo_id);
    }

    // Confirmar transacción
    db.prepare("COMMIT").run();
    return { success: true, data: insertedData };

  } catch (error) {
    db.prepare("ROLLBACK").run();
    console.error("[!] Error al reemplazar datos:", error);
    return { success: false, error };
  }
}





export const guardarMovimiento = async (movimiento) => {

  const { numero_movimiento, fecha, tipo_movimiento, origen, destino, cantidad, cantidad_seleccionada, permiso_trabajo_asociado, informe_asociado, orden_trabajo_asociada, remito, numero_almacenes, material_repuesto, marca, modelo_serie, observaciones, unidad_medida, id: articulo_id } = movimiento;


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

    let nuevaCantidad;

    const stockArticulo = typeof articulo.cantidad === 'string'
      ? parseInt(articulo.cantidad, 10)
      : articulo.cantidad;


    // Determinar nueva cantidad según el tipo de movimiento
    if (tipo_movimiento === "INGRESO" || tipo_movimiento === "ENTRADA") {

      nuevaCantidad = articulo.cantidad + cantidad_seleccionada;

    } else if (tipo_movimiento === "SALIDA") {
      if (stockArticulo < 1 || (stockArticulo - cantidad_seleccionada < 0)) {
        db.prepare("ROLLBACK").run(); // Revertir cambios si no hay suficiente stock
        return { success: false, error: "Stock insuficiente para realizar la salida" };
      }
      nuevaCantidad = stockArticulo - cantidad_seleccionada; // Restar 1
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



    const stmt = db.prepare(`INSERT INTO movimientos_materiales (numero_movimiento, fecha, tipo_movimiento, origen, destino, cantidad, permiso_trabajo_asociado, informe_asociado, orden_trabajo_asociada, remito, numero_almacenes, material_repuesto, marca, modelo_serie, observaciones, unidad_medida, articulo_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

    const result = stmt.run(
      numero_movimiento, fecha, tipo_movimiento, origen, destino, cantidad_seleccionada, permiso_trabajo_asociado, informe_asociado, orden_trabajo_asociada, remito, numero_almacenes, material_repuesto, marca, modelo_serie, observaciones, unidad_medida, articulo_id
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
      stock_articulo: nuevaCantidad,
      cantidad_seleccionada,
      permiso_trabajo_asociado,
      informe_asociado,
      orden_trabajo_asociada,
      remito,
      numero_almacenes,
      material_repuesto,
      marca,
      modelo_serie,
      observaciones,
      unidad_medida,
      articulo_id
    }


    return { success: true, data: movimientoCreado }


  } catch (error) {
    db.prepare("ROLLBACK").run(); // Si hay un error, deshacer todos los cambios
    console.log('Error al insertar movimiento:', error);
    return { success: false, error: "Error en la base de datos" };
  }

}

export const actualizarMovimiento = async (movimiento) => {


  const { numero_movimiento, fecha, tipo_movimiento, origen, destino, cantidad, permiso_trabajo_asociado, informe_asociado, orden_trabajo_asociada, remito, numero_almacenes, material_repuesto, marca, modelo_serie, observaciones, articulo_id, id: id_movimiento } = movimiento;

  try {
    const stmt = db.prepare(`UPDATE movimientos_materiales SET numero_movimiento = ?, fecha = ?, tipo_movimiento = ?, origen = ?, destino = ?, cantidad = ?, permiso_trabajo_asociado = ?, informe_asociado = ?, orden_trabajo_asociada = ?, remito = ?, numero_almacenes = ?, material_repuesto = ?, marca = ?, modelo_serie = ?, observaciones = ?, articulo_id = ? WHERE id = ?`);

    const result = stmt.run(numero_movimiento, fecha, tipo_movimiento, origen, destino, cantidad, permiso_trabajo_asociado, informe_asociado, orden_trabajo_asociada, remito, numero_almacenes, material_repuesto, marca, modelo_serie, observaciones, articulo_id, id_movimiento);

    if (result.changes == 0) {
      return { success: false, error: 'No se encontró el movimiento' }
    }
    const articuloActualizado = db.prepare(`SELECT * FROM movimientos_materiales WHERE id = ?`).get(id_movimiento);

    return { success: true, data: articuloActualizado }

  } catch (error) {
    return { success: false }
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
