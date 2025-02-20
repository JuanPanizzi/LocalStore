<template>


  <div :class="`flex ${showForm ? 'justify-end' : 'justify-between'}  items-center p-4 `">
    <h1 v-if="!showForm" class="text-center  font-semibold text-xl "> Registro de N° Repuestos / Materiales</h1>
    <div>
      <Button @click="handleInicio" :disabled="!showForm && !showFilters" icon="pi pi-list" label="Registros" />
      <Button @click="handleFilters" class="mx-2 " icon="pi pi-filter" label="Filtrar" />
      <Button type="button" label="Nuevo" icon="pi pi-plus" class="text-right" @click="handleForm" />

    </div>
  </div>

  <div v-if="showFilters" class="px-10 flex flex-col items-start justify-center">
    <h1 class="font-semibold my-3">Seleccione método de filtrado</h1>
    <div>
      <Button outlined severity="warn" @click="handleFilter('repuestoMaterial')" label="Repuesto / Material" />
      <Button outlined severity="warn" @click="handleFilter('marca')" class="ml-2" label="Marca" />
      <Button outlined severity="warn" @click="handleFilter('modelo')" class="ml-2" label="Modelo" />

    </div>

  </div>

  <div v-if="filter == 'repuestoMaterial'" class="flex justify-between  p-10">
    <div class="flex  justify-center items-end mb-3 ">
      <div class="flex flex-col">
        <label class="legend  text-start font-semibold">Repuesto / Material</label>
        <InputText v-model="repuestoMaterialFiltro" placeholder="Ingrese un repuesto o material" />
      </div>
      <Button @click="filtrarRepuestoDetalle" class="ml-2 w-full">Filtrar</Button>
    </div>

    <Button icon="pi pi-refresh" class="my-auto" label="Reiniciar" outlined severity="danger"
      @click="reiniciarValores" />
  </div>

  <div v-if="filter == 'marca'" class="flex justify-between p-10">
    <div class="flex  justify-center items-end mb-3 ">
      <div class="flex flex-col">
        <label class="legend  text-start font-semibold">Marca</label>
        <InputText v-model="marcaFiltro" placeholder="Ingrese marca" />
      </div>
      <Button @click="filtrarRepuestoMarca" class="ml-2 w-full">Filtrar</Button>
    </div>

    <Button icon="pi pi-refresh" class="my-auto" label="Reiniciar" outlined severity="danger"
      @click="reiniciarValores" />
  </div>

  <div v-if="filter == 'modelo'" class="flex justify-between p-10">
    <div class="flex  justify-center items-end mb-3 ">
      <div class="flex flex-col">
        <label class="legend  text-start font-semibold">Modelo</label>
        <InputText v-model="modeloFiltro" placeholder="Ingrese modelo" />
      </div>
      <Button @click="filtrarRepuestoModelo" class="ml-2 w-full">Filtrar</Button>
    </div>

    <Button icon="pi pi-refresh" class="my-auto" label="Reiniciar" outlined severity="danger"
      @click="reiniciarValores" />
  </div>

  <Form v-if="showForm" class="px-3 pb-20">
    <h1 class="text-center text-3xl font-semibold mt-6 ">Registro de N° Repuestos / Materiales</h1>

    <!-- Contenedor Inputs Header -->
    <div class="mt-20 mb-5 border rounded border border-gray-500  p-4 grid md:grid-cols-2  custom:grid-cols-4 gap-5 ">

      <div class="flex justify-between items-center ">
        <label class="w-2/5  font-semibold ">N° de Almacenes de Y.P.F.:</label>
        <InputNumber v-model="numeroAlmacenes" class="w-3/5 " />
      </div>

      <div class="flex justify-between items-center ">
        <label class="w-2/5  font-semibold ">Repuesto / Material :</label>
        <InputText v-model="repuestoMaterial" class="w-3/5 " />

      </div>

      <div class="flex justify-between  items-center ">
        <label class=" w-2/5  font-semibold ">Marca:</label>
        <InputText v-model="marca" class="w-3/5 " required />
      </div>


      <div class="flex justify-between items-center ">
        <label class=" w-2/5   font-semibold ">Modelo:</label>
        <InputText v-model="modelo" class="w-3/5 " />
      </div>
    </div>
    <!-- Fin Contenedor Inputs Header -->

    <!-- <Button label="Enviar Formulario" @click="guardarRepuestosMateriales" /> -->
    <div class="mt-2 flex items-center justify-end">
      <Button label="Guardar" severity="success" icon="pi pi-save" @click="guardarRepuestosMateriales" />
    </div>

  </Form>



  <Toast />
  <DataTable v-if="showDataTable" :value="dataRepuestos" paginator :rows="5" tableStyle="min-width: 50rem"
    class="m-auto my-10" showGridlines style="max-width: 90vw">
    <template #empty>
      <Message severity="error" variant="outlined">No se encontraron resultados </Message>
    </template>
    <Column style="width: 16%" field="numero_almacen_ypf" header="N° ALMACÉN DE YPF"></Column>
    <Column style="width: 40%" field="detalle_repuesto_material" header="REPUESTO / MATERIAL"></Column>
    <Column style="width: 22%" field="marca" header="MARCA"></Column>
    <Column style="width: 22%" field="modelo" header="MODELO"></Column>
    <Column>
      <template #body="slotProps">
        <div class="flex ">
          <Button icon="pi pi-pencil" @click="abrirDialogEditar(slotProps.data)" />
          <Button class="ml-2" icon="pi pi-trash" severity="danger" @click="confirmarEliminacion(slotProps.data)" />
        </div>
      </template>
    </Column>
  </DataTable>
  <!-- <div v-if="showForm" :class="`flex justify-end items-center p-4  `">
    <Button type="button" label="Generar PDF" icon="pi pi-plus" class="text-right" @click="generarPdf" />
  </div> -->
  <div v-if="showDataTable" :class="`flex justify-end items-center p-4  `">

    <FileUpload mode="basic" name="file" chooseLabel="Importar Excel" accept=".xlsx,.xls" auto="true"
      @select="importarExcel" />
    <Button label="Exportar Excel" icon="pi pi-file-export" class="ml-2" severity="success" @click="exportarExcel" />
    <Button type="button" label="Generar PDF" severity="danger" icon="pi pi-file-pdf" class=" ml-2 text-right "
      @click="generarListadoPDF(dataRepuestos)" />
  </div>

  <Dialog v-model:visible="showDialogEditar" :modal="true"
    :header="`Editar Repuesto / Material`"  style="max-width: 90vw">

    <div class="grid grid-cols-4 gap-6">
      <div class="flex flex-col col-span-2" >
        <label for="numero_almacen_ypf" class="font-semibold">Número de Almacén YPF</label>
        <InputNumber id="numero_almacen_ypf" v-model="repuestoEdicion.numero_almacen_ypf" class="flex-auto" autocomplete="off" />
      </div>

      <div class="flex flex-col col-span-2">
        <label for="detalle_repuesto_material" class="font-semibold">Detalle del Repuesto / Material</label>
        <InputText id="detalle_repuesto_material" v-model="repuestoEdicion.detalle_repuesto_material" class="flex-auto" autocomplete="off" />
      </div>

      <div class="flex flex-col col-span-2">
        <label for="marca" class="font-semibold">Marca</label>
        <InputText id="marca" v-model="repuestoEdicion.marca" class="flex-auto" autocomplete="off" />
      </div>

      <div class="flex flex-col col-span-2">
        <label for="modelo" class="font-semibold">Modelo</label>
        <InputText id="modelo" v-model="repuestoEdicion.modelo" class="flex-auto" autocomplete="off" />
      </div>


      <div class=" flex justify mt-7">
        <!-- <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="showDialogEditar = false" /> -->
        <Button label="Guardar" icon="pi pi-save" class="min-w-[170px] max-w-[250px]" severity="success" @click="actualizarRepuesto" />
      </div>
    </div>

</Dialog>



  <ConfirmDialog></ConfirmDialog>

</template>
<script>
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import * as XLSX from "xlsx-js-style";
import { useToast } from 'primevue/usetoast';
import { defineComponent, onMounted, ref } from 'vue';
import FileUpload from 'primevue/fileupload';
import Message from 'primevue/message';
import { useRepuestos } from '../composables/useRepuestos.js'
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import Dialog from 'primevue/dialog';

export default defineComponent({
  name: 'RegistroRepuestos',
  components: {
    InputText,
    InputNumber,
    Button,
    DataTable,
    Column,
    Toast,
    FileUpload,
    Message,
    ConfirmDialog,
    Dialog

  },

  setup() {


    const { generarListadoPDF } = useRepuestos()

    const toast = useToast();
    const confirm = useConfirm();
    const numeroAlmacenes = ref(null);
    const repuestoMaterial = ref(null);
    const repuestoMaterialFiltro = ref(null);
    const marca = ref('');
    const marcaFiltro = ref('');
    const modelo = ref('');
    const modeloFiltro = ref('');
    const showForm = ref(false);
    const dataRepuestos = ref([]);
    const showFilters = ref(false);
    const filter = ref(null);
    const showDataTable = ref(true);
    const showDialogEditar = ref(false);
    const repuestoEdicion = ref({
      id: '',
      numero_almacen_ypf: '',
      detalle_repuesto_material: '',
      marca: '',
      modelo: '',
    });

    

    const reiniciarValores = async () => {

      try {
        const response = await window.electronAPI.obtenerRepuestosMateriales();
        if (response.success) {
          dataRepuestos.value = response.data;

          modeloFiltro.value = null;
          marcaFiltro.value = null;
          repuestoMaterialFiltro.value = null;

          toast.add({ severity: "success", summary: "Éxito", detail: "Datos reiniciados correctamente.", life: 3000 });

        } else {
          throw new Error('error al obtener los datos')
        }
      } catch (error) {
        console.log(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al reiniciar los datos, intente nuevamente', life: 3000 });

      }
    }

    const handleInicio = () => {
      showFilters.value = false;
      showForm.value = false;
      showDataTable.value = true;
      filter.value = null;
      obtenerRepuestosMateriales()
    }

    const handleForm = () => {
      showDataTable.value = false;
      showForm.value = true;
      if (showFilters.value) {
        showFilters.value = false;
      }
      if (filter.value) {
        filter.value = null;
      }
    }
    const handleFilters = () => {
      showDataTable.value = true;
      showFilters.value = true;
      showForm.value = showForm.value = false;
    }
    const handleFilter = (nombreFiltro) => {
      filter.value = nombreFiltro;
    }


    const guardarRepuestosMateriales = async () => {

      if (!numeroAlmacenes.value || !repuestoMaterial.value || !marca.value || !modelo.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos', life: 3000 });
        return;
      }
      const datosFormulario = {
        numeroAlmacenYPF: numeroAlmacenes.value,
        detalleRepuestoMaterial: repuestoMaterial.value,
        marca: marca.value,
        modelo: modelo.value,
      }
      try {
        const response = await window.electronAPI.guardarRepuestosMateriales(datosFormulario);

        if (response.success) {
          dataRepuestos.value.push(response.data);

          toast.add({ severity: 'success', summary: 'Éxito', detail: 'Datos guardados correctamente', life: 3000 });

          setTimeout(() => {
            numeroAlmacenes.value = null;
            repuestoMaterial.value = null;
            marca.value = null,
              modelo.value = null;
          }, 1500);
        } else {
          throw new Error();
        }

      } catch (error) {
        console.error(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar los datos, intente nuevamente', life: 3000 });
      }

    }

    const obtenerRepuestosMateriales = async () => {

      try {
        const response = await window.electronAPI.obtenerRepuestosMateriales();

        if (response.success) {
          dataRepuestos.value = response.data;

        } else {
          throw new Error();
        }
      } catch (error) {
        alert('Error al obtener los datos, intente nuevamente.')
      }

    }

    const abrirDialogEditar = (repuesto) => {
      
      repuestoEdicion.value = { ...repuesto  };
      showDialogEditar.value = true;
    }

    const actualizarRepuesto = async () => {

      try {
        const repuestoActualizado = { ...repuestoEdicion.value };

        const response = await window.electronAPI.actualizarRepuesto(repuestoActualizado);

        if (response.success) {
          
          const indexRepuesto = dataRepuestos.value.findIndex(r => r.id === repuestoEdicion.value.id);

          if (indexRepuesto !== -1) {

            dataRepuestos.value[indexRepuesto] = { ...dataRepuestos.value[indexRepuesto], ...repuestoActualizado };

            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Repuesto actualizado correctamente', life: 3000 });
          }
        }
      } catch (error) {
        toast.add({ severity: "error", summary: "Error", detail: "No se pudo actualizar el repuesto intente nuevamente", life: 5000 });

      } finally {
        showDialogEditar.value = false;

      }
    }


    const eliminarRepuestoMaterial = async (repuestoId) => {

      try {
        const response = await window.electronAPI.eliminarRepuestoMaterial(repuestoId);
        if (response.success) {
          return { success: true, error: response.error }
        }
      } catch (error) {
        return { success: false, error: response.error }
      }
    }

    const confirmarEliminacion = (repuestoMaterial) => {

      const { id } = repuestoMaterial;

      confirm.require({
        message: `¿Estás seguro de eliminar este repuesto / material?`,
        header: 'Atención',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancelar',
        rejectProps: {
          label: 'Cancelar',
          severity: 'secondary',
          outlined: true
        },
        acceptProps: {
          label: 'Eliminar',
          severity: 'danger'
        },
        accept: async () => {

          const eliminacion = await eliminarRepuestoMaterial(id);

          if (eliminacion.success) {
            const indexRepuesto = dataRepuestos.value.findIndex(r => r.id === id);

            if (indexRepuesto !== -1) {

              dataRepuestos.value.splice(indexRepuesto, 1);
              // dataRepuestos.value = dataRepuestos.value.filter(informe => informe.id !== id);
            }

            toast.add({ severity: 'info', summary: 'Éxito', detail: `Repuesto / material eliminado correctamente`, life: 5000 });
          } else {

            // if (eliminacion.error == 'No se encontró el informe') {
            //   toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontró el repuesto, error al eliminarlo, intente nuevamente', life: 3000 });
            // }

            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el repuesto, intente nuevamente', life: 3000 });

          }

        },
        reject: () => {
          // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
      });

    }



    const filtrarRepuestoDetalle = async () => {

      if (!repuestoMaterialFiltro.value) {
        toast.add({ severity: 'error', summary: 'Campo incompleto', detail: 'Por favor ingresa un repuesto o material', life: 3000 });
        return;
      }

      try {
        const response = await window.electronAPI.filtrarRepuestoDetalle(repuestoMaterialFiltro.value);

        if (response.success) {
          dataRepuestos.value = response.data;

          if (response.data.length < 1) {
            toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'No se encontraron resultados.', life: 4000 });
            return;
          }
          toast.add({ severity: "success", summary: "Éxito", detail: "Datos filtrados correctamente.", life: 3000 });

        }
      } catch (error) {
        console.log(error)
        toast.add({ severity: "error", summary: "Error", detail: "Error al filtrar, intente nuevamente.", life: 3000 });

      }
    }

    const filtrarRepuestoMarca = async () => {

      if (!marcaFiltro.value) {
        toast.add({ severity: 'error', summary: 'Campo incompleto', detail: 'Por favor ingresa una marca.', life: 3000 });
        return;
      }


      try {
        const response = await window.electronAPI.filtrarRepuestoMarca(marcaFiltro.value);

        if (response.success) {
          dataRepuestos.value = response.data;

          if (response.data.length < 1) {
            toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'No se encontraron resultados.', life: 4000 });
            return;
          }
          toast.add({ severity: "success", summary: "Éxito", detail: "Datos filtrados correctamente.", life: 3000 });

        }
      } catch (error) {
        console.log(error)
        toast.add({ severity: "error", summary: "Error", detail: "Error al filtrar, intente nuevamente.", life: 3000 });

      }
    }

    const filtrarRepuestoModelo = async () => {

      if (!modeloFiltro.value) {
        toast.add({ severity: 'error', summary: 'Campo incompleto', detail: 'Por favor ingresa un modelo.', life: 5000 });
        return;
      }


      try {
        const response = await window.electronAPI.filtrarRepuestoModelo(modeloFiltro.value);

        if (response.success) {
          dataRepuestos.value = response.data;

          if (response.data.length < 1) {
            toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'No se encontraron resultados.', life: 4000 });
            return;
          }
          toast.add({ severity: "success", summary: "Éxito", detail: "Datos filtrados correctamente.", life: 3000 });

        }
      } catch (error) {
        console.log(error)
        toast.add({ severity: "error", summary: "Error", detail: "Error al filtrar, intente nuevamente.", life: 3000 });

      }
    }

    const exportarExcel = () => {
      // Mapear los datos al formato requerido
      const formattedData = dataRepuestos.value.map((item) => ({
        "Número Almacenes YPF": item.numero_almacen_ypf || "-", // Formatear las fechas
        "Ítem / Material": item.detalle_repuesto_material || "-",
        "Marca": item.marca || "-",
        "Modelo": item.modelo || "-",
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
        { wch: 30 }, // NUMERO ALMACENES YPF
        { wch: 55 }, // ITEM / MATERIAL
        { wch: 30 }, // MARCA
        { wch: 30 }, // MODELO

      ];

      // Crear un libro de trabajo (workbook)
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Repuestos y Materiales");

      // Exportar el archivo Excel
      XLSX.writeFile(workbook, "InformeRepuestos.xlsx");
    };

    const importarExcel = async (event) => {
      const file = event.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Leer la primera hoja del archivo
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convertir la hoja a un JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { raw: false });

        // Obtener las columnas desde la primera fila
        const primeraFila = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] || [];

        // Normalizar las columnas a minúsculas para comparación
        const primeraFilaNormalizada = primeraFila.map(col => col.toLowerCase());


        // Definir las columnas requeridas
        const columnasRequeridas = ["Número Almacenes YPF", "Ítem / Material", "Marca", "Modelo"];

        // Normalizar columnas requeridas a minúsculas
        const columnasRequeridasNormalizadas = columnasRequeridas.map(col => col.toLowerCase());

        // Verificar si falta alguna columna después de normalizar
        const columnasFaltantes = columnasRequeridasNormalizadas.filter(
          columna => !primeraFilaNormalizada.includes(columna)
        );

        if (columnasFaltantes.length > 0) {
          toast.add({
            severity: "error", summary: "Columnas Faltantes", detail: `Faltan las siguientes columnas en el archivo: ${columnasFaltantes.join(", ")}`,
            life: 7000
          });

          return;
        }

        // Formatear los datos para la tabla
        const formattedData = jsonData.map((row) => {

          const normalizedRow = {}; // Objeto para almacenar los datos normalizados (pasamos las claves a minusculas )
          // Iterar sobre las columnas y normalizar las claves
          Object.keys(row).forEach(key => {
            const normalizedKey = key.toLowerCase(); // Normalizar la clave a minúsculas
            normalizedRow[normalizedKey] = row[key] !== undefined && row[key] !== null && row[key] !== "" ? row[key] : null; // Asignar valor 
          });

          return {
            numero_almacen_ypf: normalizedRow["número almacenes ypf"],
            detalle_repuesto_material: normalizedRow["ítem / material"],
            marca: normalizedRow["marca"],
            modelo: normalizedRow["modelo"],
          }
        });

        // Intentar guardar los datos en la base de datos
        try {
          const response = await guardarRepuestosExcel(formattedData);

          if (response.success) {
            dataRepuestos.value = response.data;
            toast.add({ severity: "success", summary: "Éxito", detail: "Datos cargados correctamente.", life: 3000, });

          } else {

            if (response.error == 'Campos incompletos') {
              if (response.campoIncompleto == 'Campo desconocido') {
                toast.add({ severity: "error", summary: `Error al cargar los datos`, detail: "El archivo excel posee datos incompletos.", life: 5000 });
              } else {

                toast.add({ severity: "error", summary: `Campos Incompletos`, detail: `El archivo excel posee campos incompletos, revisar los campos de la columna "${response.campoIncompleto}".`, life: 6000 });
              }
            }
          }
        } catch (error) {
          console.error(error);
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Error al cargar los datos, intente nuevamente.",
            life: 3000,
          });
        }
      };

      reader.readAsArrayBuffer(file);
    };

    const guardarRepuestosExcel = async (datos) => {
      try {
        const response = await window.electronAPI.guardarRepuestosExcel(datos);
        return response;
      } catch (error) {
        console.error("Error al guardar datos en la base de datos:", error);
        return response;
      }
    };





    onMounted(() => {
      obtenerRepuestosMateriales();
    })

    return {
      dataRepuestos,
      numeroAlmacenes,
      repuestoMaterial,
      marca,
      modelo,
      showForm,
      handleForm,
      guardarRepuestosMateriales,
      obtenerRepuestosMateriales,
      repuestoMaterialFiltro,
      handleFilter,
      handleFilters,
      filtrarRepuestoDetalle,
      showFilters,
      filter,
      filtrarRepuestoMarca,
      marcaFiltro,
      modeloFiltro,
      filtrarRepuestoModelo,
      guardarRepuestosExcel,
      importarExcel,
      exportarExcel,
      showDataTable,
      handleInicio,
      generarListadoPDF,
      reiniciarValores,
      confirmarEliminacion,
      eliminarRepuestoMaterial,
      actualizarRepuesto,
      abrirDialogEditar,
      repuestoEdicion,
      showDialogEditar

    }

  }

})
</script>