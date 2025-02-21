<template>

<DataTable  :value="dataArticulos" paginator :rows="5" tableStyle="min-width: 50rem"
    showGridlines style="max-width: 90vw" class="mx-auto">
        <Column field="material" header="MATERIAL"></Column>
        <Column field="marca" header="MARCA"></Column>
        <Column field="modelo" header="MODELO"></Column>
        <Column field="imagen" header="IMAGEN"></Column>
        <Column field="cantidad" header="CANTIDAD"></Column>
        
    </DataTable>
    


</template>

<script>
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { defineComponent, onMounted, ref } from 'vue';
import { useArticulos } from '../composables/useArticulos.js'

export default defineComponent({
    name: 'Articulos',
    components: {
      DataTable,
      Column
    },
    
    setup(){

      const dataArticulos = ref(null);
      const { obtenerArticulos } = useArticulos();
      
      onMounted(async () => {

        const response = await obtenerArticulos();
        if(response.success){
          dataArticulos.value = response.data;
          console.log('response', response.data)
        }else{
          console.log('no se pudieron obtener los articulos')
        }

      })


      return {

          dataArticulos


        }
    }

})


</script>