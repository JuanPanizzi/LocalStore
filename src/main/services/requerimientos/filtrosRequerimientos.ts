import Database from 'better-sqlite3';

export async function filtrarRequerimientoNumReq(numeroRequerimiento: string | number) {
 try {
      const db = new Database('database.db');

      const numeroRequerimientoCleaned = String(numeroRequerimiento).trim();

      const query = `SELECT * FROM requerimientos_repuestos WHERE numero_requerimiento = ?`;

      const result = db.prepare(query).all(numeroRequerimientoCleaned);

      db.close();
      return { success: true, data: result };
    } catch (error) {
      // console.error('[!] Error al buscar por número de requerimiento:', error);
      return { success: false, error: error };
    }
}

export async function filtrarRequerimientoInsumo(filtros: any) {
const { insumoMaterial, anio, mes, dia } = filtros;

    try {
      const db = new Database('database.db');

      // Asegurarnos de que los valores sean cadenas de texto
      const anioCleaned = anio ? String(anio).trim() : null;  // Convertimos anio a cadena si no lo es
      const mesCleaned = mes ? String(mes).trim().padStart(2, '0') : null; // Convertimos mes a cadena y a dos dígitos
      const diaCleaned = dia ? String(dia).trim().padStart(2, '0') : null; // Convertimos día a cadena y a dos dígitos

      let query = `SELECT * FROM requerimientos_repuestos WHERE insumo_material_repuesto LIKE ?`;
      const params = [`%${insumoMaterial}%`];

      // Agregar condición para el año
      if (anioCleaned) {
        query += ` AND strftime('%Y', fecha) = ?`;
        params.push(anioCleaned);
      }

      // Agregar condición para el mes
      if (mesCleaned) {
        query += ` AND strftime('%m', fecha) = ?`;
        params.push(mesCleaned);
      }

      // Agregar condición para el día
      if (diaCleaned) {
        query += ` AND strftime('%d', fecha) = ?`;
        params.push(diaCleaned);
      }

      const result = db.prepare(query).all(...params);

      db.close();
      return { success: true, data: result };
    } catch (error) {
      // console.error('[!] Error al filtrar datos:', error);
      return { success: false, error: error };
    }

}

export async function filtrarRequerimientoInsumoRango(insumo: string, fechaInicio: string, fechaFin: string) {
  try {
      const db = new Database('database.db');

      const query = `
          SELECT * 
          FROM requerimientos_repuestos 
          WHERE insumo_material_repuesto LIKE ? 
          AND fecha BETWEEN ? AND ?
      `;

      const result = db.prepare(query).all(`%${insumo}%`, fechaInicio, fechaFin);

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


export async function filtrarRequerimientoSector(filtros: any) {

    const { sector, anio, mes, dia } = filtros;

    try {
      const db = new Database('database.db');


      const anioCleaned = anio ? String(anio).trim() : null;
      const mesCleaned = mes ? String(mes).trim().padStart(2, '0') : null;
      const diaCleaned = dia ? String(dia).trim().padStart(2, '0') : null;

      let query = `SELECT * FROM requerimientos_repuestos WHERE sector LIKE ?`;
      const params = [`%${sector}%`];

      // Agregar condición para el año
      if (anioCleaned) {
        query += ` AND strftime('%Y', fecha) = ?`;
        params.push(anioCleaned);
      }

      // Agregar condición para el mes
      if (mesCleaned) {
        query += ` AND strftime('%m', fecha) = ?`;
        params.push(mesCleaned);
      }

      // Agregar condición para el día
      if (diaCleaned) {
        query += ` AND strftime('%d', fecha) = ?`;
        params.push(diaCleaned);
      }


      const result = db.prepare(query).all(...params);

      db.close();
      return { success: true, data: result };
    } catch (error) {
      // console.error('[!] Error al filtrar datos:', error);
      return { success: false, error: error };
    }
}

export async function filtrarRequerimientoSectorRango(sector: string, fechaInicio: string, fechaFin: string) {
    try {
        const db = new Database('database.db');

        const query = `
            SELECT * 
            FROM requerimientos_repuestos 
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