<template>

  <div>
    <Button label="Nuevo" @click="handleForm(true)" />
  </div>

<DataTable  :value="dataArticulos" paginator :rows="5" tableStyle="min-width: 50rem"
    showGridlines style="max-width: 90vw" class="mx-auto">
        <Column field="material" header="MATERIAL"></Column>
        <Column field="marca" header="MARCA"></Column>
        <Column field="modelo" header="MODELO"></Column>
        <Column field="imagen" header="IMAGEN"></Column>
        <Column field="cantidad" header="CANTIDAD"></Column>
</DataTable>

<FormularioArticulos v-if="showForm"  @guardarArticulo="crearArticulo"/>

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

export default defineComponent({
    name: 'Articulos',
    components: {
      DataTable,
      Column,
      Toast,
      InputNumber,
      Button,
      FormularioArticulos
    },
    
    setup(){
      const { obtenerArticulos, nuevoArticulo } = useArticulos();
      
      const dataArticulos = ref(null);
      const toast = useToast();
      const showForm = ref(false);

      
      const handleForm = (show) => {
        showForm.value = show
      }

      async function crearArticulo(datosFormulario) {
        console.log('datos que recibe el componente padre del formulario hijo', datosFormulario)
        
        const response = await crearArticulo(datosFormulario);

        if(response.success){
          dataArticulos.value.push(response.data)
        }else{
          toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el artículo, intente nuevamente', life: 3000 });
        }

      } 


      onMounted(async () => {

        const response = await obtenerArticulos();
        if(response.success){
          dataArticulos.value = response.data;
          // console.log('response', response.data)
        }else{
          console.log('no se pudieron obtener los articulos')
          console.log(response.error)
          toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron obtener los datos, intente nuevamente', life: 3000 });

        }

      })


      return {

          dataArticulos,
          crearArticulo,
          showForm,
          handleForm


        }
    }

})


</script>