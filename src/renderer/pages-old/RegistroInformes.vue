<template>
  <!-- {{informeEdicion}} -->
  <div :class="`flex ${showForm ? 'justify-end' : 'justify-between'}  items-center p-4  `">
    <h1 v-if="!showForm" class="text-center  font-semibold text-xl"> Registro de Informes y Servicios</h1>
    <div>
      <Button @click="handleInicio" :disabled="!showForm && !showFilters" icon="pi pi-list" label="Registros" />
      <Button @click="handleFilters" class="mx-2 " icon="pi pi-filter" label="Filtrar" />
      <Button type="button" label="Nuevo" icon="pi pi-plus" @click="handleForm" />
    </div>

  </div>
  <div v-if="showFilters" class="px-10 flex flex-col items-start justify-center">
    <h1 class="font-semibold my-3">Seleccione método de filtrado</h1>
    <div>
      <Button outlined severity="warn" @click="handleFilter('FECHA EXACTA')" label="Fecha" />
      <Button outlined severity="warn" @click="handleFilter('RANGO DE FECHAS')" class="ml-2" label="Rango de Fechas" />
      <Button outlined severity="warn" @click="handleFilter('N° DE INFORME')" class="ml-2" label="N° de Informe" />
      <Button outlined severity="warn" @click="handleFilter('CÓDIGO DE INFORME')" class="ml-2"
        label="Código de Informe" />
      <Button outlined severity="warn" @click="handleFilter('SECTOR')" class="ml-2" label="Sector Intervenido" />
      <Button outlined severity="warn" @click="handleFilter('TIPO DE SERVICIO')" class="ml-2"
        label="Tipo de Servicio" />
    </div>
  </div>

  <div v-if="filter == 'RANGO DE FECHAS'" class="flex items-center justify-around px-10 mt-10  ">
    <div class="flex justify-between  ">
      <div class="flex  justify-center items-end  ">
        <div :class="` flex flex-col  items-start `">
          <p class="text-left  font-semibold">Fecha Inicio:</p>
          <DatePicker v-model="fechaInicioFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
            :showIcon="true" />
        </div>
        <!-- <Button @click="filtrarCorrectivosFecha" class="ml-2 w-full">Filtrar</Button> -->
      </div>
    </div>

    <div class="flex justify-between">
      <div class="flex  justify-center items-end  ">
        <div :class="` flex flex-col  items-start `">
          <p class="text-left  font-semibold">Fecha Fin:</p>
          <DatePicker v-model="fechaFinFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
            :showIcon="true" />
        </div>
        <Button @click="filtrarInformeServiciosRangoFecha" class="ml-2 w-full">Filtrar</Button>
      </div>
    </div>

    <Button icon="pi pi-refresh" class="mt-auto" label="Reiniciar" outlined severity="danger"
      @click="reiniciarValores" />
  </div>


  <div v-if="filter == 'FECHA EXACTA'" class="flex justify-between mt-10  px-10">

    <div class="flex  justify-center items-end mb-3 ">
      <div :class="` flex flex-col  items-start `">
        <p class="text-left  font-semibold">Fecha:</p>
        <DatePicker v-model="fechaFiltro" :invalid="validacion.fecha" class="w-64" aria-required="required"
          dateFormat="dd/mm/yy" :showIcon="true" />
      </div>
      <Button @click="filtrarInformeServiciosFecha" class="ml-2 w-full">Filtrar</Button>
    </div>

    <Button icon="pi pi-refresh" class="my-auto" label="Reiniciar" outlined severity="danger"
      @click="reiniciarValores" />
  </div>

  <div v-if="filter == 'N° DE INFORME'" class="flex justify-between mt-10  px-10">
    <div class="flex  justify-center items-end mb-3 ">
      <div class="flex flex-col">
        <label class="legend  text-start font-semibold">N° de Informe</label>
        <InputNumber v-model="numInformeFiltro" placeholder="Ingrese el número de informe" />
      </div>
      <Button @click="filtrarInformeServiciosNumInforme" class="ml-2 w-full">Filtrar</Button>
    </div>

    <Button icon="pi pi-refresh" class="my-auto" label="Reiniciar" outlined severity="danger"
      @click="reiniciarValores" />
  </div>

  <div v-if="filter == 'CÓDIGO DE INFORME'" class="flex justify-between mt-10  px-10">
    <div class="flex  justify-center items-end mb-3 ">
      <div class="flex flex-col">
        <label class="legend  text-start font-semibold">Código de Informe</label>
        <InputText v-model="codigoInformeFiltro" placeholder="Ingrese el número de informe" />
      </div>
      <Button @click="filtrarInformeServiciosCodInforme" class="ml-2 w-full">Filtrar</Button>
    </div>

    <Button icon="pi pi-refresh" class="my-auto" label="Reiniciar" outlined severity="danger"
      @click="reiniciarValores" />
  </div>


  <div v-if="filter == 'SECTOR'" class="flex justify-between mt-10  px-10">
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
      <Button @click="filtrarInformeServiciosSectorRango" class="ml-2 w-full">Filtrar</Button>
    </div>

    <Button icon="pi pi-refresh" class="mt-auto" label="Reiniciar" outlined severity="danger"
      @click="reiniciarValores" />
  </div>

  <div v-if="filter == 'TIPO DE SERVICIO'" class="flex justify-between mt-10  px-10">
    <div class="flex  justify-center items-end mb-3 ">
      <div class="flex flex-col">
        <label class="legend  text-start font-semibold">Tipo de Servicio</label>
        <Select v-model="servicioFiltro" :options="servicios" optionLabel="nombre"
          placeholder="Selecciones el tipo de servicio" />
        <!-- <InputText v-model="servicioFiltro"  /> -->
      </div>
      <Button @click="filtrarInformeServicioTipoServicio" class="ml-2 w-full">Filtrar</Button>
    </div>

    <Button icon="pi pi-refresh" class="my-auto" label="Reiniciar" outlined severity="danger"
      @click="reiniciarValores" />
  </div>


  <Form v-if="showForm" class="px-3 pb-20">

    <div>
      <h1 class="text-center text-3xl font-semibold mt-6  ">
        Registro de Informes y Servicios
      </h1>
      <div>
        <div class="inputs-container flex flex-col items-end mb-4">
          <div class="input-group flex items-center mb-3">
            <label class="legend w-40 text-right mr-3 font-semibold">N° Informe:</label>
            <InputNumber v-model="numeroInforme" :invalid="validacion.numeroInforme" class="w-64" />

          </div>
          <div :class="`input-group flex items-center `">
            <p class="legend w-40 text-right mr-3 font-semibold">Fecha:</p>
            <DatePicker v-model="fechaActual" :invalid="validacion.fecha" class="w-64" aria-required="required"
              dateFormat="dd/mm/yy" :showIcon="true" />
          </div>
        </div>
      </div>

    </div>
    <!-- Grid de inputs alineados -->
    <div class="grid grid-cols-2 gap-4 p-4 border border-gray rounded-lg ">
      <!-- Columna 1 -->
      <div class="col-span-1 space-y-4 flex flex-col    justify-between">
        <div class="flex  items-center justify-start">
          <label class="legend w-2/5  text-left font-semibold">Nombre / Código de informe:</label>
          <InputText v-model="codigoInforme" :invalid="validacion.codigoInforme" class="w-3/5 "
            aria-required="required" />


        </div>
        <div class="input-group flex items-center justify-between">
          <label class="legend w-2/5 text-left font-semibold">N° de Permiso de Trabajo Asociado:</label>
          <InputText v-model="numeroPermiso" :invalid="validacion.numeroPermiso" class="w-3/5"
            aria-required="required" />

        </div>



        <div class="flex items-center  justify-between">
          <label class="legend w-2/5 text-left font-semibold">Solicitante:</label>
          <InputText v-model="solicitante" :invalid="validacion.solicitante" readonly class="w-3/5" />

        </div>
      </div>

      <!-- Columna 2 -->
      <div class="col-span-1 space-y-4 flex flex-col bg-red">

        <div class="flex justify-between items-center ">
          <label class=" w-2/5  text-right font-semibold mr-3">Planta:</label>
          <Select v-model="planta" :invalid="validacion.planta" optionLabel="nombre" class="w-3/5 "
            :options="plantas" />
        </div>

        <div class="input-group flex justify-between items-center">

          <p class=" w-2/5  text-right  mr-3 font-semibold">Sector Intervenido: </p>
          <InputText v-model="sector" :invalid="validacion.sector" class="w-3/5 " />


        </div>
        <div class="input-group flex items-center">
          <p class="legend w-2/5 text-right mr-3 font-semibold">Tipo de Servicio:</p>
          <!-- <InputText v-model="servicio" class="w-3/5" /> -->
          <Select v-model="servicio" :invalid="validacion.servicio" optionLabel="nombre" class="w-3/5 "
            :options="servicios" />

        </div>
      </div>
    </div>
    <div class="mt-8 flex items-center justify-end">
      <Button label="Reiniciar" icon="pi pi-refresh" class="mr-2" outlined severity="secondary"
        @click="reiniciarFormulario" />
      <Button label="Guardar" icon="pi pi-save" severity="success" class="" @click="guardarInforme"
        :disabled="!formCompleto" />
      <!-- <Button v-if="showForm" type="button" label="Generar PDF" severity="danger" icon="pi pi-file-pdf"
       class=" ml-2 text-right " :disabled="!formCompleto"  @click="generarPdf"  /> -->
    </div>
  </Form>

  <Toast />

  <div class="card mt-20 px-10 pb-10">

    <DataTable v-if="showDataTable" :value="dataInformeServicios" paginator :rows="5" tableStyle="min-width: 50rem"
      showGridlines style="max-width: 90vw">
      <template #empty>
        <Message v-if="!loading" severity="error" variant="outlined">No se encontraron resultados </Message>
        <Message v-if="loading" severity="secondary" variant="outlined">Cargando... </Message>
      </template>

      <Column field="numero_informe" header="N° INFORME"></Column>
      <Column style="min-width: 9rem;" field="nombre_codigo" header="N° / NOMBRE CÓDIGO"></Column>
      <Column style="min-width: 9rem;" field="permiso_trabajo" header="N° PERMISO DE TRABAJO"></Column>
      <Column field="planta" header="PLANTA"></Column>
      <Column field="sector_intervenido" header="SECTOR INTERVENIDO"></Column>
      <Column field="tipo_servicio" header="TIPO DE SERVICIO"></Column>
      <Column style="min-width: 8rem;" field="fecha" header="FECHA"></Column>
      <Column field="solicitante" header="SOLICITANTE"></Column>
      <!-- <Column style="min-width: 9rem;" field="hipervinculoPermisoTrabajo" header="ENLACE PERMISO DE TRABAJO">
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <Button v-if="!slotProps.data.hipervinculo_permiso_trabajo" type="button" icon="pi pi-plus" severity="info"
              rounded outlined @click=" abrirDialogPermisoTrabajo(slotProps.data)" />
            <Button v-if="slotProps.data.hipervinculo_permiso_trabajo" type="button" icon="pi pi-pencil" rounded
              outlined @click=" abrirDialogPermisoTrabajo(slotProps.data, true)" />
            <p @click="abrirHipervinculoPermiso(slotProps.data.hipervinculo_permiso_trabajo)"
              class=" hover:text-blue-500 cursor-pointer hover:underline ">{{
                slotProps.data.hipervinculo_permiso_trabajo }}</p>
          </div>
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
  <div v-if="showDataTable" :class="`flex justify-end items-center p-4  `">

    <FileUpload mode="basic" name="file" chooseLabel="Importar Excel" accept=".xlsx,.xls" auto="true"
      @select="importarExcel" />
    <Button label="Exportar Excel" icon="pi pi-file-export" class="ml-2" severity="success" @click="exportarExcel" />
    <Button type="button" label="Generar PDF" severity="danger" icon="pi pi-file-pdf" class=" ml-2 text-right "
      @click="generarListadoPDF" />
  </div>


  <Dialog v-model:visible="showDialogPermisoTrabajo" modal
    :header="!editarHipervinculo ? 'Añadir Hipervínculo' : 'Editar Hipervinculo'" :style="{ width: '40rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">Selecciona el hipervínculo que desea asociar al
      permiso {{ informeSeleccionado?.permiso_trabajo }}.</span>
    <div class="flex flex-col justify-start items-start my-10  ">
      <Button label="Seleccionar archivo" icon="pi pi-file" @click="seleccionarHipervinculoPermiso('agregar editar hipervinculo')" />
      <p v-if="hipervinculoPermisoTrabajo" class="my-4 break-words whitespace-normal w-full"><b>Archivo
          seleccionado:</b>
        {{ hipervinculoPermisoTrabajo }}</p>
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancelar" severity="secondary" @click="cerrarDialogPermisoTrabajo" />
      <Button type="button" label="Guardar" severity="success" :disabled="!hipervinculoPermisoTrabajo"
        @click="agregarHipervinculoPermiso" />
    </div>
  </Dialog>

  <Dialog v-model:visible="showDialogEditar" :modal="true"
    :header="`Editar Informe N° ${informeEdicion?.numero_informe}`" class="" style="">

    <div class="grid grid-cols-4 gap-6">
      <div class="flex  flex-col">
        <label for="fecha" class="font-semibold ">Fecha</label>
        <DatePicker id="fecha" v-model="informeEdicion.fecha" class="flex-auto"  dateFormat="dd/mm/yy" autocomplete="off" />

      </div>

      <div class="flex  flex-col">
        <label for="nombre_codigo" class="font-semibold ">Nombre Codigo</label>
        <InputText id="nombre_codigo" v-model="informeEdicion.nombre_codigo" class="flex-auto" autocomplete="off" />
      </div>

      <div class="flex  flex-col">
        <label for="permiso_trabajo" class="font-semibold ">Permiso de Trabajo</label>
        <InputText id="permiso_trabajo" v-model="informeEdicion.permiso_trabajo" class="flex-auto" autocomplete="off" />
      </div>

      <div class="flex  flex-col">
        <label for="sector_intervenido" class="font-semibold ">Sector Intervenido</label>
        <InputText id="sector_intervenido" v-model="informeEdicion.sector_intervenido" class="flex-auto"
          autocomplete="off" />
      </div>

      <div class="flex  flex-col">
        <label for="tipo_servicio" class="font-semibold ">Tipo de Servicio</label>
        <!-- <InputText id="tipo_servicio" v-model="informeEdicion.tipo_servicio" class="flex-auto"
          autocomplete="off" /> -->
        <Select v-model="informeEdicion.tipo_servicio" optionLabel="nombre" class=" " :options="servicios" />
      </div>

      <div class="flex  flex-col">
        <label for="numero_informe" class="font-semibold ">Número de Informe</label>
        <InputNumber id="numero_informe" v-model="informeEdicion.numero_informe" class="flex-auto" autocomplete="off" />
      </div>

      <div class="flex  flex-col col-span-2">
        <label for="planta" class="font-semibold ">Planta</label>
        <InputText id="planta" v-model="informeEdicion.planta" class="flex-auto" autocomplete="off" />
      </div>

      <div class="flex  flex-col col-span-4">
        <label for="solicitante" class="font-semibold ">Solicitante</label>
        <InputText id="solicitante" v-model="informeEdicion.solicitante" class="flex-auto" />
      </div>

      <!-- <div class="flex items-end justify-between col-span-4">
        <div class="flex flex-col w-2/3">
          <label for="hipervinculo_permiso_trabajo" class="font-semibold ">Hipervínculo Permiso de Trabajo</label>
          <InputText id="hipervinculo_permiso_trabajo" v-model="informeEdicion.hipervinculo_permiso_trabajo"
            class="flex-auto mr-4" autocomplete="off" />
          
        </div>
        <div class="w-1/3">
          <Button label="Seleccionar archivo" class=" w-full" icon="pi pi-file"
            @click="seleccionarHipervinculoPermiso('editar hipervinculo en edicion del informe')" />

        </div>

      </div> -->
      <div>
        <Button label="Guardar" icon="pi pi-save" class="mt-5 min-w-[170px] max-w-[250px]" severity="success"
          @click="actualizarInforme" />
      </div>
    </div>

    <!-- <template #footer> -->
    <!-- <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="showDialogEditar = false" /> -->
    <!-- <Button label="Guardar" icon="pi pi-check" severity="success" @click="" /> -->
    <!-- </template> -->
  </Dialog>



  <ConfirmDialog></ConfirmDialog>

</template>

<script>

import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import logo from '../../resources/pdflogo.png';
import Select from 'primevue/select';
import DatePicker from 'primevue/datepicker';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
// import * as XLSX from "xlsx";
import * as XLSX from "xlsx-js-style";
import FileUpload from 'primevue/fileupload';
import { toRaw } from "vue";
import Message from 'primevue/message';
import Dialog from 'primevue/dialog';

import { formatFechaDate, formatFechaDDMMYYYY, validarFormatoFecha, formatFechaToYYYYMMDD } from '../utils/funcionesFecha.js'
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";

export default defineComponent({
  name: 'RegistroInformes',
  components: {
    Select,
    DatePicker,
    InputText,
    InputNumber,
    Button,
    DataTable,
    Column,
    Toast,
    FileUpload,
    Message,
    Dialog,
    ConfirmDialog

  },

  setup(props, { emit }) {



    const numeroInforme = ref(null);
    const numInformeFiltro = ref(null);
    const fechaActual = ref(null);
    const fechaFiltro = ref(null);
    const fechaInicioFiltro = ref(null);
    const fechaFinFiltro = ref(null);

    const codigoInforme = ref(null);
    const codigoInformeFiltro = ref(null);
    const numeroPermiso = ref(null);
    const sector = ref(null);
    const sectorFiltro = ref(null);
    const anioFiltro = ref(null);
    const mesFiltro = ref(null);
    const diaFiltro = ref(null);

    const solicitante = ref('INSPECCIÓN MANTENIMIENTO C.I.L.E. - Y.P.F.');
    const planta = ref(null)
    const plantas = ref([{ nombre: 'C.I.L.E LUBRICANTES' }, { nombre: 'C.I.L.E ASFALTOS' }]);
    const servicio = ref(null);
    const servicios = ref([{ nombre: 'PREVENTIVO' }, { nombre: 'CORRECTIVO' }, { nombre: 'PESAJE' }, { nombre: 'SIMULACRO' }]);
    const servicioFiltro = ref(null);

    const showForm = ref(false);
    const dataInformeServicios = ref([]);
    const showFilters = ref(false);
    const filter = ref(null);
    const tipoFiltradoPdf = ref('');
    const loading = ref(false);
    const showDataTable = ref(true);
    const registroGuardado = ref(false);
    const hipervinculoPermisoTrabajo = ref(null);
    const showDialogPermisoTrabajo = ref(false);
    const informeSeleccionado = ref(null);
    const editarHipervinculo = ref(false);
    const showDialogEditar = ref(false);

    const informeEdicion = ref({
      id: null,
      fecha: '',
      nombre_codigo: '',
      permiso_trabajo: '',
      sector_intervenido: '',
      tipo_servicio: '',
      ruta_archivo_permiso_trabajo: '',
      ruta_archivo_informe_servicio: '',
      created_at: '',
      numero_informe: '',
      planta: '',
      solicitante: '',
      hipervinculo_permiso_trabajo: ''
    });

   

    const toast = useToast()
    const confirm = useConfirm();

    const formCompleto = computed(() => {
      return (
        numeroInforme.value &&
        fechaActual.value &&
        codigoInforme.value &&
        numeroPermiso.value &&
        planta.value &&
        sector.value &&
        servicio.value &&
        solicitante.value
      );
    });

    // const confirmarActualizacion = (registroInforme) => {
    //   const { numero_informe } = registroInforme;
    // }
    const abrirDialogEditar = (registroInforme) => {
      const servicioSeleccionado = servicios.value.find(
        s => s.nombre === registroInforme.tipo_servicio
      );
      informeEdicion.value = { ...registroInforme, tipo_servicio: servicioSeleccionado };
      showDialogEditar.value = true;
    }


    const confirmarEliminacion = (registroInforme) => {

      const { id, numero_informe } = registroInforme;

      confirm.require({
        message: `¿Estás seguro de eliminar el informe N° ${numero_informe}?`,
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

          const eliminacion = await eliminarInforme(id);

          if (eliminacion.success) {
            const indexInforme = dataInformeServicios.value.findIndex( i => i.id === id)

            if(indexInforme !== -1){

              dataInformeServicios.value.splice(indexInforme, 1); 
            }
            // dataInformeServicios.value = dataInformeServicios.value.filter(informe => informe.id !== id);

            
            toast.add({ severity: 'info', summary: 'Éxito', detail: `Informe N° ${numero_informe} eliminado`, life: 5000 });
          } else {

            if (eliminacion.error == 'No se encontró el informe') {
              toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontró el informe, error al eliminarlo, intente nuevamente', life: 3000 });
            }

            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el informe, intente nuevamente', life: 3000 });

          }

        },
        reject: () => {
          // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
      });

    }

    const cerrarDialogPermisoTrabajo = () => {
      editarHipervinculo.value = false;
      showDialogPermisoTrabajo.value = false;
      hipervinculoPermisoTrabajo.value = null;
    }

    const agregarHipervinculoPermiso = async () => {

      try {
        const response = await window.electronAPI.agregarHipervinculoPermiso({
          id_informe: informeSeleccionado.value.id,
          hipervinculo_permiso_trabajo: hipervinculoPermisoTrabajo.value
        })

        if (response.success) {
          const informeActualizado = dataInformeServicios.value.find(
            (item) => item.id === informeSeleccionado.value.id
          )
          if (informeActualizado) {
            informeActualizado.hipervinculo_permiso_trabajo = hipervinculoPermisoTrabajo.value;
            toast.add({ severity: "success", summary: "Éxito", detail: ` Hipervínculo asociado al permiso de trabajo correctamente.`, life: 5000 });
          } else {
            throw new Error();
          }
        }
      } catch (error) {
        console.log(error)
        toast.add({
          severity: "error", summary: "Error", detail: "Error al asociar el hipervínculo, intente nuevamente", life: 3000
        })
      } finally {
        showDialogPermisoTrabajo.value = false;
        hipervinculoPermisoTrabajo.value = null;
        editarHipervinculo.value = false;
      }
    }

    const abrirHipervinculoPermiso = async (hipervinculo) => {
      if (hipervinculo && window.electronAPI) {
        await window.electronAPI.abrirHipervinculoPermiso(hipervinculo);
      }
    };

    const abrirDialogPermisoTrabajo = (informe, editar) => {

      if (editar) {
        editarHipervinculo.value = true;
      }

      informeSeleccionado.value = informe
      showDialogPermisoTrabajo.value = true;
      hipervinculoPermisoTrabajo.value = false;
    }



    const seleccionarHipervinculoPermiso = async (agregarEditar) => {
      if (window.electronAPI) {
        // Llamamos a Electron para abrir el diálogo nativo
        const selectedPath = await window.electronAPI.seleccionarHipervinculoPermiso();

        if (selectedPath) {
          if (agregarEditar == 'agregar editar hipervinculo') {
            hipervinculoPermisoTrabajo.value = selectedPath;

          } else if (agregarEditar == 'editar hipervinculo en edicion del informe') {
            informeEdicion.value.hipervinculo_permiso_trabajo = selectedPath;

          }


        }
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al intentar seleccionar el archivo, intente nuevamente por favor.', life: 3000 });
      }
    }
    const setTipoFiltradoPdf = (titulo) => tipoFiltradoPdf.value = titulo;

    const resetInvalid = (campo) => {
      // Resetea el estado de 'invalid' a false cuando el usuario empieza a escribir
      validacion.value[campo] = false;
    };

    const validacion = ref({
      numeroInforme: false,
      fechaActual: false,
      codigoInforme: false,
      numeroPermiso: false,
      planta: false,
      servicio: false,
      sector: false,
      solicitante: false,
    });

    const guardarInforme = async () => {

      const datosFormulario = {
        numeroInforme: numeroInforme.value,
        fecha: fechaActual.value ? formatFechaDate(fechaActual.value) : null,
        codigoInforme: codigoInforme.value,
        numeroPermiso: numeroPermiso.value,
        planta: planta.value ? planta.value.nombre : null,
        sector: sector.value,
        servicio: servicio.value ? servicio.value.nombre : null,
        solicitante: solicitante.value
      };

      for (const [campo, valor] of Object.entries(datosFormulario)) {
        if (!valor) {
          toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos ', life: 3000 });
          return;
        }
      }
      // Intentar enviar los datos si todos los campos están completos
      try {
        const response = await window.electronAPI.guardarInforme(datosFormulario);
        if (response.success) {

          toast.add({ severity: 'success', summary: 'Éxito', detail: 'Datos guardados correctamente', life: 3000 });
          dataInformeServicios.value.push(response.data);
          registroGuardado.value = true;


        } else {

          if (response.error === 'numero de informe repetido.') {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Ya existe un informe con este número de informe', life: 3000 });
            return;
          }
        }
      } catch (error) {

        console.log(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al enviar los datos, intente nuevamente', life: 3000 });

      }

    };

    const filtrarInformeServiciosFecha = async () => {

      if (!fechaFiltro.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor ingresa una fecha ', life: 3000 });
        return;
      }

      try {
        // const formatoFecha = new Date(fechaFiltro.value).toISOString().split('T')[0]; //A formato YYYY/MM/AA
        const formatoFecha = fechaFiltro.value ? formatFechaDate(fechaFiltro.value) : null; //A formato YYYY/MM/AA

        const response = await window.electronAPI.filtrarInformeServiciosFecha(formatoFecha);

        if (response.success) {
          dataInformeServicios.value = response.data;

          if (response.data.length < 1) {
            toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'No se encontraron resultados para los valores del filtro aplicado.', life: 4000 });
            return;
          }

          toast.add({ severity: "success", summary: "Éxito", detail: "Datos filtrados correctamente.", life: 3000 });

        }
      } catch (error) {
        console.log(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al filtrar los datos, intente nuevamente', life: 3000 });

      }
    }

    const filtrarInformeServiciosRangoFecha = async () => {

      if (!fechaInicioFiltro.value || !fechaFinFiltro.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor selecciona las fechas de inicio y/o de fin', life: 3000 });
        return;
      }

      try {
        // Convertir las fechas al formato YYYY-MM-DD
        const formatoFechaInicio = new Date(fechaInicioFiltro.value).toISOString().split('T')[0];
        const formatoFechaFin = new Date(fechaFinFiltro.value).toISOString().split('T')[0];

        const response = await window.electronAPI.filtrarInformeServiciosRangoFecha(formatoFechaInicio, formatoFechaFin);
        if (response.success) {
          dataInformeServicios.value = response.data;

          if (response.data.length < 1) {
            toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'No se encontraron resultados para los valores del filtro aplicado.', life: 4000 });
            return;
          }

          toast.add({ severity: "success", summary: "Éxito", detail: "Datos filtrados correctamente.", life: 3000 });
        } else {
          toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontraron datos para el rango de fechas seleccionado', life: 3000 });
        }
      } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al filtrar los datos, intente nuevamente', life: 3000 });
      }
    };
    const filtrarInformeServiciosNumInforme = async () => {

      if (!numInformeFiltro.value) {
        toast.add({ severity: 'error', summary: 'Campos incompletos', detail: 'Por favor ingrese un n° de informe.', life: 3000 });
        return;
      }

      try {
        const response = await window.electronAPI.filtrarInformeServiciosNumInforme(numInformeFiltro.value);

        if (response.success) {
          dataInformeServicios.value = response.data;
          if (response.data.length < 1) {
            toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'No se encontraron resultados.', life: 4000 });
            return;
          }

          toast.add({ severity: "success", summary: "Éxito", detail: "Datos filtrados correctamente.", life: 3000 });

        }
      } catch (error) {
        console.log(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al filtrar los datos, intente nuevamente', life: 3000 });
      }
    }

    const filtrarInformeServiciosCodInforme = async () => {

      if (!codigoInformeFiltro.value) {
        toast.add({ severity: 'error', summary: 'Campos incompletos', detail: 'Por favor ingrese un código de informe.', life: 3000 });
        return;
      }

      try {
        const response = await window.electronAPI.filtrarInformeServiciosCodInforme(codigoInformeFiltro.value);
        if (response.success) {
          dataInformeServicios.value = response.data;
          if (response.data.length < 1) {
            toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'No se encontraron resultados.', life: 4000 });
            return;
          }

          toast.add({ severity: "success", summary: "Éxito", detail: "Datos filtrados correctamente.", life: 3000 });
        }

      } catch (error) {
        console.log(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al filtrar los datos, intente nuevamente', life: 3000 });
      }
    }

    const reiniciarFormulario = () => {
      numeroInforme.value = null;
      codigoInforme.value = null;
      numeroPermiso.value = null;
      sector.value = null;
      planta.value = null;
      servicio.value = null;
    }

    const reiniciarValores = async () => {
      try {
        const response = await window.electronAPI.obtenerInformeServicios();
        if (response.success) {
          dataInformeServicios.value = response.data;

          fechaFiltro.value = null;
          fechaInicioFiltro.value = null;
          fechaFinFiltro.value = null;
          numInformeFiltro.value = null;
          codigoInformeFiltro.value = null;
          sectorFiltro.value = null;
          servicioFiltro.value = null;
          toast.add({ severity: "success", summary: "Éxito", detail: "Datos reiniciados correctamente.", life: 3000 });

        } else {
          throw new Error('error al obtener los datos')
        }
      } catch (error) {
        console.log(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al reiniciar los datos, intente nuevamente', life: 3000 });

      }
    }

    const filtrarInformeServiciosSectorRango = async () => {

      if (!fechaInicioFiltro.value || !fechaFinFiltro.value) {
        toast.add({ severity: 'error', summary: 'Campos incompletos', detail: 'Por favor selecciona las fechas de inicio y/o de fin', life: 3000 });
        return;
      }

      if (!sectorFiltro.value) {
        toast.add({ severity: 'error', summary: 'Campos incompletos', detail: 'Por favor ingrese un sector.', life: 3000 });
        return;
      }


      try {
        const formatoFechaInicio = new Date(fechaInicioFiltro.value).toISOString().split('T')[0]; // A formato YYYY-MM-DD
        const formatoFechaFin = new Date(fechaFinFiltro.value).toISOString().split('T')[0];       // A formato YYYY-MM-DD

        const response = await window.electronAPI.filtrarInformeServiciosSectorRango(
          sectorFiltro.value,
          formatoFechaInicio,
          formatoFechaFin
        );
        if (response.success) {
          dataInformeServicios.value = response.data;

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
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al filtrar los datos, intente nuevamente', life: 3000 });
      }
    };


    const filtrarInformeServiciosSector = async () => {

      if (!sectorFiltro.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor ingrese un sector.', life: 3000 });
        return;
      }

      try {
        const filtros = {
          sector_intervenido: sectorFiltro.value,
          anio: anioFiltro.value,
          mes: mesFiltro.value,
          dia: diaFiltro.value,
        };

        // Enviamos los filtros al backend
        const response = await window.electronAPI.filtrarInformeServiciosSector(filtros);

        if (response.success) {
          // Actualizamos los datos de la tabla con los resultados filtrados
          dataInformeServicios.value = response.data;
          toast.add({ severity: "success", summary: "Éxito", detail: "Datos filtrados correctamente.", life: 3000 });

        } else {
          console.error('Error al filtrar datos:', response.error);
        }
      } catch (error) {
        console.error('Error al realizar la consulta:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al filtrar los datos, intente nuevamente', life: 3000 });

      }
    }

    const filtrarInformeServicioTipoServicio = async () => {
      if (!servicioFiltro.value) {
        toast.add({ severity: 'error', summary: 'Campo Incompleto', detail: 'Por favor seleccione un servicio.', life: 3000 });
        return;
      }
      try {
        const response = await window.electronAPI.filtrarInformeServicioTipoServicio(servicioFiltro.value.nombre);
        if (response.success) {
          dataInformeServicios.value = response.data;
          if (response.data.length < 1) {
            toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'No se encontraron resultados.', life: 4000 });
            return;
          }
          toast.add({ severity: "success", summary: "Éxito", detail: "Datos filtrados correctamente.", life: 3000 });
        }
      } catch (error) {
        console.log(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al filtrar los datos, intente nuevamente', life: 3000 });

      }

    }

    const obtenerInformeServicios = async () => {
      loading.value = true;
      try {
        const response = await window.electronAPI.obtenerInformeServicios();
        if (response.success) {
         
          dataInformeServicios.value = response.data;
        } else {
          throw new Error('error al obtener los datos')
        }
      } catch (error) {
        console.log(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los datos, intente nuevamente', life: 3000 });

      } finally {
        loading.value = false;
      }

    }

    const actualizarInforme = async () => {

      try {
        const informeActualizado = {
          ...informeEdicion.value,
          tipo_servicio: informeEdicion.value.tipo_servicio.nombre,
          // fecha: formatFechaToYYYYMMDD(informeEdicion.value.fecha)
          fecha: formatFechaToYYYYMMDD(informeEdicion.value.fecha)

        };

        const response = await window.electronAPI.actualizarInforme(informeActualizado);
        
        if (response.success) {
        const indexInformeParaActualizar = dataInformeServicios.value.findIndex(informe => informe.id === informeEdicion.value.id);
        
      if (indexInformeParaActualizar !== -1) {

        dataInformeServicios.value[indexInformeParaActualizar] = {  ...dataInformeServicios.value[indexInformeParaActualizar], ...informeActualizado, fecha: formatFechaDDMMYYYY(informeActualizado.fecha) };
        
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Informe actualizado correctamente', life: 3000 });
      }
    }
  } catch (error) {
        toast.add({ severity: "error", summary: "Error", detail: "No se pudo actualizar el informe intente nuevamente", life: 5000 });

      } finally {
        showDialogEditar.value = false;

      }
    }

    const eliminarInforme = async (id) => {

      try {
        const response = await window.electronAPI.eliminarInforme(id);
        if (response.success) {
          return { success: true, error: response.error }
        }
      } catch (error) {
        return { success: false, error: response.error }
      }
    }

    const sendMessage = async () => {
      try {
        // electron ipc communication
        const result = await window.electronAPI?.ping('1');
        // console.log(result);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }

    const handleInicio = () => {
      showFilters.value = false;
      showForm.value = false;
      showDataTable.value = true;
      filter.value = null;
      obtenerInformeServicios()
    }

    const handleFilters = () => {
      showFilters.value = showFilters.value = true;
      showForm.value = showForm.value = false;
      showDataTable.value = true;
    }
    const handleFilter = (nombreFiltro) => {
      filter.value = nombreFiltro;
      tipoFiltradoPdf.value = nombreFiltro;
    }

    const formatearFecha = (fecha) => {

      const fechaDate = new Date(fecha);
      const dia = String(fechaDate.getDate()).padStart(2, '0');
      const mes = String(fechaDate.getMonth() + 1).padStart(2, '0');
      const año = fechaDate.getFullYear();

      const fechaFormateada = `${dia}/${mes}/${año}`;
      return fechaFormateada;
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
        const columnasRequeridas = ["INFORME", "CÓDIGO", "PERMISO", "PLANTA", "SECTOR", "TIPO SERVICIO", "SOLICITANTE"];

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
            numero_informe: normalizedRow["informe"],
            nombre_codigo: normalizedRow["código"],
            permiso_trabajo: normalizedRow["permiso"],
            planta: normalizedRow["planta"],
            sector_intervenido: normalizedRow["sector"],
            tipo_servicio: normalizedRow["tipo servicio"],
            // Convertir la fecha al formato YYYY-MM-DD para guardar en la base de datos
            fecha: normalizedRow["fecha"] ? formatFechaToYYYYMMDD(normalizedRow["fecha"]) : null,
            solicitante: normalizedRow["solicitante"]
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
          const response = await guardarInformesExcel(formattedData);

          if (response.success) {
            // Solo si el reemplazo es exitoso, formatear las fechas para el frontend
            dataInformeServicios.value = response.data.map((row) => ({
              ...row,
              fecha: row.fecha ? formatFechaDDMMYYYY(row.fecha) : null, // Renderizar como DD-MM-YYYY
            }));

            toast.add({ severity: "success", summary: "Éxito", detail: "Datos cargados correctamente.", life: 3000 });
        
          } else {

            if (response.error == 'Campos incompletos') {
              if (response.campoIncompleto == 'Campo desconocido') {
                toast.add({ severity: "error", summary: `Error al cargar los datos`, detail: "El archivo excel posee datos incompletos.", life: 5000 });
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

      reader.readAsArrayBuffer(file); // Leer el archivo como ArrayBuffer
    };



    const guardarInformesExcel = async (datos) => {
      try {
        const response = await window.electronAPI.guardarInformesExcel(datos);
        return response; // Devuelve `true` si fue exitoso
      } catch (error) {
        console.error("Error al reemplazar datos en la base de datos:", error);
        return false; // Devuelve `false` si hubo algún error
      }
    };


    const exportarExcel = () => {
      // Mapear los datos al formato requerido
      const formattedData = dataInformeServicios.value.map((item) => ({
        FECHA: item.fecha ? formatFechaExcel(item.fecha) : "-", // Formatear las fechas
        INFORME: item.numero_informe || "-",
        CÓDIGO: item.nombre_codigo || "-",
        PERMISO: item.permiso_trabajo || "-",
        PLANTA: item.planta || "-",
        SECTOR: item.sector_intervenido || "-",
        "TIPO SERVICIO": item.tipo_servicio || "-",
        SOLICITANTE: item.solicitante || "-",
        // "HIPERVÍNCULO PERMISO DE TRABAJO": item.hipervinculo_permiso_trabajo || "-"
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
        { wch: 12 }, // Ancho para la primera columna (FECHA)
        { wch: 12 }, // Ancho para la segunda columna (INFORME)
        { wch: 25 }, // Ancho para la tercera columna (CÓDIGO)
        { wch: 33 }, // Ancho para la cuarta columna (PERMISO)
        { wch: 17 }, // Ancho para la quinta columna (PLANTA)
        { wch: 37 }, // Ancho para la sexta columna (SECTOR)
        { wch: 25 }, // Ancho para la séptima columna (TIPO SERVICIO)
        { wch: 40 }, // Ancho para la ocatava columna (SOLICITANTE)
        // { wch: 91 }, // Ancho para la novena columna (HIPERVINCULO)

      ];

      // Crear un libro de trabajo (workbook)
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Informe Servicios");

      // Exportar el archivo Excel
      XLSX.writeFile(workbook, "InformeServicios.xlsx");
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

    const generarListadoPDF = () => {
      if (!dataInformeServicios.value || dataInformeServicios.value.length === 0) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No hay datos para generar el PDF ', life: 3000 });
        return;
      }

      const doc = new jsPDF("p", "mm", "a4");

      // Agregar logo (si se tiene uno)
      const appLogo = new Image();
      appLogo.src = logo; // Asegúrate de tener el logo accesible
      appLogo.onload = () => {
        doc.addImage(appLogo, "PNG", 10, 10, 20, 20);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("REGISTRO DE INFORMES Y SERVICIOS", 64, 20);
        doc.setFontSize(8);

        // if (tipoFiltradoPdf.value) {
        //   doc.text(`FILTRADO POR ${tipoFiltradoPdf.value}`, 90, 25);
        // }

        // Definir las columnas y sus títulos
        const columnas = [
          "N° INFORME", "CÓDIGO INFORME", "PERMISO TRABAJO", "PLANTA", "SECTOR", "TIPO SERVICIO", "FECHA", "SOLICITANTE"
        ];

        // Mapear los datos a filas
        const filas = dataInformeServicios.value.map(item => [
          item.numero_informe || "-",
          item.nombre_codigo || "-",
          item.permiso_trabajo || "-",
          item.planta || "-",
          item.sector_intervenido || "-",
          item.tipo_servicio || "-",
          item.fecha || "-",
          item.solicitante || "-"
        ]);

        // Agregar la tabla al PDF
        autoTable(doc, {
          startY: 40,
          head: [columnas],
          body: filas,
          styles: { fontSize: 7, cellPadding: 1 },
          headStyles: { fillColor: [0, 128, 255], textColor: 255, fontStyle: "bold" }
        });

        // Guardar el PDF
        // if (tipoFiltradoPdf.value) {
        //   doc.save(`INFORMES Y SERVICIOS POR ${tipoFiltradoPdf.value}.pdf`);
        // } else {
        //   doc.save(`INFORMES Y SERVICIOS.pdf`);
        // }
        const today = new Date();
        const yyyy = today.getUTCFullYear();
        const mm = String(today.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(today.getUTCDate()).padStart(2, '0');

        const nombrePdf = `INF-SERVICIOS-${yyyy}-${mm}-${dd}.pdf`;

        doc.save(nombrePdf);

      };
    };


    const handleForm = () => {
      showDataTable.value = false;
      showForm.value = showForm.value = true;
      if (showFilters.value) {
        showFilters.value = false;
      }
      if (filter.value) {
        filter.value = null;
      }

    }
    onMounted(() => {
      const today = new Date();
      fechaActual.value = today;
      obtenerInformeServicios();

    })


    return {
      sendMessage,
      codigoInforme,
      numeroInforme,
      numeroPermiso,
      solicitante,
      logo,
      plantas,
      planta,
      showForm,
      fechaActual,
      sector,
      handleForm,
      dataInformeServicios,
      guardarInforme,
      validacion,
      servicio,
      servicios,
      resetInvalid,
      formatearFecha,
      filtrarInformeServiciosFecha,
      showFilters,
      filter,
      handleFilter,
      handleFilters,
      fechaFiltro,
      filtrarInformeServiciosNumInforme,
      numInformeFiltro,
      filtrarInformeServiciosCodInforme,
      codigoInformeFiltro,
      sectorFiltro,
      anioFiltro,
      mesFiltro,
      diaFiltro,
      filtrarInformeServiciosSector,
      filtrarInformeServicioTipoServicio,
      servicioFiltro,
      importarExcel,
      guardarInformesExcel,
      fechaInicioFiltro,
      fechaFinFiltro,
      filtrarInformeServiciosRangoFecha,
      filtrarInformeServiciosSectorRango,
      reiniciarValores,
      exportarExcel,
      formatFechaExcel,
      generarListadoPDF,
      tipoFiltradoPdf,
      setTipoFiltradoPdf,
      loading,
      showDataTable,
      formCompleto,
      registroGuardado,
      handleInicio,
      reiniciarFormulario,
      hipervinculoPermisoTrabajo,
      showDialogPermisoTrabajo,
      abrirDialogPermisoTrabajo,
      cerrarDialogPermisoTrabajo,
      seleccionarHipervinculoPermiso,
      informeSeleccionado,
      agregarHipervinculoPermiso,
      abrirHipervinculoPermiso,
      editarHipervinculo,
      formatFechaDate,
      formatFechaToYYYYMMDD,
      formatFechaDDMMYYYY,
      validarFormatoFecha,
      eliminarInforme,
      confirmarEliminacion,
      informeEdicion,
      showDialogEditar,
      abrirDialogEditar,
      actualizarInforme,
      formatFechaToYYYYMMDD
    };
  },

});


</script>

<style scoped></style>