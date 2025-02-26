<template>

  <div class="max-w-[90vw] mx-auto my-5">
    <Button outlined label="Ingreso" severity="success" @click="handleIngresoSalida(true, 'Ingresar')"  />
    <Button outlined label="Salida" severity="danger" class="mx-2" @click="handleIngresoSalida(true, 'Salida')" />
    <Button outlined label="Crear Artículo" @click="handleForm(true)" />
    
  </div>

  <DataTable v-if="!showIngresoSalida.show" v-model:filters="filters" :value="dataArticulos" paginator :rows="5" filterDisplay="row"
    tableStyle="min-width: 50rem" showGridlines class="max-w-[90vw] mx-auto" 
    :globalFilterFields="['material', 'marca']">

    <Column field="material" header="MATERIAL" :showFilterMenu="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
          placeholder="Buscar por material" />
      </template>

    </Column>
    <!-- <Column field="material" header="MATERIAL"></Column> -->
    <Column field="marca" header="MARCA" :showFilterMenu="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
          placeholder="Buscar por marca" />
      </template>
    </Column>
    <Column field="modelo" header="MODELO" :showFilterMenu="false">
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
          placeholder="Buscar por modelo" />
      </template>
    </Column>
    <Column field="imagen" header="IMAGEN"></Column>
    <Column field="cantidad" header="CANTIDAD"></Column>
    <Column>
      <template #body="slotProps">
        <div class="flex ">
          <Button outlined icon="pi pi-pencil" @click="abrirDialogEditar(slotProps.data)" />
          <Button outlined class="ml-2" icon="pi pi-trash" severity="danger" @click="confirmarEliminacion(slotProps.data)" />
        </div>
      </template>
    </Column>

  </DataTable>

  <!-- Dialog crear articulo -->
  <Dialog v-model:visible="showForm" modal header="NUEVO ARTÍCULO">
    <FormularioArticulos @guardarArticulo="guardarArticulo" @cancelar="handleForm(false)" />
  </Dialog>

  <DialogEditar v-if="showDialogEditar" :articuloSeleccionado="articuloSeleccionado" />

  <Dialog v-model:visible="showIngresoSalida.show" modal 
  :header="showIngresoSalida.accion == 'Ingresar' ? 'INGRESO ARTICULO' : 'SALIDA ARTICULO'" >
    <IngresoSalida :numeroInformeMovimiento="numeroInformeMovimiento" @guardarMovimiento="guardarMovimiento" />
  </Dialog>


  <Toast />
  <ConfirmDialog></ConfirmDialog>

</template>

<script>

import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { useArticulos } from '../composables/useArticulos.js'
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
    const { obtenerArticulos, crearArticulo, eliminarArticulo, obtenerUltimoMovimiento } = useArticulos();

    const dataArticulos = ref(null);
    const toast = useToast();
    const confirm = useConfirm();
    const numeroInformeMovimiento = ref(null);
    const articuloSeleccionado = ref({
      id: null,
      material: '',
      marca: '',
      modelo: '',
      cantidad: null,
      imagen: ''
    })
    const showForm = ref(false);
    const showDialogEditar = ref(false);
    const showIngresoSalida = ref({show: false, accion: ''});
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      material: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      marca: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      modelo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },

    })

    const handleForm = (show) => {
      showForm.value = show;
    }
    const handleIngresoSalida = async (show, accion) => {
      
      const ultimoNumMovimiento = await ultimoNumeroMovimiento();  //El numero de informe será el ultimo numero de movimiento + 1 (porque el n° de movimiento es el Id en el excel)
      if(!ultimoNumMovimiento){
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener el N° de informe, intente nuevamente', life: 5000 });
        return;
      }
      numeroInformeMovimiento.value = ultimoNumMovimiento + 1;

      showIngresoSalida.value.show = show;
      showIngresoSalida.value.accion = accion;
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

    const abrirDialogEditar = (articulo) => {
     
      articuloSeleccionado.value = { ...articulo};
      showDialogEditar.value = true;
    }

    const ultimoNumeroMovimiento = async () => {

      const response = await obtenerUltimoMovimiento();
      if(response.success){
        return response.data;
      }else {
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

    const guardarMovimiento = (datosFormulario) => { 
      
        const response = await guardarMovimiento(datosFormulario);

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
      articuloSeleccionado,
      handleIngresoSalida,
      ultimoNumeroMovimiento,
      obtenerUltimoMovimiento,
      numeroInformeMovimiento

    }
  }

})


</script>
