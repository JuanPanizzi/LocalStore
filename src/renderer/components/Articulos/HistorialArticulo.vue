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
                        <!-- <Button icon="pi pi-pencil" outlined severity="info" @click="abrirEdicionMovimiento(slotProps.data)" /> -->
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
            <Column field="unidad_medida" header="UNIDAD"></Column>
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
    <Drawer v-model:visible="visibleRight" :header="`Editar Movimiento N° ${movimientoSeleccionado?.numero_movimiento}`"
        position="right" class="!w-[30vw]">
        <div class="p-4 space-y-4">
            <!-- Fecha -->
            <div>
                <label class="block text-sm font-medium">Fecha</label>
                <DatePicker v-model="movimientoSeleccionado.fecha" dateFormat="dd/mm/yy" placeholder="Seleccione fecha"
                    class="w-full" />
            </div>
            <!-- Material / Repuesto -->
            <div>
                <label class="block text-sm font-medium">Material / Repuesto</label>
                <InputText v-model="movimientoSeleccionado.material_repuesto" readonly class="w-full" />
            </div>
            <!-- Marca -->
            <div>
                <label class="block text-sm font-medium">Marca</label>
                <InputText v-model="movimientoSeleccionado.marca" class="w-full" readonly />
            </div>
            <!-- Modelo / Serie -->
            <div>
                <label class="block text-sm font-medium">Modelo / Serie</label>
                <InputText v-model="movimientoSeleccionado.modelo_serie" class="w-full" readonly />
            </div>
            <!-- Tipo Movimiento -->
            <div>
                <label class="block text-sm font-medium">Tipo Movimiento</label>
                <Select :options="tipoMoviminento" optionLabel="nombre" optionValue="nombre"
                    v-model="movimientoSeleccionado.tipo_movimiento" class="w-full" />
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
            </div <!-- Cantidad -->
            <div>
                <label class="block text-sm font-medium">Cantidad</label>
                <InputNumber v-model="movimientoSeleccionado.cantidad" class="w-full" readonly />
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
                <Textarea v-model="movimientoSeleccionado.observaciones" class="w-full" rows="3" />
            </div>
            <!-- Botones de acción -->
            <div class="flex justify-end space-x-2">
                <Button label="Cancelar" severity="secondary" outlined @click="cancelarEdicion" />
                <Button label="Guardar" severity="success" @click="editarMovimiento(movimientoSeleccionado)" />
            </div>
        </div>
    </Drawer>
    <Toast />
</template>
<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { defineComponent, ref, onMounted, inject } from 'vue';
import { stringToDate, formatearFecha, formatFechaToYYYYMMDD } from '../../utils/funcionesFecha.js'
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
import Select from 'primevue/select';


export default defineComponent({
    name: 'HistorialArticulo',
    components: {
        Select,
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


    setup(props, { emit }) {

        const { obtenerMovimientosArticulo, generarListadoPDF, exportarExcel, eliminarMovimiento, actualizarMovimiento } = useMovimientos();
        const dataMovimientosArticulo = ref(null);
        const confirm = useConfirm();
        const toast = useToast();
        const dialogRef = inject('dialogRef');
        const visibleRight = ref(false);
        const movimientoSeleccionado = ref(null);
        const tipoMoviminento = [{ nombre: "SALIDA" }, { nombre: "INGRESO" }]
        // const tipoMoviminento = ["SALIDA", "INGRESO"];

        const abrirEdicionMovimiento = (movimiento) => {
            // Normalizamos el valor recibido a mayúsculas y lo mapeamos a los valores esperados
            const valorNormalizado = movimiento.tipo_movimiento.toUpperCase() === 'SALIDA'
                ? 'SALIDA'
                : 'INGRESO'; // Cualquier valor distinto a 'SALIDA' lo tratamos como 'ENTRADA'

            movimientoSeleccionado.value = {
                ...movimiento,
                tipo_movimiento: valorNormalizado
            };

            // movimientoSeleccionado.value = {...movimiento};
            visibleRight.value = true;
        }

        const editarMovimiento = async () => {

            // console.log('movimientoSeleccionado.value', movimientoSeleccionado.value)
            const movimientoEditado = {
                ...movimientoSeleccionado.value,
                fecha: movimientoSeleccionado.value.fecha ? formatFechaToYYYYMMDD(movimientoSeleccionado.value.fecha) : ''
            }
            // console.log('movimientoEditado que se manda: historialArticulo-258', movimientoEditado)
            const response = await actualizarMovimiento(movimientoEditado);
            // console.log('response en editar movimiento', response)
            if (response.success) {
                const movimientoActualizado = response.data;
                const indexMovimiento = dataMovimientosArticulo.value.findIndex(mov => mov.id == movimientoActualizado.id)

                if (indexMovimiento !== -1) {

                    dataMovimientosArticulo.value.splice(indexMovimiento, 1, movimientoActualizado);
                    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Movimiento actualizado correctamente', life: 4000 });
                    visibleRight.value = false;
                } else {
                    throw new Error()
                }
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el movimiento, intente nuevamente', life: 3000 });
                visibleRight.value = false;

            }
        }

        const confirmarEliminacionMov = (movimiento) => {

            const { id, tipo_movimiento, cantidad } = movimiento;

            confirm.require({
                message:
                    tipo_movimiento === 'SALIDA'
                        ? (cantidad > 1
                            ? `¿Estás Seguro? Se reestablecerán ${cantidad} artículos en el stock`
                            : `¿Estás Seguro? Se reestablecerá ${cantidad} artículo en el stock`)
                        : ((tipo_movimiento === 'INGRESO' || tipo_movimiento === 'ENTRADA')
                            ? (cantidad > 1
                                ? `¿Estás Seguro? Se eliminarán ${cantidad} artículos del stock`
                                : `¿Estás Seguro? Se eliminará ${cantidad} artículo del stock`)
                            : ''),
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

                    const response = await eliminarMovimiento(movimiento);

                    if (response.success) {
                        const indexMovimiento = dataMovimientosArticulo.value.findIndex(mov => mov.id == id);

                        if (indexMovimiento !== -1) {

                            dataMovimientosArticulo.value.splice(indexMovimiento, 1);

                            emit('save', { movimiento_articulo_eliminado: movimiento });

                            const mensaje = tipo_movimiento === 'SALIDA'
                                    ? (cantidad > 1
                                        ? `Se han restablecido ${cantidad} artículos en el stock`
                                        : `Se ha restablecido ${cantidad} artículo en el stock`)
                                    : ((tipo_movimiento === 'INGRESO' || tipo_movimiento === 'ENTRADA')
                                        ? (cantidad > 1
                                            ? `Se han eliminado ${cantidad} artículos del stock`
                                            : `Se ha eliminado ${cantidad} artículo del stock`)
                                        : '')

                                    toast.add({ severity: 'success', summary: 'Movimiento eliminado correctamente', detail: `${mensaje}`, life: 5000 });
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
            exportarExcel,
            confirmarEliminacionMov,
            visibleRight,
            movimientoSeleccionado,
            abrirEdicionMovimiento,
            actualizarMovimiento,
            editarMovimiento,
            tipoMoviminento,
            formatFechaToYYYYMMDD,
            emit

        }

    }
})

</script>