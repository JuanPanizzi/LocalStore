import * as XLSX from "xlsx-js-style";
import { formatFechaDDMMYYYY, formatFechaToYYYYMMDD, validarFormatoFecha, formatearFecha } from '../utils/funcionesFecha';
import { useToast } from "primevue/usetoast";
import logo from '../../resources/pdflogo.png'
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
export function useMovimientos() {


    const toast = useToast();


    const obtenerMovimientos = async () => {

        try {
            const response = await window.electronAPI.obtenerMovimientos();
            //console.log('response', response.data)

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

    const actualizarMovimiento = async (movimiento) => {
        try {
            const response = await window.electronAPI.actualizarMovimiento(movimiento);
            if (response.success) {
                return { success: true, data: response.data }
            } else {
                throw new Error();
            }
        } catch (error) {
            console.log('error en actualizar movimiento', error)
            return { success: false }
        }
    }

    const eliminarMovimiento = async (movimiento) => {

        try {
            const response = await window.electronAPI.eliminarMovimiento({ ...movimiento });
            if (response.success) {
                return { success: true, data: response.data }
            } else {
                throw new Error(response.error)
            }
        } catch (error) {
            console.log('error', error)
            return { success: false }
        }
    }

    const obtenerMovimientosArticulo = async (articulo_id) => {
        try {
            const response = await window.electronAPI.obtenerMovimientosArticulo(articulo_id);

            if (response.success) {
                return { success: true, data: response.data };
            } else {
                throw new Error();
            }
        } catch (error) {
            console.log('error', error);
            return { success: false };

        }
    }
    const guardarMovimiento = async (movimiento) => {
        try {
            const response = await window.electronAPI.guardarMovimiento(movimiento);
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
                        numero_almacenes: normalizedRow["n° almacenes"],
                        observaciones: normalizedRow["observaciones"],
                        unidad_medida: normalizedRow["unidad de medida"]

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

                        // Mostrar advertencias si existen
                        if (response.warnings && response.warnings.length > 0) {
                            response.warnings.forEach((msg) => {
                                toast.add({ severity: "warn", summary: "Advertencia", detail: msg, life: 6000 });
                            });
                        }

                        resolve({ success: true, data: movimientos });

                    } else {
                        reject({ success: false });
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

            const { numero_movimiento, fecha, tipo_movimiento, origen, destino, cantidad, permiso_trabajo_asociado, informe_asociado, orden_trabajo_asociada, remito, numero_almacenes, material_repuesto, marca, modelo_serie, observaciones, unidad_medida, cantidad_seleccionada, id } = datosFormulario;

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
            doc.rect(47, 36, 50, 5) //rec codigo informe
            doc.setFont('helvetica', 'normal');
            doc.text(`${tipo_movimiento}`, 49, 40)

            doc.setFont('helvetica', 'bold');
            doc.text(`CANTIDAD SELECCIONADA: `, 105, 40);
            doc.rect(154, 36, 50, 5) //rec codigo informe
            doc.setFont('helvetica', 'normal');
            doc.text(`${cantidad_seleccionada} ${unidad_medida || ''} `, 156, 40)


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


            appLogo.onload = async () => {
                doc.addImage(appLogo, 'PNG', 4, 7, 15, 15);
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('REGISTRO DE MOVIMIENTO', 22, 13);
                doc.text('DE MATERIAL / REPUESTO', 22, 19);

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

    const obtenerArticuloById = async (articuloId) => {

        try {
            const response = await window.electronAPI.obtenerArticuloById(articuloId);
            
            if(response.success){
                return {success: true, data: response.data}
            }else{
                throw new Error()
            }
            } catch (error) {
                return {success: false}
        }
    }

    const generarListadoPDF = async (movimientos) => {

        if (!movimientos || movimientos.length === 0) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No hay datos para generar el PDF', life: 3000 });
            return;
        }


        const { material_repuesto, marca, modelo_serie, articulo_id } = movimientos[0];

        const response = await obtenerArticuloById(articulo_id);

        if(!response.success){ 
            toast.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al generar el PDF, intente nuevamente.', life: 3000 });
            return;
        }

        const { cantidad: stock_articulo_seleccionado, unidad_medida } = response.data;

        

        const doc = new jsPDF("l", "mm", "a4"); // Cambiamos a orientación horizontal (landscape)

        // Agregar logo
        const appLogo = new Image();
        appLogo.src = logo;
        appLogo.onload = () => {
            doc.addImage(appLogo, "PNG", 6, 10, 20, 20);
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text(`HISTORIAL DE MOVIMIENTOS `, 29, 19);
            doc.text(`${material_repuesto?.toUpperCase()} - ${marca?.toUpperCase()} - ${modelo_serie?.toUpperCase()}`, 29, 26);

            doc.setFontSize(10);



            // doc.setFontSize(9)
            doc.setFont('helvetica', 'bold');
            doc.rect(260, 11, 30, 5); //rectangulo fecha
            doc.text(`FECHA: `, 245, 15);
            doc.setFont('helvetica', 'normal');
            doc.text(`${formatearFecha(new Date()) || '-'}`, 263, 15);

            // doc.text(`${formatearFecha(fechaActual.value)}`, 176, 10);


            doc.setFont('helvetica', 'bold');
            doc.rect(260, 22, 30, 5) //rectangulo n° req
            doc.text(`STOCK ARTÍCULO:`, 225, 26)
            doc.setFont('helvetica', 'normal');
            doc.text(`${stock_articulo_seleccionado} ${unidad_medida || ''}`, 263, 26)



            //   if (tipoFiltradoPdf.value) {
            //     doc.text(`FILTRADO POR ${tipoFiltradoPdf.value}`, doc.internal.pageSize.width / 2, 22, { align: "center" });
            //   }

            // Definir columnas y títulos
            const columnas = [
                { title: "FECHA", dataKey: "fecha" },
                { title: "MATERIAL / REPUESTO", dataKey: "material_repuesto" },
                { title: "MARCA", dataKey: "marca" },
                { title: "MODELO / SERIE", dataKey: "modelo_serie" },
                { title: "MOVIMIENTO", dataKey: "tipo_movimiento" },
                { title: "ORIGEN", dataKey: "origen" },
                { title: "DESTINO", dataKey: "destino" },
                { title: "CANTIDAD", dataKey: "cantidad" },
                { title: "UNIDAD", dataKey: "unidad_medida" },
                { title: "PT ASOCIADO", dataKey: "permiso_trabajo_asociado" },
                { title: "OT ASOCIADA", dataKey: "orden_trabajo_asociada" },
                { title: "INFORME ASOCIADO", dataKey: "informe_asociado" },
                { title: "REMITO", dataKey: "remito" },
                { title: "N° ALMACENES", dataKey: "numero_almacenes" },
                { title: "OBSERVACIONES", dataKey: "observaciones" },

            ];


            // Función para limpiar caracteres problemáticos en "documento_intervencion", "modelo", "marca"
            const limpiarTexto = (texto) => {
                if (!texto) return "-";
                return texto
                    .normalize("NFKD") // Normaliza caracteres Unicode
                    .replace(/[\u2010-\u2015]/g, "-") // Reemplaza guiones especiales con un guion normal
                    .replace(/\s+/g, " ") // Reemplaza múltiples espacios con un solo espacio
                    .trim(); // Elimina espacios innecesarios al inicio y al final
            };



            // Mapear los datos y limpiar el campo "documento_intervencion", "modelo", "marca"
            const filas = movimientos.map(item => {
                return columnas.reduce((obj, col) => {
                    let valor = item[col.dataKey];

                    // Si es el campo "fecha", formatearlo
                    if (col.dataKey === "fecha" && valor) {
                        valor = formatearFecha(valor);
                    }

                    // Aplicar la función de limpieza solo en "documento_intervencion", "modelo", "marca"
                    if (col.dataKey === "material_repuesto" || col.dataKey === "modelo_serie" || col.dataKey === "marca") {
                        valor = limpiarTexto(valor);
                    }

                    // Asegurar que el valor 0 no sea reemplazado por "-"
                    obj[col.dataKey] = (valor !== undefined && valor !== null) ? valor : "-";
                    return obj;
                }, {});
            });



            // Configurar tabla con mejores ajustes
            autoTable(doc, {
                startY: 40,
                head: [columnas.map(col => col.title)],
                body: filas.map(fila => columnas.map(col => fila[col.dataKey])),
                styles: { fontSize: 6, cellPadding: 1 },
                headStyles: { fillColor: [0, 128, 255], textColor: 255, fontStyle: "bold", fontSize: 6.5 },
                columnStyles: {
                    0: { cellWidth: 19 }, //Fecha
                    1: { cellWidth: 19 }, //material / repuesto
                    2: { cellWidth: 19 }, //marca
                    3: { cellWidth: 24 },//modelo
                    4: { cellWidth: 19 }, // movimiento
                    5: { cellWidth: 19 }, // origen
                    6: { cellWidth: 19 }, // destino
                    7: { cellWidth: 19 }, // cantidad
                    8: { cellWidth: 16 }, // unidad medida
                    9: { cellWidth: 19 }, // pt asociado
                    10: { cellWidth: 23 }, //  ot asociado 
                    11: { cellWidth: 24 }, // informe asociado
                    12: { cellWidth: 16 }, // remito
                    13: { cellWidth: 18 }, // n° almacenes
                    14: { cellWidth: 22 }, // observaciones
                },
                margin: { left: 1, right: 1 },
                theme: "grid"
            });

            // Guardar PDF
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            // const nombrePdf = tipoFiltradoPdf.value ? `INFCOR-${yyyy}-${mm}-${dd}-FILTRADO-POR-${tipoFiltradoPdf.value}.pdf` : `INFCOR-${yyyy}-${mm}-${dd}.pdf`;
            const nombrePdf = `INFMOV-${material_repuesto?.toUpperCase()}-${marca?.toUpperCase()}-${modelo_serie?.toUpperCase()}-FECHA-${yyyy}-${mm}-${dd}.pdf`;

            doc.save(nombrePdf);
        };
    };


    const exportarExcel = (datosFiltrados, tipoExcel) => {

        console.log('datosFiltrados', datosFiltrados)

        if (!datosFiltrados || datosFiltrados.length === 0) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No hay datos para generar el PDF', life: 3000 });
            return;
        }

        // Mapear los datos al formato requerido}
        const formattedData = datosFiltrados.map((item) => ({
            "Fecha": item.fecha ? formatearFecha(item.fecha) : "-",
            "ID": item.numero_movimiento || "-",
            "Movimiento": item.tipo_movimiento || "-",
            "Origen": item.origen || "-",
            "Destino": item.destino || "-",
            "Material/Repuesto": item.material_repuesto || "-",
            "Marca": item.marca || "-",
            "Modelo/Serie": item.modelo_serie || "-",
            "Cantidad": item.cantidad || "-",
            "Unidad de Medida": item.unidad_medida || "-",
            "PT Asociado": item.permiso_trabajo_asociado || "-",
            "Informe Asociado": item.informe_asociado,
            "OT Asociada": item.orden_trabajo_asociada || "-",
            "Remito": item.remito || "-",
            "N° Almacenes": item.numero_almacenes || "-",
            "Observaciones": item.observaciones || "-",

        }));

        // Crear una hoja de trabajo (worksheet)
        const worksheet = XLSX.utils.json_to_sheet(formattedData);

        // Estilo para el encabezado
        const headerStyle = {
            fill: {
                patternType: "solid",
                fgColor: { rgb: "FF4F81BD" }, // Fondo azul correcto
            },
            font: {
                bold: true,
                color: { rgb: "FFFFFFFF" }, // Texto blanco
            },
            alignment: {
                horizontal: "center",
                vertical: "center",
            },
        };

        // Estilo para las celdas de datos (centrado vertical y horizontal)
        const dataStyle = {
            alignment: {
                horizontal: "center", // Centrado horizontal
                vertical: "center",   // Centrado vertical
            },
        };

        // Aplicar estilos a los encabezados
        const headers = Object.keys(formattedData[0]);
        headers.forEach((header, index) => {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
            if (!worksheet[cellAddress]) return;
            worksheet[cellAddress].s = headerStyle;
        });

        // Aplicar estilo a las celdas de datos
        formattedData.forEach((_, rowIndex) => {
            headers.forEach((_, colIndex) => {
                const cellAddress = XLSX.utils.encode_cell({ r: rowIndex + 1, c: colIndex }); // Las filas empiezan desde 1
                if (!worksheet[cellAddress]) return;
                worksheet[cellAddress].s = dataStyle;
            });
        });

        // Definir el ancho de las columnas
        worksheet["!cols"] = [
            { wch: 12 }, // Fecha
            { wch: 39 }, // ID (numero_movimiento)
            { wch: 18 }, // Movimiento
            { wch: 52 }, // Origen
            { wch: 59 }, // Destino
            { wch: 40 }, // Material/Repuesto
            { wch: 50 }, // Marca
            { wch: 74 }, // Modelo/Serie
            { wch: 15 }, // Cantidad
            { wch: 20 }, // Unidad de Medida
            { wch: 15 }, // PT asociado
            { wch: 30 }, // Informe Asociado
            { wch: 22 }, // OT Asociada
            { wch: 22 }, // Remito
            { wch: 20 }, // N° Almacenes
            { wch: 20 }, // Observaciones

        ];

        // Crear un libro de trabajo (workbook)
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Historial de Movimientos");

        const today = new Date();
        const yyyy = today.getUTCFullYear();
        const mm = String(today.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(today.getUTCDate()).padStart(2, '0');

        // Exportar el archivo Excel
        if (tipoExcel == "historial articulo") {
            const material = datosFiltrados[0].material_repuesto;
            const marca = datosFiltrados[0].marca;
            const modelo = datosFiltrados[1].modelo_serie
            XLSX.writeFile(workbook, `INF-MOV-${material}-${marca}-${modelo}-FECHA-${yyyy}-${mm}-${dd}.xlsx`);

        } else {

            XLSX.writeFile(workbook, `INF-MOVIMIENTOS-${yyyy}-${mm}-${dd}.xlsx`);
        }
    };



    return {
        importarExcel,
        guardarExcelMovimientos,
        obtenerMovimientos,
        obtenerMovimientosArticulo,
        guardarMovimiento,
        generarPdf,
        obtenerUltimoMovimiento,
        generarListadoPDF,
        formatearFecha,
        exportarExcel,
        eliminarMovimiento,
        actualizarMovimiento,
        obtenerArticuloById
    }

}