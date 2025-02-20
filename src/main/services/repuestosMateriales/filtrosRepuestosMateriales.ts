import Database from 'better-sqlite3';

export async function filtrarRepuestoDetalle(detalleRepuestoMaterial: string) {
    try {
      const db = new Database('database.db');
  
      const result = db
        .prepare('SELECT * FROM repuestos_materiales WHERE detalle_repuesto_material LIKE ?')
        .all(`%${detalleRepuestoMaterial}%`);
  
      db.close();
  
      return { success: true, data: result };
    } catch (error) {
      // console.error(error);
      return { success: false, error };
    }
  }

  export async function filtrarRepuestoMarca(marca: string) {
    try {
      const db = new Database('database.db');
  
      // Realizar la consulta filtrando por marca
      const result = db
        .prepare('SELECT * FROM repuestos_materiales WHERE marca LIKE ?')
        .all(`%${marca}%`);
  
      db.close();
  
      return { success: true, data: result };
    } catch (error) {
      // console.error(error);
      return { success: false, error };
    } 
  }

  export async function filtrarRepuestoModelo(modelo: string) {
    try {
      const db = new Database('database.db');
  
      // Realizar la consulta filtrando por modelo
      const result = db
        .prepare('SELECT * FROM repuestos_materiales WHERE modelo LIKE ?')
        .all(`%${modelo}%`);
  
      db.close();
  
      return { success: true, data: result };
    } catch (error) {
      // console.error(error);
      return { success: false, error };
    }
  }
  