import * as XLSX from "xlsx-js-style";
import { formatFechaToYYYYMMDD, validarFormatoFecha } from '../utils/funcionesFecha';
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

    const importarExcel = async (event) => {


        const file = event.files[0]; // Obtener el archivo seleccionado
        if (!file) return;

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
                toast.add({
                    severity: "error", summary: "No se cargaron los datos", detail: `Faltan las siguientes columnas en el archivo excel: ${columnasFaltantes.join(", ")}`,
                    life: 6000
                });

                return;
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
                return;
            }



            // Intentar reemplazar los datos en la base de datos
            try {
                const response = await guardarExcelMovimientos(formattedData);

                if (response.success) {
                    // Solo si el reemplazo es exitoso, formatear las fechas para el frontend
                    dataInformeServicios.value = response.data.map((row) => ({
                        ...row,
                        fecha: row.fecha ? formatFechaDDMMYYYY(row.fecha) : null, // Renderizar como DD-MM-YYYY
                    }));
                    console.log('exito')
                    toast.add({ severity: "success", summary: "Éxito", detail: "Datos cargados correctamente.", life: 3000 });

                } else {

                    if (response.error == 'Campos incompletos') {
                        if (response.campoIncompleto == 'Campo desconocido') {
                            toast.add({ severity: "error", summary: `Error al cargar los datos`, detail: "El archivo excel posee datos incompletos.", life: 5000 });
                        } else {
                            console.log(' fail')
                            toast.add({ severity: "error", summary: `Error al cargar los datos`, detail: `El archivo excel posee datos incompletos, revisar los datos de la columna "${response.campoIncompleto}".`, life: 6000 });
                        }
                    }
                }
            } catch (error) {
                console.log(' fail 2')

                console.error(error);
                toast.add({ severity: "error", summary: "Error", detail: "Error al cargar los datos, intente nuevamente.", life: 3000 });
            }
        };

        reader.readAsArrayBuffer(file); // Leer el archivo como ArrayBuffer
    };

    const guardarExcelMovimientos = async (data) => {
        try {
            const response = await window.electronAPI.guardarExcelMovimientos(data);
            return response; // Devuelve `true` si fue exitoso
        } catch (error) {
            console.error("Error al reemplazar datos en la base de datos:", error);
            return false; // Devuelve `false` si hubo algún error
        }
    };

    return {
        importarExcel,
        guardarExcelMovimientos,
        obtenerMovimientos
    }

}