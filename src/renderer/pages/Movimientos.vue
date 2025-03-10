<template>
    <section class="p-5 bg-[#0F172A]">
        <!-- <section class="p-5"> -->



        <h1 class="font-bold text-xl text-[#0EA5E9]">Movimientos de Materiales</h1>

        <!-- Sección para mostrar filtros activos -->
        <div class="active-filters" v-if="activeFilters.length">
            <h3>Filtros aplicados:</h3>
            <ul>
                <li v-for="(filter, index) in activeFilters" :key="index">
                    <strong>{{ filter.field }}:</strong>
                    <!-- Aquí puedes formatear el valor del filtro según el matchMode o tipo -->
                    {{ filter.value }}
                </li>
            </ul>
            <!-- Botón para limpiar filtros, si lo requieres -->
            <Button label="Limpiar filtros" @click="clearFilters" />
        </div>

        <DataTable v-model:filters="filters" filterDisplay="menu" :value="dataMovimientos" paginator :rows="8"
            tableStyle="min-width: 50rem" showGridlines style="max-width: 90vw" class="mx-auto mt-20"
            :globalFilterFields="['material_repuesto', 'marca', 'modelo_serie', 'origen', 'destino']">
            <!-- <Column field="numero_movimiento" header="ID"></Column> -->
            <!-- <Column field="fecha" header="FECHA"></Column> -->
            <Column header="">
                <template #body="slotProps">
                    <div class="flex justify-center">
                        <Button outlined icon="pi pi-pencil" @click="" />
                        <!-- <Button outlined class="ml-2" icon="pi pi-trash" severity="danger"@click="confirmarEliminacion(slotProps.data)" /> -->
                    </div>
                </template>
            </Column>

            <Column header="FECHA" filterField="fecha" dataType="date" style="min-width: 10rem"
                :showFilterOperator="false" :showFilterMatchModes="true" :showAddButton="true" :filterMatchModeOptions="[
                    { label: 'Fecha Inicio', value: 'dateAfter' },
                    { label: 'Fecha Fin', value: 'dateBefore' }
                ]">
                <template #body="{ data }">
                    <!-- {{ data.fecha }} -->
                    {{ formatearFecha(data.fecha) }}
                </template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" />
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
            <Column field="modelo_serie" header="MODELO" :showFilterOperator="false" :showFilterMatchModes="false"
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

        <div class="mt-10 flex justify-end mx-auto" style="max-width: 90vw">
            <FileUpload mode="basic" name="file" chooseLabel="Importar Excel" accept=".xlsx,.xls" auto="true"
                @select="seleccionarExcel" />
        </div>
        <Toast />
    </section>
    <DialogEditarMov />
</template>
<script>
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { computed, defineComponent, onMounted, ref } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useMovimientos } from '../composables/useMovimientos';
import FileUpload from 'primevue/fileupload';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import DatePicker from 'primevue/datepicker';
import { stringToDate, formatearFecha } from '../utils/funcionesFecha.js'

export default defineComponent({
    name: 'Movimientos',
    components: {
        Button,
        Column,
        DataTable,
        Toast,
        FileUpload,
        DatePicker
    },

    setup() {
        // const filters = ref({
        //   fecha: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        // });
        const filters = ref({
            material_repuesto: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            marca: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            modelo_serie: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            origen: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            destino: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },

            fecha: {
                operator: FilterOperator.AND,
                constraints: [
                    // Primera regla: "Date is after"
                    { value: null, matchMode: FilterMatchMode.DATE_AFTER },
                    // Segunda regla: "Date is before"
                    { value: null, matchMode: FilterMatchMode.DATE_BEFORE }
                ]
            }
        });
        const dataMovimientos = ref(null);
        
        const activeFilters = computed(() => {
  const active = [];
  for (const field in filters.value) {
    const filterObj = filters.value[field];
    // Recorremos las constraints de cada filtro
    filterObj.constraints.forEach(constraint => {
      if (constraint.value !== null && constraint.value !== undefined && constraint.value !== '') {
        active.push({
          field,
          value: constraint.value,
          matchMode: constraint.matchMode
        });
      }
    });
  }
  return active;
});

// Función para limpiar todos los filtros
function clearFilters() {
  for (const field in filters.value) {
    filters.value[field].constraints.forEach(constraint => {
      constraint.value = null;
    });
  }
}
        
        const toast = useToast()
        const { importarExcel, guardarExcelMovimientos, obtenerMovimientos } = useMovimientos();

        const seleccionarExcel = async (event) => {
            const response = await importarExcel(event);

            if (response.success) {
                dataMovimientos.value = response.data;
                toast.add({ severity: "success", summary: "Éxito", detail: "Datos cargados correctamente.", life: 3000 });
            } else {

                switch (response.message) {

                    case 'Faltan columnas':
                        toast.add({ severity: "error", summary: `Error`, detail: "Faltan columnas en el archivo excel, intente nuevamente.", life: 5000 });
                        break;
                    case 'Fechas inválidas':
                        toast.add({ severity: "error", summary: `Error`, detail: "Se encontraron fechas inválidas en el archivo excel, intente nuevamente.", life: 5000 });

                        break;
                }
            }
        };


        onMounted(async () => {

            const response = await obtenerMovimientos();

            if (response.success) {
                // dataMovimientos.value = response.data;
                dataMovimientos.value = response.data.map(mov =>
                // console.log('mov', mov)

                (

                    {
                        ...mov,
                        fecha: stringToDate(mov.fecha)
                    })

                )


            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el registro de movimientos, intente nuevamente', life: 3000 });
            }

        });

        return {
            seleccionarExcel,
            importarExcel,
            dataMovimientos,
            guardarExcelMovimientos,
            obtenerMovimientos,
            filters,
            formatearFecha,
            stringToDate,
            activeFilters,
            clearFilters


        }
    }
})

</script>
<style>
.p-datatable-filter-remove-rule-button {
    display: none !important;
}

.p-datatable-column-filter-button {
    color: #ffffff !important;
    background-color: #0EA5E9 !important;

}

/* .p-button-text.p-button-secondary {
} */
/* .p-button-text.p-button-secondary:hover{
    scale: 105%;
    transition: all ease 0.1s;
} */
</style>