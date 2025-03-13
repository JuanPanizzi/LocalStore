<template>
    <DataTable :value="dataMovimientos">
        <Column field="numero_movimiento" header="ID"></Column>

        <Column header="FECHA" filterField="fecha" dataType="date" style="min-width: 10rem" :showFilterOperator="false"
            :showFilterMatchModes="true" :showAddButton="true" :filterMatchModeOptions="[
                { label: 'Fechas Posteriores a:', value: 'dateAfter' },
                { label: 'Fechas Anteriores a:', value: 'dateBefore' }
            ]">
            <template #body="{ data }">
                <!-- {{ data.fecha }} -->
                <!-- {{ formatearFecha(data.fecha) }} -->
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
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'HistorialArticulo',
    components: {
        DataTable,
        Column
    },


    setup(){


        const dataMovimientos = ref([{
    "id": 16026,
    "fecha": "2025-03-13",
    "tipo_movimiento": "INGRESO",
    "origen": "1",
    "destino": "2212",
    "articulo_id": 12197,
    "cantidad": 2,
    "permiso_trabajo_asociado": "12",
    "informe_asociado": "21",
    "orden_trabajo_asociada": "21",
    "remito": "21",
    "material_repuesto": "Manguera Tela",
    "marca": "GPM",
    "modelo_serie": "2,5\"",
    "numero_movimiento": 1273,
    "numero_almacenes": null,
    "observaciones": null
},
{
    "id": 16025,
    "fecha": "2025-03-13",
    "tipo_movimiento": "INGRESO",
    "origen": "213",
    "destino": "2121",
    "articulo_id": 12197,
    "cantidad": 1,
    "permiso_trabajo_asociado": null,
    "informe_asociado": null,
    "orden_trabajo_asociada": null,
    "remito": null,
    "material_repuesto": "Manguera Tela",
    "marca": "GPM",
    "modelo_serie": "2,5\"",
    "numero_movimiento": 1272,
    "numero_almacenes": null,
    "observaciones": null
}])

    return {
        dataMovimientos
    }

    }
})

</script>