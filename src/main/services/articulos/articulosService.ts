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

    const { material, marca, modelo, cantidad, imagen} = articulo;



    try {

        const articuloRepetido = db.prepare(`SELECT id FROM articulos WHERE marca = ? AND modelo = ?`).get(marca, modelo);

        if (articuloRepetido) {
            return { success: false, error: "Ya existe un artículo con esa marca y modelo" };
        }

        const stmt = db.prepare(`INSERT INTO articulos (material, marca, modelo, cantidad, imagen) VALUES (?,?,?,?,?)`);

        const result = stmt.run(material, marca, modelo, cantidad, imagen);


        if(result.changes === 0){
            return {success: false};
        }

       const nuevoArticulo = {
            id: result.lastInsertRowid,
            material,
            marca,
            modelo,
            imagen,
            cantidad
        }

        return {success: true, data: nuevoArticulo}


    } catch (error) {
        console.log('error al insertar articulo', error)
        return {success: false, error}
    }
}