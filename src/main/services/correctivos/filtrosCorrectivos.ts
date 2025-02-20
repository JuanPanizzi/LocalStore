import Database from 'better-sqlite3';

export async function filtrarCorrectivosFecha(fecha: string) {
    try {
        const db = new Database('database.db');
        
        const result = db.prepare('SELECT * FROM correctivos WHERE fecha = ?').all(fecha);

        // Cambiar el formato de la fecha en cada objeto
        const updatedResult = result.map(item => {
            const [year, month, day] = item.fecha.split('-');  
            item.fecha = `${day}-${month}-${year}`;  
            return item;
        });

        db.close();

        return { success: true, data: updatedResult };
    } catch (error) {
        // console.error(error);
        return { success: false, error };
    }
}

export async function filtrarCorrectivosRangoFechas(fechaInicio, fechaFin) {

    try {
        const db = new Database('database.db');
        
        const result = db.prepare(
            'SELECT * FROM correctivos WHERE fecha BETWEEN ? AND ?'
        ).all(fechaInicio, fechaFin);

        // Cambiar el formato de la fecha en cada objeto
        const updatedResult = result.map(item => {
            const [year, month, day] = item.fecha.split('-');  
            item.fecha = `${day}-${month}-${year}`;  
            return item;
        });

        db.close();

        return { success: true, data: updatedResult };
    } catch (error) {
        // console.error(error);
        return { success: false, error };
    }
}
export async function filtrarCorrectivosRepuesto(repuestoMaterial: string, fechaInicio: string, fechaFin: string) {
    try {
        const db = new Database('database.db');

        const query = `
            SELECT * 
            FROM correctivos 
            WHERE repuesto_material LIKE ? 
            AND fecha BETWEEN ? AND ?
        `;

        const result = db.prepare(query).all(`%${repuestoMaterial}%`, fechaInicio, fechaFin);

        // Cambiar el formato de la fecha en cada objeto
        const updatedResult = result.map(item => {
            const [year, month, day] = item.fecha.split('-');
            item.fecha = `${day}-${month}-${year}`;
            return item;
        });

        db.close();

        return { success: true, data: updatedResult };
    } catch (error) {
        // console.error(error);
        return { success: false, error };
    }
}
export async function filtrarCorrectivosSector(sector: string, fechaInicio: string, fechaFin: string) {
    try {
        const db = new Database('database.db');

        const query = `
            SELECT * 
            FROM correctivos 
            WHERE sector LIKE ? 
            AND fecha BETWEEN ? AND ?
        `;

        const result = db.prepare(query).all(`%${sector}%`, fechaInicio, fechaFin);

        // Cambiar el formato de la fecha en cada objeto
        const updatedResult = result.map(item => {
            const [year, month, day] = item.fecha.split('-');
            item.fecha = `${day}-${month}-${year}`;
            return item;
        });

        db.close();

        return { success: true, data: updatedResult };
    } catch (error) {
        // console.error(error);
        return { success: false, error };
    }
}
export async function filtrarCorrectivosMarca(marca: string, fechaInicio: string, fechaFin: string) {
    try {
        const db = new Database('database.db');

        const query = `
            SELECT * 
            FROM correctivos 
            WHERE marca = ? 
            AND fecha BETWEEN ? AND ?
        `;

        const result = db.prepare(query).all(marca, fechaInicio, fechaFin);

        // Cambiar el formato de la fecha en cada objeto
        const updatedResult = result.map(item => {
            const [year, month, day] = item.fecha.split('-');
            item.fecha = `${day}-${month}-${year}`;
            return item;
        });

        db.close();

        return { success: true, data: updatedResult };
    } catch (error) {
        // console.error(error);
        return { success: false, error };
    }
}
export async function filtrarCorrectivosModelo(modelo: string, fechaInicio: string, fechaFin: string) {
    const db = new Database('database.db'); 
    try {
        const query = `
            SELECT * 
            FROM correctivos 
            WHERE modelo LIKE ? 
            AND fecha BETWEEN ? AND ?
        `;

        const result = db.prepare(query).all(`%${modelo}%`, fechaInicio, fechaFin) || [];

        // Cambiar el formato de la fecha en cada objeto
        const updatedResult = result.map(item => {
            if (item.fecha) {
                const [year, month, day] = item.fecha.split('-');
                item.fecha = `${day}-${month}-${year}`;
            }
            return item;
        });

        return { success: true, data: updatedResult };
    } catch (error) {
        // console.error("Error al filtrar correctivos:", error);
        return { success: false, error: error };
    } finally {
        db.close(); 
    }
}

export async function filtrarCorrectivosPermisoTrabajo(permisoTrabajo: string | number) {
    const db = new Database('database.db');
    try {
    
          const result = db.prepare('SELECT * FROM correctivos where tipo_numero_permiso_trabajo LIKE ?').all(`%${permisoTrabajo}%`);
    
          // Cambiar el formato de la fecha en cada objeto
          const updatedResult = result.map(item => {
            const [year, month, day] = item.fecha.split('-');  
            item.fecha = `${day}-${month}-${year}`;  
            return item;
          });
    
    
    
          return { success: true, data: updatedResult}
    
        } catch (error) {
        //   console.log(error)
          return { success: false, error: error }
        } finally {
            db.close();

        }
    
}

export async function filtrarCorrectivosOrdenTrabajo(ordenTrabajo: string | number) {
    const db = new Database('database.db');
    try {
    
          const result = db.prepare('SELECT * FROM correctivos where orden_trabajo LIKE ?').all(`%${ordenTrabajo}%`);
    
          // Cambiar el formato de la fecha en cada objeto
          const updatedResult = result.map(item => {
            const [year, month, day] = item.fecha.split('-');  
            item.fecha = `${day}-${month}-${year}`;  
            return item;
          });
    
    
    
          return { success: true, data: updatedResult}
    
        } catch (error) {
        //   console.log(error)
          return { success: false, error: error }
        } finally {
          db.close();

        }
    
}