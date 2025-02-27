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

export const crearArticulo = async (articulo) => {

    const { material_repuesto, marca, modelo, cantidad, imagen } = articulo;

    try {

        const articuloRepetido = db.prepare(`SELECT id FROM articulos WHERE marca = ? COLLATE NOCASE AND modelo = ? COLLATE NOCASE`).get(marca, modelo);

        if (articuloRepetido) {
            return { success: false, error: "Ya existe un artículo con esa marca y modelo" };
        }

        const stmt = db.prepare(`INSERT INTO articulos (material_repuesto, marca, modelo, cantidad, imagen) VALUES (?,?,?,?,?)`);

        const result = stmt.run(material_repuesto, marca, modelo, cantidad, imagen);


        if (result.changes === 0) {
            return { success: false };
        }

        const nuevoArticulo = {
            id: result.lastInsertRowid,
            material_repuesto,
            marca,
            modelo,
            imagen,
            cantidad
        }

        return { success: true, data: nuevoArticulo }


    } catch (error) {
        console.log('error al insertar articulo', error)
        return { success: false, error }
    }
}

export const eliminarArticulo = async (articuloId: number | string) => {

    try {
        const result = db.prepare(`DELETE FROM articulos WHERE id = ?`).run(articuloId);

        if (result.changes == 0) {
            return { success: false, error: 'No se encontró el articulo' }
        }

        return { success: true };


    } catch (error) {
        console.log('error', error)
        return { success: false }
    }

}

export const actualizarArticulo = async (articulo) => {
    const { material_repuesto, marca, modelo, cantidad, imagen, id } = articulo;
    console.log('articulo que llega', articulo)
    try {
        // const stmt = db.prepare(`UPDATE articulos SET material_repuesto = ?, marca = ?, modelo = ?, cantidad = ?, imagen = ? WHERE id = ?`);

        // const result = stmt.run(material_repuesto, marca, modelo, cantidad, imagen, id);
        // if(result.changes == 0){
        //     return { success: false, error: 'No se encontró el informe' }
        // }

        const stmt = db.prepare(
            `UPDATE articulos 
             SET material_repuesto = ?, marca = ?, modelo = ?, cantidad = ?, imagen = ? 
             WHERE id = ? 
             RETURNING *`
        );
        const articuloActualizado = stmt.get(material_repuesto, marca, modelo, cantidad, imagen, id);
        console.log('articulo actualizado', articuloActualizado)

        return { success: true, data: articuloActualizado }

    } catch (error) {
        console.log('error al actualizar articulo', error)
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
