<template>

  <div>
    <Button label="Nuevo" @click="handleForm(true)" />
  </div>

  <DataTable :value="dataArticulos" paginator :rows="5" tableStyle="min-width: 50rem" showGridlines
    style="max-width: 90vw" class="mx-auto">
    <Column field="material" header="MATERIAL"></Column>
    <Column field="marca" header="MARCA"></Column>
    <Column field="modelo" header="MODELO"></Column>
    <Column field="imagen" header="IMAGEN"></Column>
    <Column field="cantidad" header="CANTIDAD"></Column>
  </DataTable>

  <Dialog v-model:visible="showForm" modal header="Crear Artículo Nuevo">
    <FormularioArticulos @guardarArticulo="guardarArticulo" />
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

export default defineComponent({
  name: 'Articulos',
  components: {
    DataTable,
    Column,
    Toast,
    InputNumber,
    Button,
    FormularioArticulos,
    Dialog
  },

  setup() {
    const { obtenerArticulos, crearArticulo } = useArticulos();

    const dataArticulos = ref(null);
    const toast = useToast();
    const showForm = ref(false);


    const handleForm = (show) => {
      showForm.value = show
    }

    async function guardarArticulo(datosFormulario) {
      console.log('datos del cop hijo', datosFormulario)
      const response = await crearArticulo(datosFormulario);

      if (response.success) {
        console.log('response', response)
        dataArticulos.value.push(response.data)
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el artículo, intente nuevamente', life: 3000 });
      }

    }


    onMounted(async () => {

      const response = await obtenerArticulos();
      if (response.success) {
        dataArticulos.value = response.data;
        // console.log('response', response.data)
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
      handleForm


    }
  }

})


</script>