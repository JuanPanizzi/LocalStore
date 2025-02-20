import logo from '../../resources/pdflogo.png';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import { useToast } from "primevue/usetoast";

export function useRepuestos(){

    const toast = useToast();

    const generarListadoPDF = (data) => {
      
        // Extraer el valor si es un ref o reactive
        const datos = Array.isArray(data) ? data : data.value;
    
        if (!datos || datos.length === 0) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No hay datos para generar el PDFF', life: 3000 });
            return;
        }

        const doc = new jsPDF("l", "mm", "a4"); // Cambiamos a orientación horizontal (landscape)

        // Agregar logo
        const appLogo = new Image();
        appLogo.src = logo;
        appLogo.onload = () => {
            doc.addImage(appLogo, "PNG", 10, 10, 20, 20);
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text("REGISTRO DE REPUESTOS / MATERIALES", doc.internal.pageSize.width / 2, 22, { align: "center" });
            doc.setFontSize(10);

        //numero_almacen_ypf', 'detalle_repuesto_material', 'marca', 'modelo'

        const columnas = [
                { title: "N° DE ALMACENES YPF", dataKey: "numero_almacen_ypf" },
                { title: "REPUESTO / MATERIAL.", dataKey: "detalle_repuesto_material" },
                { title: "MARCA", dataKey: "marca" },
                { title: "MODELO", dataKey: "modelo" },
            ];

            const filas = datos.map(item => {
                return columnas.reduce((obj, col) => {
                    obj[col.dataKey] = item[col.dataKey] || "-";
                    return obj;
                }, {});
            });
            //fecha, material_equipo_devuelto, cantidad, marca, modelo, procedencia, destino_recepcion, descripcion)
            // Configurar tabla con mejores ajustes

            autoTable(doc, {
                startY: 40,
                head: [columnas.map(col => col.title)],
                body: filas.map(fila => columnas.map(col => fila[col.dataKey])),
                styles: { fontSize: 9, cellPadding: 2 },
                headStyles: { fillColor: [0, 128, 255], textColor: 255, fontStyle: "bold", fontSize: 9 },
                columnStyles: {
                    0: { cellWidth: 55 }, //N° almacenes YPF
                    1: { cellWidth: 78 }, //Repuesto / Material
                    2: { cellWidth: 78 }, //Marca
                    3: { cellWidth: 78 }, //Modelo

                },
                margin: { left: 4, right: 4 },
                theme: "grid"
            });

            // Guardar PDF
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const nombrePdf = `REPUESTOS-${yyyy}-${mm}-${dd}`;

            doc.save(nombrePdf);
        };
    };


    return {
        generarListadoPDF
    }
}