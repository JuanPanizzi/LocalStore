<template>

    <div :class="`flex ${showForm ? 'justify-end' : 'justify-between'}  items-center p-4 `">
        <h1 v-if="!showForm" class="text-center  font-semibold text-xl"> Registro de Devoluciones</h1>
        <div>
            <Button @click="handleInicio" :disabled="!showForm && !showFilters" icon="pi pi-list" label="Registros" />
            <Button @click="handleFilters" class="mx-2 " icon="pi pi-filter" label="Filtrar" />
            <Button type="button" label="Nuevo" icon="pi pi-plus" class="text-right" @click="handleForm" />
        </div>
    </div>

    <!-- FILTROS -->
    <div v-if="showFilters" class="p-10  flex flex-col items-start justify-center">
        <h1 class="font-semibold my-3">Seleccione método de filtrado</h1>
        <div>
            <Button outlined severity="warn" @click="handleFilter('FECHA')" label="Fecha" />
            <Button outlined severity="warn" @click="handleFilter('RANGO DE FECHAS')" class="ml-2"
                label="Rango de Fechas" />
            <Button outlined severity="warn" @click="handleFilter('MATERIAL / EQUIPO')" class="ml-2"
                label="Material / Equipo" />
            <Button outlined severity="warn" @click="handleFilter('MARCA')" class="ml-2" label="Marca" />
            <Button outlined severity="warn" @click="handleFilter('MODELO')" class="ml-2" label="Modelo" />
            <Button outlined severity="warn" @click="handleFilter('PROCEDENCIA')" class="ml-2" label="Procedencia" />
        </div>
    </div>

    <div v-if="filter == 'FECHA'" class="flex items-center justify-around px-10 my-10  ">
        <div class="flex justify-between">
            <div class="flex  justify-center items-end ">
                <div :class="` flex flex-col  items-start `">
                    <p class="text-left  font-semibold">Fecha:</p>
                    <DatePicker v-model="fechaFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
                        :showIcon="true" />
                </div>
                <Button @click="filtrarDevolucionesFecha" class="ml-2 mr-2 w-full">Filtrar</Button>
            </div>
            <Button icon="pi pi-refresh" class="mt-auto" label="Reiniciar" outlined severity="danger"
                @click="resetearValores" />
        </div>
    </div>

    <div v-if="filter == 'RANGO DE FECHAS'" class="flex items-center justify-around px-10 my-10  ">
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

        <div class="flex justify-between  ">
            <div class="flex  justify-center items-end  ">
                <div :class="` flex flex-col  items-start `">
                    <p class="text-left  font-semibold">Fecha Fin:</p>
                    <DatePicker v-model="fechaFinFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
                        :showIcon="true" />
                </div>
                <Button @click="filtrarDevolucionesRangoFecha" class="ml-2 w-full">Filtrar</Button>
            </div>
        </div>

        <Button icon="pi pi-refresh" class="mt-auto" label="Reiniciar" outlined severity="danger"
            @click="resetearValores" />
    </div>

    <div v-if="filter == 'MATERIAL / EQUIPO'" class="flex justify-between my-10  px-10">
        <div class="flex flex-col">
            <label class="legend  text-start font-semibold">Material / Equipo</label>
            <InputText v-model="materialEquipoFiltro" placeholder="Ingrese el material o equipo" />
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
            <Button @click="filtrarDevolucionesMaterial" class="ml-2 w-full">Filtrar</Button>
        </div>

        <Button icon="pi pi-refresh" class="mt-auto" label="Reiniciar" outlined severity="danger"
            @click="resetearValores" />
    </div>

    <div v-if="filter == 'MARCA'" class="flex justify-between mt-10  px-10">
        <div class="flex flex-col">
            <label class="legend  text-start font-semibold">Marca</label>
            <InputText v-model="marcaFiltro" placeholder="Ingrese la marca" />
        </div>

        <div :class="` flex flex-col  items-start `">
            <p class="text-left  font-semibold">Fecha Inicio:</p>
            <DatePicker v-model="fechaInicioFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
                :showIcon="true" />
        </div>

        <div class="flex  justify-center items-end  ">
            <div :class="` flex flex-col  items-start `">
                <p class="text-left  font-semibold">Fecha Fin:</p>
                <DatePicker v-model="fechaFinFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
                    :showIcon="true" />
            </div>
            <Button @click="filtrarDevolucionesMarca" class="ml-2 w-full">Filtrar</Button>
        </div>
        <Button icon="pi pi-refresh" class="mt-auto" label="Reiniciar" outlined severity="danger"
            @click="resetearValores" />
    </div>

    <div v-if="filter == 'MODELO'" class="flex justify-between   p-10">
        <div class="flex flex-col">
            <label class="legend  text-start font-semibold">Modelo</label>
            <InputText v-model="modeloFiltro" placeholder="Ingrese el modelo" />
        </div>

        <div :class="` flex flex-col  items-start `">
            <p class="text-left  font-semibold">Fecha Inicio:</p>
            <DatePicker v-model="fechaInicioFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
                :showIcon="true" />
        </div>

        <div class="flex  justify-center items-end  ">
            <div :class="` flex flex-col  items-start `">
                <p class="text-left  font-semibold">Fecha Fin:</p>
                <DatePicker v-model="fechaFinFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
                    :showIcon="true" />
            </div>
            <Button @click="filtrarDevolucionesModelo" class="ml-2 w-full">Filtrar</Button>
        </div>

        <Button icon="pi pi-refresh" class="mt-auto" label="Reiniciar" outlined severity="danger"
            @click="resetearValores" />
    </div>

    <div v-if="filter == 'PROCEDENCIA'" class="flex justify-between   p-10">
        <div class="flex flex-col">
            <label class="legend  text-start font-semibold">Procedencia</label>
            <InputText v-model="procedenciaFiltro" placeholder="Ingrese la procedencia" />
        </div>

        <div :class="` flex flex-col  items-start `">
            <p class="text-left  font-semibold">Fecha Inicio:</p>
            <DatePicker v-model="fechaInicioFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
                :showIcon="true" />
        </div>

        <div class="flex  justify-center items-end  ">
            <div :class="` flex flex-col  items-start `">
                <p class="text-left  font-semibold">Fecha Fin:</p>
                <DatePicker v-model="fechaFinFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
                    :showIcon="true" />
            </div>
            <Button @click="filtrarDevolucionesProcedencia" class="ml-2 w-full">Filtrar</Button>
        </div>

        <Button icon="pi pi-refresh" class="mt-auto" label="Reiniciar" outlined severity="danger"
            @click="resetearValores" />
    </div>




    <Form v-if="showForm" class="relative px-3 pb-20">
        <h1 class="text-center text-3xl font-semibold mt-6">Registro de Devoluciones</h1>
        <div class="absolute top-14 right-5">

            <div class=" flex items-center mb-3">
                <p class="legend w-40 text-right mr-3 font-semibold">Fecha:</p>
                <DatePicker v-model="fecha" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
                    :showIcon="true" />
            </div>

        </div>


        <!-- Contenedor Inputs Header -->
        <div class="mt-36 mb-5 border p-4 grid grid-cols-2 gap-y-2 gap-x-10 px-3 ">

            <div class="flex justify-between items-center ">
                <label class="w-1/5  font-semibold ">Material / Equipo Devuelto:</label>
                <InputText v-model="materialEquipo" class="w-4/5 " />
            </div>

            <div class="flex justify-between items-center ">
                <label class=" w-1/5   font-semibold ">Cantidad:</label>
                <InputText v-model="cantidad" class="w-4/5 " />
            </div>

            <div class="flex justify-between items-center ">
                <label class="w-1/5  font-semibold ">Marca:</label>
                <InputText v-model="marca" class="w-4/5 " />
            </div>

            <div class="flex justify-between items-center ">
                <label class=" w-1/5   font-semibold ">Modelo:</label>
                <InputText v-model="modelo" class="w-4/5 " />
            </div>
        </div>

        <!-- Fin Contenedor Inputs Header -->

        <!-- Contenedor Inputs Body -->

        <div class=" mb-5 border p-4 grid grid-cols-2 gap-y-2 gap-x-10 px-3 ">

            <div class="flex justify-between  items-center ">
                <label class=" w-1/5  font-semibold ">Procedencia:</label>
                <InputText v-model="procedencia" class="w-4/5 " required />
            </div>


            <div class="flex justify-between  items-center ">
                <label class=" w-1/5  font-semibold ">Destino / Recepción:</label>
                <InputText v-model="destinoRecepcion" class="w-4/5 " required />
            </div>

            <div class="col-span-2 space-y-1 w-full mt-5  px-3">
                <p class="font-semibold">Descripción:</p>
                <Textarea id="descripcion" v-model="descripcion" variant="filled" rows="4" cols="30"
                    class="w-full bg-white" style="background-color: white;" />
            </div>
        </div>


        <!-- Fin Contenedor Inputs Body -->


        <div class="mt-2 flex items-center justify-end">
            <Button label="Reiniciar" icon="pi pi-refresh" class="mr-2" severity="secondary"
                @click="reiniciarFormulario" />
            <Button label="Guardar" icon="pi pi-save" severity="success" @click="guardarDevolucion"
                :disabled="!formCompleto" />
            <Button v-if="showForm" type="button" label="Generar PDF" severity="danger" icon="pi pi-file-pdf"
                class=" mx-2 text-right " @click="generarPdf" :disabled="!formCompleto" />
        </div>
    </Form>


    <DataTable v-if="showDataTable" :value="dataDevoluciones" paginator :rows="5" tableStyle="min-width: 50rem"
        class="m-auto my-10" showGridlines style="max-width: 90vw">
        <template #empty>
            <Message v-if="!loading" severity="error" variant="outlined">No se encontraron resultados </Message>
            <Message v-if="loading" severity="secondary" variant="outlined">Cargando... </Message>
        </template>

        <!-- <Column field="id" header="Id"></Column> -->
        <Column field="fecha" header="FECHA"></Column>
        <Column field="material_equipo" header="MATERIAL / EQUIPO DEVUELTO"></Column>
        <Column field="marca" header="MARCA"></Column>
        <Column field="modelo" header="MODELO"></Column>
        <Column field="destino_recepcion" header="DESTINO / RECEPCIÓN"></Column>
        <Column field="cantidad" header="CANTIDAD"></Column>
        <Column field="procedencia" header="PROCEDENCIA"></Column>
        <Column field="descripcion" header="DESCRIPCIÓN"></Column>

        <Column>
            <template #body="slotProps">
                <div class="flex ">
                    <Button icon="pi pi-pencil" @click="abrirDialogEditar(slotProps.data)" />
                    <Button class="ml-2" icon="pi pi-trash" severity="danger"
                        @click="confirmarEliminacion(slotProps.data)" />
                </div>
            </template>
        </Column>
    </DataTable>

    <Toast />

    <div v-if="showDataTable" :class="`flex justify-end items-center p-4  `">
        <FileUpload mode="basic" name="file" chooseLabel="Importar Excel" accept=".xlsx,.xls" auto="true"
            @select="importarExcel" />
        <Button label="Exportar Excel" icon="pi pi-file-export" class="ml-2" severity="success"
            @click="exportarExcel" />
        <Button type="button" label="Generar PDF" severity="danger" icon="pi pi-file-pdf" class=" ml-2 text-right "
            @click="generarListadoPDF(dataDevoluciones)" />
    </div>

    <ConfirmDialog></ConfirmDialog>


    <Dialog v-model:visible="showDialogEditar" :modal="true" :header="`Editar Devolución`" style="max-width: 90vw">

        <div class="grid grid-cols-6 gap-6">
            <div class="flex flex-col col-span-3">
                <label for="marca" class="font-semibold">Marca</label>
                <InputText id="marca" v-model="devolucionEdicion.marca" class="flex-auto" autocomplete="off" />
            </div>

            <div class="flex flex-col col-span-3">
                <label for="modelo" class="font-semibold">Modelo</label>
                <InputText id="modelo" v-model="devolucionEdicion.modelo" class="flex-auto" autocomplete="off" />
            </div>

            <div class="flex flex-col col-span-3">
                <label for="procedencia" class="font-semibold">Procedencia</label>
                <InputText id="procedencia" v-model="devolucionEdicion.procedencia" class="flex-auto"
                    autocomplete="off" />
            </div>

            <div class="flex flex-col col-span-3">
                <label for="destino_recepcion" class="font-semibold">Destino Recepción</label>
                <InputText id="destino_recepcion" v-model="devolucionEdicion.destino_recepcion" class="flex-auto"
                    autocomplete="off" />
            </div>

            <div class="flex flex-col col-span-2">
                <label for="material_equipo" class="font-semibold">Material / Equipo</label>
                <InputText id="material_equipo" v-model="devolucionEdicion.material_equipo" class="flex-auto"
                    autocomplete="off" />
            </div>


            <div class="flex flex-col col-span-2">
                <label for="cantidad" class="font-semibold">Cantidad</label>
                <InputText id="cantidad" v-model="devolucionEdicion.cantidad" class="flex-auto" autocomplete="off" />
            </div>


            <div class="flex flex-col col-span-2">
                <label for="fecha" class="font-semibold">Fecha</label>
                <DatePicker id="fecha" v-model="devolucionEdicion.fecha" class="flex-auto" dateFormat="dd/mm/yy" />
            </div>
            <div class="flex flex-col col-span-6">
                <label for="descripcion" class="font-semibold">Descripción</label>
                <Textarea id="descripcion" v-model="devolucionEdicion.descripcion" class="flex-auto" autocomplete="off"
                    rows="3" />
            </div>


            <div class="flex justify-end  mt-7">
                <Button label="Guardar" icon="pi pi-save" class="min-w-[170px] max-w-[250px]" severity="success"
                    @click="actualizarDevolucion" />
            </div>
        </div>

    </Dialog>


</template>
<script>
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import DatePicker from 'primevue/datepicker';
import FileUpload from 'primevue/fileupload';
import Message from 'primevue/message';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import * as XLSX from "xlsx-js-style";
import { useToast } from 'primevue/usetoast';
import { computed, defineComponent, onMounted, ref, toRaw } from 'vue';
import { useDevoluciones } from '../composables/useDevoluciones.js'
import { compararUltimoRegistro } from '../utils/utils.js'
import { formatFechaDate, formatFechaExcel, formatFechaToYYYYMMDD, formatFechaDDMMYYYY, validarFormatoFecha } from '../utils/funcionesFecha.js'
import logo from '../../resources/pdflogo.png';
import jsPDF from 'jspdf';
import { useConfirm } from 'primevue/useconfirm';
import ConfirmDialog from 'primevue/confirmdialog';
import Dialog from 'primevue/dialog';

export default defineComponent({
    name: 'RegistroDevoluciones',
    components: {
        // InputText,
        // InputNumber,
        Button,
        Textarea,
        DatePicker,
        DataTable,
        Column,
        Toast,
        Message,
        FileUpload,
        ConfirmDialog,
        Dialog


    },

    setup() {
        const { generarListadoPDF } = useDevoluciones()

        const showForm = ref(false);
        const showFilters = ref(false);
        const showDataTable = ref(true);
        const filter = ref(null);
        const showCerrarReq = ref(false);
        const fecha = ref(false);
        const materialEquipo = ref(null);
        const cantidad = ref(null);
        const marca = ref(null);
        const modelo = ref(null);
        const procedencia = ref(null);
        const destinoRecepcion = ref(null);
        const descripcion = ref(null);
        const dataDevoluciones = ref(null);
        const toast = useToast();
        const confirm = useConfirm();

        const loading = ref(false);
        const fechaInicioFiltro = ref(null);
        const fechaFinFiltro = ref(null);
        const fechaFiltro = ref(null);
        const materialEquipoFiltro = ref(null);
        const marcaFiltro = ref(null);
        const modeloFiltro = ref(null);
        const procedenciaFiltro = ref(null);
        const registroGuardado = ref(false);
        const ultimoRegistroGuardado = ref(null);
        const showDialogEditar = ref(false);
        const devolucionEdicion = ref({
            id: "",
            marca: "",
            modelo: "",
            cantidad: "",
            procedencia: "",
            descripcion: "",
            fecha: "",
            destino_recepcion: "",
            material_equipo: ""
        }
        )


        const formCompleto = computed(() => {

            return (
                fecha.value &&
                materialEquipo.value &&
                cantidad.value &&
                marca.value &&
                modelo.value &&
                procedencia.value &&
                destinoRecepcion.value
            )
        })

        const reiniciarFormulario = () => {
            registroGuardado.value = false;

            materialEquipo.value = null;
            cantidad.value = null;
            marca.value = null;
            modelo.value = null;
            procedencia.value = null;
            destinoRecepcion.value = null;
            descripcion.value = null;
        }


        const handleForm = () => {
            showForm.value = true;
            showDataTable.value = false;
            if (showFilters.value) showFilters.value = false;

            if (filter.value) filter.value = null;

            if (showCerrarReq) showCerrarReq.value = false;
        }

        const handleInicio = () => {
            showFilters.value = false;
            showForm.value = false;
            showDataTable.value = true;
            filter.value = null;
            obtenerDevoluciones();
        }

        const handleFilters = () => {


            showFilters.value = true;
            showForm.value = showForm.value = false;
            showDataTable.value = true;
        }
        const handleFilter = (nombreFiltro) => {
            filter.value = nombreFiltro;
            // tipoFiltradoPdf.value = nombreFiltro;
            fechaInicioFiltro.value = null;
            fechaFinFiltro.value = null;
        }



        const abrirDialogEditar = (devolucionSeleccionada) => {

            devolucionEdicion.value = { ...devolucionSeleccionada };
            showDialogEditar.value = true;
        }


        const actualizarDevolucion = async () => {

            try {
                const devolucionActualizada = {
                    ...devolucionEdicion.value,
                    fecha: formatFechaToYYYYMMDD(devolucionEdicion.value.fecha)

                };

                const response = await window.electronAPI.actualizarDevolucion(devolucionActualizada);

                if (response.success) {
                    const indexDevolucion = dataDevoluciones.value.findIndex(dev => dev.id === devolucionActualizada.id);

                    if (indexDevolucion !== -1) {

                        dataDevoluciones.value[indexDevolucion] = { ...dataDevoluciones.value[indexDevolucion], ...devolucionActualizada, fecha: formatFechaDDMMYYYY(devolucionActualizada.fecha) };

                        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Devolucion actualizada correctamente', life: 3000 });
                    }
                }
            } catch (error) {
                toast.add({ severity: "error", summary: "Error", detail: "No se pudo actualizar la devolución intente nuevamente", life: 5000 });

            } finally {
                showDialogEditar.value = false;
            }
        }



        const eliminarDevolucion = async (id) => {

            try {
                const response = await window.electronAPI.eliminarDevolucion(id);
                if (response.success) {
                    return { success: true, error: response.error }
                }
            } catch (error) {
                return { success: false, error: response.error }
            }
        }

        const confirmarEliminacion = (devolucion) => {

            const { id } = devolucion;

            confirm.require({
                message: `¿Estás seguro de eliminar esta devolucion?`,
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

                    const eliminacion = await eliminarDevolucion(id);
                    if (eliminacion.success) {
                        const indexDevolucion = dataDevoluciones.value.findIndex(i => i.id === id)

                        if (indexDevolucion !== -1) {

                            dataDevoluciones.value.splice(indexDevolucion, 1);
                        }
                        // dataDevoluciones.value = dataDevoluciones.value.filter(informe => informe.id !== id);


                        toast.add({ severity: 'info', summary: 'Éxito', detail: `Devolución eliminada correctamente`, life: 5000 });
                    } else {

                        // if (eliminacion.error == 'No se encontró el informe') {
                        //   toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontró el requerimient, error al eliminarlo, intente nuevamente', life: 3000 });
                        // }

                        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la devolución, intente nuevamente', life: 3000 });

                    }

                },
                reject: () => {
                    // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                }
            });

        }



        const obtenerDevoluciones = async () => {
            loading.value = true;

            try {
                const response = await window.electronAPI.obtenerDevoluciones();
                if (response.success) {
                    dataDevoluciones.value = response.data;
                } else {
                    throw new Error()
                }
            } catch (error) {
                console.log(error)
                toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los datos, intente nuevamente.', life: 3000 });
            } finally {
                loading.value = false;

            }
        }

        const filtrarDevolucionesModelo = async () => {

            if (!fechaInicioFiltro.value || !fechaFinFiltro.value) {

                toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor selecciona las fechas de inicio y/o de fin', life: 3000 });
                return;
            }
            if (!modeloFiltro.value) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor selecciona un modelo.', life: 3000 });
                return;
            }

            try {
                const formatoFechaInicio = new Date(fechaInicioFiltro.value).toISOString().split('T')[0]; // A formato YYYY-MM-DD
                const formatoFechaFin = new Date(fechaFinFiltro.value).toISOString().split('T')[0];       // A formato YYYY-MM-DD

                const response = await window.electronAPI.filtrarDevolucionesModelo(
                    modeloFiltro.value,
                    formatoFechaInicio,
                    formatoFechaFin
                );

                if (response.success) {

                    dataDevoluciones.value = response.data;

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

        const filtrarDevolucionesProcedencia = async () => {

            if (!fechaInicioFiltro.value || !fechaFinFiltro.value) {

                toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor selecciona las fechas de inicio y/o de fin', life: 3000 });
                return;
            }
            if (!procedenciaFiltro.value) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor ingresa la procedencia.', life: 3000 });
                return;
            }

            try {
                const formatoFechaInicio = new Date(fechaInicioFiltro.value).toISOString().split('T')[0]; // A formato YYYY-MM-DD
                const formatoFechaFin = new Date(fechaFinFiltro.value).toISOString().split('T')[0];       // A formato YYYY-MM-DD

                const response = await window.electronAPI.filtrarDevolucionesProcedencia(
                    procedenciaFiltro.value,
                    formatoFechaInicio,
                    formatoFechaFin
                );

                if (response.success) {

                    dataDevoluciones.value = response.data;

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

        const filtrarDevolucionesMarca = async () => {

            if (!fechaInicioFiltro.value || !fechaFinFiltro.value) {

                toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor selecciona las fechas de inicio y/o de fin', life: 3000 });
                return;
            }
            if (!marcaFiltro.value) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor ingresa una marca.', life: 3000 });
                return;
            }

            try {
                const formatoFechaInicio = new Date(fechaInicioFiltro.value).toISOString().split('T')[0]; // A formato YYYY-MM-DD
                const formatoFechaFin = new Date(fechaFinFiltro.value).toISOString().split('T')[0];       // A formato YYYY-MM-DD

                const response = await window.electronAPI.filtrarDevolucionesMarca(
                    marcaFiltro.value,
                    formatoFechaInicio,
                    formatoFechaFin
                );

                if (response.success) {

                    dataDevoluciones.value = response.data;

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

        const filtrarDevolucionesMaterial = async () => {

            if (!fechaInicioFiltro.value || !fechaFinFiltro.value) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor selecciona las fechas de inicio y/o de fin', life: 3000 });
                return;
            }

            if (!materialEquipoFiltro.value) {

                toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor ingresa un material o equipo', life: 3000 });
                return;
            }

            try {
                const formatoFechaInicio = new Date(fechaInicioFiltro.value).toISOString().split('T')[0]; // A formato YYYY-MM-DD
                const formatoFechaFin = new Date(fechaFinFiltro.value).toISOString().split('T')[0];       // A formato YYYY-MM-DD

                const response = await window.electronAPI.filtrarDevolucionesMaterial(
                    materialEquipoFiltro.value,
                    formatoFechaInicio,
                    formatoFechaFin
                );

                if (response.success) {
                    dataDevoluciones.value = response.data;

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



        const filtrarDevolucionesFecha = async () => {
            if (!fechaFiltro.value) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor ingresa una fecha.', life: 3000 });
                return;
            }

            try {
                const formatoFecha = new Date(fechaFiltro.value).toISOString().split('T')[0]; //A formato YYYY/MM/AA
                const response = await window.electronAPI.filtrarDevolucionesFecha(formatoFecha);

                if (response.success) {
                    dataDevoluciones.value = response.data;

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

        const filtrarDevolucionesRangoFecha = async () => {

            if (!fechaInicioFiltro.value || !fechaFinFiltro.value) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor selecciona las fechas de inicio y/o de fin', life: 3000 });
                return;
            }

            try {
                // Convertir las fechas al formato YYYY-MM-DD
                const formatoFechaInicio = new Date(fechaInicioFiltro.value).toISOString().split('T')[0];
                const formatoFechaFin = new Date(fechaFinFiltro.value).toISOString().split('T')[0];

                const response = await window.electronAPI.filtrarDevolucionesRangoFecha(formatoFechaInicio, formatoFechaFin);
                if (response.success) {
                    dataDevoluciones.value = response.data;

                    if (response.data.length < 1) {
                        toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'No se encontraron resultados.', life: 4000 });
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

        const resetearValores = async () => {

            try {
                const response = await window.electronAPI.obtenerDevoluciones();

                if (response.success) {
                    dataDevoluciones.value = response.data;

                    marcaFiltro.value = null;
                    materialEquipoFiltro.value = null;
                    fechaFiltro.value = null;
                    fechaInicioFiltro.value = null;
                    fechaFinFiltro.value = null;
                    toast.add({ severity: "success", summary: "Éxito", detail: "Datos reiniciados correctamente.", life: 3000 });

                } else {
                    throw new Error('error al obtener los datos')
                }
            } catch (error) {
                console.log(error)
                toast.add({ severity: 'error', summary: 'Error', detail: 'Error al reiniciar los datos, intente nuevamente', life: 3000 });

            }

        }


        const guardarDevolucion = async () => {

            const datosFormulario = {
                // fecha: fecha.value ? new Date(fecha.value).toISOString().split('T')[0] : null,
                fecha: fecha.value ? formatFechaDate(fecha.value) : null,
                material_equipo: materialEquipo.value,
                cantidad: cantidad.value,
                marca: marca.value,
                modelo: modelo.value,
                procedencia: procedencia.value,
                destino_recepcion: destinoRecepcion.value,
                descripcion: descripcion.value
            };

            for (const [campo, valor] of Object.entries(datosFormulario)) {
                if (!valor && campo !== 'descripcion') {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos ', life: 3000 });
                    return;
                }
            }

            if (ultimoRegistroGuardado.value) {

                const registroRegistrado = compararUltimoRegistro(datosFormulario, toRaw(ultimoRegistroGuardado.value));

                if (registroRegistrado) {
                    toast.add({ severity: 'error', summary: 'Atención', detail: 'Acabas de guardar un registro con los mismos datos', life: 3000 });
                    return;
                }
            }

            // Intentar enviar los datos si todos los campos están completos
            try {

                const response = await window.electronAPI.guardarDevolucion(datosFormulario);

                if (response.success) {

                    dataDevoluciones.value.push(response.data);
                    registroGuardado.value = true;
                    ultimoRegistroGuardado.value = response.data;
                    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Datos guardados correctamente', life: 3000 });


                } else {
                    throw new Error()

                }
            } catch (error) {

                console.log(error);
                toast.add({ severity: 'error', summary: 'Error', detail: 'Error al enviar los datos, intente nuevamente', life: 3000 });

            }

        };


        const exportarExcel = () => {
            // Mapear los datos al formato requerido
            const formattedData = dataDevoluciones.value.map((item) => ({
                Fecha: item.fecha ? formatFechaExcel(item.fecha) : "-", // Formatear las fechas
                Material_Equipo: item.material_equipo || "-",
                Marca: item.marca || "-",
                Modelo: item.modelo || "-",
                Cantidad: item.cantidad || "-",
                Procedencia: item.procedencia || "-",
                Destino_Recepción: item.destino_recepcion || "-",
                Descripción: item.descripcion || "-",
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
                { wch: 39 }, // Material equipo
                { wch: 39 }, // Marca
                { wch: 39 }, // Modelo
                { wch: 12 }, // Cantidad
                { wch: 69 }, // Procedencia
                { wch: 39 }, // Destino_recepcion
                { wch: 200 }, // Descripcion
            ];

            // Crear un libro de trabajo (workbook)
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Registro Devoluciones");

            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            // Exportar el archivo Excel
            XLSX.writeFile(workbook, `Informe-Devoluciones-${yyyy}-${mm}-${dd}.xlsx`);
        };


        const importarExcel = async (event) => {
            const file = event.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                // Se activa cellDates para que las celdas con fechas se conviertan a objetos Date
                const workbook = XLSX.read(data, { type: "array", cellDates: true });

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
                const columnasRequeridas = ["Fecha", "Material_Equipo", "Cantidad", "Marca", "Modelo", "Procedencia", "Destino_Recepción", "Descripción"];

                // Normalizar columnas requeridas a minúsculas
                const columnasRequeridasNormalizadas = columnasRequeridas.map(col => col.toLowerCase());


                // Verificar si falta alguna columna después de normalizar
                const columnasFaltantes = columnasRequeridasNormalizadas.filter(
                    columna => !primeraFilaNormalizada.includes(columna)
                );
                if (columnasFaltantes.length > 0) {
                    toast.add({
                        severity: "error",
                        summary: "Columnas Faltantes",
                        detail: `Faltan las siguientes columnas en el archivo: ${columnasFaltantes.join(", ")}`,
                        life: 5000
                    });
                    return;
                }

               

                // Formatear los datos y procesar la fecha con nuestra función personalizada
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
                        fecha: normalizedRow["fecha"] ? formatFechaToYYYYMMDD(normalizedRow["fecha"]) : null,
                        material_equipo: normalizedRow["material_equipo"],
                        cantidad: normalizedRow["cantidad"] || null,
                        marca: normalizedRow["marca"] || null,
                        modelo: normalizedRow["modelo"] || null,
                        procedencia: normalizedRow["procedencia"] || null,
                        destino_recepcion: normalizedRow["destino_recepción"] || null,
                        descripcion: normalizedRow["descripción"] || null,
                    }

                });


                if (fechasInvalidas.length > 0) {
                    const columnasInvalidas = [...new Set(fechasInvalidas.map(item => item.columna))];
                    const mensaje = `Se encontraron fechas con un formato distinto a 'DD/MM/YYYY' en las siguientes columnas: ${columnasInvalidas.map(col => `"${col}"`).join(", ")}`;
                    toast.add({ severity: "error", summary: "Fechas Inválidas", detail: mensaje, life: 9000 });
                    return;
                }


                try {
                    const response = await guardarExcelDevoluciones(formattedData);

                    if (response.success) {
                        // Actualizar el DataTable formateando la fecha para el frontend
                        dataDevoluciones.value = response.data.map((row) => ({
                            ...row,
                            fecha: row.fecha ? formatFechaDDMMYYYY(row.fecha) : null,
                        }));
                        toast.add({ severity: "success", summary: "Éxito", detail: "Datos cargados correctamente.", life: 3000 });
                    } else {
                        if (response.error == 'Campos incompletos') {
                            if (response.campoIncompleto == 'Campo desconocido') {
                                toast.add({
                                    severity: "error",
                                    summary: "Error al cargar los datos",
                                    detail: "El archivo excel posee datos incompletos.",
                                    life: 5000
                                });
                            } else {
                                toast.add({
                                    severity: "error",
                                    summary: "Error al cargar los datos",
                                    detail: `El archivo excel posee datos incompletos, revisar los datos de la columna "${response.campoIncompleto}".`,
                                    life: 6000
                                });
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


        const guardarExcelDevoluciones = async (datos) => {
            try {
                const response = await window.electronAPI.guardarExcelDevoluciones(datos);
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



        const formatearFecha = (fecha) => {

            const fechaDate = new Date(fecha);
            const dia = String(fechaDate.getDate()).padStart(2, '0'); // Asegurarse de que el día tenga dos dígitos
            const mes = String(fechaDate.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0, así que sumamos 1
            const año = fechaDate.getFullYear();

            const fechaFormateada = `${dia}/${mes}/${año}`;
            return fechaFormateada;
        }


        const generarPdf = () => {

            if (!registroGuardado.value) {
                toast.add({ severity: 'warn', summary: 'Error', detail: 'Debe guardar el registro antes de generar el PDF', life: 3000 });
                return
            }

            if (!fecha.value || !materialEquipo.value || !cantidad.value || !modelo.value || !marca.value || !procedencia.value || !destinoRecepcion.value) {
                toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor completa todos los campos.', life: 3000 });
                return;
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
            doc.text(`${formatearFecha(fecha.value)}`, 176, 10);



            doc.setFont('helvetica', 'bold');
            doc.text(`MATERIAL / EQUIPO: `, 7, 40);
            doc.rect(47, 36, 157, 5) //rec codigo informe
            doc.setFont('helvetica', 'normal');
            doc.text(`${materialEquipo.value}`, 49, 40)

            doc.setFont('helvetica', 'bold');
            doc.text(`CANTIDAD.:`, 7, 50)
            doc.rect(47, 46, 157, 5)
            doc.setFont('helvetica', 'normal');
            doc.text(`${cantidad.value}`, 49, 50)

            //SEGUNDO CUADRO DE INPUTS


            //RECTANGULO INPUTS INFERIORES
            // doc.rect(3, 81, 204, 100)

            doc.setFont('helvetica', 'bold');
            doc.text(`MARCA: `, 7, 70);
            doc.rect(47, 66, 157, 5) //rec codigo informe
            doc.setFont('helvetica', 'normal');
            doc.text(`${marca.value}`, 49, 70)

            doc.setFont('helvetica', 'bold');
            doc.text(`MODELO:`, 7, 80)
            doc.rect(47, 76, 157, 5)
            doc.setFont('helvetica', 'normal');
            doc.text(`${modelo.value}`, 49, 80)

            doc.setFont('helvetica', 'bold');
            doc.text(`PROCEDENCIA:`, 7, 100)
            doc.rect(47, 96, 157, 5)
            doc.setFont('helvetica', 'normal');
            doc.text(`${procedencia?.value}`, 49, 100)

            doc.setFont('helvetica', 'bold');
            doc.text(`DESTINO / RECEPCION:`, 7, 110)
            doc.rect(47, 106, 157, 5)
            doc.setFont('helvetica', 'normal');
            doc.text(`${destinoRecepcion.value}`, 49, 110)



            // RECTÁNGULO OBSERVACIONES
            doc.setFont('helvetica', 'bold');
            doc.rect(3, 129, 204, 80);
            doc.text(`DESCRIPCIÓN: `, 7, 137);
            doc.rect(7, 140, 196, 60);

            // Ajustar el texto dentro del rectángulo
            doc.setFont('helvetica', 'normal');
            const maxWidth = 185; // Ancho máximo del texto dentro del rectángulo
            const textLines = doc.splitTextToSize(descripcion.value || '', maxWidth);

            // // Imprimir el texto multilínea
            doc.text(textLines, 10, 144);



            doc.setFont('helvetica', 'bold');
            doc.text('Entrega por parte de Contratista', 6, 290);
            doc.rect(5, 260, 55, 25);  //Tecnico Contratista

            doc.text('Recibe por parte del Cliente', 151, 290);
            doc.rect(150, 260, 55, 25); //Inspector Mantenimiento



            const appLogo = new Image();
            appLogo.src = logo;
            appLogo.onload = () => {
                doc.addImage(appLogo, 'PNG', 4, 7, 15, 15);
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('REGISTRO DE DEVOLUCIONES', 28, 16);


                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                const nombrePdf = `DEVMAT-${yyyy}-${mm}-${dd}.pdf`;

                doc.save(nombrePdf);

            }
        }



        onMounted(() => {
            const today = new Date();
            fecha.value = today;
            obtenerDevoluciones()
        })

        return {
            showForm,
            showFilters,
            showDataTable,
            filter,
            handleForm,
            fecha,
            materialEquipo,
            cantidad,
            marca,
            modelo,
            procedencia,
            destinoRecepcion,
            descripcion,
            dataDevoluciones,
            toast,
            obtenerDevoluciones,
            loading,
            guardarDevolucion,
            handleInicio,
            handleFilter,
            handleFilters,
            fechaFinFiltro,
            fechaInicioFiltro,
            fechaFiltro,
            filtrarDevolucionesRangoFecha,
            filtrarDevolucionesFecha,
            resetearValores,
            materialEquipoFiltro,
            filtrarDevolucionesMaterial,
            filtrarDevolucionesMarca,
            filtrarDevolucionesModelo,
            marcaFiltro,
            modeloFiltro,
            procedenciaFiltro,
            filtrarDevolucionesProcedencia,
            generarListadoPDF,
            importarExcel,
            guardarExcelDevoluciones,
            formatFechaDDMMYYYY,
            convertirFechaYYYYMMDD,
            formatFechaExcel,
            exportarExcel,
            generarPdf,
            formatearFecha,
            registroGuardado,
            ultimoRegistroGuardado,
            compararUltimoRegistro,
            reiniciarFormulario,
            formCompleto,
            formatFechaDate,
            formatFechaExcel,
            formatFechaToYYYYMMDD,
            validarFormatoFecha,
            confirmarEliminacion,
            eliminarDevolucion,
            abrirDialogEditar,
            devolucionEdicion,
            showDialogEditar,
            actualizarDevolucion
        }

    }

})
</script>