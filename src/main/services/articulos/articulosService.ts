import db from '../../database/database'

export const obtenerArticulos = async () => {

    try {
        const result = db.prepare(`SELECT * FROM articulos`).all();

        return { success: true, data: result }
    } catch (error) {
        console.log('error al obtener datos', error);
        return { success: false, error }
    }


}

export const obtenerArticuloById = async (articuloId) => { 
    try {
        const result = db.prepare(`SELECT * FROM articulos WHERE id = ?`).get(articuloId);
        return { success: true, data: result }
    } catch (error) {
        console.log('error al obtener articulo por id', error)
        return { success: false }
    }

}

export const crearArticulo = async (articulo) => {
    // console.log('articulo', articulo)
    const { material_repuesto, marca, modelo_serie, cantidad, imagen, unidad_medida } = articulo;

    try {

        const articuloRepetido = db.prepare(`SELECT id FROM articulos WHERE marca = ? COLLATE NOCASE AND modelo_serie = ? COLLATE NOCASE`).get(marca, modelo_serie);

        if (articuloRepetido) {
            return { success: false, error: "Ya existe un artículo con esa marca y modelo_serie" };
        }

        const stmt = db.prepare(`INSERT INTO articulos (material_repuesto, marca, modelo_serie, cantidad, imagen, unidad_medida) VALUES (?,?,?,?,?,?)`);

        const result = stmt.run(material_repuesto, marca, modelo_serie, cantidad, imagen, unidad_medida);


        if (result.changes === 0) {
            return { success: false };
        }

        const nuevoArticulo = {
            id: result.lastInsertRowid,
            material_repuesto,
            marca,
            modelo_serie,
            imagen,
            cantidad,
            unidad_medida
        }

        return { success: true, data: nuevoArticulo }


    } catch (error) {
        console.log('error al insertar articulo', error)
        return { success: false, error }
    }
}

export const eliminarArticulo = async (articuloId: number | string) => {

    try {

        db.prepare("BEGIN TRANSACTION").run();


        const eliminarMovimientosStmt = db.prepare(`DELETE FROM movimientos_materiales WHERE articulo_id = ?`)
        eliminarMovimientosStmt.run(articuloId);
        
        // const resultEliminarMov = eliminarMovimientosStmt.run(articuloId);
        // if(resultEliminarMov.changes === 0){
        //     // db.prepare("ROLLBACK").run();
        //     // return { success: false, error: 'Error al eliminar los movimientos' }
        // console.log('no se pudo eliminar movimientos')
        // }

        const eliminarArticulosStmt = db.prepare(`DELETE FROM articulos WHERE id = ?`);
        const resultEliminarArticulos = eliminarArticulosStmt.run(articuloId);

        if (resultEliminarArticulos.changes === 0) {
            db.prepare("ROLLBACK").run();
            return { success: false, error: 'No se encontró el articulo' }
        }

        db.prepare("COMMIT").run();
        return { success: true };

    } catch (error) {

        console.log('error', error)
        db.prepare("ROLLBACK").run();
        return { success: false };
    }

}

export const actualizarArticulo = async (articulo) => {
    
    const { material_repuesto, marca, modelo_serie, cantidad, unidad_medida, imagen, id } = articulo;

    

    try {
        // const stmt = db.prepare(`UPDATE articulos SET material_repuesto = ?, marca = ?, modelo_serie = ?, cantidad = ?, imagen = ? WHERE id = ?`);

        // const result = stmt.run(material_repuesto, marca, modelo_serie, cantidad, imagen, id);
        // if(result.changes == 0){
        //     return { success: false, error: 'No se encontró el informe' }
        // }

        db.prepare("BEGIN TRANSACTION").run();

        const actualizarMovimientosStmt = db.prepare(`
            UPDATE movimientos_materiales 
            SET material_repuesto = ?, marca = ?, modelo_serie = ?, cantidad = ?, unidad_medida = ?
            WHERE articulo_id = ?
             RETURNING *`)

        
        const movimientosActualizados = actualizarMovimientosStmt.all(material_repuesto, marca, modelo_serie, cantidad, unidad_medida,  id);


        const stmt = db.prepare(
            `UPDATE articulos 
             SET material_repuesto = ?, marca = ?, modelo_serie = ?, cantidad = ?, unidad_medida = ?, imagen = ? 
             WHERE id = ? 
             RETURNING *`
        );
        const articuloActualizado = stmt.get(material_repuesto, marca, modelo_serie, cantidad, unidad_medida, imagen, id);

        db.prepare("COMMIT").run();


        return { success: true, data: articuloActualizado }

    } catch (error) {

        console.log('error al actualizar articulo', error)
        db.prepare("ROLLBACK").run();
        return {success: false}
    }


}

// export const obtenerUltimoMovimiento = async () => {
//     try {
//         const result = db
//           .prepare(`SELECT MAX(numero_movimiento) as maxNumero FROM movimientos_materiales`)
//           .get();
//         // Si no hay registros, result.maxNumero será null, por lo que devolvemos 0 (o el valor que consideres por defecto)
//         const maxNumero = result?.maxNumero ?? 0;
//         return { success: true, data: maxNumero };
//       } catch (error) {
//         console.error('Error al obtener el número de movimiento:', error);
//         return { success: false, error: error || 'Error al obtener el número de movimiento' };
//       }

    
// } 
