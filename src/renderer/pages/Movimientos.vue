<template>

    <DataTable>
        <Column field="id" header="ID"></Column>
    </DataTable>

    <!-- <Button label="Importar Excel" @click="importarExcel" /> -->
    <FileUpload mode="basic" name="file" chooseLabel="Importar Excel" accept=".xlsx,.xls" auto="true"
    @select="importarExcel" />
    <Toast />
</template>
<script>
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { defineComponent, ref } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useMovimientos} from '../composables/useMovimientos';
import FileUpload from 'primevue/fileupload';


export default defineComponent({
    name: 'Movimientos',
    components: {
        Button,
        Column,
        DataTable,
        Toast,
        FileUpload
    },

    setup() {

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