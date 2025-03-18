<template>
    <Form class="px-3 py-5 border border-gray rounded-xl  max-w-[95vw] mx-auto">

        <div>


            <div class="flex justify-between items-center   mb-4 mt-2">

                <div class=" flex items-center mb-3">
                    <label class="w-40 text-right mr-3 font-semibold">STOCK ARTÍCULO:</label>
                    <InputText v-model="formData.cantidad" readonly class="w-64" />
                </div>

                <div class="flex flex-col pr-4 ">
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
                <p class="mr-2  w-2/5 text-left  font-semibold">Modelo / Serie:</p>
                <InputText v-model="formData.modelo_serie" class="w-3/5" readonly />
            </div>

            <div class="flex justify-between items-center ">
                <label class="mr-2  w-2/5  text-left font-semibold ">Cantidad:</label>
                <InputNumber v-model="formData.cantidad_seleccionada" class="w-3/5" />
            </div>
            <div class="flex  items-center justify-between">
                <label class="mr-2  w-2/5  text-left font-semibold">Tipo Movimiento:</label>
                <InputText v-model="formData.tipo_movimiento" readonly class="w-3/5 " aria-required="required" />
            </div>
            <div class="input-group flex items-center justify-between">
                <label class="mr-2  w-2/5 text-left font-semibold">Origen:</label>
                <InputText v-model="formData.origen" :invalid="camposIncompletos.origen && !formData.origen"
                    class="w-3/5" aria-required="required" required />

            </div>

            <div class="flex items-center  justify-between">
                <label class="mr-2  w-2/5 text-left font-semibold">Destino:</label>
                <InputText v-model="formData.destino" class="w-3/5"
                    :invalid="camposIncompletos.destino && !formData.destino" />
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
                <p class="mr-2  w-2/5 text-left  font-semibold">Remito de Ingreso:</p>
                <InputText v-model="formData.remito" class="w-3/5" />
            </div>
            <div class="input-group flex items-center">
                <p class="mr-2  w-2/5 text-left  font-semibold">N° Pieza de Almacén:</p>
                <InputText v-model="formData.numero_almacenes" class="w-3/5" />
            </div>
            <div class="input-group flex items-center">
                <p class="mr-2  w-2/5 text-left  font-semibold">Observaciones:</p>
                <InputText v-model="formData.observaciones" class="w-3/5" />
            </div>



        </div>
        <div class="mt-8 flex items-center justify-end">
            <!-- <div class="flex items-center justify-start  mr-auto">
                <Button label="Reiniciar" icon="pi pi-refresh" class="mr-auto" severity="secondary"
                @click="reiniciarFormulario" />
            </div>  -->
            <div class="flex items-center">

                <Button label="Generar PDF " icon="pi pi-file-pdf" class="" severity="info"
                    :disabled="!camposRequeridos" @click="nuevoPdf" />
                <Button label="Regresar" icon="pi pi-refresh" class="mx-2" severity="danger"
                    @click="cancelarIngresoSalida" />
                <Button label="Guardar" icon="pi pi-save" severity="success" class="" @click="guardarMovimiento" />
            </div>

        </div>
    </Form>
    <Toast />
</template>

<script>
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import { computed, reactive, ref, watch } from 'vue';
import { defineComponent } from 'vue';
import { fechaActual } from '../../utils/funcionesFecha.js'
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';


export default defineComponent({
    name: 'IngresoSalida',
    components: {
        InputNumber,
        DatePicker,
        InputText,
        Button,
        Toast
    },
    props: {
        numeroInformeMovimiento: {
            type: [Number, String],
            default: 0
        },
        articuloSeleccionado: {
            type: Object
        },
        ingresoSalida: {
            type: String
        }
    },
    emits: ['guardarMovimiento', 'cancelarIngresoSalida'],
    setup(props, { emit }) {


        const movimiento = ref({ ...props.articuloSeleccionado });
        const toast = useToast();
        const camposIncompletos = ref({
            origen: null,
            destino: null
        })

        const formData = reactive({
            id: props.articuloSeleccionado.id,
            numero_movimiento: props.numeroInformeMovimiento,
            material_repuesto: props.articuloSeleccionado.material_repuesto,
            marca: props.articuloSeleccionado.marca,
            modelo_serie: props.articuloSeleccionado.modelo_serie,
            cantidad: props.articuloSeleccionado.cantidad,
            cantidad_seleccionada: 0,
            fecha: fechaActual(),
            tipo_movimiento: props.ingresoSalida,
            origen: null,
            destino: null,
            permiso_trabajo_asociado: null,
            informe_asociado: null,
            orden_trabajo_asociada: null,
            remito: null,
            numero_almacenes: null,
            observaciones: null
        });

        const camposRequeridos = computed(() => {
            return (
                formData.numero_movimiento &&
                formData.fecha &&
                formData.material_repuesto &&
                formData.marca &&
                formData.modelo_serie &&
                formData.cantidad &&
                formData.tipo_movimiento &&
                formData.origen &&
                formData.destino
            )
        })

        watch(() => props.numeroInformeMovimiento, (nuevoValor) => {
            formData.numero_movimiento = nuevoValor;
        });

        const reiniciarFormulario = () => {
            emit('reiniciarFormulario')
        }

        const nuevoPdf = () => {
            emit('nuevoPdf', { ...formData })
        }

        const guardarMovimiento = () => {

            if (!formData.origen) {
                camposIncompletos.value.origen = true;
                toast.add({ severity: "error", summary: `Campos incompletos`, detail: "Por favor complete el campo de origen.", life: 5000 });
                return;
            }
            if (!formData.destino) {
                camposIncompletos.value.destino = true;
                toast.add({ severity: "error", summary: `Campos incompletos`, detail: "Por favor complete el campo de destino.", life: 5000 });
                return;
            }

            emit('guardarMovimiento', { ...formData })
        }

        const cancelarIngresoSalida = () => {

            emit('cancelarIngresoSalida')
        }


        const resetForm = () => {
            formData.value = {
                id: null,
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
            cancelarIngresoSalida,
            camposIncompletos,
            camposRequeridos,
            nuevoPdf,
            reiniciarFormulario
        }
    },

})

</script>