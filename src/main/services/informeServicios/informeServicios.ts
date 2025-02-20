
// src/main/services/informeServicios.ts
import sqlite3 from 'better-sqlite3';
import Database from 'better-sqlite3';

const DB_PATH = 'database.db';

export async function obtenerInformeServicios() {
  const db = new sqlite3(DB_PATH, { verbose: console.log });
  try {
    const query = `
    SELECT * FROM informe_servicios 
    ORDER BY CAST(SUBSTR(numero_informe, 1, INSTR(numero_informe || '-', '-') - 1) AS INTEGER) DESC,
             numero_informe DESC;
  `;

    const result = db.prepare(query).all();

    // Cambiar el formato de la fecha en cada objeto
    const updatedResult = result.map(item => {
      const [year, month, day] = item.fecha.split('-');
      item.fecha = `${day}/${month}/${year}`;
      return item;
    });

    return { success: true, data: updatedResult };

  } catch (error) {
    console.error('[!] Error al obtener datos:', error);
    return { success: false, error: error };
  } finally {
    db.close();
  }
}


export async function guardarInforme(data) {
  try {

    const db = new Database('database.db');


    const registroExistente = db.prepare(`
        SELECT * FROM informe_servicios WHERE numero_informe = ?
      `).get(data.numeroInforme);


    if (registroExistente) {
      db.close();

      return { success: false, error: 'numero de informe repetido.' };
    }

    // Proceder con la inserción si no se encuentra ningún informe con el mismo numero_informe
    const insert = db.prepare(`
        INSERT INTO informe_servicios 
        (numero_informe, fecha, nombre_codigo, permiso_trabajo, planta, sector_intervenido, tipo_servicio, solicitante, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?,  CURRENT_TIMESTAMP)
      `);

    const result = insert.run(
      data.numeroInforme,
      data.fecha,
      data.codigoInforme,
      data.numeroPermiso,
      data.planta,
      data.sector,
      data.servicio,
      data.solicitante
    );

    const nuevoInforme = {
      id: result.lastInsertRowid,
      numero_informe: data.numeroInforme,
      fecha: data.fecha.split('-').reverse().join('-'), //se convierte la fecha de YYYY-MM-DD a DD-MM-YYYY 
      nombre_codigo: data.codigoInforme,
      permiso_trabajo: data.numeroPermiso,
      planta: data.planta,
      sector_intervenido: data.sector,
      tipo_servicio: data.servicio,
      solicitante: data.solicitante
    };

    db.close();

    return { success: true, data: nuevoInforme };
  } catch (error) {
    console.error('[!] Error al insertar datos:', error);
    return { success: false, error: error };
  }
}
export async function guardarInformesExcel(data) {
  const db = new Database('database.db');

  try {
    for (const informe of data) {
      const camposRequeridos = [
        'numero_informe', 'fecha', 'nombre_codigo', 'permiso_trabajo', 'planta', 'sector_intervenido', 'tipo_servicio', 'solicitante'
      ];

      // Recorre los campos requeridos
      for (const campo of camposRequeridos) {
        if (!informe[campo]) {
          console.error(`[!] Campo vacío: ${campo}, informe[campo]: ${informe[campo]}`);
          let campoIncompleto;

          switch (campo) {
            case 'numero_informe':
              campoIncompleto = 'INFORME';
              break;
            case 'fecha':
              campoIncompleto = 'FECHA';
              break;
            case 'nombre_codigo':
              campoIncompleto = 'CÓDIGO';
              break;
            case 'permiso_trabajo':
              campoIncompleto = 'PERMISO';
              break;
            case 'planta':
              campoIncompleto = 'PLANTA';
              break;
            case 'sector_intervenido':
              campoIncompleto = 'SECTOR';
              break;
            case 'tipo_servicio':
              campoIncompleto = 'TIPO SERVICIO';
              break;
            case 'solicitante':
              campoIncompleto = 'SOLICITANTE';
              break;
            default:
              campoIncompleto = 'Campo desconocido';
              break;
          }

          return { success: false, error: 'Campos incompletos', campoIncompleto };
        }
      }
    }



    // Eliminar todos los registros existentes
    db.prepare(`DELETE FROM informe_servicios`).run();

    // Preparar la inserción de nuevos datos
    const insert = db.prepare(`
      INSERT INTO informe_servicios 
      (numero_informe, fecha, nombre_codigo, permiso_trabajo, planta, sector_intervenido, tipo_servicio, solicitante, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    const insertMany = db.transaction((informes) => {
      for (const informe of informes) {
        insert.run(
          informe.numero_informe,
          informe.fecha,
          informe.nombre_codigo,
          informe.permiso_trabajo,
          informe.planta,
          informe.sector_intervenido,
          informe.tipo_servicio,
          informe.solicitante
        );
      }
    });

    insertMany(data);

    // Obtener los datos insertados junto con el ID generado
    const insertedData = db.prepare(`SELECT * FROM informe_servicios 
    ORDER BY CAST(SUBSTR(numero_informe, 1, INSTR(numero_informe || '-', '-') - 1) AS INTEGER) DESC,
             numero_informe DESC`).all();

    if (insertedData.length === 0) {
      return { success: false, error: "No se insertaron los datos" };
    }

    return { success: true, data: insertedData };


    return { success: true };
  } catch (error) {
    console.error('[!] Error al reemplazar datos:', error);
    return { success: false, error: error };
  } finally {
    db.close();

  }
}

export async function agregarHipervinculoPermiso(data) {
  const { id_informe, hipervinculo_permiso_trabajo } = data;

  const db = new Database("database.db");
  try {

    const stmt = db.prepare(`
      UPDATE informe_servicios 
      SET hipervinculo_permiso_trabajo = ?
      WHERE id = ?
    `);

    const result = stmt.run(hipervinculo_permiso_trabajo, id_informe);

    if (result.changes === 0) {
      throw new Error("No se encontró el requerimiento con el número proporcionado.");
    }

    return { success: true };

  } catch (error) {
    console.error("Error al guardar la referencia externa:", error);
    return { success: false, error };
  } finally {
    db.close();
  }

}

export async function eliminarInforme(id) {

  const db = new Database('database.db');
  try {

    const result = db.prepare(`DELETE FROM informe_servicios WHERE id = ?`).run(id);

    if (result.changes === 0) {
      return { success: false, error: 'No se encontró el informe' }
    }

    return { success: true };

  } catch (error) {

    console.error("Error al eliminar el informe:", error);
    return { success: false, error: error };

  } finally {
    db.close();
  }
}

export async function actualizarInforme(informeRegistro) {
  const { id, fecha, nombre_codigo, permiso_trabajo, sector_intervenido, tipo_servicio, numero_informe, planta, solicitante } = informeRegistro;

  const db = new Database('database.db');


  try {
    const result = db.prepare(`UPDATE informe_servicios SET fecha = ?, nombre_codigo = ?, permiso_trabajo = ?, planta = ?, sector_intervenido = ?, tipo_servicio = ?, solicitante = ?, numero_informe = ? WHERE id = ?`).run(fecha, nombre_codigo, permiso_trabajo, planta, sector_intervenido, tipo_servicio, solicitante, numero_informe, id);

    if (result.changes === 0) {
      return { success: false, error: 'No se encontró el informe' }
    }
    return { success: true };

  } catch (error) {
    return { success: false, error: error };
  } finally {
    db.close();
  }

}