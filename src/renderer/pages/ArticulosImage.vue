<template>
    <section class="min-h-screen p-8 bg-[#0F172A]">
    <div class="max-w-[97%] mx-auto space-y-8">
      <!-- Filtros en un contenedor con fondo claro, borde y sombra -->
      <div class="bg-slate-800 p-4 rounded-lg shadow-md">
        <h2 class="text-xl font-bold  mb-4">Filtrar Artículos</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputText v-model="filters.material_repuesto" placeholder="Buscar por material" class="p-2 border rounded" />
          <InputText v-model="filters.marca" placeholder="Buscar por marca" class="p-2 border rounded" />
          <InputText v-model="filters.modelo_serie" placeholder="Buscar por modelo" class="p-2 border rounded" />
        </div>
      </div>

      <!-- Contenedor de Carousel y DataTable -->
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Carousel dentro de un contenedor estilizado -->
        <div class="md:w-1/2 bg-slate-800 p-4 rounded-lg shadow-md">
          <h3 class="text-lg font-bold text-gray-800 mb-2 text-center">Vista Previa del Artículo</h3>
          <Carousel 
            :value="carouselItems" 
            :numVisible="1" 
            :numScroll="1" 
            :showIndicators="false"
            :responsiveOptions="responsiveOptions"
            class="rounded-lg overflow-hidden"
          >
            <template #item="slotProps">
              <div class="flex flex-col">
                <!-- Imagen -->
                <div class="h-[300px] overflow-hidden">
                  <img 
                    :src="formatImagePath(slotProps.data.imagen)"
                    :alt="`${slotProps.data.marca} ${slotProps.data.modelo_serie}`"
                    class="w-full h-full rounded object-cover" />
                </div>
                <!-- Datos del artículo -->
                <div class="mt-4">
                  <div class="flex justify-between text-white">
                    <p class="w-1/2"><strong>Material:</strong> {{ slotProps.data.material_repuesto }}</p>
                    <p class="w-1/2 text-right"><strong>Cantidad:</strong> {{ slotProps.data.cantidad }}</p>
                  </div>
                  <div class="flex justify-between text-white">
                    <p class="w-1/2"><strong>Modelo:</strong> {{ slotProps.data.modelo_serie }}</p>
                    <p class="w-1/2 text-right"><strong>Marca:</strong> {{ slotProps.data.marca }}</p>
                  </div>
                </div>
              </div>
            </template>
          </Carousel>
        </div>

        <!-- DataTable en contenedor con fondo claro y sombra -->
        <div class="md:w-1/2 bg-slate-800 p-4 rounded-lg shadow-md">
          <h3 class="text-lg font-bold text-gray-800 mb-2 text-center">Listado de Artículos</h3>
          <DataTable 
            v-model:filters="filters" 
            :value="filteredArticulos" 
            paginator 
            :rows="4" 
            class="mx-auto"
            selectionMode="single" 
            :selection="selectedArticulo"
            @row-select="onArticuloSelect"
            dataKey="id"
          >
            <Column field="material_repuesto" header="MATERIAL" :showFilterMenu="false" />
            <Column field="marca" header="MARCA" :showFilterMenu="false" />
            <Column field="modelo_serie" header="MODELO" :showFilterMenu="false" />
            <Column field="cantidad" header="CANTIDAD" />
          </DataTable>
        </div>
      </div>
      
      <!-- Aquí se ubican los Dialogs si los necesitas -->
      <Dialog v-model:visible="showForm" modal header="NUEVO ARTÍCULO">
        <FormularioArticulos @guardarArticulo="guardarArticulo" @cancelar="handleForm(false)" />
      </Dialog>
      
      <DialogEditar v-if="showDialogEditar" :articuloEdicion="articuloEdicion" @actualizarArticulo="editarArticulo" />
      
      <Dialog v-model:visible="showIngresoSalida.show" modal
        :header="showIngresoSalida.accion == 'INGRESO' ? 'INGRESO ARTÍCULO' : 'SALIDA ARTÍCULO'">
        <IngresoSalida 
          :ingresoSalida="showIngresoSalida.accion" 
          :articuloSeleccionado="articuloSeleccionado"
          :numeroInformeMovimiento="numeroInformeMovimiento" 
          @guardarMovimiento="crearMovimiento"
          @cancelarIngresoSalida="handleIngresoSalida(false)" 
          @reiniciarFormulario="reiniciarIngresoSalida"
          @nuevoPdf="nuevoPdf" />
      </Dialog>
    </div>
    <Toast />
    <ConfirmDialog />
  </section>


    <Toast />
    <ConfirmDialog></ConfirmDialog>

</template>

<script>

import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue';
import { useArticulos } from '../composables/useArticulos.js'
import { useMovimientos } from '../composables/useMovimientos.js'
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import InputNumber from 'primevue/inputnumber';
import FormularioArticulos from '../components/Articulos/FormularioArticulos.vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { FilterMatchMode } from '@primevue/core/api';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import DialogEditar from '../components/Articulos/DialogEditar.vue';
import IngresoSalida from '../components/Movimientos/IngresoSalida.vue';
import { formatFechaToYYYYMMDD } from '../utils/funcionesFecha.js'
import Carousel from 'primevue/carousel';

export default defineComponent({
    name: 'ArticulosImage',
    components: {
        DataTable,
        Column,
        Toast,
        InputNumber,
        Button,
        FormularioArticulos,
        Dialog,
        ConfirmDialog,
        DialogEditar,
        IngresoSalida,
        Carousel

    },

    setup() {
        const { obtenerArticulos, crearArticulo, eliminarArticulo, actualizarArticulo } = useArticulos();
        const { guardarMovimiento, generarPdf, obtenerUltimoMovimiento } = useMovimientos();
        const dataArticulos = ref([]);
        const toast = useToast();
        const confirm = useConfirm();
        const numeroInformeMovimiento = ref(null);
        const articuloEdicion = ref({
            id: null,
            material_repuesto: '',
            marca: '',
            modelo_serie: '',
            cantidad: null,
            imagen: ''
        })
        const showForm = ref(false);
        const showDialogEditar = ref(false);
        const showIngresoSalida = ref({ show: false, accion: '' });
        const articuloSeleccionado = ref(null);
        const registroGuardado = ref(false);

        // const filters = ref({
        //   global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        //   material_repuesto: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        //   marca: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        //   modelo_serie: { value: null, matchMode: FilterMatchMode.STARTS_WITH },

        // })

        const responsiveOptions = ref([
            {
                breakpoint: '1400px',
                numVisible: 1,
                numScroll: 1
            },
            {
                breakpoint: '1199px',
                numVisible: 1,
                numScroll: 1
            },
            {
                breakpoint: '767px',
                numVisible: 1,
                numScroll: 1
            },
            {
                breakpoint: '575px',
                numVisible: 1,
                numScroll: 1
            }
        ]);


        const handleForm = (show) => {
            showForm.value = show;
        }

        // Artículo seleccionado en el DataTable
        const selectedArticulo = ref(null)

        // Computed para el Carousel: si hay un artículo seleccionado, rota la lista para que ese aparezca primero; de lo contrario, muestra la lista filtrada original
        const carouselItems = computed(() => {
            if (selectedArticulo.value) {
                const index = filteredArticulos.value.findIndex(
                    item => item.id === selectedArticulo.value.id
                );
                if (index !== -1) {
                    return [
                        ...filteredArticulos.value.slice(index),
                        ...filteredArticulos.value.slice(0, index)
                    ];
                }
            }
            return filteredArticulos.value;
        })


        // Función para actualizar el artículo seleccionado al marcar una fila en el DataTable
        function onArticuloSelect(event) {
            console.log("Fila seleccionada:", event.data);
            selectedArticulo.value = event.data;
        }


        const filters = ref({
            material_repuesto: '',
            marca: '',
            modelo_serie: ''
        })

        const filteredArticulos = computed(() => {
            return (dataArticulos.value || []).filter(item => {
                const materialMatch = (item.material_repuesto || '').toLowerCase().includes((filters.value.material_repuesto || '').toLowerCase());
                const marcaMatch = (item.marca || '').toLowerCase().includes((filters.value.marca || '').toLowerCase());
                const modeloMatch = (item.modelo_serie || '').toLowerCase().includes((filters.value.modelo_serie || '').toLowerCase());
                return materialMatch && marcaMatch && modeloMatch;
            });
        });

        // Variable para almacenar el artículo activo (por defecto, el primero)
        const activeArticulo = ref(filteredArticulos.value[0] || null)

        // Función para actualizar el artículo activo al cambiar el carousel
        function onPageChange(event) {
            // El objeto event debe incluir el índice actual (ajusta según la documentación de tu Carousel)
            const index = event.page
            activeArticulo.value = filteredArticulos.value[index]
        }


        //     function formatImagePath(path) {
        //   if (!path) return '';
        //   let fixedPath = path.replace(/\\/g, '/');
        //   if (/^[A-Za-z]:/.test(fixedPath)) {
        //     fixedPath = '/' + fixedPath;
        //   }
        //   return `local://${fixedPath}`;
        // }
        function formatImagePath(path) {
            if (!path) return '';
            // Reemplaza las barras invertidas por barras normales.
            const fixedPath = path.replace(/\\/g, '/');
            // Retorna la URL con el esquema "local"
            return `local://${fixedPath}`;
        }



        const nuevoPdf = async (datosFormulario) => {

            if (!registroGuardado.value) {
                toast.add({ severity: 'error', summary: 'Registro sin guardar', detail: 'Debes guardar el movimiento antes de generar el PDF, intente nuevamente', life: 6000 });
                return;
            }
            try {
                const pdfGuardado = await generarPdf(datosFormulario);

                if (pdfGuardado.success) {
                    handleIngresoSalida(false);
                    toast.add({ severity: 'success', summary: 'Éxito', detail: 'PDF guardado correctamente', life: 6000 });

                } else {
                    toast.add({ severity: 'warn', summary: 'Pdf sin guardar', detail: 'No se ha generadoo el PDF', life: 6000 });
                }

            } catch (error) {
                toast.add({ severity: 'error', summary: 'Pdf sin guardar', detail: 'Hubo un error al guardar el PDF, intente nuevamente', life: 6000 });
            }
        }

        const reiniciarIngresoSalida = async () => {

            registroGuardado.value = false;


            const ultimoNumMovimiento = await ultimoNumeroMovimiento();  //El numero de informe será el ultimo numero de movimiento + 1 (porque el n° de movimiento es el Id en el excel)
            if (!ultimoNumMovimiento) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener el N° de informe, intente nuevamente', life: 5000 });
                return;
            }

            // Se extrae la parte numerica por si el numero viene con el formato de 1302-B por ejemplo.
            const formatUltimoMovimiento = parseInt(ultimoNumMovimiento, 10);

            if (isNaN(formatUltimoMovimiento)) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Formato de número de movimiento inválido, por favor revise el archivo excel importado.', life: 5000 });
                return;
            }

            //numeroInformeMovimiento.value = formatUltimoMovimiento + 1;
            numeroInformeMovimiento.value = (formatUltimoMovimiento + 1).toString();




        }

        const handleIngresoSalida = async (show, accion, articulo) => {

            if (!show) {
                registroGuardado.value = false;
                showIngresoSalida.value.show = false;
                return
            }

            const ultimoNumMovimiento = await ultimoNumeroMovimiento();  //El numero de informe será el ultimo numero de movimiento + 1 (porque el n° de movimiento es el Id en el excel)
            if (!ultimoNumMovimiento) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener el N° de informe, intente nuevamente', life: 5000 });
                return;
            }

            // Se extrae la parte numerica por si el numero viene con el formato de 1302-B por ejemplo.
            const formatUltimoMovimiento = parseInt(ultimoNumMovimiento, 10);

            if (isNaN(formatUltimoMovimiento)) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Formato de número de movimiento inválido, por favor revise el archivo excel importado.', life: 5000 });
                return;
            }

            //numeroInformeMovimiento.value = formatUltimoMovimiento + 1;
            numeroInformeMovimiento.value = (formatUltimoMovimiento + 1).toString();

            showIngresoSalida.value.show = show;
            showIngresoSalida.value.accion = accion;
            articuloSeleccionado.value = { ...articulo }

            // console.log('articuloSeleccionado.value', articuloSeleccionado.value)
        }
        async function guardarArticulo(datosFormulario) {

            const response = await crearArticulo(datosFormulario);

            if (response.success) {
                dataArticulos.value.push(response.data)
                handleForm(false);
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Artículo guardado correctamente', life: 5000 });

            } else {
                if (response.error == 'Ya existe un artículo con esa marca y modelo') {
                    toast.add({ severity: 'error', summary: 'Error', detail: `${response.error}`, life: 5000 });
                    return;
                }
                toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el artículo, intente nuevamente', life: 5000 });
            }
        }
        const editarArticulo = async (articulo) => {

            const response = await actualizarArticulo(articulo);

            if (response.success) {

                const indexArticulo = dataArticulos.value.findIndex(art => art.id == response.data.id);

                dataArticulos.value.splice(indexArticulo, 1, response.data);
                showDialogEditar.value = false;
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Artículo editado correctamente', life: 5000 });
            } else {
                showDialogEditar.value = false;
                toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el artículo, intente nuevamente', life: 5000 });
            }



        }
        const abrirDialogEditar = (articulo) => {

            articuloEdicion.value = { ...articulo };
            showDialogEditar.value = true;
        }

        const ultimoNumeroMovimiento = async () => {

            const response = await obtenerUltimoMovimiento();
            if (response.success) {
                return response.data;
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al obtener el N° de informe, intente nuevamente', life: 5000 });
                return;
            }

        }


        const confirmarEliminacion = (articulo) => {

            const { id } = articulo;

            confirm.require({
                message: `¿Estás seguro de eliminar este artículo?`,
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

                    const eliminacion = await eliminarArticulo(id);

                    if (eliminacion.success) {
                        const indexArticulo = dataArticulos.value.findIndex(i => i.id === id)

                        if (indexArticulo !== -1) {
                            dataArticulos.value.splice(indexArticulo, 1);
                        }

                        toast.add({ severity: 'info', summary: 'Éxito', detail: `Artículo eliminado correctamente`, life: 5000 });

                    } else {

                        if (eliminacion.error == 'No se encontró el articulo') {
                            toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontró el articulo, error al eliminarlo, intente nuevamente', life: 3000 });
                            return;
                        }
                        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el informe, intente nuevamente', life: 3000 });
                    }

                },
                // reject: () => {
                // }
            });

        }

        const crearMovimiento = async (datosCompIngresoSalida) => {
            //console.log('datosFormulario', datosCompIngresoSalida) //llegan del componente hijo

            const datosFormulario = {
                ...datosCompIngresoSalida,
                fecha: datosCompIngresoSalida.fecha ? formatFechaToYYYYMMDD(datosCompIngresoSalida.fecha) : ''
            }

            const response = await guardarMovimiento(datosFormulario);
            // console.log('response en crear movimiento', response)
            if (response.success) {

                // console.log('response.data movmiento generado', response.data)
                //dataArticulos.value.push(response.data);
                const movimientoArticulo = response.data;

                const indexArticulo = dataArticulos.value.findIndex(art => art.id == movimientoArticulo.articulo_id);

                if (indexArticulo == -1) {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo encontrar el artículo, intente nuevamente', life: 3000 });
                    return;
                }

                const articuloParaModificar = dataArticulos.value[indexArticulo];

                articuloParaModificar.cantidad += showIngresoSalida.value.accion === 'INGRESO' ? 1 : -1;


                // showIngresoSalida.value.show = false;
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Movimiento creado correctamente', life: 5000 });
                registroGuardado.value = true;
            } else {

                if (response.error == 'El artículo no existe') {
                    showIngresoSalida.value.show = false;
                    toast.add({ severity: 'error', summary: 'Error', detail: 'El artículo no existe en la base de datos', life: 3000 });
                    return;
                } else if (response.error == 'Stock insuficiente para realizar la salida') {

                    showIngresoSalida.value.show = false;
                    toast.add({ severity: 'error', summary: 'Sin stock', detail: 'La cantidad del artículo seleccionado es 0, por lo que no se le puede dar salida.', life: 5000 });
                    return;

                } else if (response.error == 'numero de informe repetido') {
                    toast.add({ severity: 'error', summary: 'Informe Existente', detail: 'Ya existe un registro con este n° de informe, por favor reinicia el formulario para crear uno nuevo', life: 5000 });
                    return;

                }

                showIngresoSalida.value.show = false;
                toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el movimiento, intente nuevamente', life: 3000 });
                registroGuardado.value = false;
            }
        }

        // Si los filtros cambian y el artículo seleccionado ya no está presente, se resetea la selección
        watch(filteredArticulos, (newVal) => {
            if (selectedArticulo.value && !newVal.find(item => item.id === selectedArticulo.value.id)) {
                selectedArticulo.value = null;
            }
        });

        onMounted(async () => {

            const response = await obtenerArticulos();
            if (response.success) {
                dataArticulos.value = response.data;
                console.log('',)
            } else {
                console.log('no se pudieron obtener los articulos')
                console.log(response.error)
                toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron obtener los datos, intente nuevamente', life: 3000 });

            }

        })


        return {
            activeArticulo,
            filteredArticulos,
            onPageChange,
            dataArticulos,
            crearArticulo,
            eliminarArticulo,
            guardarArticulo,
            showForm,
            handleForm,
            filters,
            confirmarEliminacion,
            abrirDialogEditar,
            showDialogEditar,
            showIngresoSalida,
            articuloEdicion,
            handleIngresoSalida,
            ultimoNumeroMovimiento,
            obtenerUltimoMovimiento,
            numeroInformeMovimiento,
            guardarMovimiento,
            crearMovimiento,
            articuloEdicion,
            articuloSeleccionado,
            formatFechaToYYYYMMDD,
            registroGuardado,
            generarPdf,
            nuevoPdf,
            reiniciarIngresoSalida,
            actualizarArticulo,
            editarArticulo,
            formatImagePath,
            responsiveOptions,
            onArticuloSelect,
            selectedArticulo,
            carouselItems,
            filteredArticulos

        }
    }

})


</script>
