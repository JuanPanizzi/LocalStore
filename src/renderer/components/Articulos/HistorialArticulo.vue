<template>
    
    
        <DataTable :value="dataMovimientosArticulo" paginator :rows="5" tableStyle="min-width: 50rem" showGridlines
        style="max-width: 90vw">
        <Column field="numero_movimiento" header="ID"></Column>

        <Column header="FECHA" filterField="fecha" dataType="date" style="min-width: 10rem" :showFilterOperator="false"
            :showFilterMatchModes="true" :showAddButton="true" :filterMatchModeOptions="[
                { label: 'Fechas Posteriores a:', value: 'dateAfter' },
                { label: 'Fechas Anteriores a:', value: 'dateBefore' }
            ]">
            <template #body="{ data }">
                <!-- {{ data.fecha }} -->
                {{ formatearFecha(data.fecha) }}
            </template>
            <template #filter="{ filterModel }">
                <DatePicker v-model="filterModel.value" dateFormat="dd/mm/yy" placeholder="Seleccione fecha " />
            </template>
        </Column>
        
        <Column class="min-w-[12rem]" field="material_repuesto" header="MATERIAL / REPUESTO" :showFilterOperator="false"
            :showFilterMatchModes="false" :showAddButton="false">
            <template #body="{ data }">
                {{ data.material_repuesto }}
            </template>
            <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Buscar" />
            </template>
        </Column>
        <Column field="marca" header="MARCA" :showFilterOperator="false" :showFilterMatchModes="false"
            :showAddButton="false">
            <template #body="{ data }">
                {{ data.marca }}
            </template>
            <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Buscar" />
            </template>
        </Column>
        <Column field="modelo_serie" header="MODELO / SERIE" :showFilterOperator="false" :showFilterMatchModes="false"
            :showAddButton="false">
            <template #body="{ data }">
                {{ data.modelo_serie }}
            </template>
            <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Buscar" />
            </template>
        </Column>
        <Column field="tipo_movimiento" header="MOVIMIENTO"></Column>
        <Column field="origen" header="ORIGEN" :showFilterOperator="false" :showFilterMatchModes="false"
            :showAddButton="false">
            <template #body="{ data }">
                {{ data.origen }}
            </template>
            <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Buscar" />
            </template>
        </Column>
        <Column field="destino" header="DESTINO" :showFilterOperator="false" :showFilterMatchModes="false"
            :showAddButton="false">
            <template #body="{ data }">
                {{ data.destino }}
            </template>
            <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Buscar" />
            </template>
        </Column>
        <Column field="cantidad" header="CANTIDAD"></Column>
        <Column field="permiso_trabajo_asociado" header="PT ASOCIADO"></Column>
        <Column field="informe_asociado" header="INFORME ASOCIADO"></Column>
        <Column field="orden_trabajo_asociada" header="OT ASOCIADA"></Column>
        <Column field="remito" header="REMITO"></Column>
        <Column field="numero_almacenes" header="N° ALMACENES"></Column>
        <Column field="observaciones" header="OBSERVACIONES"></Column>


    </DataTable>

</template>
<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { defineComponent, ref , onMounted, inject} from 'vue';
import { stringToDate, formatearFecha } from '../../utils/funcionesFecha.js'
import { useMovimientos } from '../../composables/useMovimientos.js';

export default defineComponent({
    name: 'HistorialArticulo',
    components: {
        DataTable,
        Column
    },


    setup() {

        const { obtenerMovimientosArticulo} = useMovimientos();
        const dataMovimientosArticulo = ref(null);
        const dialogRef = inject('dialogRef');

        onMounted(async () => {
            console.log('dialogRef.value.data', dialogRef.value.data.articulo_id)
            const response = await obtenerMovimientosArticulo(dialogRef.value.data.articulo_id);
            console.log('repsonse.data en historial art', response.data)
            if (response.success) {

                dataMovimientosArticulo.value = response.data.map(mov => ({
                    ...mov,
                    fecha: stringToDate(mov.fecha)
                })
                )

            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el registro de movimientos, intente nuevamente', life: 3000 });
            }

        });

        return {
            dataMovimientosArticulo,
            stringToDate,
            formatearFecha,
            dialogRef
        }

    }
})

</script>