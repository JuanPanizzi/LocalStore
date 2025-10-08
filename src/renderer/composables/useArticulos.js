import logo from '../../resources/pdflogo.png';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import { useToast } from "primevue/usetoast";

export function useArticulos(){

    const toast = useToast();

    const obtenerArticulos  = async () => {

        try {
            const response = await window.electronAPI.obtenerArticulos();
            if(response.success){
                return {success: true, data: response.data};
            }else{
                throw new Error('Error al obtener los datos')
            }
            
        } catch (error) {
            return {success: false, error: error?.message || 'Error al obtener los datos, intente nuevamente' }
        }
    }

    const crearArticulo = async (articulo) => {
        
        try {
            const response = await window.electronAPI.crearArticulo(articulo);
            
            if(response.success){
                return {success: true, data: response.data}
            }else{
                if(response.message == 'Ya existe un artículo con esa marca y modelo'){
                    return {success: false, message: response.message}
                }
                throw new Error();
            }
        } catch (error) {
            return {success: false}
        }

    }

    
    const eliminarArticulo = async (id) => {

        try {
          const response = await window.electronAPI.eliminarArticulo(id);
          if (response.success) {
            return { success: true, error: response.error }
          }else{

            if(response.error == 'No se encontró el articulo'){
                return {success: false, error: response.error}
            }

          }
        } catch (error) {
          return { success: false, error: response.error }
        }
      }
  

      const actualizarArticulo = async (articulo) => {
        try {
            const response = await window.electronAPI.actualizarArticulo(articulo);
            if(response.success){
                return {success: true, data: response.data}
            }else{
                if(response.message == 'Ya existe un artículo con la misma marca y modelo'){
                    return {success: false, message: response.message}
                }else{
                    throw new Error();
                }
            }
            
        } catch (error) {
            return {success: false}
        }
      }

      const seleccionarImagen = async () => {

        try {
            const response = await window.electronAPI.seleccionarImagen();
           
                return {success: true, data: response}
            

        } catch (error) {
            console.log('error')
            return {success: false}
        }
    }

    const generarListadoPDF = (articulos) => {
        if (!articulos || articulos.length === 0) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No hay artículos para generar el PDF', life: 3000 });
            return;
        }

        const doc = new jsPDF("l", "mm", "a4"); // Orientación horizontal

        // Agregar logo
        const appLogo = new Image();
        appLogo.src = logo;
        appLogo.onload = () => {
            doc.addImage(appLogo, "PNG", 10, 10, 20, 20);
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text("INVENTARIO DE ARTÍCULOS", doc.internal.pageSize.width / 2, 22, { align: "center" });
            
            // Agregar fecha de exportación
            const today = new Date();
            const fecha = today.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            doc.setFontSize(10);
            doc.text(`Fecha de exportación: ${fecha}`, doc.internal.pageSize.width - 20, 15, { align: "right" });

            const columnas = [
                { title: "MATERIAL / REPUESTO", dataKey: "material_repuesto" },
                { title: "MARCA", dataKey: "marca" },
                { title: "MODELO / SERIE", dataKey: "modelo_serie" },
                { title: "CANTIDAD", dataKey: "cantidad" },
                { title: "UNIDAD", dataKey: "unidad_medida" }
            ];

            const filas = articulos.map(item => {
                return columnas.reduce((obj, col) => {
                    obj[col.dataKey] = item[col.dataKey] || "-";
                    return obj;
                }, {});
            });

            autoTable(doc, {
                startY: 40,
                head: [columnas.map(col => col.title)],
                body: filas.map(fila => columnas.map(col => fila[col.dataKey])),
                styles: { fontSize: 9, cellPadding: 2 },
                headStyles: { fillColor: [0, 128, 255], textColor: 255, fontStyle: "bold", fontSize: 9 },
                columnStyles: {
                    0: { cellWidth: 80 }, // Material/Repuesto
                    1: { cellWidth: 60 }, // Marca
                    2: { cellWidth: 60 }, // Modelo/Serie
                    3: { cellWidth: 30 }, // Cantidad
                    4: { cellWidth: 30 }  // Unidad
                },
                margin: { left: 20, right: 20 },
                theme: "grid"
            });

            // Guardar PDF
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const nombrePdf = `INVENTARIO-ARTICULOS-${yyyy}-${mm}-${dd}.pdf`;

            doc.save(nombrePdf);
        };
    };

    return {
        obtenerArticulos,
        crearArticulo,
        eliminarArticulo,
        seleccionarImagen,
        actualizarArticulo,
        generarListadoPDF
    }



}

