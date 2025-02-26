<template>
    <Form class="px-3 py-5 border border-gray rounded-xl  max-w-[95vw] mx-auto">

        <div>
            <div class="inputs-container flex flex-col items-end mb-4">
                <div class="input-group flex items-center mb-3">
                    <label class="mr-2 w-40 text-right mr-3 font-semibold">N° Informe:</label>
                    <InputText v-model="numeroInforme" readonly class="w-64" />
                </div>
                <div :class="`input-group flex items-center `">
                    <p class="mr-2 w-40 text-right mr-3 font-semibold">Fecha:</p>
                    <DatePicker v-model="fecha" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
                        :showIcon="true" />
                </div>
            </div>
        </div>

        <!-- Grid de inputs alineados -->
        <div class="grid grid-cols-3 gap-4 p-4 rounded-lg ">
            <!-- Columna 1 -->
            <div class="flex  items-center justify-between">
                <label class="mr-2  w-2/5  text-left font-semibold">Movimiento</label>
                <InputText v-model="tipo_movimiento" class="w-3/5 " aria-required="required" />


            </div>
            <div class="input-group flex items-center justify-between">
                <label class="mr-2  w-2/5 text-left font-semibold">Origen:</label>
                <InputText v-model="origen" class="w-3/5" aria-required="required" />

            </div>

            <div class="flex items-center  justify-between">
                <label class="mr-2  w-2/5 text-left font-semibold">Destino:</label>
                <InputText v-model="destino" class="w-3/5" />
            </div>

            <!-- Columna 2 -->

            <div class="flex justify-between items-center ">
                <label class="mr-2  w-2/5  text-left font-semibold ">Cantidad:</label>
                <InputNumber v-model="cantidad" class="w-3/5" />
            </div>

            <div class="input-group flex justify-between items-center">

                <p class="mr-2  w-2/5  text-left   font-semibold">Permiso de Trabajo Asociado: </p>
                <InputText v-model="permiso_trabajo_asociado" class="w-3/5 " />


            </div>
            <div class="input-group flex items-center">
                <p class="mr-2  w-2/5 text-left  font-semibold">Informe Asociado:</p>
                <InputText v-model="informe_asociado" class="w-3/5" />
            </div>
            <div class="input-group flex items-center">
                <p class="mr-2  w-2/5 text-left  font-semibold">Orden de trabajo Asociada:</p>
                <InputText v-model="orden_trabajo_asociada" class="w-3/5" />
            </div>
            <div class="input-group flex items-center">
                <p class="mr-2  w-2/5 text-left  font-semibold">Remito:</p>
                <InputText v-model="remito" class="w-3/5" />
            </div>
            <div class="input-group flex items-center">
                <p class="mr-2  w-2/5 text-left  font-semibold">N° Almacenes:</p>
                <InputText v-model="numero_almacenes" class="w-3/5" />
            </div>
            <div class="input-group flex items-center">
                <p class="mr-2  w-2/5 text-left  font-semibold">Material / Repuesto:</p>
                <InputText v-model="material_repuesto" class="w-3/5" />
            </div>
            <div class="input-group flex items-center">
                <p class="mr-2  w-2/5 text-left  font-semibold">Marca:</p>
                <InputText v-model="marca" class="w-3/5" />
            </div>
            <div class="input-group flex items-center">
                <p class="mr-2  w-2/5 text-left  font-semibold">Modelo:</p>
                <InputText v-model="modelo" class="w-3/5" />
            </div>

        </div>
        <div class="mt-8 flex items-center justify-end">
            <Button label="Cancelar" icon="pi pi-refresh" class="mr-2" severity="danger" @click="" />
            <Button label="Guardar" icon="pi pi-save" severity="success" class="" @click="" />

        </div>
    </Form>

</template>

<script>
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import { ref, watch } from 'vue';
import { defineComponent } from 'vue';


export default defineComponent({
    name: 'IngresoSalida',
    components: {
        InputNumber,
        DatePicker,
        InputText,
        Button
    },

    setup(props) {
        const numero_movimiento = ref(null);
        const fecha = ref(null);
        const tipo_movimiento = ref(null);
        const origen = ref(null);
        const cantidad = ref(null);
        const permiso_trabajo_asociado = ref(null);
        const orden_trabajo_asociada = ref(null);
        const remito = ref(null);
        const numero_almacenes = ref(null);
        const material_repuesto = ref(null);
        const marca = ref(null);
        const modelo = ref(null);
        const numeroInforme = ref(props.numeroInformeMovimiento)

        watch(
            () => props.numeroInformeMovimiento,
            (nuevoValor) => {
                numeroInforme.value = nuevoValor
            }
        )

        return {
            numero_movimiento,
            fecha,
            tipo_movimiento,
            origen,
            cantidad,
            permiso_trabajo_asociado,
            orden_trabajo_asociada,
            remito,
            numero_almacenes,
            material_repuesto,
            marca,
            modelo,
            numeroInforme,

        }
    },
    props: {
        numeroInformeMovimiento: {
            type: [Number, String],
            default: 0
        }
    }
})

</script>