<template>
    <section class="p-5 bg-[#0F172A]">
  
  <!-- <section class="p-5 "> -->
    <!-- <h1 class="font-bold text-xl ">Artículos</h1> -->

    <div class="max-w-[90vw] flex justify-end mx-auto my-5">

      <Button label="Crear Artículo" icon="pi pi-plus" @click="handleForm(true)" />

    </div>
    <DataTable v-if="!showIngresoSalida.show" v-model:filters="filters" :value="dataArticulos" paginator :rows="5"
      filterDisplay="row" tableStyle="min-width: 50rem" showGridlines class="max-w-[90vw] mx-auto"
      :globalFilterFields="['material_repuesto', 'marca', 'modelo_serie']">

      <Column field="material_repuesto" header="MATERIAL" :showFilterMenu="false">
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
            placeholder="Buscar por material" />
        </template>

      </Column>
      <!-- <Column field="material" header="MATERIAL"></Column> -->
      <Column field="marca" header="MARCA" :showFilterMenu="false">
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Buscar por marca" />
        </template>
      </Column>
      <Column field="modelo_serie" header="MODELO" :showFilterMenu="false">
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
            placeholder="Buscar por modelo" />
        </template>
      </Column>
      <Column field="imagen" header="IMAGEN">
      <template #body="slotProps">
        <img :src="formatImagePath(slotProps.data.imagen)"  alt="imagen" />
        </template>
    </Column>
      <Column field="cantidad" header="CANTIDAD"></Column>
      <Column header="INGRESO / SALIDA">
        <template #body="slotProps">
          <div class="flex justify-center">
            <Button icon="pi pi-sign-in" severity="success"
              @click="handleIngresoSalida(true, 'INGRESO', slotProps.data)" />
            <Button icon="pi pi-sign-out" severity="danger" class="mx-2"
              @click="handleIngresoSalida(true, 'SALIDA', slotProps.data)" />
          </div>
        </template>
      </Column>
      <Column header="EDITAR / ELIMINAR">
        <template #body="slotProps">
          <div class="flex justify-center">
            <Button outlined icon="pi pi-pencil" @click="abrirDialogEditar(slotProps.data)" />
            <Button outlined class="ml-2" icon="pi pi-trash" severity="danger"
              @click="confirmarEliminacion(slotProps.data)" />
          </div>
        </template>
      </Column>
      <!-- <Column header="HISTORIAL">
        <template #body="slotProps">
          <div class="flex justify-center">
            <Button icon="pi pi-calendar-clock "  />
          </div>
        </template>
    </Column> -->
    </DataTable>

    <!-- Dialog crear articulo -->
    <Dialog v-model:visible="showForm" modal header="NUEVO ARTÍCULO">
      <FormularioArticulos @guardarArticulo="guardarArticulo" @cancelar="handleForm(false)" />
    </Dialog>

    <DialogEditar v-if="showDialogEditar" :articuloEdicion="articuloEdicion" @actualizarArticulo="editarArticulo" />

    <!-- Dialog para ingresar o dar salida a un artículo -->
    <Dialog v-model:visible="showIngresoSalida.show" modal
      :header="showIngresoSalida.accion == 'INGRESO' ? 'INGRESO ARTICULO' : 'SALIDA ARTICULO'">
      <IngresoSalida :ingresoSalida="showIngresoSalida.accion" :articuloSeleccionado="articuloSeleccionado"
        :numeroInformeMovimiento="numeroInformeMovimiento" @guardarMovimiento="crearMovimiento"
        @cancelarIngresoSalida="handleIngresoSalida(false)" @reiniciarFormulario="reiniciarIngresoSalida"
        @nuevoPdf="nuevoPdf" />
    </Dialog>
  </section>


  <Toast />
  <ConfirmDialog></ConfirmDialog>

</template>

<script>

import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { defineComponent, onMounted, reactive, ref } from 'vue';
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

export default defineComponent({
  name: 'Articulos',
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
    IngresoSalida

  },

  setup() {
    const { obtenerArticulos, crearArticulo, eliminarArticulo, actualizarArticulo } = useArticulos();
    const { guardarMovimiento, generarPdf, obtenerUltimoMovimiento } = useMovimientos();
    const dataArticulos = ref(null);
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

    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      material_repuesto: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      marca: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      modelo_serie: { value: null, matchMode: FilterMatchMode.STARTS_WITH },

    })

    const handleForm = (show) => {
      showForm.value = show;
    }

    function formatImagePath(path) {
  if (!path) return '';
  let fixedPath = path.replace(/\\/g, '/');
  if (/^[A-Za-z]:/.test(fixedPath)) {
    fixedPath = '/' + fixedPath;
  }
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
      
      if(response.success){
        
        const indexArticulo = dataArticulos.value.findIndex(art => art.id == response.data.id);

        dataArticulos.value.splice(indexArticulo, 1, response.data);
        showDialogEditar.value = false;
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Artículo editado correctamente', life: 5000 });
      }else{
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

    onMounted(async () => {

      const response = await obtenerArticulos();
      if (response.success) {
        dataArticulos.value = response.data;
      } else {
        console.log('no se pudieron obtener los articulos')
        console.log(response.error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron obtener los datos, intente nuevamente', life: 3000 });

      }

    })


    return {
      formatImagePath,
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
      editarArticulo

    }
  }

})


</script>
