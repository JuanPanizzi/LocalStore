
import db from '../../database/database'

interface Movimiento {
  fecha: string;
  tipo_movimiento?: string | null;
  origen: string;
  destino: string;
  material_repuesto: string;
  marca: string;
  articulo_id?: number | null;
  cantidad: number;
  permiso_trabajo_asociado?: string;
  informe_asociado?: string;
  orden_trabajo_asociada?: string;
  remito?: string | null;
  numero_almacenes?: string;
  numero_movimiento: string | number;   // Este campo puede venir como string o number, lo convertimos a string en la inserción
  modelo_serie: string;
  unidad_medida?: string;
  inventario_remanente: number;
}



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

       // Obtener el stock actual del artículo
       const stmtObtenerStock = db.prepare("SELECT cantidad FROM articulos WHERE id = ?");
       const row = stmtObtenerStock.get(articulo_id);
       if (!row) {
         throw new Error("Artículo no encontrado");
       }
       const stockActual = row.cantidad;
 
       // Si la cantidad a restar es mayor que el stock, abortar
       if (stockActual < cantidad) {
         db.exec("ROLLBACK");
         return { 
           success: false, 
           message: "No se puede eliminar una cantidad mayor a la que hay en el stock actual del artículo." 
         };
        }



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
    return { success: false, error };
  }

}




export async function guardarExcelMovimientos(movimientosData: Movimiento[]) {
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

    for (const movimiento of movimientosData) {
      insertMov.run(
        movimiento.fecha,
        movimiento.tipo_movimiento ? movimiento.tipo_movimiento.toUpperCase() : null,
        movimiento.origen,
        movimiento.destino,
        movimiento.material_repuesto,
        movimiento.marca,
        null, // Se completará luego con el ID del artículo
        movimiento.cantidad,
        movimiento.permiso_trabajo_asociado,
        movimiento.informe_asociado,
        movimiento.orden_trabajo_asociada,
        movimiento.remito,
        movimiento.numero_almacenes,
        movimiento.numero_movimiento.toString(), // Convertir a string para tratar correctamente sufijos
        movimiento.modelo_serie,
        movimiento.unidad_medida,
        movimiento.inventario_remanente
      );
    }

    const movimientosGuardados = db.prepare("SELECT * FROM movimientos_materiales").all();
    if (movimientosGuardados.length === 0) {
      throw new Error("No se insertaron datos en movimientos_materiales.");
    }

    // Función de normalización: trim, toLowerCase y quitar todos los espacios internos
    const normalizar = (valor: string) =>
      valor ? valor.trim().toLowerCase().replace(/\s+/g, '') : "";

    // 3) Crear o actualizar artículos (stock = 0 inicialmente)
    // Agrupamos por (marca, modelo_serie) utilizando valores normalizados
    const articuloMap = new Map<string, Movimiento>();

    for (const mov of movimientosData) {
      const normalizedMarca = normalizar(mov.marca);
      const normalizedModelo = normalizar(mov.modelo_serie);
      const key = `${normalizedMarca}__${normalizedModelo}`;
      if (!articuloMap.has(key)) {
        articuloMap.set(key, mov);
      }
    }

    for (const [key, mov] of articuloMap.entries()) {
      const normalizedMarca = normalizar(mov.marca);
      const normalizedModelo = normalizar(mov.modelo_serie);

      // Revisar si el artículo ya existe utilizando REPLACE para quitar espacios en la consulta
      const articuloExistente = db.prepare(`
        SELECT * FROM articulos
        WHERE REPLACE(LOWER(trim(marca)), ' ', '') = ? AND REPLACE(LOWER(trim(modelo_serie)), ' ', '') = ?
      `).get(normalizedMarca, normalizedModelo);

      if (!articuloExistente) {
        // Insertar artículo con stock = 0 (almacenando los valores originales, pero recortados)
        const result = db.prepare(`
          INSERT INTO articulos
            (material_repuesto, marca, modelo_serie, cantidad, imagen, unidad_medida)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(
          mov.material_repuesto,
          mov.marca.trim(),
          mov.modelo_serie.trim(),
          0,     // stock inicial
          null,  // imagen
          mov.unidad_medida
        );
        const newArticleId = result.lastInsertRowid;

        // Actualizar en movimientos_materiales el artículo correspondiente usando normalización
        db.prepare(`
          UPDATE movimientos_materiales
          SET articulo_id = ?
          WHERE REPLACE(LOWER(trim(marca)), ' ', '') = ? AND REPLACE(LOWER(trim(modelo_serie)), ' ', '') = ?
        `).run(newArticleId, normalizedMarca, normalizedModelo);
      } else {
        // Si existe, solo se actualiza el articulo_id en los movimientos
        db.prepare(`
          UPDATE movimientos_materiales
          SET articulo_id = ?
          WHERE REPLACE(LOWER(trim(marca)), ' ', '') = ? AND REPLACE(LOWER(trim(modelo_serie)), ' ', '') = ?
        `).run(articuloExistente.id, normalizedMarca, normalizedModelo);
      }
    }

    // 4) Recuperar todos los movimientos para elegir el "último" movimiento según la comparación personalizada
    const allMovements = db.prepare("SELECT * FROM movimientos_materiales").all();

    // Agrupar movimientos por (marca, modelo_serie) normalizados
    const grouped = new Map<string, any[]>();
    for (const mov of allMovements) {
      const normalizedMarca = normalizar(mov.marca);
      const normalizedModelo = normalizar(mov.modelo_serie);
      const key = `${normalizedMarca}__${normalizedModelo}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(mov);
    }

    // Función para parsear el numero_movimiento (ejemplo: "1147-B", "1150", etc.)
    function parseNumeroMov(numMov: string) {
      const str = numMov.toString();
      const match = str.match(/^(\d+)(?:-(.*))?$/);
      if (!match) {
        return { numeric: 0, suffix: numMov };
      }
      const numeric = parseInt(match[1], 10);
      const suffix = match[2] || "";
      return { numeric, suffix };
    }

    // Comparación personalizada: primero se compara la parte numérica y luego, en caso de empate,
    // se considera mayor el movimiento sin sufijo o se comparan alfabéticamente los sufijos.
    function compareNumeroMov(a: string, b: string) {
      const pa = parseNumeroMov(a);
      const pb = parseNumeroMov(b);

      if (pa.numeric !== pb.numeric) {
        return pa.numeric - pb.numeric;
      } else {
        if (pa.suffix === "" && pb.suffix !== "") {
          return 1;
        }
        if (pb.suffix === "" && pa.suffix !== "") {
          return -1;
        }
        return pa.suffix.localeCompare(pb.suffix);
      }
    }

    // Array para almacenar los artículos cuyos movimientos tienen todos el numero_movimiento "0"
    const movimientosSinID: string[] = [];

    for (const [key, movimientos] of grouped.entries()) {
      let ultimo: any;
      const allZero = movimientos.every(mov => mov.numero_movimiento.toString() === "0");

      if (allZero) {
        // Si todos tienen "0", se usa la fecha para determinar el último movimiento
        ultimo = movimientos.reduce((a, b) =>
          new Date(a.fecha).getTime() > new Date(b.fecha).getTime() ? a : b
        );
        movimientosSinID.push(
          `[${ultimo.material_repuesto} - ${ultimo.marca} - ${ultimo.modelo_serie}]`
        );
      } else {
        // Caso normal: se usa la comparación personalizada por numero_movimiento
        ultimo = movimientos[0];
        for (let i = 1; i < movimientos.length; i++) {
          const current = movimientos[i];
          if (compareNumeroMov(current.numero_movimiento, ultimo.numero_movimiento) > 0) {
            ultimo = current;
          }
        }
      }

      // Actualizar el stock en la tabla "articulos" con el inventario_remanente del último movimiento
      db.prepare(`
        UPDATE articulos
        SET cantidad = ?
        WHERE id = ?
      `).run(ultimo.inventario_remanente, ultimo.articulo_id);
    }

    // Confirmar transacción
    db.prepare("COMMIT").run();
    console.log('movimientosSinID:', movimientosSinID);
    return { success: true, data: movimientosGuardados, movimientosSinID };

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



    const stmt = db.prepare(`INSERT INTO movimientos_materiales (numero_movimiento, fecha, tipo_movimiento, origen, destino, cantidad, permiso_trabajo_asociado, informe_asociado, orden_trabajo_asociada, remito, numero_almacenes, material_repuesto, marca, modelo_serie, observaciones, unidad_medida, inventario_remanente, articulo_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

    const result = stmt.run(
      numero_movimiento, fecha, tipo_movimiento, origen, destino, cantidad_seleccionada, permiso_trabajo_asociado, informe_asociado, orden_trabajo_asociada, remito, numero_almacenes, material_repuesto, marca, modelo_serie, observaciones, unidad_medida, nuevaCantidad, articulo_id
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
      inventario_remanente: nuevaCantidad,
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
