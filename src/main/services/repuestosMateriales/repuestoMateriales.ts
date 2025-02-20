import sqlite3 from 'better-sqlite3';
import Database from 'better-sqlite3';


export async function obtenerRepuestosMateriales() {

  try {
    const db = new Database('database.db');
    const result = db.prepare('SELECT * FROM repuestos_materiales ORDER BY numero_almacen_ypf DESC  ').all();

    return { success: true, data: result };

  } catch (error) {
    // console.error('[!] Error al obtener datos:', error);
    return { success: false, error: error };
  }
}
export async function guardarRepuestosMateriales(data) {
  try {
    if (
      !data.numeroAlmacenYPF ||
      !data.detalleRepuestoMaterial ||
      !data.marca ||
      !data.modelo
    ) {
      throw new Error('Todos los campos (numeroAlmacenYPF, detalleRepuestoMaterial, marca, modelo) son obligatorios.');
    }

    const db = new Database('database.db');

    const insert = db.prepare(`
          INSERT INTO repuestos_materiales 
          (numero_almacen_ypf, detalle_repuesto_material, marca, modelo) 
          VALUES (?, ?, ?, ?)
        `);

    const result = insert.run(
      data.numeroAlmacenYPF,
      data.detalleRepuestoMaterial,
      data.marca,
      data.modelo
    );

    const nuevoRegistro = {
      id: result.lastInsertRowid,
      numero_almacen_ypf: data.numeroAlmacenYPF,
      detalle_repuesto_material: data.detalleRepuestoMaterial,
      marca: data.marca,
      modelo: data.modelo,
    };

    db.close();

    // Retorna el objeto al frontend
    return { success: true, data: nuevoRegistro };
  } catch (error) {
    // console.error('[!] Error al insertar datos en repuestos_materiales:', error);
    return { success: false, error: error };
  }
}

export async function guardarRepuestosExcel(data) {
  const db = new Database("database.db");

  try {

    for (const repuesto of data) {
      const camposRequeridos = [
        'numero_almacen_ypf', 'detalle_repuesto_material', 'marca', 'modelo'
      ];

      // Recorre los campos requeridos
      for (const campo of camposRequeridos) {
        if (!repuesto[campo]) {

          let campoIncompleto;

          switch (campo) {
            case 'numero_almacen_ypf':
              campoIncompleto = 'Número Almacenes YPF';
              break;
            case 'detalle_repuesto_material':
              campoIncompleto = 'ítem / Material';
              break;
            case 'marca':
              campoIncompleto = 'Marca';
              break;
            case 'modelo':
              campoIncompleto = 'Modelo';
              break;
            default:
              campoIncompleto = 'Campo desconocido';
              break;
          }

          return { success: false, error: 'Campos incompletos', campoIncompleto };



        }
      }
    }

    // Eliminar todos los registros existentes en la tabla 'repuesto_materiales'
    db.prepare("DELETE FROM repuestos_materiales").run();



    // Preparar la inserción de nuevos datos
    const insert = db.prepare(
      `INSERT INTO repuestos_materiales 
      (numero_almacen_ypf, detalle_repuesto_material, marca, modelo, creado_en) 
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`
    );

    const insertMany = db.transaction((repuestos) => {
      for (const repuesto of repuestos) {
        insert.run(
          repuesto.numero_almacen_ypf,
          repuesto.detalle_repuesto_material,
          repuesto.marca,
          repuesto.modelo
        );
      }
    });

    insertMany(data);


    // Obtener los datos insertados junto con el ID generado
    const insertedData = db.prepare("SELECT * FROM repuestos_materiales").all();

    if (insertedData.length === 0) {
      return { success: false, error: "No se insertaron los datos" };
    }

    return { success: true, data: insertedData };


  } catch (error) {
    // console.error("[!] Error al reemplazar datos:", error);
    return { success: false, error: error };
  } finally {
    db.close();

  }
}

export const eliminarRepuestoMaterial = async (repuestoMaterialId) => {

  const db = new Database('database.db');
  try {

    const result = db.prepare('DELETE FROM repuestos_materiales WHERE id = ?').run(repuestoMaterialId);


    if (result.changes === 0) {
      throw new Error('No se encontró el repuesto material con el ID proporcionado.');
    }

    return { success: true };

  } catch (error) {
    // console.error('[!] Error al eliminar repuesto material:', error);
    return { success: false, error: error };
  } finally {
    db.close();
  }

}
export const actualizarRepuestoMaterial = async (repuestoMaterial) => {

  const { id, numero_almacen_ypf, detalle_repuesto_material, marca, modelo } = repuestoMaterial;


  const db = new Database('database.db');

  try {
    const result = db.prepare(`
      UPDATE repuestos_materiales 
      SET numero_almacen_ypf = ?, detalle_repuesto_material = ?, marca = ?, modelo = ?
      WHERE id = ?
    `).run(numero_almacen_ypf, detalle_repuesto_material, marca, modelo, id);

    if (result.changes === 0) {
      throw new Error('No se encontró el repuesto material con el ID proporcionado.');
    }

    return { success: true };

  } catch (error) {
    return { success: false, error: error };
  }
  finally {
    db.close();
  }

}
