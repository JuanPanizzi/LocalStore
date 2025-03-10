<template>
    <section class="p-5 bg-[#0F172A]">
        <!-- <section class="p-5"> -->
        <!-- {{ dataMovimientosFiltrada }} -->

        <!-- <h1 class="font-bold text-xl text-[#0EA5E9] flex justify-end">Movimientos de Materiales</h1> -->

        <!-- Sección para mostrar los filtros activos -->
        <!-- <Button label="Limpiar filtros" @click="clearFilters" /> -->
        <!-- Filtros activos usando el componente Badge -->
        <!-- <Tag icon="pi pi-info-circle" severity="info" value="Filtros Aplicados"></Tag> -->

        <div v-if="activeFilters.length" class="mb-4">
            <Tag icon="pi pi-info-circle" severity="danger" value="Filtros Aplicados" class="mb-2 "></Tag>

            <div class="flex flex-wrap gap-2">
                <Tag v-for="(filter, index) in activeFilters" :key="index" :value="`${filter.field}: ${filter.value}`"
                    severity="secondary" class="p-2" icon="pi pi-filter" />
            </div>
            <Button label="Limpiar filtros" @click="clearFilters" class="mt-2" size="small" />
        </div>
        <DataTable v-model:filters="filters" @filter="handleFilter" filterDisplay="menu" :value="dataMovimientos"
            paginator :rows="5" tableStyle="min-width: 50rem" showGridlines style="max-width: 90vw"
            class="mx-auto mt-28"
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
                    { label: 'Fechas Posteriores a:', value: 'dateAfter' },
                    { label: 'Fechas Anteriores a:', value: 'dateBefore' }
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

        <div class="mt-10 flex justify-end mx-auto" style="max-width: 90vw">
            <Button label="PDF Historial de Movimientos" />
            <Button label="PDF Historial de Artículo" class="mx-2" severity="info" outlined
                @click="generarPdfArticulo(dataMovimientosFiltrada)" />
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
import Tag from 'primevue/tag';
import Badge from 'primevue/badge';

export default defineComponent({
    name: 'Movimientos',
    components: {
        Button,
        Column,
        DataTable,
        Toast,
        FileUpload,
        DatePicker,
        Tag,
        Badge
    },

    setup() {
        // const filters = ref({
        //   fecha: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        // });
        const filters = ref({
            material_repuesto: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            marca: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            modelo_serie: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
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
        const dataMovimientosFiltrada = ref(null);
        const articuloSeleccionado = ref(false);

        const activeFilters = computed(() => {
            const active = [];
            for (const field in filters.value) {
                const filterObj = filters.value[field];
                filterObj.constraints.forEach(constraint => {
                    if (constraint.value !== null && constraint.value !== undefined && constraint.value !== '') {
                        let label = '';
                        // Si el campo es "fecha", mostramos etiquetas personalizadas según el matchMode
                        if (field === 'fecha') {
                            if (constraint.matchMode === FilterMatchMode.DATE_AFTER) {
                                label = 'Fechas Posteriores a';
                            } else if (constraint.matchMode === FilterMatchMode.DATE_BEFORE) {
                                label = 'Fechas Anteriores a';
                            }
                            active.push({
                                field: label,
                                value: formatearFecha(constraint.value),
                                matchMode: constraint.matchMode
                            });
                        } else {
                            // Para los demás campos, usamos el mapeo definido
                            label = fieldLabels[field] || field;
                            active.push({
                                field: label,
                                value: constraint.value,
                                matchMode: constraint.matchMode
                            });
                        }
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
        const fieldLabels = {
            material_repuesto: "Material / Repuesto",
            marca: "Marca",
            modelo_serie: "Modelo / Serie",
            origen: "Origen",
            destino: "Destino"
        }
        const toast = useToast()
        const { importarExcel, guardarExcelMovimientos, obtenerMovimientos, generarListadoPDF } = useMovimientos();

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

        const generarPdfArticulo = (movimientos) => {

            // 1. Verificamos si marca está seteado
            const marcaValue = filters.value.marca.constraints[0].value;
            // 2. Verificamos si modelo_serie está seteado
            const modeloValue = filters.value.modelo_serie.constraints[0].value;

            const marcaExiste = marcaValue && marcaValue.trim().length > 0;
            const modeloExiste = modeloValue && modeloValue.trim().length > 0;

            if (!marcaExiste || !modeloExiste) {
                toast.add({ severity: 'error', summary: 'Marca y/o Modelo inexistente', detail: 'Debes elegir una marca y un modelo para seleccionar el artículo, intente nuevamente', life: 5000 });
                return;
            }

            // 3. Verificamos si hay resultados en la tabla filtrada
            const resultados = dataMovimientosFiltrada.value && dataMovimientosFiltrada.value.length > 0;
            if (!resultados) {
                toast.add({ severity: 'error', summary: 'Sin resultados', detail: 'No existen resultados para los filtros aplicados, intente nuevamente', life: 5000 });
                return;
            }

            
            generarListadoPDF(movimientos)
        }

        const handleFilter = (event) => {
            console.log('Datos filtrados:', event.filteredValue)
            dataMovimientosFiltrada.value = event.filteredValue
        }
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
            dataMovimientosFiltrada,
            guardarExcelMovimientos,
            obtenerMovimientos,
            filters,
            formatearFecha,
            stringToDate,
            activeFilters,
            clearFilters,
            handleFilter,
            generarListadoPDF,
            generarPdfArticulo


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