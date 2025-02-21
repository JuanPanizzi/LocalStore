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