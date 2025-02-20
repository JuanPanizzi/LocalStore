import Database from 'better-sqlite3';
import { formatFecha } from '../../utils/funcionesFecha'



export async function obtenerCorrectivos() {
  const db = new Database('database.db');
  try {

    const result = db.prepare('SELECT * FROM correctivos ORDER BY fecha DESC').all();
 
    // Cambiar el formato de las fechas en cada objeto
    const updatedResult = result.map(item => ({
      ...item,
      fecha: formatFecha(item.fecha),
      fecha_intervencion: formatFecha(item.fecha_intervencion),
      fecha_referencia: formatFecha(item.fecha_referencia),
    }));

    return { success: true, data: updatedResult };

  } catch (error) {
    // console.error('[!] Error al obtener datos:', error);
    return { success: false, error: error };
  } finally {
    db.close();

  }
}

export async function actualizarCorrectivo(correctivo) { 

  const { id, fecha, solicitante, planta, sector, sistemas, tipo_numero_permiso_trabajo, repuesto_material, marca, modelo, fecha_intervencion, dias_transcurridos, nivel_criticidad, plazo_estimado, plazo_cumplido,   fecha_referencia, orden_trabajo, documento_intervencion } = correctivo;


const db = new Database('database.db');

try {
  
  const result = db.prepare(`UPDATE correctivos SET fecha = ?, solicitante = ?, planta = ?, sector = ?, sistemas = ?, tipo_numero_permiso_trabajo = ?, repuesto_material = ?, marca = ?, modelo = ?, fecha_intervencion = ?, dias_transcurridos = ?, nivel_criticidad = ?, plazo_estimado = ?, plazo_cumplido = ?,   fecha_referencia = ?,   orden_trabajo = ?,  documento_intervencion = ? WHERE id = ?`).run(fecha, solicitante, planta, sector, sistemas, tipo_numero_permiso_trabajo, repuesto_material, marca, modelo, fecha_intervencion, dias_transcurridos, nivel_criticidad, plazo_estimado, plazo_cumplido,  fecha_referencia, orden_trabajo, documento_intervencion, id);

  if(result.changes === 0) {
    return { success: false, error: 'No se pudo actualizar el correctivo' };
  }

  return { success: true };

} catch (error) {
  // console.log("Error al actualizar el informe:", error);
  
  return { success: false, error: error };

} finally {
  db.close();
}

}

export async function guardarCorrectivos(data: any) {
  
  const db = new Database('database.db');
  try {

    const insert = db.prepare(`
        INSERT INTO correctivos
        (fecha, solicitante, planta, sector, sistemas, tipo_numero_permiso_trabajo, repuesto_material, marca, modelo, documento_intervencion, fecha_intervencion, fecha_referencia, dias_transcurridos, orden_trabajo, nivel_criticidad, plazo_estimado, plazo_cumplido, documento_referencia, observaciones)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

    const result = insert.run(
      data.fecha,
      data.solicitante,
      data.planta,
      data.sector,
      data.sistemas,
      data.tipo_numero_permiso_trabajo,
      data.repuesto_material,
      data.marca,
      data.modelo,
      data.documento_intervencion,
      data.fecha_referencia,
      data.fecha_intervencion,
      data.dias_transcurridos,
      data.orden_trabajo,
      data.nivel_criticidad,
      data.plazo_estimado,
      data.plazo_cumplido,
      data.documento_referencia,
      data.observaciones
    );

    const nuevoRegistro = {
      id: result.lastInsertRowid,
      fecha: data.fecha,
      solicitante: data.solicitante,
      planta: data.planta,
      sector: data.sector,
      sistemas: data.sistemas,
      tipo_numero_permiso_trabajo: data.tipo_numero_permiso_trabajo,
      repuesto_material: data.repuesto_material,
      marca: data.marca,
      modelo: data.modelo,
      documento_intervencion: data.documento_intervencion,
      fecha_referencia: data.fecha_referencia,
      fecha_intervencion: data.fecha_intervencion,
      dias_transcurridos: data.dias_transcurridos,
      orden_trabajo: data.orden_trabajo,
      nivel_criticidad: data.nivel_criticidad,
      plazo_estimado: data.plazo_estimado,
      plazo_cumplido: data.plazo_cumplido,
      documento_referencia: data.documento_referencia,
      observaciones: data.observaciones,
    };

    return { success: true, data: nuevoRegistro };

  } catch (error) {
    // console.error('[!] Error al insertar datos:', error);
    return { success: false, error: error };
  } finally {
    db.close();
  }
}

export async function guardarCorrectivosExcel(data) {

  // console.log('data a ahora reemplazar bd', data);
  
  const db = new Database('database.db');

  try {

    for (const correctivo of data) {
      const camposRequeridos = [
        'fecha', 'solicitante', 'planta', 'sector', 'sistemas', 'tipo_numero_permiso_trabajo',
        'repuesto_material', 'marca', 'modelo', 'documento_intervencion', 'fecha_intervencion',
        'dias_transcurridos', 'orden_trabajo', 'nivel_criticidad', 'plazo_estimado', 'plazo_cumplido', 
        'fecha_referencia',
        // 'documento_referencia' 
      ];

      // Recorre los campos requeridos
      for (const campo of camposRequeridos) {
        if (correctivo[campo] === null || correctivo[campo] === undefined || correctivo[campo] === '' || (!isNaN(correctivo[campo]) && correctivo[campo] < 0 )) {
          // console.error(`[!] Campo vacío: ${campo}, correctivo[campo]`, correctivo[campo], 'correctivo', correctivo);
          let campoIncompleto;

          switch (campo) {
            case 'fecha':
              campoIncompleto = 'Fecha';
              break;
            case 'solicitante':
              campoIncompleto = 'Área Solicitante';
              break;
            case 'planta':
              campoIncompleto = 'Planta Intervenida';
              break;
            case 'sector':
              campoIncompleto = 'Sector Intervenido';
              break;
            case 'sistemas':
              campoIncompleto = 'Sistemas Informados';
              break;
            case 'tipo_numero_permiso_trabajo':
              campoIncompleto = 'Tipo y N° Permiso Trabajo';
              break;
            case 'repuesto_material':
              campoIncompleto = 'Repuesto / Material Utilizado';
              break;
            case 'marca':
              campoIncompleto = 'Marca';
              break;
            case 'modelo':
              campoIncompleto = 'Modelo';
              break;
            case 'documento_intervencion':
              campoIncompleto = 'Documento Intervención';
              break;
            case 'fecha_intervencion':
              campoIncompleto = 'Fecha Intervención';
              break;
            case 'fecha_referencia':
              campoIncompleto = 'Fecha Referencia';
              break;
            case 'dias_transcurridos':
              campoIncompleto = 'Días Transcurridos';
              break;
            case 'orden_trabajo':
              campoIncompleto = 'órden de Trabajo';
              break;
            case 'nivel_criticidad':
              campoIncompleto = 'Nivel Criticidad';
              break;
            case 'plazo_estimado':
              campoIncompleto = 'Plazo Estimado de Ejecución';
              break;
            case 'plazo_cumplido':
              campoIncompleto = 'Plazo Cumplido';
              break;
            // case 'documento_referencia':
            //   campoIncompleto = 'Documento Referencia';
            //   break;
            default:
              campoIncompleto = 'Campo desconocido';
              break;
          }

          return { success: false, error: 'Campos incompletos', campoIncompleto };
        }
      }
    }


    // Eliminar todos los registros existentes
    db.prepare(`DELETE FROM correctivos`).run();

    // Preparar la inserción de nuevos datos (no se esta pasando documento_referencia ni observaciones)
    const insert = db.prepare(`
      INSERT INTO correctivos 
      (fecha, solicitante, planta, sector, sistemas, tipo_numero_permiso_trabajo, 
       repuesto_material, marca, modelo, documento_intervencion, fecha_intervencion, 
       dias_transcurridos, orden_trabajo, nivel_criticidad, plazo_estimado, plazo_cumplido, 
      created_at,  fecha_referencia) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  CURRENT_TIMESTAMP, ?)
    `);

    const insertMany = db.transaction((correctivos) => {
      for (const correctivo of correctivos) {
        insert.run(
          correctivo.fecha,
          correctivo.solicitante,
          correctivo.planta,
          correctivo.sector,
          correctivo.sistemas,
          correctivo.tipo_numero_permiso_trabajo,
          correctivo.repuesto_material,
          correctivo.marca,
          correctivo.modelo,
          correctivo.documento_intervencion,
          correctivo.fecha_intervencion,
          correctivo.dias_transcurridos,
          String(correctivo.orden_trabajo),
          correctivo.nivel_criticidad,
          correctivo.plazo_estimado,
          correctivo.plazo_cumplido,
          // correctivo.observaciones,
          // correctivo.documento_referencia,
          correctivo.fecha_referencia
        );
      }
    });

    insertMany(data);

      // Obtener los datos insertados junto con el ID generado
      const insertedData = db.prepare("SELECT * FROM correctivos").all();

      if (insertedData.length === 0) {
        return { success: false, error: "No se insertaron los datos" };
      }

     return { success: true, data: insertedData };


  } catch (error) {
    console.error('[!] Error al reemplazar datos:', error);
    return { success: false, error: error };
  } finally {
    db.close();

  }
}

export const eliminarCorrectivo = async (correctivoId: string | number) => {
  
  const db = new Database('database.db');
  try {

    const result = db.prepare('DELETE FROM correctivos WHERE id = ?').run(correctivoId);


    if(result.changes === 0) {
      return { success: false, error: 'No se pudo eliminar el correctivo' };
    }

    return { success: true };

  } catch (error) {
    
    // console.error('[!] Error al eliminar el correctivo:', error);
    return { success: false, error: error };

  } finally {
    db.close();
  }
}