import * as XLSX from "xlsx-js-style";
import { formatFechaDDMMYYYY, formatFechaToYYYYMMDD, validarFormatoFecha } from '../utils/funcionesFecha';
import { useToast } from "primevue/usetoast";


export function useMovimientos() {


    const toast = useToast();


    const obtenerMovimientos = async () => {

        try {
            const response = await window.electronAPI.obtenerMovimientos();
            // console.log('response', response.data)

            if(response.success){
                // console.log('datos obtenidos correctamente', response.data)

                return {success: true, data: response.data}
            }else{
                throw new Error(response.error)
            }

        } catch (error) {
            
            console.log('no se pudieron traer los datos:', error)
            
            return {success: false}
        }

    }

    const guardarMovimiento = async (movimiento) => {
        try {
            const response = await window.electronAPI.guardarMovimiento(movimiento);
            
            if(response.success){
                return {success: true, data: response.data}
            }
        } catch (error) {
            return {succes: false}
        }

     }


    const importarExcel = async (event) => {
        return new Promise((resolve, reject) => {

        const file = event.files[0]; // Obtener el archivo seleccionado
        if (!file){
            return reject({ success: false, message: "No se proporcionó archivo" });
        } 


        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result); // Leer los datos binarios
            // Se activa cellDates para que las celdas con fechas se conviertan a objetos Date
            const workbook = XLSX.read(data, { type: "array", cellDates: true }); // Procesar el archivo Excel

            // Leer la primera hoja del archivo
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Usamos raw: true para que las celdas con fechas se mantengan como objetos Date y no se formateen automáticamente
            const jsonData = XLSX.utils.sheet_to_json(sheet, { raw: true });

            // Obtener las columnas desde la primera fila
            const primeraFila = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] || [];

            // Normalizar las columnas a minúsculas para comparación
            const primeraFilaNormalizada = primeraFila.map(col => col.toLowerCase());


            // Definir las columnas requeridas
            const columnasRequeridas = ["FECHA", "ID", "MOVIMIENTO", "DESTINO", "ORIGEN", "MATERIAL/REPUESTO", "MARCA", "MODELO/SERIE", "CANTIDAD", "PT ASOCIADO", "INFORME ASOCIADO", "OT ASOCIADA", "REMITO", "N° ALMACENES"];

            // Normalizar columnas requeridas a minúsculas
            const columnasRequeridasNormalizadas = columnasRequeridas.map(col => col.toLowerCase());

            // Verificar si falta alguna columna después de normalizar
            const columnasFaltantes = columnasRequeridasNormalizadas.filter(
                columna => !primeraFilaNormalizada.includes(columna)
            );

            if (columnasFaltantes.length > 0) {
                // toast.add({
                //     severity: "error", summary: "No se cargaron los datos", detail: `Faltan las siguientes columnas en el archivo excel: ${columnasFaltantes.join(", ")}`,
                //     life: 6000
                // });

                return resolve({ success: false, message: "Faltan columnas" });
            }

            // Formatear los datos para el DataTable
            let fechasInvalidas = [];
            const formattedData = jsonData.map((row) => {

                const normalizedRow = {}; // Objeto para almacenar los datos normalizados (pasamos las claves a minusculas )

                // Iterar sobre las columnas y normalizar las claves
                Object.keys(row).forEach(key => {
                    const normalizedKey = key.toLowerCase(); // Normalizar la clave a minúsculas
                    normalizedRow[normalizedKey] = row[key] !== undefined && row[key] !== null && row[key] !== "" ? row[key] : null; // Asignar valor 

                    //row es cada fila del excel representada por un JSON {Fecha: '21/21/2021', ...}
                    //key es cada clave de este json, por ej 'Fecha'
                    //row[key] es el valor de esa key, en este caso '21/21/2021'
                    if (normalizedKey == 'fecha') {
                        if (!validarFormatoFecha(row[key])) {
                            fechasInvalidas.push({ columna: normalizedKey.toUpperCase(), fechaInvalida: row[key] })
                        }
                    }


                });

                return {
                    // id // fecha // tipo_movimiento // origen // destino // material_repuesto // marca // articulo_id // cantidad // permiso_trabajo_asociado
                    // informe_asociado // orden_trabajo_asociada // remito // numero_almacenes // numero_serie // instrumento// numero_movimiento 
                    // modelo_serie

                    // Convertir la fecha al formato YYYY-MM-DD para guardar en la base de datos
                    fecha: normalizedRow["fecha"] ? formatFechaToYYYYMMDD(normalizedRow["fecha"]) : null,
                    numero_movimiento: normalizedRow["id"], //no confundir id con numero_movimiento
                    tipo_movimiento: normalizedRow["movimiento"],
                    origen: normalizedRow["origen"],
                    destino: normalizedRow["destino"],
                    material_repuesto: normalizedRow["material/repuesto"],
                    marca: normalizedRow["marca"],
                    modelo_serie: normalizedRow["modelo/serie"],
                    cantidad: normalizedRow["cantidad"],
                    permiso_trabajo_asociado: normalizedRow["pt asociado"],
                    informe_asociado: normalizedRow["informe asociado"],
                    orden_trabajo_asociada: normalizedRow["ot asociada"],
                    remito: normalizedRow["remito"],
                    numero_almacenes: normalizedRow["n° almacenes"]
                }
            });


            if (fechasInvalidas.length > 0) {
                const columnasInvalidas = [...new Set(fechasInvalidas.map(item => item.columna))];
                const mensaje = `Se encontraron fechas con un formato distinto a 'DD/MM/YYYY' en las siguientes columnas: ${columnasInvalidas.map(col => `"${col}"`).join(", ")}`;
                toast.add({ severity: "error", summary: "Fechas Inválidas", detail: mensaje, life: 9000 });
                return resolve({ success: false, message: "Fechas inválidas" });
            }



            // Intentar reemplazar los datos en la base de datos
            try {
                const response = await guardarExcelMovimientos(formattedData);

                if (response.success) {
                    // Solo si el reemplazo es exitoso, formatear las fechas para el frontend
                    const movimientos = response.data.map((row) => ({
                        ...row,
                        fecha: row.fecha ? formatFechaDDMMYYYY(row.fecha) : null, // Renderizar como DD-MM-YYYY
                    }));
                  
                    resolve({ success: true, data: movimientos });

                } else {
                    reject({ success: false });
                //    throw new Error(); 
                    // if (response.error == 'Campos incompletos') {
                    //     if (response.campoIncompleto == 'Campo desconocido') {
                  
                    //         return {success: false, campoIncompleto: 'columna desconocida'}
                  
                    //     } else {
                  
                    //         console.log(' fail')
                    //         return {success: false, campoIncompleto: response.campoIncompleto}
                    //     }
                    // }
                }
            } catch (error) {
                console.error(error);
                reject({ success: false, error });
            }
        };
        reader.onerror = (error) => {
            reject({ success: false, error });
          };
      
        reader.readAsArrayBuffer(file); // Leer el archivo como ArrayBuffer
     })
    };

    const guardarExcelMovimientos = async (data) => {
        try {
            const response = await window.electronAPI.guardarExcelMovimientos(data);

            if(response.success){

                return {success: true, data: response.data} 

            }
        } catch (error) {
            console.error("Error al reemplazar datos en la base de datos:", error);
            return {success: false,}
        }
    };

    return {
        importarExcel,
        guardarExcelMovimientos,
        obtenerMovimientos,
        guardarMovimiento
    }

}