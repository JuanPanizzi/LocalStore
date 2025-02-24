<template>

  <div>
    <Button label="Nuevo"  />
  </div>

<DataTable  :value="dataArticulos" paginator :rows="5" tableStyle="min-width: 50rem"
    showGridlines style="max-width: 90vw" class="mx-auto">
        <Column field="material" header="MATERIAL"></Column>
        <Column field="marca" header="MARCA"></Column>
        <Column field="modelo" header="MODELO"></Column>
        <Column field="imagen" header="IMAGEN"></Column>
        <Column field="cantidad" header="CANTIDAD"></Column>
        
    </DataTable>
    

<Toast />
</template>

<script>
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { defineComponent, onMounted, ref } from 'vue';
import { useArticulos } from '../composables/useArticulos.js'
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

export default defineComponent({
    name: 'Articulos',
    components: {
      DataTable,
      Column,
      Toast
    },
    
    setup(){
      const { obtenerArticulos, nuevoArticulo } = useArticulos();
      
      const dataArticulos = ref(null);
      const toast = useToast();

      


      async function crearArticulo() {

        const response = await crearArticulo();

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
          console.log('response', response.data)
        }else{
          console.log('no se pudieron obtener los articulos')
          console.log(response.error)
          toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron obtener los datos, intente nuevamente', life: 3000 });

        }

      })


      return {

          dataArticulos,
          crearArticulo


        }
    }

})


</script>