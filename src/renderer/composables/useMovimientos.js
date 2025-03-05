import * as XLSX from "xlsx-js-style";
import { formatFechaDDMMYYYY, formatFechaToYYYYMMDD, validarFormatoFecha } from '../utils/funcionesFecha';
import { useToast } from "primevue/usetoast";
import logo from '../../resources/pdflogo.png'
import { formatearFecha } from '../utils/funcionesFecha'
import jsPDF from 'jspdf';

export function useMovimientos() {


    const toast = useToast();


    const obtenerMovimientos = async () => {

        try {
            const response = await window.electronAPI.obtenerMovimientos();
            // console.log('response', response.data)

            if (response.success) {
                // console.log('datos obtenidos correctamente', response.data)

                return { success: true, data: response.data }
            } else {
                throw new Error(response.error)
            }

        } catch (error) {

            console.log('no se pudieron traer los datos:', error)

            return { success: false }
        }

    }

    const guardarMovimiento = async (movimiento) => {
        try {
            const response = await window.electronAPI.guardarMovimiento(movimiento);
            console.log('response en guardar movimiento use movimietnos', response)
            if (response.success) {
                return { success: true, data: response.data }
            } else {
                throw new Error(response.error)
            }
        } catch (error) {
            return { success: false, error: error.message }
        }

    }


    const importarExcel = async (event) => {
        return new Promise((resolve, reject) => {

            const file = event.files[0]; // Obtener el archivo seleccionado
            if (!file) {
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

            if (response.success) {

                return { success: true, data: response.data }

            }
        } catch (error) {
            console.error("Error al reemplazar datos en la base de datos:", error);
            return { success: false, }
        }
    };


    const generarPdf = (datosFormulario) => {
 return new Promise((resolve, reject) => {
        // console.log('datosFormulario useMovimientos', datosFormulario)

        const { numero_movimiento, fecha, tipo_movimiento, origen, destino, cantidad, permiso_trabajo_asociado, informe_asociado, orden_trabajo_asociada, remito, numero_almacenes, material_repuesto, marca, modelo_serie, observaciones, id } = datosFormulario;

        // if (!registroGuardado.value) {
        //     toast.add({ severity: 'warn', summary: 'Error', detail: 'Debe guardar el registro antes de generar el PDF', life: 3000 });
        //     return
        // }

        const doc = new jsPDF('p', 'mm', 'a4');


        //RECTANGULO INPUTS SUPERIORES
        doc.rect(3, 30, 204, 210)

        //RECTANGULO GENERAL 
        // Definir las dimensiones del documento (tamaño carta en puntos)
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        // Margen deseado
        const margin = 2; // en puntos
        // Dibujar el rectángulo de los márgenes
        doc.rect(
            margin,                // Coordenada X inicial
            margin,                // Coordenada Y inicial
            pageWidth - 2 * margin, // Ancho del rectángulo
            pageHeight - 2 * margin // Alto del rectángulo
        );

        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold');
        doc.rect(173, 6, 30, 5) //rectangulo fecha
        doc.text(`FECHA: `, 159, 10);
        doc.setFont('helvetica', 'normal');
        doc.text(`${formatearFecha(fecha)}`, 176, 10);
        // doc.text(`${fecha}`, 176, 10);


        doc.setFont('helvetica', 'bold');
        doc.rect(173, 17, 30, 5) //rectangulo n° req
        doc.text(`N° INFORME:`, 151, 21)
        doc.setFont('helvetica', 'normal');
        doc.text(`${numero_movimiento}`, 176, 21)

        doc.setFont('helvetica', 'bold');
        doc.text(`TIPO DE MOVIMIENTO: `, 7, 40);
        doc.rect(47, 36, 60, 5) //rec codigo informe
        doc.setFont('helvetica', 'normal');
        doc.text(`${tipo_movimiento}`, 49, 40)

        doc.setFont('helvetica', 'bold');
        doc.text(`CANTIDAD: `, 120, 40);
        doc.rect(144, 36, 60, 5) //rec codigo informe
        doc.setFont('helvetica', 'normal');
        doc.text(`${cantidad}`, 146, 40)


        doc.setFont('helvetica', 'bold');
        doc.text(`MATERIAL / REPUESTO:`, 7, 50)
        doc.rect(47, 46, 157, 5)
        doc.setFont('helvetica', 'normal');
        doc.text(`${material_repuesto}`, 49, 50)


        doc.setFont('helvetica', 'bold');
        doc.text(`MARCA:`, 7, 60)
        doc.rect(47, 56, 157, 5)
        doc.setFont('helvetica', 'normal');
        doc.text(`${marca}`, 49, 60)


        doc.setFont('helvetica', 'bold');
        doc.text(`MODELO / SERIE:`, 7, 70)
        doc.rect(47, 66, 157, 5)
        doc.setFont('helvetica', 'normal');
        doc.text(`${modelo_serie}`, 49, 70)

        doc.setFont('helvetica', 'bold');
        doc.text(`ORIGEN:`, 7, 80)
        doc.rect(47, 76, 157, 5)
        doc.setFont('helvetica', 'normal');
        doc.text(`${origen}`, 49, 80)

        doc.setFont('helvetica', 'bold');
        doc.text(`DESTINO:`, 7, 90)
        doc.rect(47, 86, 157, 5)
        doc.setFont('helvetica', 'normal');
        doc.text(`${destino}`, 49, 90)


        doc.setFont('helvetica', 'bold');
        doc.text(`PERMISO DE TRABAJO ASOCIADO:`, 7, 110)
        doc.rect(67, 106, 137, 5)
        doc.setFont('helvetica', 'normal');
        doc.text(`${permiso_trabajo_asociado || ''}`, 69, 110);

        doc.setFont('helvetica', 'bold');
        doc.text(`ORDEN DE TRABAJO ASOCIADA:`, 7, 120)
        doc.rect(67, 116, 137, 5)
        doc.setFont('helvetica', 'normal');
        doc.text(`${orden_trabajo_asociada || ''}`, 69, 120)

        doc.setFont('helvetica', 'bold');
        doc.text(`INFORME ASOCIADO:`, 7, 130)
        doc.rect(67, 126, 137, 5)
        doc.setFont('helvetica', 'normal');
        doc.text(`${informe_asociado || ''}`, 69, 130)

        doc.setFont('helvetica', 'bold');
        doc.text(`REMITO:`, 7, 150)
        doc.rect(67, 146, 137, 5)
        doc.setFont('helvetica', 'normal');
        doc.text(`${remito || ''}`, 69, 150)

        doc.setFont('helvetica', 'bold');
        doc.text(`N° DE ALMACENES:`, 7, 160)
        doc.rect(67, 156, 137, 5)
        doc.setFont('helvetica', 'normal');
        doc.text(`${numero_almacenes || ''}`, 69, 160)


        // RECTÁNGULO OBSERVACIONES
        doc.setFont('helvetica', 'bold');
        // doc.rect(3, 190, 204, 80);
        doc.text(`OBSERVACIONES: `, 7, 180);
        doc.rect(7, 185, 196, 50);

        // Ajustar el texto dentro del rectángulo
        doc.setFont('helvetica', 'normal');
        const maxWidth = 188; // Ancho máximo del texto dentro del rectángulo
        const textLines = doc.splitTextToSize(observaciones || '', maxWidth);

        // // Imprimir el texto multilínea
        doc.text(textLines, 10, 191);



        doc.setFont('helvetica', 'bold');
        doc.text('Responsable de Inventario', 6, 290)
        doc.rect(5, 260, 55, 25)



        const appLogo = new Image();
        appLogo.src = logo;

        let response;
        appLogo.onload = async () => {
            doc.addImage(appLogo, 'PNG', 4, 7, 15, 15);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('REGISTRO DE MOVIMIENTO DE MATERIAL / REPUESTO', 22, 16);

            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const nombrePdf = `MOVINV-${yyyy}-${mm}-${dd}.pdf`;

            // doc.save(`${nombrePdf}`);

            // Obtenemos el contenido del PDF como ArrayBuffer
            const pdfArrayBuffer = doc.output('arraybuffer');

            try {
                const result = await window.electronAPI.guardarPdf(pdfArrayBuffer);
                resolve(result); // Resolvemos la promesa con el resultado obtenido
              } catch (error) {
                reject(error);
              }
           
        }
        appLogo.onerror = (err) => {
            reject(err);
          };


          
    })
}

    const obtenerUltimoMovimiento = async () => {
        try {
            const response = await window.electronAPI.obtenerUltimoMovimiento();
            if (response.success) {
                return { success: true, data: response.data };
            }
        } catch (error) {
            return { success: false }
        }
    }


    return {
        importarExcel,
        guardarExcelMovimientos,
        obtenerMovimientos,
        guardarMovimiento,
        generarPdf,
        obtenerUltimoMovimiento
    }

}