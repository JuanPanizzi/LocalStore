<template>

  <div class="max-w-[90vw] mx-auto my-5">
    <Button label="Nuevo" @click="handleForm(true)" />
    <Button label="Buscar" class="mx-2" />
  </div>

  <DataTable v-model:filters="filters" :value="dataArticulos" paginator :rows="5" filterDisplay="row"
    tableStyle="min-width: 50rem" showGridlines class="max-w-[90vw] mx-auto" :globalFilterFields="['material']">

    <Column field="material" header="MATERIAL">
      <template #filter="{ filterModel, filterCallback }">
        <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
          placeholder="Buscar por material" />
      </template>

    </Column>
    <!-- <Column field="material" header="MATERIAL"></Column> -->
    <Column field="marca" header="MARCA"></Column>
    <Column field="modelo" header="MODELO"></Column>
    <Column field="imagen" header="IMAGEN"></Column>
    <Column field="cantidad" header="CANTIDAD"></Column>
  </DataTable>

  <!-- Aquí se envuelve el formulario en el diálogo modal -->
  <Dialog v-model:visible="showForm" modal header="NUEVO ARTÍCULO">
    <FormularioArticulos @guardarArticulo="guardarArticulo" @cancelar="handleForm(false)" />
  </Dialog>
  <Toast />
</template>

<script>
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { defineComponent, onMounted, ref } from 'vue';
import { useArticulos } from '../composables/useArticulos.js'
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import InputNumber from 'primevue/inputnumber';
import FormularioArticulos from '../components/Articulos/FormularioArticulos.vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { FilterMatchMode } from '@primevue/core/api';

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

  },

  setup() {
    const { obtenerArticulos, crearArticulo } = useArticulos();

    const dataArticulos = ref(null);
    const toast = useToast();
    const showForm = ref(false);
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      material: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
    })

    const representatives = ref([
      { name: 'mat' },
      { name: 'material' },

    ]);

    const handleForm = (show) => {
      showForm.value = show;
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
      guardarArticulo,
      showForm,
      handleForm,
      filters


    }
  }

})


</script>