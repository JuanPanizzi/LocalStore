<template>

<DataTable  :value="dataArticulos" paginator :rows="5" tableStyle="min-width: 50rem"
    showGridlines style="max-width: 90vw" class="mx-auto">
        <Column field="numero_movimiento" header="ID"></Column>
        <Column field="fecha" header="FECHA"></Column>
        <Column field="tipo_movimiento" header="MOVIMIENTO"></Column>
        <Column field="origen" header="ORIGEN"></Column>
        <Column field="destino" header="DESTINO"></Column>
        <Column field="cantidad" header="CANTIDAD"></Column>
        <Column field="permiso_trabajo_asociado" header="PT ASOCIADO"></Column>
        <Column field="informe_asociado" header="INFORME ASOCIADO"></Column>
        <Column field="orden_trabajo_asociada" header="OT ASOCIADA"></Column>
        <Column field="remito" header="REMITO"></Column>
        <Column field="numero_almacenes" header="N° ALMACENES"></Column>
        <Column field="material_repuesto" header="MATERIAL / REPUESTO"></Column>
        <Column field="marca" header="MARCA"></Column>
        <Column field="modelo" header="MODELO"></Column>
    </DataTable>
    


</template>

<script>
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { defineComponent } from 'vue';


export default defineComponent({
    name: 'Articulos',
    components: {
      DataTable,
      Column
    },
    
    setup(){

      const dataArticulos = ref(null);

        return {

          dataArticulos




        }
    }

})


</script>