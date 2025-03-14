<template>
    <div>

        <Toolbar>
            <template #start>
                <Button outlined label="Exportar Excel" icon="pi pi-file-excel" class="p-button-success" @click="exportarExcel(dataMovimientosArticulo, 'historial articulo')" />
                <Button outlined label="Generar PDF" icon="pi pi-file-pdf" class="p-button-danger"
                    style="margin-left: .5em;" @click="generarListadoPDF(dataMovimientosArticulo)" />
            </template>
        </Toolbar>

        <DataTable :value="dataMovimientosArticulo" paginator :rows="5" tableStyle="min-width: 50rem" showGridlines
            style="max-width: 90vw">
            <Column>
            <template #body="slotProps">
                <Button icon="pi pi-trash" @click="eliminarMovimientoArticulo(slotProps.data.id)"/>
                <Button icon="pi pi-pencil"/>
            </template>
            </Column>
            <Column field="numero_movimiento" header="ID"></Column>

            <Column header="FECHA" filterField="fecha" dataType="date" style="min-width: 10rem"
                :showFilterOperator="false" :showFilterMatchModes="true" :showAddButton="true" :filterMatchModeOptions="[
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

            <Column class="min-w-[12rem]" field="material_repuesto" header="MATERIAL / REPUESTO"
                :showFilterOperator="false" :showFilterMatchModes="false" :showAddButton="false">
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
            <Column field="modelo_serie" header="MODELO / SERIE" :showFilterOperator="false"
                :showFilterMatchModes="false" :showAddButton="false">
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

    </div>
    <Toast />
</template>
<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { defineComponent, ref, onMounted, inject } from 'vue';
import { stringToDate, formatearFecha } from '../../utils/funcionesFecha.js'
import { useMovimientos } from '../../composables/useMovimientos.js';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

export default defineComponent({
    name: 'HistorialArticulo',
    components: {
        DataTable,
        Column,
        Toolbar,
        Button,
        Toast
    },


    setup() {

        const { obtenerMovimientosArticulo, generarListadoPDF, exportarExcel, eliminarMovimiento } = useMovimientos();
        const dataMovimientosArticulo = ref(null);
        const toast = useToast();
        const dialogRef = inject('dialogRef');

        const eliminarMovimientoArticulo = async (idMovimiento) => { 
            const response = await eliminarMovimiento(idMovimiento);
            if(response.success){
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Movimiento eliminado correctamente', life: 4000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el movimiento, intente nuevamente', life: 3000 });
            }

         }


        onMounted(async () => {
            const response = await obtenerMovimientosArticulo(dialogRef.value.data.articulo_id);
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
            dialogRef,
            generarListadoPDF,
            generarListadoPDF,
            exportarExcel,
            eliminarMovimientoArticulo
        }

    }
})

</script>