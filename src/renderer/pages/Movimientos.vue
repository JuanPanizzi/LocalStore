<template>
<section class="p-5">

    <DataTable  :value="dataMovimientos" paginator :rows="5" tableStyle="min-width: 50rem"
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
    
    <div class="mt-10 flex justify-end mx-auto" style="max-width: 90vw">
        <FileUpload mode="basic" name="file" chooseLabel="Importar Excel" accept=".xlsx,.xls" auto="true"
        @select="seleccionarExcel" />
    </div>
    <Toast />
</section>
</template>
<script>
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { defineComponent, onMounted, ref } from 'vue';
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

        const dataMovimientos = ref(null);
        const toast = useToast()
        const { importarExcel, guardarExcelMovimientos, obtenerMovimientos } = useMovimientos();
       
        const seleccionarExcel = async (event) => {
        const response = await importarExcel(event);
        
        if(response.success){
            dataMovimientos.value = response.data;
            toast.add({ severity: "success", summary: "Éxito", detail: "Datos cargados correctamente.", life: 3000 });
        }else {
        
            switch(response.message){

                case 'Faltan columnas':
                    toast.add({ severity: "error", summary: `Error`, detail: "Faltan columnas en el archivo excel, intente nuevamente.", life: 5000 });
                break;
                case 'Fechas inválidas':
                toast.add({ severity: "error", summary: `Error`, detail: "Se encontraron fechas inválidas en el archivo excel, intente nuevamente.", life: 5000 });

                break;
            }
        }
    };


        onMounted(async ()=>{

            const response = await obtenerMovimientos();

            if(response.success){
                dataMovimientos.value = response.data;
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el registro de movimientos, intente nuevamente', life: 3000 });
            }

        });

        return {
            seleccionarExcel,
            importarExcel,
            dataMovimientos,
            guardarExcelMovimientos,
            obtenerMovimientos,

            
        }
    }
})

</script>