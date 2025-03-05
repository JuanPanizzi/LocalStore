<template>

  <div :class="`flex ${showForm ? 'justify-end' : 'justify-between'}  items-center p-4 `">
    <h1 v-if="!showForm" class="text-center  font-semibold text-xl"> Registro de Requerimientos de Repuestos /
      Materiales</h1>
    <div>
      <Button @click="handleInicio" :disabled="!showForm && !showFilters && !showCerrarReq" icon="pi pi-list" class=""
        label="Registros" />
      <!-- <Button type="button" label="Estado" icon="pi pi-wave-pulse" class="text-right" @click="handleRequerimiento" /> -->
      <Button type="button" label="Filtrar" icon="pi pi-filter" class="mx-2 text-right" @click="handleFilters" />
      <Button type="button" label="Solicitar" icon="pi pi-plus" class="text-right" @click="handleForm" />
    </div>
  </div>

  <div v-if="showFilters" class="px-10 flex flex-col items-start justify-center">
    <h1 class="font-semibold my-3"> Seleccione método de filtrado</h1>
    <div>
      <Button outlined severity="warn" @click="handleFilter('codigo')">Código de Requerimiento</Button>
      <Button outlined severity="warn" @click="handleFilter('insumo')" class="mx-2">Insumo</Button>
      <Button outlined severity="warn" @click="handleFilter('sector')">Sector</Button>
    </div>

  </div>

  <div v-if="showCerrarReq" class="px-10 flex flex-col items-start justify-center">
    <h1 class="font-semibold my-3"> Seleccione método de filtrado</h1>
    <div>
      <Button outlined severity="warn" @click="handleFilter('numReq')">N° de Requerimiento</Button>
      <Button outlined severity="warn" @click="handleFilter('estado')" class="mx-2">Estado</Button>
    </div>

  </div>

  <div v-if="filter == 'numReq'" class="flex justify-between mt-10  px-10">
    <div class="flex  justify-center items-end  ">
      <div class="flex flex-col">
        <label class="legend  text-start font-semibold">N° de Requerimiento</label>
        <InputText v-model="numeroRequerimientoFiltro" placeholder="Ingrese el n° de requerimiento" class="w-64" />
      </div>
      <Button @click="filtrarNumeroReq('cerrar requerimiento')" class="ml-2 w-full">Buscar</Button>
    </div>

    <Button icon="pi pi-refresh" class="my-auto" label="Reiniciar" outlined severity="danger"
      @click="reiniciarValores" />
  </div>
  <div v-if="filter == 'estado'" class="flex justify-between mt-10  px-10">

    <Button icon="pi pi-filter" outlined severity="info"
      :label="mostrarReqCerrados ? 'Ver Requerimientos Pendientes' : 'Ver Requerimientos Completados'"
      @click="filtrarRequerimientos" class="" />

    <Button icon="pi pi-refresh" class=" mr-2" label="Reiniciar" outlined severity="danger" @click="reiniciarValores" />

  </div>



  <div v-if="filter == 'codigo'" class="flex justify-between mt-10  px-10">
    <div class="flex  justify-center items-end mb-3 ">
      <div class="flex flex-col">
        <label class="legend  text-start font-semibold">Código de Requerimiento</label>
        <InputText v-model="numeroRequerimientoFiltro" placeholder="Ingrese el código" />
      </div>
      <Button @click="filtrarNumeroReq" class="ml-2 w-full">Filtrar</Button>
    </div>

    <Button icon="pi pi-refresh" class="my-auto" label="Reiniciar" outlined severity="danger"
      @click="reiniciarValores" />
  </div>


  <div v-if="filter == 'sector'" class="flex justify-between my-10  px-10">
    <div class="flex flex-col">
      <label class="legend  text-start font-semibold">Sector</label>
      <InputText v-model="sectorFiltro" placeholder="Ingrese el sector" />
    </div>
    <!-- <Button @click="filtrarCorrectivosRepuesto" class="ml-2 w-full">Filtrar</Button> -->


    <div :class="` flex flex-col  items-start `">
      <p class="text-left  font-semibold">Fecha Inicio:</p>
      <DatePicker v-model="fechaInicioFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
        :showIcon="true" />
    </div>
    <!-- <Button @click="filtrarCorrectivosFecha" class="ml-2 w-full">Filtrar</Button> -->

    <div class="flex  justify-center items-end  ">
      <div :class="` flex flex-col  items-start `">
        <p class="text-left  font-semibold">Fecha Fin:</p>
        <DatePicker v-model="fechaFinFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
          :showIcon="true" />
      </div>
      <Button @click="filtrarRequerimientoSectorRango" class="ml-2 w-full">Filtrar</Button>
    </div>

    <Button icon="pi pi-refresh" class="mt-auto" label="Reiniciar" outlined severity="danger"
      @click="reiniciarValores" />
  </div>




  <div v-if="filter == 'insumo'" class="flex justify-between my-10  px-10">
    <div class="flex flex-col">
      <label class="legend  text-start font-semibold">Insumo / Material / Repuesto</label>
      <InputText v-model="insumoMaterialFiltro" placeholder="Ingrese el insumo" />
    </div>
    <!-- <Button @click="filtrarCorrectivosRepuesto" class="ml-2 w-full">Filtrar</Button> -->

    <div :class="` flex flex-col  items-start `">
      <p class="text-left  font-semibold">Fecha Inicio:</p>
      <DatePicker v-model="fechaInicioFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
        :showIcon="true" />
    </div>
    <!-- <Button @click="filtrarCorrectivosFecha" class="ml-2 w-full">Filtrar</Button> -->

    <div class="flex  justify-center items-end  ">
      <div :class="` flex flex-col  items-start `">
        <p class="text-left  font-semibold">Fecha Fin:</p>
        <DatePicker v-model="fechaFinFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
          :showIcon="true" />
      </div>
      <Button @click="filtrarRequerimientoInsumoRango" class="ml-2 w-full">Filtrar</Button>
    </div>

    <Button icon="pi pi-refresh" class="mt-auto" label="Reiniciar" outlined severity="danger"
      @click="reiniciarValores" />
  </div>

  <Form v-if="showForm" class="relative px-3 pb-20">
    <h1 class="text-center text-3xl font-semibold mt-6">Registro de Requerimientos de Repuestos / Materiales</h1>
    <div class="absolute top-14 right-5">

      <div class=" flex items-center mb-3">
        <p class="legend w-40 text-right mr-3 font-semibold">Fecha:</p>
        <DatePicker v-model="fechaActual" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
          :showIcon="true" />
      </div>
      <div class="flex items-center mb-3">
        <label class="legend w-40 text-right mr-3 font-semibold">N° Del Requerimiento:</label>
        <InputText v-model="numeroRequerimiento" readonly class="w-64" />
      </div>
    </div>


    <!-- Contenedor Inputs Header -->
    <div class="mt-36 mb-5 border p-4 grid grid-cols-2 gap-y-2 gap-x-10 px-3 ">

      <div class="flex justify-between items-center ">
        <label class="w-1/5  font-semibold ">Dirigido a:</label>
        <InputText v-model="remitente" readonly class="w-4/5 " />
      </div>

      <div class="flex justify-between items-center ">
        <label class=" w-1/5   font-semibold ">Documento de Referencia:</label>
        <InputText v-model="documentoReferencia" class="w-4/5 " />
      </div>
    </div>

    <!-- Fin Contenedor Inputs Header -->

    <!-- Contenedor Inputs Body -->
    <div class="px-3 py-6 border rounded">
      <h1 class="text-2xl mb-3 font-semibold">Destino:</h1>
      <!-- Ctn planta y sector -->
      <div class="grid grid-cols-4 gap-4 ">

        <div class=" flex items-center col-span-2">
          <label class="  font-semibold ">Planta:</label>
          <Select v-model="plantaSeleccionada" :options="plantas" optionLabel="nombre" placeholder="Seleccionar planta"
            class=" w-full ml-2" />
        </div>

        <div class="flex  items-center col-span-2">
          <label class="  font-semibold ">Sector:</label>
          <InputText v-model="sector" class="w-full ml-2" required />
        </div>


        <div class="flex mt-4 items-center col-span-4">
          <label class="   font-semibold ">Insumo / Material / Repuesto:</label>
          <InputText v-model="insumoMaterial" class="w-full " />
        </div>
      </div>

      <!-- Fin Ctn planta y sector -->

      <div class="grid grid-cols-2 gap-4 mt-7">

        <!-- <div class="flex justify-between items-center ">
          <label class=" w-1/5   font-semibold ">Cantidad:</label>
          <InputNumber v-model="cantidad" class="w-4/5 " />
        </div> -->
        <!-- 
        <div class="flex justify-between items-center col-span-2">
          <label class=" w-1/5   font-semibold ">Insumo / Material / Repuesto:</label>
          <InputText v-model="insumoMaterial" class="w-4/5 " />
        </div> -->


        <!-- <div class="flex justify-between items-center ">
          <label class=" w-1/5   font-semibold ">Observación:</label>
          <InputText v-model="observacion" class="w-4/5 " />
        </div>

        <div class="flex justify-between items-center ">
          <label class=" w-1/5   font-semibold ">Estado:</label>
          <InputText v-model="estado" readonly class="w-4/5 " />
        </div> -->

      </div>

    </div>
    <div class="mt-2 flex items-center justify-end">
      <Button label="Reiniciar" icon="pi pi-refresh" class="mr-2" severity="secondary" @click="reiniciarFormulario" />
      <Button label="Guardar" icon="pi pi-save" severity="success" class="" @click="guardarRequerimientos" />
      <Button v-if="showForm" type="button" label="Generar PDF" severity="danger" icon="pi pi-file-pdf"
        class=" mx-2 text-right " @click="generarPdf" />
    </div>
  </Form>
  <div class="card  px-10 pb-10">

    <DataTable v-if="showDataTable" class="my-10" :value="dataRequerimientos" paginator :rows="5"
      tableStyle="min-width: 50rem" showGridlines style="max-width: 90vw">
      <template #empty>
        <Message severity="error" variant="outlined">No se encontraron resultados </Message>
      </template>
      <Column field="fecha" header="FECHA"></Column>
      <Column style="min-width: 12rem;" field="numero_requerimiento" header="N° REQUERIMIENTO"></Column>
      <Column style="min-width: 10rem;" field="documento_referencia" header="DOCUMENTO REFERENCIA"></Column>
      <Column style="min-width: 9rem;" field="planta" header="PLANTA"></Column>
      <Column style="min-width: 9rem;" field="sector" header="SECTOR"></Column>
      <Column style="min-width: 20rem;" field="insumo_material_repuesto" header="INSUMO / MATERIAL / REPUESTO"></Column>
      <Column field="estado" header="ESTADO">
        <template #body="slotProps">
          <div class="flex justify-between items-center gap-2">
            <!-- <Message :severity="slotProps.data.estado == 'Pendiente' ? 'error' : 'success'"> {{ slotProps.data.estado }} </Message> -->
            <span>{{ slotProps.data.estado }}</span>
            <!-- <Button type="button" icon="pi pi-pencil" rounded outlined @click=" abrirDialogEstado(slotProps.data)" /> -->
          </div>
        </template>
      </Column>
      <!-- <Column field="cantidad" header="CANTIDAD"></Column> -->
      <Column style="min-width: 10rem;" field="remitente" header="DIRIGIDO A:"></Column>
      <!-- <Column style="min-width: 20rem;" field="observacion" header="OBSERVACIÓN"></Column> -->
      <!-- <Column style="min-width: 18rem;" field="referencia_externa" header="REFERENCIA EXTERNA">
        <template #body="slotProps">
          <p @click="abrirHipervinculoRequerimiento(slotProps.data.referencia_externa)"
            class=" hover:text-blue-500 cursor-pointer hover:underline ">{{
              slotProps.data.referencia_externa }}</p>
        </template>
      </Column> -->
      <Column>
        <template #body="slotProps">
          <div class="flex ">
            <Button icon="pi pi-pencil" @click="abrirDialogEditar(slotProps.data)" />
            <Button class="ml-2" icon="pi pi-trash" severity="danger" @click="confirmarEliminacion(slotProps.data)" />
          </div>
        </template>
      </Column>
    </DataTable>

  </div>
  <!-- <div v-if="showForm" :class="`flex justify-end items-center p-4  `">
    <Button type="button" label="Generar PDF" icon="pi pi-plus" class="text-right" @click="generarPdf" />
  </div> -->
  <Toast />

  <div v-if="showDataTable" :class="`flex justify-end items-center p-4  `">

    <FileUpload mode="basic" name="file" chooseLabel="Importar Excel" accept=".xlsx,.xls" auto="true"
      @select="importarExcel" />
    <Button label="Exportar Excel" icon="pi pi-file-export" class="ml-2" severity="success" @click="exportarExcel" />
    <Button type="button" label="Generar PDF" severity="danger" icon="pi pi-file-pdf" class=" ml-2 text-right "
      @click="generarListadoPDF" />
  </div>

  <Dialog v-model:visible="showDialogEstado" modal class="text-center"
    :header="`CERRAR ${reqSeleccionado?.numero_requerimiento || ''}`" :style="{ width: '40rem' }">
    <span class="text-surface-500 dark:text-surface-400 text-left block mb-8">Seleccione una opción para la Referencia
      Externa</span>
    <div class="flex my-10">
      <Button label="Dato" class="mr-2" @click="handleOptions('dato')" severity="contrast" outlined />
      <Button label="Documento/Hipervínculo" @click="handleOptions" severity="contrast" outlined />

    </div>

    <div v-if="showDato" class="flex flex-col items-center gap-4 mb-4">
      <label for="referenciaExterna" class="font-semibold ">Ingrese el dato manualmente</label>
      <InputText id="referenciaExterna" class="flex-auto" v-model="referenciaExt" autocomplete="off" />
    </div>

    <div v-if="showDocumentoHipervinculo" class="flex flex-col items-center gap-4 mb-4">
      <span class="font-semibold">Seleccione documento o hipervínculo</span>
      <!-- <FileUpload mode="basic" name="file" chooseLabel="Seleccionar"  accept=".xlsx,.xls,.pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"  auto="true" @select="handleFileSelect"  /> -->
      <Button label="Seleccionar archivo" icon="pi pi-file" @click="seleccionarArchivoRefExt" />
      <p v-if="referenciaExt" class="mt-10"> <b> Archivo seleccionado: </b> {{ referenciaExt }}</p>
    </div>

    <div class="flex justify-end gap-2 mt-20">
      <Button type="button" label="Cancelar" severity="secondary" @click="showDialogEstado = false"></Button>
      <Button type="button" label="Guardar" severity="success" @click="modificarEstadoRequerimiento"></Button>
    </div>
  </Dialog>


  <Dialog v-model:visible="showDialogRevertirEstado" modal
    :header="`¿CAMBIAR ESTADO ${reqSeleccionado?.numero_requerimiento || ''} A 'PENDIENTE' ?`"
    :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">¿Desea revertir el estado de este requerimiento a
      "pendiente"? <br> <i> Se eliminará la referencia externa </i> </span>

    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancelar" severity="secondary" @click="showDialogRevertirEstado = false"></Button>
      <Button type="button" label="Aceptar" severity="danger" @click="modificarEstadoRequerimiento"></Button>
    </div>
  </Dialog>


  <Dialog v-model:visible="showDialogEditar" :modal="true"
    :header="`Editar ${requerimientoEdicion.numero_requerimiento}`" class="" style="max-width: 90vw">

    <div class="grid grid-cols-4 gap-6">
      <div class="flex flex-col col-span-2">
        <label for="remitente" class="font-semibold">Remitente</label>
        <InputText id="remitente" v-model="requerimientoEdicion.remitente" class="flex-auto" autocomplete="off" />
      </div>

      <div class="flex flex-col col-span-2">
        <label for="documento_referencia" class="font-semibold">Documento Referencia</label>
        <InputText id="documento_referencia" v-model="requerimientoEdicion.documento_referencia" class="flex-auto"
          autocomplete="off" />
      </div>

      <div class="flex flex-col col-span-2">
        <label for="planta" class="font-semibold">Planta</label>
        <InputText id="planta" v-model="requerimientoEdicion.planta" class="flex-auto" autocomplete="off" />
      </div>

      <div class="flex flex-col col-span-2">
        <label for="sector" class="font-semibold">Sector</label>
        <InputText id="sector" v-model="requerimientoEdicion.sector" class="flex-auto" autocomplete="off" />
      </div>

      <div class="flex flex-col col-span-4">
        <label for="insumo_material_repuesto" class="font-semibold">Insumo / Material / Repuesto</label>
        <InputText id="insumo_material_repuesto" v-model="requerimientoEdicion.insumo_material_repuesto"
          class="flex-auto" autocomplete="off" />
      </div>

      <div class="flex flex-col">
        <label for="fecha" class="font-semibold">Fecha</label>
        <DatePicker id="fecha" v-model="requerimientoEdicion.fecha" class="flex-auto" dateFormat="dd/mm/yy"
          autocomplete="off" />
      </div>

      <div class="flex flex-col">
        <label for="numero_requerimiento" class="font-semibold">Número de Requerimiento</label>
        <InputText id="numero_requerimiento" readonly v-model="requerimientoEdicion.numero_requerimiento"
          class="flex-auto" autocomplete="off" />
      </div>

      <div class="flex flex-col col-span-2">
        <label for="estado" class="font-semibold">Estado</label>
        <InputText id="estado" v-model="requerimientoEdicion.estado" class="flex-auto" autocomplete="off" />
      </div>

      <!-- <div class="flex flex-col col-span-4">
        <label for="referencia_externa" class="font-semibold">Referencia Externa</label>
        <InputText id="referencia_externa" v-model="requerimientoEdicion.referencia_externa" class="flex-auto"
          autocomplete="off" />
      </div> -->

      <!-- <div class="flex flex-col col-span-4">
        <label for="observacion" class="font-semibold">Observación</label>
        <InputText id="observacion" v-model="requerimientoEdicion.observacion" class="flex-auto" autocomplete="off" />
      </div>

      <div class="flex flex-col">
        <label for="cantidad" class="font-semibold">Cantidad</label>
        <InputText id="cantidad" v-model="requerimientoEdicion.cantidad" class="flex-auto" autocomplete="off" />
      </div> -->

      <div class="col-span-4 flex justify-end gap-4 mt-4">
        <!-- <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="showDialogEditar = false" /> -->
        <Button label="Guardar" icon="pi pi-save" class="min-w-[170px] max-w-[250px]" severity="success"
          @click="actualizarRequerimiento" />
      </div>
    </div>

  </Dialog>




  <ConfirmDialog></ConfirmDialog>

</template>
<script>
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import DatePicker from 'primevue/datepicker';
import FileUpload from 'primevue/fileupload';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import logo from '../../resources/pdflogo.png';
import * as XLSX from "xlsx-js-style";
import { useToast } from 'primevue/usetoast';
import { defineComponent, onMounted, ref } from 'vue';
import Dialog from 'primevue/dialog';
import Message from 'primevue/message';
import { formatFechaDate, formatFechaToYYYYMMDD, validarFormatoFecha, formatFechaDDMMYYYY } from '../utils/funcionesFecha.js'
import { useConfirm } from 'primevue/useconfirm';
import ConfirmDialog from 'primevue/confirmdialog';


export default defineComponent({
  name: 'RegistroRequerimientos',
  components: {
    DatePicker,
    InputText,
    InputNumber,
    Select,
    FileUpload,
    Toast,
    Textarea,
    Button,
    DataTable,
    Column,
    Dialog,
    Message,
    ConfirmDialog
  },

  setup() {

    const toast = useToast();
    const confirm = useConfirm();

    const remitente = ref('Inspección Mantenimiento C.I.LE. Y.P.F.');
    const numeroRequerimiento = ref(null);
    const numeroRequerimientoFiltro = ref(null);
    const documentoReferencia = ref(null);
    const plantas = ref([{ nombre: "C.I.L.E Lubricantes" }, { nombre: "C.I.L.E Asfaltos" }])
    const plantaSeleccionada = ref('C.I.L.E Lubricantes')
    const fechaActual = ref(null);
    const cantidad = ref(null)
    const insumoMaterial = ref(null)
    const observacion = ref(null)
    const estado = ref('Pendiente');
    const showForm = ref(false);
    const dataRequerimientos = ref([]);
    const dataRequerimientosOr = ref(null);
    const insumoMaterialFiltro = ref('');
    const anioFiltro = ref(null);
    const mesFiltro = ref(null);
    const diaFiltro = ref(null);
    const sector = ref(null);
    const sectorFiltro = ref(null);
    const showFilters = ref(false);
    const filter = ref(null)
    const tipoFiltradoPdf = ref(null);
    const fechaInicioFiltro = ref(null);
    const fechaFinFiltro = ref(null);
    const showCerrarReq = ref(false);
    const cerrandoReq = ref(false);
    const movimientoMaterial = ref(null);
    const mostrarReqCerrados = ref(false);
    const showDialogEstado = ref(false);
    const showDialogRevertirEstado = ref(false);
    const showDato = ref(false);
    const showDocumentoHipervinculo = ref(false);
    const referenciaExt = ref('');
    const reqSeleccionado = ref(null);
    const showDataTable = ref(true);
    const registroGuardado = ref(false);
    const showDialogEditar = ref(false);
    const requerimientoEdicion = ref({
      id: "",
      remitente: "",
      documento_referencia: "",
      planta: "",
      sector: "",
      insumo_material_repuesto: "",
      fecha: "",
      numero_requerimiento: "",
      observacion: "",
      estado: "",
      referencia_externa: "",
      cantidad: ""
    })



    const reiniciarValores = async () => {
      try {
        const response = await window.electronAPI.obtenerRequerimientos();
        if (response.success) {
          dataRequerimientos.value = response.data;

          numeroRequerimientoFiltro.value = null;
          sectorFiltro.value = null;
          fechaInicioFiltro.value = null;
          fechaFinFiltro.value = null;
          insumoMaterialFiltro.value = null;

          toast.add({ severity: "success", summary: "Éxito", detail: "Datos reiniciados correctamente.", life: 3000 });

        } else {
          throw new Error('error al obtener los datos')
        }
      } catch (error) {
        console.log(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al reiniciar los datos, intente nuevamente', life: 3000 });

      }
    }


    const modificarEstadoRequerimiento = async () => {
      try {
        const nuevoEstado = reqSeleccionado.value.estado === "Completado" ? "Pendiente" : "Completado";
        const nuevaReferencia = nuevoEstado === "Pendiente" ? "" : referenciaExt.value;

        const response = await window.electronAPI.modificarEstadoRequerimiento({
          referencia_externa: nuevaReferencia,
          numero_requerimiento: reqSeleccionado.value.numero_requerimiento,
          estado: nuevoEstado
        });

        if (response.success) {
          const updatedRequerimiento = dataRequerimientos.value.find(
            (item) => item.numero_requerimiento === reqSeleccionado.value.numero_requerimiento
          );

          if (updatedRequerimiento) {
            updatedRequerimiento.referencia_externa = nuevaReferencia;
            updatedRequerimiento.estado = nuevoEstado;

            toast.add({ severity: "success", summary: "Éxito", detail: `${reqSeleccionado.value.numero_requerimiento} cambiado a ${nuevoEstado}`, life: 5000 });
          } else {
            throw new Error();
          }
        }
      } catch (error) {
        console.log(error);
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Error al guardar los datos, intente nuevamente",
          life: 3000
        });
      } finally {
        showDialogEstado.value = false;
        showDialogRevertirEstado.value = false;
        reqSeleccionado.value = null;
        referenciaExt.value = "";
      }
    };



    const seleccionarArchivoRefExt = async () => {
      if (window.electronAPI) {
        // Llamamos a Electron para abrir el diálogo nativo
        const selectedPath = await window.electronAPI.seleccionarArchivoRefExt();

        if (selectedPath) {
          referenciaExt.value = selectedPath;
        }
      } else {
        console.error('Electron no está disponible.');
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al intentar seleccionar el archivo, intente nuevamente por favor.', life: 3000 });
      }
    };

    const handleOptions = (opcion) => {

      referenciaExt.value = '';
      if (opcion == 'dato') {
        showDato.value = true;
        showDocumentoHipervinculo.value = false;
      } else {
        showDato.value = false;
        showDocumentoHipervinculo.value = true;
      }
    }


    const abrirDialogEstado = (req) => {

      if (req.estado == 'Completado') {
        showDialogRevertirEstado.value = true;
        reqSeleccionado.value = req;
        return;
      }


      showDato.value = false;
      showDocumentoHipervinculo.value = false;

      reqSeleccionado.value = req;
      showDialogEstado.value = true;

    }

    const handleRequerimiento = () => {
      showDataTable.value = true;
      showCerrarReq.value = true;
      showForm.value = false;
      if (showFilters.value) {
        showFilters.value = false;
      }
      if (filter.value) {
        filter.value = null;
      }
    }

    const handleInicio = () => {
      showCerrarReq.value = false;
      showFilters.value = false;
      showForm.value = false;
      showDataTable.value = true;
      filter.value = null;
      obtenerRequerimientos()
    }

    const reiniciarFormulario = () => {
      registroGuardado.value = false;

      if (dataRequerimientos.value.length === 0) {
        // Si no hay datos en la base, se comienza desde un número inicial
        numeroRequerimiento.value = "RQM-1012";
      } else {
        // Buscar el último número de requerimiento en la base de datos
        const numeros = dataRequerimientos.value.map(req => {
          const partes = req.numero_requerimiento.split("-");
          return partes.length > 1 ? parseInt(partes[1], 10) : 0;
        });

        // Encontrar el número más alto actual
        const ultimoNumero = Math.max(...numeros);

        // Generar el siguiente número en formato "RQM-XXXX"
        const siguienteNumero = (ultimoNumero + 1).toString().padStart(4, '0');
        numeroRequerimiento.value = `RQM-${siguienteNumero}`;
      }

      // Limpiar los campos del formulario
      documentoReferencia.value = null;
      plantaSeleccionada.value = null;
      sector.value = null;
      cantidad.value = null;
      insumoMaterial.value = null;
      observacion.value = null;
    };


    const handleForm = () => {
      showForm.value = true;
      showDataTable.value = false;
      if (showFilters.value) showFilters.value = false;

      if (filter.value) filter.value = null;

      if (showCerrarReq) showCerrarReq.value = false;
    }
    const handleFilters = () => {
      showDataTable.value = true;
      showFilters.value = true;
      showForm.value = showForm.value = false;
      if (showCerrarReq) showCerrarReq.value = false;
      filter.value = ''
    }
    const handleFilter = (nombreFiltro) => {
      filter.value = nombreFiltro;
      fechaInicioFiltro.value = null;
      fechaFinFiltro.value = null;
    }


    const guardarRequerimientos = async () => {

      if (!fechaActual.value || !numeroRequerimiento.value || !remitente.value || !documentoReferencia.value || !plantaSeleccionada.value.nombre ||
        !sector.value || !insumoMaterial.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos', life: 3000 });
        return
      }

      const datosFormulario = {
        fecha: fechaActual.value ? formatFechaDate(fechaActual.value) : null,
        numeroRequerimiento: numeroRequerimiento.value,
        remitente: remitente.value,
        documentoReferencia: documentoReferencia.value,
        planta: plantaSeleccionada.value.nombre,
        sector: sector.value,
        cantidad: cantidad.value,
        insumoMaterial: insumoMaterial.value,
        observacion: observacion.value,
        estado: estado.value
      };

      try {
        const response = await window.electronAPI.guardarRequerimientos(datosFormulario);
        if (response.success) {
          dataRequerimientos.value.push(response.data)
          registroGuardado.value = true;
          toast.add({ severity: 'success', summary: 'Éxito', detail: 'Datos guardados correctamente', life: 3000 });

          // setTimeout(() => {
          //  Extraer el número de `numeroRequerimiento.value` y calcular el siguiente
          // const partes = numeroRequerimiento.value.split("-");
          // const nuevoNumero = (parseInt(partes[1], 10) + 1).toString().padStart(4, '0');
          // numeroRequerimiento.value = `RQM-${nuevoNumero}`;
          // }, 500);

        } else {

          if (response.error === 'numero de requerimiento repetido.') {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Ya existe un registro con este número de requerimiento, por favor reinicia el formulario', life: 5000 });
            return;
          }
        }
      } catch (error) {
        console.log(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar los datos, intente nuevamente', life: 3000 });
      }
    }

    const filtrarInsumos = async () => {

      if (!insumoMaterialFiltro.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor ingrese un insumo, material o repuesto.', life: 3000 });
        return;
      }

      try {
        const filtros = {
          insumoMaterial: insumoMaterialFiltro.value,
          anio: anioFiltro.value,
          mes: mesFiltro.value,
          dia: diaFiltro.value,
        };

        // Enviamos los filtros al backend
        const response = await window.electronAPI.filtrarInsumos(filtros);

        if (response.success) {
          // Actualizamos los datos de la tabla con los resultados filtrados
          dataRequerimientos.value = response.data;
        } else {
          console.error('Error al filtrar datos:', response.error);
        }
      } catch (error) {
        console.error('Error al realizar la consulta:', error);
      }
    }

    const filtrarNumeroReq = async (cerrarReq) => {
      if (!numeroRequerimientoFiltro.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor ingrese un número o código de requerimiento.', life: 3000 });
        return;
      }
      try {
        const response = await window.electronAPI.filtrarNumeroReq(numeroRequerimientoFiltro.value);
        if (response.success) {

          dataRequerimientos.value = response.data;

          if (cerrarReq === 'cerrar requerimiento') {
            cerrandoReq.value = true;
          }

          if (response.data.length < 1) {
            toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'No se encontraron resultados.', life: 4000 });
            return;
          }
          toast.add({ severity: "success", summary: "Éxito", detail: "Datos filtrados correctamente.", life: 3000 });
        }

      } catch (error) {
        console.log(error)
      }

    }

    const filtrarRequerimientoInsumoRango = async () => {

      if (!fechaInicioFiltro.value || !fechaFinFiltro.value) {

        toast.add({ severity: 'error', summary: 'Campos incompletos', detail: 'Por favor selecciona las fechas de inicio y/o de fin', life: 3000 });
        return;
      }

      if (!insumoMaterialFiltro.value) {
        toast.add({ severity: 'error', summary: 'Campos incompletos', detail: 'Por favor ingrese un insumo o material', life: 3000 });
        return;
      }

      try {
        const formatoFechaInicio = new Date(fechaInicioFiltro.value).toISOString().split('T')[0]; // A formato YYYY-MM-DD
        const formatoFechaFin = new Date(fechaFinFiltro.value).toISOString().split('T')[0];       // A formato YYYY-MM-DD

        const response = await window.electronAPI.filtrarRequerimientoInsumoRango(
          insumoMaterialFiltro.value,
          formatoFechaInicio,
          formatoFechaFin
        );
        if (response.success) {
          dataRequerimientos.value = response.data;

          if (response.data.length < 1) {
            toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'No se encontraron resultados.', life: 4000 });
            return;
          }

          toast.add({ severity: "success", summary: "Éxito", detail: "Datos filtrados correctamente.", life: 3000 });


        } else {
          toast.add({
            severity: 'info',
            summary: 'Sin resultados',
            detail: 'No se encontraron registros con los filtros especificados',
            life: 3000
          });
        }
      } catch (error) {
        console.error(error);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al filtrar los datos, intente nuevamente',
          life: 3000
        });
      }
    };


    const filtrarSector = async () => {

      if (!sectorFiltro.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor ingrese un sector.', life: 3000 });
        return;
      }

      try {
        const filtros = {
          sector: sectorFiltro.value,
          anio: anioFiltro.value,
          mes: mesFiltro.value,
          dia: diaFiltro.value,
        };

        // Enviamos los filtros al backend
        const response = await window.electronAPI.filtrarSector(filtros);

        if (response.success) {
          // Actualizamos los datos de la tabla con los resultados filtrados
          dataRequerimientos.value = response.data;
        } else {
          console.error('Error al filtrar datos:', response.error);
        }
      } catch (error) {
        console.error('Error al realizar la consulta:', error);
      }
    }


    const filtrarRequerimientoSectorRango = async () => {

      if (!fechaInicioFiltro.value || !fechaFinFiltro.value) {

        toast.add({ severity: 'error', summary: 'Campos incompletos', detail: 'Por favor selecciona las fechas de inicio y/o de fin.', life: 3000 });
        return;
      }

      if (!sectorFiltro.value) {
        toast.add({ severity: 'error', summary: 'Campos incompletos', detail: 'Por favor ingrese un sector.', life: 3000 });
        return;
      }

      try {
        const formatoFechaInicio = new Date(fechaInicioFiltro.value).toISOString().split('T')[0]; // A formato YYYY-MM-DD
        const formatoFechaFin = new Date(fechaFinFiltro.value).toISOString().split('T')[0];       // A formato YYYY-MM-DD

        const response = await window.electronAPI.filtrarRequerimientoSectorRango(
          sectorFiltro.value,
          formatoFechaInicio,
          formatoFechaFin
        );
        if (response.success) {
          dataRequerimientos.value = response.data;

          if (response.data.length < 1) {
            toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'No se encontraron resultados.', life: 4000 });
            return;
          }

          toast.add({ severity: "success", summary: "Éxito", detail: "Datos filtrados correctamente.", life: 3000 });

        } else {
          toast.add({ severity: 'info', summary: 'Sin resultados', detail: 'No se encontraron registros con los filtros especificados', life: 3000 });
        }
      } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al filtrar los datos, intente nuevamente', life: 3000 });
      }
    };


    function filtrarRequerimientos() {
      // Filtrar según el estado de mostrarReqCerrados
      if (mostrarReqCerrados.value) {
        // Mostrar abiertos (referencia_externa es falsy)
        dataRequerimientos.value = dataRequerimientosOr.value.filter(
          (item) => item.estado == 'Pendiente'
        );

        toast.add({ severity: "info", summary: "Éxito", detail: "Mostrando requerimientos pendientes.", life: 3000 });

      } else {
        // Mostrar cerrados (referencia_externa es truthy)
        dataRequerimientos.value = dataRequerimientosOr.value.filter(
          (item) => item.estado == 'Completado'
        );
        toast.add({ severity: "info", summary: "Éxito", detail: "Mostrando requerimientos completados.", life: 3000 });

      }
      mostrarReqCerrados.value = !mostrarReqCerrados.value
    }


    const eliminarRequerimiento = async (id) => {

      try {
        const response = await window.electronAPI.eliminarRequerimiento(id);
        if (response.success) {
          return { success: true, error: response.error }
        }
      } catch (error) {
        return { success: false, error: response.error }
      }
    }

    const confirmarEliminacion = (requerimiento) => {

      const { id, numero_requerimiento } = requerimiento;

      confirm.require({
        message: `¿Estás seguro de eliminar el ${numero_requerimiento}?`,
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

          const eliminacion = await eliminarRequerimiento(id);

          if (eliminacion.success) {
            const indexRequerimiento = dataRequerimientos.value.findIndex(i => i.id === id)

            if (indexRequerimiento !== -1) {

              dataRequerimientos.value.splice(indexRequerimiento, 1);
            }
            // dataRequerimientos.value = dataRequerimientos.value.filter(informe => informe.id !== id);


            toast.add({ severity: 'info', summary: 'Éxito', detail: `${numero_requerimiento} eliminado correctamente`, life: 5000 });
          } else {

            // if (eliminacion.error == 'No se encontró el informe') {
            //   toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontró el requerimient, error al eliminarlo, intente nuevamente', life: 3000 });
            // }

            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el requerimiento, intente nuevamente', life: 3000 });

          }

        },
        reject: () => {
          // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
      });

    }




    const abrirDialogEditar = (requerimiento) => {
      requerimientoEdicion.value = { ...requerimiento };
      showDialogEditar.value = true;
    }

    const actualizarRequerimiento = async () => {

      try {
        const requerimientoActualizado = {
          ...requerimientoEdicion.value,
          fecha: formatFechaToYYYYMMDD(requerimientoEdicion.value.fecha)
        };

        const response = await window.electronAPI.actualizarRequerimiento(requerimientoActualizado);

        if (response.success) {
          const indexRequerimiento = dataRequerimientos.value.findIndex(req => req.id === requerimientoEdicion.value.id);

          if (indexRequerimiento !== -1) {

            dataRequerimientos.value[indexRequerimiento] = {
              ...dataRequerimientos.value[indexRequerimiento],
              ...requerimientoActualizado, fecha: formatFechaDDMMYYYY(requerimientoActualizado.fecha)
            };

            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Requerimiento actualizado correctamente', life: 3000 });
          }
        }
      } catch (error) {
        toast.add({ severity: "error", summary: "Error", detail: "No se pudo actualizar el requerimiento intente nuevamente", life: 5000 });

      } finally {
        showDialogEditar.value = false;

      }
    }




    const obtenerRequerimientos = async () => {

      try {
        const response = await window.electronAPI.obtenerRequerimientos();
        if (response.success) {
          dataRequerimientos.value = response.data;
          dataRequerimientosOr.value = response.data;

          const NUMERO_INICIAL = 1012; // Punto de partida mínimo

          // Extraer los números de los valores de "numero_requerimiento"
          const numeros = response.data.map(req => {
            const partes = req.numero_requerimiento.split("-"); // Dividir la cadena en partes
            return partes.length > 1 ? parseInt(partes[1], 10) : 0; // Obtener la parte numérica
          });

          // Encontrar el número más alto actual
          const ultimoNumero = numeros.length > 0 ? Math.max(...numeros) : 0;

          // Determinar el siguiente número basado en la regla establecida
          const siguienteNumero = ultimoNumero >= NUMERO_INICIAL ? ultimoNumero + 1 : NUMERO_INICIAL;
          // Generar el siguiente número en formato "RQM-XXXX"
          numeroRequerimiento.value = `RQM-${siguienteNumero.toString().padStart(4, '0')}`;

        } else {
          throw new Error('error al obtener los datos')
        }
      } catch (error) {
        console.log(error)
      }
    }

    const formatearFecha = (fecha) => {

      const fechaDate = new Date(fecha);
      const dia = String(fechaDate.getDate()).padStart(2, '0'); // Asegurarse de que el día tenga dos dígitos
      const mes = String(fechaDate.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0, así que sumamos 1
      const año = fechaDate.getFullYear();

      const fechaFormateada = `${dia}/${mes}/${año}`;
      return fechaFormateada;
    }


    const cerrarRequerimiento = async () => {

      if (!movimientoMaterial.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor, ingrese un movimiento', life: 3000 });
        return;
      }

      try {
        const response = await window.electronAPI.cerrarRequerimiento(
          numeroRequerimientoFiltro.value,
          movimientoMaterial.value
        );

        if (response.success) {
          const updatedRecords = response.data;

          updatedRecords.forEach((updatedRecord) => {
            const index = dataRequerimientos.value.findIndex(
              (item) => item.numero_requerimiento === updatedRecord.numero_requerimiento
            );

            if (index !== -1) {
              dataRequerimientos.value[index] = updatedRecord;

              toast.add({ severity: 'success', summary: 'Éxito', detail: 'Requerimiento cerrado correctamente', life: 3000 });
              movimientoMaterial.value = null;
              numeroRequerimientoFiltro.value = null;

            } else {
              // Si no existe, añadirlo (aunque esto probablemente no sea necesario en tu caso)
              dataRequerimientos.value.push(updatedRecord);
            }
          });

        } else {

          console.warn('No se pudo actualizar el requerimiento:', response.error);
        }
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cerrar el requerimiento, intente nuevamente', life: 3000 });
      }
    };


    const abrirHipervinculoRequerimiento = async (hipervinculo) => {
      if (hipervinculo && window.electronAPI) {
        await window.electronAPI.abrirHipervinculoRequerimiento(hipervinculo);
      }
    };

    const generarPdf = () => {

      if (!registroGuardado.value) {
        toast.add({ severity: 'warn', summary: 'Error', detail: 'Debe guardar el registro antes de generar el PDF', life: 3000 });
        return
      }

      const doc = new jsPDF('p', 'mm', 'a4');


      //RECTANGULO INPUTS SUPERIORES
      doc.rect(3, 30, 204, 98)

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
      doc.text(`${formatearFecha(fechaActual.value)}`, 176, 10);


      doc.setFont('helvetica', 'bold');
      doc.rect(173, 17, 30, 5) //rectangulo n° req
      doc.text(`N° REQUERIMIENTO:`, 139, 21)
      doc.setFont('helvetica', 'normal');
      doc.text(`${numeroRequerimiento?.value}`, 176, 21)

      doc.setFont('helvetica', 'bold');
      doc.text(`DIRIGIDO A: `, 7, 40);
      doc.rect(47, 36, 157, 5) //rec codigo informe
      doc.setFont('helvetica', 'normal');
      doc.text(`${remitente.value}`, 49, 40)

      doc.setFont('helvetica', 'bold');
      doc.text(`DOCUMENTO REF.:`, 7, 50)
      doc.rect(47, 46, 157, 5)
      doc.setFont('helvetica', 'normal');
      doc.text(`${documentoReferencia.value}`, 49, 50)

      doc.setFont('helvetica', 'bold');
      doc.text(`DESTINO.:`, 104, 60)
      doc.setFont('helvetica', 'normal');



      //SEGUNDO CUADRO DE INPUTS


      //RECTANGULO INPUTS INFERIORES
      // doc.rect(3, 81, 204, 100)

      doc.setFont('helvetica', 'bold');
      doc.text(`PLANTA: `, 7, 70);
      doc.rect(47, 66, 157, 5) //rec codigo informe
      doc.setFont('helvetica', 'normal');
      doc.text(`${plantaSeleccionada.value.nombre}`, 49, 70)

      doc.setFont('helvetica', 'bold');
      doc.text(`SECTOR:`, 7, 80)
      doc.rect(47, 76, 157, 5)
      doc.setFont('helvetica', 'normal');
      doc.text(`${sector.value}`, 49, 80)

      // doc.setFont('helvetica', 'bold');
      // doc.text(`CANTIDAD:`, 7, 100)
      // doc.rect(47, 96, 157, 5)
      // doc.setFont('helvetica', 'normal');
      // doc.text(`${cantidad?.value}`, 49, 100)

      doc.setFont('helvetica', 'bold');
      doc.text(`INSUMO / MATERIAL:`, 7, 110)
      doc.rect(47, 106, 157, 5)
      doc.setFont('helvetica', 'normal');
      doc.text(`${insumoMaterial.value}`, 49, 110)


      doc.setFont('helvetica', 'bold');
      doc.text(`ESTADO:`, 7, 120)
      doc.rect(47, 116, 157, 5)
      doc.setFont('helvetica', 'normal');
      doc.text(`${estado.value}`, 49, 120);


      // RECTÁNGULO OBSERVACIONES
      // doc.setFont('helvetica', 'bold');
      // doc.rect(3, 129, 204, 80);
      // doc.text(`OBSERVACIÓN: `, 7, 137);
      // doc.rect(7, 140, 196, 60);

      // Ajustar el texto dentro del rectángulo
      doc.setFont('helvetica', 'normal');
      const maxWidth = 185; // Ancho máximo del texto dentro del rectángulo
      const textLines = doc.splitTextToSize(observacion.value || '', maxWidth);

      // // Imprimir el texto multilínea
      doc.text(textLines, 10, 144);



      doc.setFont('helvetica', 'bold');
      doc.text('Firma por Contratista', 6, 290)
      doc.rect(5, 260, 55, 25)  //Tecnico Contratista

      doc.text('Firma por Inspección Y.P.F.', 151, 290)
      doc.rect(150, 260, 55, 25) //Inspector Mantenimiento



      const appLogo = new Image();
      appLogo.src = logo;
      appLogo.onload = () => {
        doc.addImage(appLogo, 'PNG', 4, 7, 15, 15);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('REGISTRO DE REQUERIMIENTOS', 28, 16);



        doc.save(`${numeroRequerimiento.value}.pdf`);
      }
    }


    const exportarExcel = () => {
      // Mapear los datos al formato requerido
      const formattedData = dataRequerimientos.value.map((item) => ({
        "Número Requerimiento": item.numero_requerimiento || "-",
        "Fecha": item.fecha ? formatFechaExcel(item.fecha) : "-", // Formatear las fechas
        "Dirigido a": item.remitente || "-",
        "Documento Referencia": item.documento_referencia || "-",
        "Planta / Sector Destino": item.planta || "-",
        "Sector Destino": item.sector || "-",
        "Detalle de Repuesto / Material": item.insumo_material_repuesto || "-",
        "Estado": item.estado || "-",
        //"Referencia Externa": item.referencia_externa || "-",
        // "Observacion": item.observacion || "-",
        // "Cantidad": item.cantidad || "-",
      }));
      //numero_requerimiento, referencia_externa, remitente, documento_referencia, planta, sector, cantidad, insumo_material_repuesto, observacion, fecha
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
        { wch: 25 }, // Ancho para la primera columna (NUMERO REQUERIMIENTO)
        { wch: 12 }, // Ancho para la segunda columna (FECHA)
        { wch: 38 }, // Ancho para la segunda columna (DIRIGIDO A)
        { wch: 50 }, // Ancho para la tercera columna (D. REF)
        { wch: 50 }, // Ancho para la quinta columna (PLANTA / SECTOR DESTINO)
        { wch: 50 }, // Ancho para la cuarta columna (SECTOR DESTINO)
        { wch: 125 }, // Ancho para la séptima columna (Detalle de Repuesto / Material)
        { wch: 50 }, // Ancho para la oct columna (ESTADO)
    //    { wch: 80 }, // Ancho para la nov columna (ref ext)
       // { wch: 25 }, // Ancho para la oct columna (OBS)
       // { wch: 25 }, // Ancho para la oct columna (CANT)

      ];

      // Crear un libro de trabajo (workbook)
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Requerimientos de Repuestos");

      // Exportar el archivo Excel
      XLSX.writeFile(workbook, "InformeRequerimientos.xlsx");
    };

    // Función para formatear las fechas a DD/MM/YYYY
    const formatFechaExcel = (fecha) => {
      const dateParts = fecha.split("-");
      if (dateParts.length === 3) {
        // Suponiendo que la fecha viene como DD-MM-YYYY
        return `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
      }
      return fecha; // Si no se puede formatear, devolver la fecha tal cual
    };

    const importarExcel = async (event) => {
      const file = event.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
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
        const columnasRequeridas = ["Número Requerimiento", 
        "Fecha", 
        "Estado", 
        "Dirigido a",
         "Documento Referencia", 
         "Planta / Sector Destino", 
         "Detalle de Repuesto / Material",
          // "Referencia Externa"
        ];

        // Normalizar columnas requeridas a minúsculas
        const columnasRequeridasNormalizadas = columnasRequeridas.map(col => col.toLowerCase());

        // Verificar si falta alguna columna después de normalizar
        const columnasFaltantes = columnasRequeridasNormalizadas.filter(
          columna => !primeraFilaNormalizada.includes(columna)
        );

        // Verificar si falta alguna columna
        if (columnasFaltantes.length > 0) {
          toast.add({
            severity: "error", summary: "No se cargaron los datos", detail: `Faltan las siguientes columnas en el archivo: ${columnasFaltantes.join(", ").toUpperCase()}`,
            life: 5000
          });
          return;
        }

        // Formatear los datos
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
           

            switch (normalizedKey) {
              case 'fecha':
                if (!validarFormatoFecha(row[key])) {
                  fechasInvalidas.push({ columna: normalizedKey.toUpperCase(), fechaInvalida: row[key] })
                }
                break;

            }
          });

          return {
            numero_requerimiento: normalizedRow["número requerimiento"],
            fecha: normalizedRow["fecha"] ? formatFechaToYYYYMMDD(normalizedRow["fecha"]) : null,
            estado: normalizedRow["estado"] || null,
            remitente: normalizedRow["dirigido a"] || null,
            documento_referencia: normalizedRow["documento referencia"] || null,
            planta: normalizedRow["planta / sector destino"] || null,
            sector: normalizedRow["sector destino"] || null,
            insumo_material_repuesto: normalizedRow["detalle de repuesto / material"] || null,
            // referencia_externa: normalizedRow["referencia externa"] || null,
            // observacion: normalizedRow["observación"] || null,
            // cantidad: normalizedRow["cantidad"] || null,
          }
        });

        if (fechasInvalidas.length > 0) {
          const columnasInvalidas = [...new Set(fechasInvalidas.map(item => item.columna))];
          const mensaje = `Se encontraron fechas con un formato distinto a 'DD/MM/YYYY' en las siguientes columnas: ${columnasInvalidas.map(col => `"${col}"`).join(", ")}`;
          toast.add({ severity: "error", summary: "Fechas Inválidas", detail: mensaje, life: 9000 });
          return;
        }

        try {
          const response = await guardarExcelRequerimientos(formattedData);

          if (response.success) {
            // Si el guardado es exitoso, actualizar el DataTable
            dataRequerimientos.value = response.data.map((row) => ({
              ...row,
              fecha: row.fecha ? formatFechaDDMMYYYY(row.fecha) : null,
            }));
            toast.add({ severity: "success", summary: "Éxito", detail: "Datos cargados correctamente.", life: 3000 });
          } else {
            if (response.error == 'Campos incompletos') {

              if (response.campoIncompleto == 'Campo desconocido') {
                toast.add({ severity: "error", summary: `Error al cargar los datos`, detail: "El archivo excel posee datos incompletos.", life: 6000 });
              } else {
                toast.add({ severity: "error", summary: `Error al cargar los datos`, detail: `El archivo excel posee datos incompletos, revisar los datos de la columna "${response.campoIncompleto}".`, life: 6000 });
              }
            }
          }
        } catch (error) {
          console.error(error);
          toast.add({ severity: "error", summary: "Error", detail: "Error al cargar los datos, intente nuevamente.", life: 3000 });
        }
      };

      reader.readAsArrayBuffer(file);
    };

    const guardarExcelRequerimientos = async (datos) => {
      try {
        const response = await window.electronAPI.guardarExcelRequerimientos(datos);
        return response;
      } catch (error) {
        console.error("Error al guardar datos en la base de datos:", error);
        return response;
      }
    };

    const convertirFechaYYYYMMDD = (fecha) => {
      if (typeof fecha === "number") {
        const excelDate = XLSX.SSF.parse_date_code(fecha);
        const date = new Date(excelDate.y, excelDate.m - 1, excelDate.d);
        return date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
      }

      // Verificar si la fecha está en formato MM/DD/YY (mes/día/año de 2 dígitos)
      const dateParts = fecha.split(/[\/-]/);
      if (dateParts.length === 3) {
        const [first, second, third] = dateParts;

        // Verificar si el primer número es un mes válido (1-12)
        const isMonth = first >= 1 && first <= 12;

        // Si es un mes, es formato MM/DD/YY
        if (isMonth) {
          const month = first.padStart(2, "0");
          const day = second.padStart(2, "0");
          let year = third.length === 2 ? `20${third}` : third;

          // Ajuste para fechas del siglo pasado (si el año es entre 50-99, se asume siglo 1900)
          if (third.length === 2 && parseInt(third) >= 50) {
            year = `19${third}`;
          }

          return `${year}-${month}-${day}`;
        }

        // Si no es un mes válido, asumimos que la fecha está en formato DD/MM/YYYY
        const day = first.padStart(2, "0");
        const month = second.padStart(2, "0");
        const year = third;

        // Ajuste para fechas del siglo pasado (si el año es entre 50-99, se asume siglo 1900)
        if (third.length === 2 && parseInt(third) >= 50) {
          return `19${third}-${month}-${day}`;
        }

        return `${year}-${month}-${day}`;
      }

      // Si no coincide con el formato esperado, retornamos la fecha original
      return fecha;
    };



    // Convertir una fecha de YYYY-MM-DD a DD-MM-YYYY
    const convertirFechaDDMMYYYY = (fecha) => {
      const [year, month, day] = fecha.split("-");

      return `${day}-${month}-${year}`;
    };


    const generarListadoPDF = () => {
      if (!dataRequerimientos.value || dataRequerimientos.value.length === 0) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No hay datos para generar el PDF', life: 3000 });
        return;
      }

      const doc = new jsPDF("l", "mm", "a4"); // Cambiamos a orientación horizontal (landscape)

      // Agregar logo
      const appLogo = new Image();
      appLogo.src = logo;
      appLogo.onload = () => {
        doc.addImage(appLogo, "PNG", 10, 10, 20, 20);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("REGISTRO DE REQUERIMIENTOS DE REPUESTOS", doc.internal.pageSize.width / 2, 15, { align: "center" });
        doc.setFontSize(10);

        if (tipoFiltradoPdf.value) {
          doc.text(`FILTRADO POR ${tipoFiltradoPdf.value}`, doc.internal.pageSize.width / 2, 22, { align: "center" });
        }

        //  (remitente, documento_referencia, planta, sector, cantidad, insumo_material_repuesto, observacion, fecha, numero_requerimiento, estado) 

        // Definir columnas y títulos
        const columnas = [
          { title: "FECHA", dataKey: "fecha" },
          { title: "N° REQUERIMIENTO", dataKey: "numero_requerimiento" },
          { title: "DIRIGIDO A.", dataKey: "remitente" },
          { title: "DOC. REFERENCIA", dataKey: "documento_referencia" },
          { title: "PLANTA / SECTOR", dataKey: "planta_sector" }, // Columna personalizada
          { title: "REPUESTO / MATERIAL", dataKey: "insumo_material_repuesto" },
          { title: "ESTADO.", dataKey: "estado" },
          // { title: "REF. EXTERNA", dataKey: "referencia_externa" },
          // { title: "CANTIDAD", dataKey: "cantidad" },
          // { title: "OBSERVACIÓN", dataKey: "observacion" },
        ];

        const filas = dataRequerimientos.value.map(item => {
          return columnas.reduce((obj, col) => {
            if (col.dataKey === "planta_sector") {
              // Crear el formato personalizado
              obj[col.dataKey] = `${item.planta || "-"}/${item.sector || "-"}`;
            } else {
              // Procesar los demás valores normalmente
              obj[col.dataKey] = item[col.dataKey] || "-";
            }
            return obj;
          }, {});
        });


        // Configurar tabla con mejores ajustes
        autoTable(doc, {
          startY: 40,
          head: [columnas.map(col => col.title)],
          body: filas.map(fila => columnas.map(col => fila[col.dataKey])),
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [0, 128, 255], textColor: 255, fontStyle: "bold", fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 25 }, //Fecha
            1: { cellWidth: 30 }, //n° requerimiento
            2: { cellWidth: 45 }, //Dirigido a 
            3: { cellWidth: 45 }, //Doc. Referencia
            4: { cellWidth: 55 }, //planta / sector
            5: { cellWidth: 68 },//Repuesto / material
            6: { cellWidth: 25 }, //estado
            // 7: { cellWidth: 30 }, // ref. externa
            // 8: { cellWidth: 25 }, // cantidad
            // 9: { cellWidth: 43 }, // observacion
          },
          margin: { left: 2, right: 2 },
          theme: "grid"
        });

        // Guardar PDF
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const nombrePdf = tipoFiltradoPdf.value ? `INFREQ-${yyyy}-${mm}-${dd}-FILTRADO-POR-${tipoFiltradoPdf.value}.pdf` : `INFREQ-${yyyy}-${mm}-${dd}.pdf`;
        doc.save(nombrePdf);
      };
    };




    onMounted(() => {
      const today = new Date();
      fechaActual.value = today;
      obtenerRequerimientos()
    })
    return {
      documentoReferencia,
      remitente,
      numeroRequerimiento,
      fechaActual,
      plantas,
      plantaSeleccionada,
      cantidad,
      insumoMaterial,
      observacion,
      sector,
      showForm,
      showFilters,
      handleForm,
      handleFilters,
      dataRequerimientos,
      insumoMaterialFiltro,
      anioFiltro,
      mesFiltro,
      diaFiltro,
      sectorFiltro,
      numeroRequerimientoFiltro,
      guardarRequerimientos,
      obtenerRequerimientos,
      generarPdf,
      formatearFecha,
      filtrarInsumos,
      filtrarSector,
      filtrarNumeroReq,
      handleFilter,
      filter,
      filtrarRequerimientoSectorRango,
      fechaInicioFiltro,
      fechaFinFiltro,
      filtrarRequerimientoInsumoRango,
      handleRequerimiento,
      showCerrarReq,
      cerrandoReq,
      movimientoMaterial,
      cerrarRequerimiento,
      mostrarReqCerrados,
      filtrarRequerimientos,
      importarExcel,
      guardarExcelRequerimientos,
      convertirFechaDDMMYYYY,
      convertirFechaYYYYMMDD,
      exportarExcel,
      formatFechaExcel,
      estado,
      reqSeleccionado,
      showDialogEstado,
      showDialogRevertirEstado,
      abrirDialogEstado,
      showDato,
      showDocumentoHipervinculo,
      handleOptions,
      referenciaExt,
      seleccionarArchivoRefExt,
      modificarEstadoRequerimiento,
      logo,
      generarListadoPDF,
      tipoFiltradoPdf,
      showDataTable,
      reiniciarFormulario,
      registroGuardado,
      handleInicio,
      reiniciarValores,
      formatFechaDate,
      abrirHipervinculoRequerimiento,
      formatFechaExcel,
      validarFormatoFecha,
      dataRequerimientosOr,
      formatFechaToYYYYMMDD,
      formatFechaDDMMYYYY,
      showDialogEditar,
      requerimientoEdicion,
      abrirDialogEditar,
      actualizarRequerimiento,
      confirmarEliminacion,
      eliminarRequerimiento

    }

  }

})
</script>