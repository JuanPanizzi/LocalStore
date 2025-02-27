<template>
    <Form class="px-3 py-5 border border-gray rounded-xl  max-w-[95vw] mx-auto">

        <div>
            <div class="inputs-container flex flex-col items-end mb-4">
                <div class="input-group flex items-center mb-3">
                    <label class="mr-2 w-40 text-right mr-3 font-semibold">N° Informe:</label>
                    <InputText v-model="formData.numero_movimiento" readonly class="w-64" />
                </div>
                <div :class="`input-group flex items-center `">
                    <p class="mr-2 w-40 text-right mr-3 font-semibold">Fecha:</p>
                    <DatePicker v-model="formData.fecha" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
                        :showIcon="true" />
                </div>
            </div>
        </div>

        <!-- Grid de inputs alineados -->
        <div class="grid grid-cols-3 gap-4 p-4 rounded-lg ">
           
            <div class="input-group flex items-center">
                <p class="mr-2  w-2/5 text-left  font-semibold">Material / Repuesto:</p>
                <InputText v-model="formData.material_repuesto" class="w-3/5" readonly />
            </div>
            <div class="input-group flex items-center">
                <p class="mr-2  w-2/5 text-left  font-semibold">Marca:</p>
                <InputText v-model="formData.marca" class="w-3/5" readonly />
            </div>
            <div class="input-group flex items-center">
                <p class="mr-2  w-2/5 text-left  font-semibold">Modelo:</p>
                <InputText v-model="formData.modelo_serie" class="w-3/5" readonly />
            </div>
            
            <div class="flex justify-between items-center ">
                <label class="mr-2  w-2/5  text-left font-semibold ">Cantidad:</label>
                <InputNumber v-model="formData.cantidad" class="w-3/5" readonly />
            </div>
            <div class="flex  items-center justify-between">
                <label class="mr-2  w-2/5  text-left font-semibold">Movimiento</label>
                <InputText v-model="formData.tipo_movimiento" readonly class="w-3/5 " aria-required="required" />
            </div>
            <div class="input-group flex items-center justify-between">
                <label class="mr-2  w-2/5 text-left font-semibold">Origen:</label>
                <InputText v-model="formData.origen" class="w-3/5" aria-required="required" />

            </div>

            <div class="flex items-center  justify-between">
                <label class="mr-2  w-2/5 text-left font-semibold">Destino:</label>
                <InputText v-model="formData.destino" class="w-3/5" />
            </div>

           


            <div class="input-group flex justify-between items-center">

                <p class="mr-2  w-2/5  text-left   font-semibold">Permiso de Trabajo Asociado: </p>
                <InputText v-model="formData.permiso_trabajo_asociado" class="w-3/5 " />


            </div>
            <div class="input-group flex items-center">
                <p class="mr-2  w-2/5 text-left  font-semibold">Informe Asociado:</p>
                <InputText v-model="formData.informe_asociado" class="w-3/5" />
            </div>
            <div class="input-group flex items-center">
                <p class="mr-2  w-2/5 text-left  font-semibold">Orden de trabajo Asociada:</p>
                <InputText v-model="formData.orden_trabajo_asociada" class="w-3/5" />
            </div>
            <div class="input-group flex items-center">
                <p class="mr-2  w-2/5 text-left  font-semibold">Remito:</p>
                <InputText v-model="formData.remito" class="w-3/5" />
            </div>
            <div class="input-group flex items-center">
                <p class="mr-2  w-2/5 text-left  font-semibold">N° Almacenes:</p>
                <InputText v-model="formData.numero_almacenes" class="w-3/5" />
            </div>
          

        </div>
        <div class="mt-8 flex items-center justify-end">
            <Button label="Cancelar" icon="pi pi-refresh" class="mr-2" severity="danger" @click="" />
            <Button label="Guardar" icon="pi pi-save" severity="success" class="" @click="guardarMovimiento" />

        </div>
    </Form>

</template>

<script>
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import { reactive, ref, watch } from 'vue';
import { defineComponent } from 'vue';
import { fechaActual } from '../../utils/funcionesFecha.js'


export default defineComponent({
    name: 'IngresoSalida',
    components: {
        InputNumber,
        DatePicker,
        InputText,
        Button
    },
    props: {
        numeroInformeMovimiento: {
            type: [Number, String],
            default: 0
        },
        movimientoSeleccionado: {
            type: Object
        },
        ingresoSalida: {
            type: String
        }
    },
    emits: ['guardarMovimiento'],
    setup(props, { emit }) {

         const movimiento = ref({ ...props.movimientoSeleccionado });

        const formData = reactive({
            id: props.movimientoSeleccionado.id,
            numero_movimiento: props.numeroInformeMovimiento,
            material_repuesto: props.movimientoSeleccionado.material_repuesto,
            marca: props.movimientoSeleccionado.marca,
            modelo_serie: props.movimientoSeleccionado.modelo_serie,
            cantidad: props.movimientoSeleccionado.cantidad,
            fecha: fechaActual(),
            tipo_movimiento: props.ingresoSalida,
            origen: null,
            destino: null,
            permiso_trabajo_asociado: null,
            informe_asociado: null,
            orden_trabajo_asociada: null,
            remito: null,
            numero_almacenes: null,
        });

        watch(() => props.numeroInformeMovimiento, (nuevoValor) => {
            formData.numero_movimiento = nuevoValor;
        });

        const guardarMovimiento = () => {
            emit('guardarMovimiento', { ...formData })
        }



        const resetForm = () => {
            formData.value = {
                numero_movimiento: props.numeroInformeMovimiento,
                fecha: null,
                tipo_movimiento: '',
                origen: '',
                destino: '',
                cantidad: null,
                permiso_trabajo_asociado: '',
                informe_asociado: '',
                orden_trabajo_asociada: '',
                remito: '',
                numero_almacenes: '',
                material_repuesto: '',
                marca: '',
                modelo_serie: ''
            };
        };
        return {
            formData,
            resetForm,
            guardarMovimiento,
            movimiento,
            fechaActual,
        }
    },

})

</script>