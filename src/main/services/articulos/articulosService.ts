import db from '../../database/database'

export const obtenerArticulos = async () => {

    try {
        const result = db.prepare(`SELECT * FROM articulos`).all();
        console.log('result', result);
        return { success: true, data: result }
    } catch (error) {
        console.log('error al obtener datos', error);
        
        return { success: false, error }
    }


}

export const nuevoArticulo = (articulo) => {

    const { material, marca, modelo, cantidad, imagen} = articulo;

    try {
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