<template>
    <div>

        <Toolbar>
            <template #start>
                <Button outlined label="Exportar Excel" icon="pi pi-file-excel" class="p-button-success"
                    @click="exportarExcel(dataMovimientosArticulo, 'historial articulo')" />
                <Button outlined label="Generar PDF" icon="pi pi-file-pdf" class="p-button-danger"
                    style="margin-left: .5em;" @click="generarListadoPDF(dataMovimientosArticulo)" />
            </template>
        </Toolbar>

        <DataTable :value="dataMovimientosArticulo" paginator :rows="5" tableStyle="min-width: 50rem" showGridlines
            style="max-width: 90vw">
            <Column>
                <template #body="slotProps">
                    <div class="flex">

                        <Button class="mr-2" icon="pi pi-trash" outlined severity="danger"
                            @click="confirmarEliminacionMov(slotProps.data)" />
                        <Button icon="pi pi-pencil" outlined severity="info" @click="abrirEdicionMovimiento(slotProps.data)" />
                    </div>
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
    <!-- <ConfirmPopup></ConfirmPopup> -->
     <!-- Drawer para edición -->
     <Drawer
      v-model:visible="visibleRight"
      :header="`Editar Movimiento N° ${movimientoSeleccionado?.numero_movimiento}`"
      position="right"
      class="!w-[30vw]"
    >
      <div class="p-4 space-y-4">
        <!-- Fecha -->
        <div>
          <label class="block text-sm font-medium">Fecha</label>
          <DatePicker
            v-model="movimientoSeleccionado.fecha"
            dateFormat="dd/mm/yy"
            placeholder="Seleccione fecha"
            class="w-full"
          />
        </div>
        <!-- Material / Repuesto -->
        <div>
          <label class="block text-sm font-medium">Material / Repuesto</label>
          <InputText v-model="movimientoSeleccionado.material_repuesto" class="w-full" />
        </div>
        <!-- Marca -->
        <div>
          <label class="block text-sm font-medium">Marca</label>
          <InputText v-model="movimientoSeleccionado.marca" class="w-full" />
        </div>
        <!-- Modelo / Serie -->
        <div>
          <label class="block text-sm font-medium">Modelo / Serie</label>
          <InputText v-model="movimientoSeleccionado.modelo_serie" class="w-full" />
        </div>
        <!-- Tipo Movimiento -->
        <div>
          <label class="block text-sm font-medium">Tipo Movimiento</label>
          <InputText v-model="movimientoSeleccionado.tipo_movimiento" class="w-full" />
        </div>
        <!-- Origen -->
        <div>
          <label class="block text-sm font-medium">Origen</label>
          <InputText v-model="movimientoSeleccionado.origen" class="w-full" />
        </div>
        <!-- Destino -->
        <div>
          <label class="block text-sm font-medium">Destino</label>
          <InputText v-model="movimientoSeleccionado.destino" class="w-full" />
        </div>
        <!-- Cantidad -->
        <div>
          <label class="block text-sm font-medium">Cantidad</label>
          <InputNumber v-model="movimientoSeleccionado.cantidad" class="w-full" />
        </div>
        <!-- Permiso Trabajo Asociado -->
        <div>
          <label class="block text-sm font-medium">Permiso Trabajo Asociado</label>
          <InputText v-model="movimientoSeleccionado.permiso_trabajo_asociado" class="w-full" />
        </div>
        <!-- Informe Asociado -->
        <div>
          <label class="block text-sm font-medium">Informe Asociado</label>
          <InputText v-model="movimientoSeleccionado.informe_asociado" class="w-full" />
        </div>
        <!-- Orden Trabajo Asociada -->
        <div>
          <label class="block text-sm font-medium">Orden Trabajo Asociada</label>
          <InputText v-model="movimientoSeleccionado.orden_trabajo_asociada" class="w-full" />
        </div>
        <!-- Remito -->
        <div>
          <label class="block text-sm font-medium">Remito</label>
          <InputText v-model="movimientoSeleccionado.remito" class="w-full" />
        </div>
        <!-- Número Almacenes -->
        <div>
          <label class="block text-sm font-medium">N° Almacenes</label>
          <InputNumber v-model="movimientoSeleccionado.numero_almacenes" class="w-full" />
        </div>
        <!-- Observaciones -->
        <div>
          <label class="block text-sm font-medium">Observaciones</label>
          <Textarea
            v-model="movimientoSeleccionado.observaciones"
            class="w-full"
            rows="3"
          />
        </div>
        <!-- Botones de acción -->
        <div class="flex justify-end space-x-2">
          <Button label="Cancelar" severity="secondary" outlined @click="cancelarEdicion" />
          <Button label="Guardar" severity="success" @click="actualizarMovimiento" />
        </div>
      </div>
    </Drawer>
    <Toast />
</template>
<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { defineComponent, ref, onMounted, inject } from 'vue';
import { stringToDate, formatearFecha } from '../../utils/funcionesFecha.js'
import { useMovimientos } from '../../composables/useMovimientos.js';
import { useConfirm } from 'primevue/useconfirm';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import ConfirmPopup from 'primevue/confirmpopup';
import Drawer from 'primevue/drawer';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Textarea from 'primevue/textarea';


export default defineComponent({
    name: 'HistorialArticulo',
    components: {
        DataTable,
        Column,
        Toolbar,
        Button,
        Toast,
        ConfirmPopup,
        Drawer,
        InputNumber,
        DatePicker,
        Textarea

    },


    setup() {

        const { obtenerMovimientosArticulo, generarListadoPDF, exportarExcel, eliminarMovimiento } = useMovimientos();
        const dataMovimientosArticulo = ref(null);
        const confirm = useConfirm();
        const toast = useToast();
        const dialogRef = inject('dialogRef');
        const visibleRight = ref(false);
        const movimientoSeleccionado = ref(null);

        const abrirEdicionMovimiento = (movimiento) => {
            console.log('movimiento', movimiento)
            movimientoSeleccionado.value = movimiento;
            visibleRight.value = true;
        }

        const actualizarMovimiento = async () => { 

            

         }

        const confirmarEliminacionMov = (movimiento) => {

            const { id } = movimiento;

            confirm.require({
                message: `¿Estás seguro de eliminar este movimiento?`,
                header: 'Atención',
                icon: 'pi pi-info-circle',
                rejectLabel: 'Cancelar',
                rejectProps: {
                    label: 'Cancelar',
                    severity: 'secondary',
                    outlined: true
                },
                acceptProps: {
                    label: 'Eliminar',
                    severity: 'danger'
                },
                accept: async () => {

                    const response = await eliminarMovimiento(id);

                    if (response.success) {
                        const indexMovimiento = dataMovimientosArticulo.value.findIndex(mov => mov.id == id);

                        if (indexMovimiento !== -1) {
                            dataMovimientosArticulo.value.splice(indexMovimiento, 1);
                            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Movimiento eliminado correctamente', life: 4000 });
                        } else {
                            toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Movimiento no encontrado', life: 3000 });
                        }
                    } else {
                        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el movimiento, intente nuevamente', life: 3000 });
                    }

                },
                // reject: () => {
                // }
            });

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
            confirmarEliminacionMov,
            visibleRight,
            movimientoSeleccionado,
            abrirEdicionMovimiento
            
        }

    }
})

</script>