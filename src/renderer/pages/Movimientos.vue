<template>



    <DataTable>


        <Column field="id" header="ID"></Column>
    </DataTable>

    <Button label="Importar Excel" @click="importarExcel(dataMovimientos)" />
    <Toast />
</template>
<script>
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { defineComponent } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useMovimientos} from '../composables/useMovimientos';


export default defineComponent({
    name: 'Movimientos',
    components: {
        Button,
        Column,
        DataTable,
        Toast
    },



    setup() {

        const toast = useToast();
        const dataMovimientos = ref([]);

        const { importarExcel, guardarExcelMovimientos } = useMovimientos();
       




        return {
            importarExcel,
            dataMovimientos,
            guardarExcelMovimientos

        }
    }
})

</script>