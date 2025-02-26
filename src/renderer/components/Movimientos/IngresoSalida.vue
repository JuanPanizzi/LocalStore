<template>
 <Form  class="px-3 pb-20">

<div>
  <h1 class="text-center text-3xl font-semibold mt-6  ">
    Informe de Movimiento de Material <!-- INGRESO O SALIDA -->
  </h1>
  <div>
    <div class="inputs-container flex flex-col items-end mb-4">
      <div class="input-group flex items-center mb-3">
        <label class="legend w-40 text-right mr-3 font-semibold">N° Informe:</label>
        <InputNumber v-model="numeroInforme"  class="w-64" />

      </div>
      <div :class="`input-group flex items-center `">
        <p class="legend w-40 text-right mr-3 font-semibold">Fecha:</p>
        <DatePicker v-model="fecha" class="w-64" aria-required="required"
          dateFormat="dd/mm/yy" :showIcon="true" />
      </div>
    </div>
  </div>

</div>
<!-- Grid de inputs alineados -->
<div class="grid grid-cols-2 gap-4 p-4 border border-gray rounded-lg ">
  <!-- Columna 1 -->
  <div class="col-span-1 space-y-4 flex flex-col    justify-between">
    <div class="flex  items-center justify-start">
      <label class="legend w-2/5  text-left font-semibold">Movimiento</label>
      <InputText v-model="tipo_movimiento"  class="w-3/5 "
        aria-required="required" />


    </div>
    <div class="input-group flex items-center justify-between">
      <label class="legend w-2/5 text-left font-semibold">Origen:</label>
      <InputText v-model="origen"  class="w-3/5"
        aria-required="required" />

    </div>



    <div class="flex items-center  justify-between">
      <label class="legend w-2/5 text-left font-semibold">Destino:</label>
      <InputText v-model="destino" readonly class="w-3/5" />
    </div>
  </div>

  <!-- Columna 2 -->
  <div class="col-span-1 space-y-4 flex flex-col bg-red">

    <div class="flex justify-between items-center ">
      <label class=" w-2/5  text-right font-semibold mr-3">Cantidad:</label>
      <InputNumber v-model="cantidad" />
    </div>

    <div class="input-group flex justify-between items-center">

      <p class=" w-2/5  text-right  mr-3 font-semibold">Permiso de Trabajo Asociado: </p>
      <InputText v-model="permiso_trabajo_asociado"  class="w-3/5 " />


    </div>
    <div class="input-group flex items-center">
      <p class="legend w-2/5 text-right mr-3 font-semibold">Informe Asociado:</p>
      <InputText v-model="informe_asociado" class="w-3/5" />
    </div>
  </div>
</div>
<div class="mt-8 flex items-center justify-end">
  <Button label="Reiniciar" icon="pi pi-refresh" class="mr-2" outlined severity="secondary"
    @click="reiniciarFormulario" />
  <Button label="Guardar" icon="pi pi-save" severity="success" class="" @click="guardarInforme"
    :disabled="!formCompleto" />
  
</div>
</Form>

</template>

<script>
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';
import { defineComponent } from 'vue';


export default defineComponent({
    name: 'IngresoSalida',
    components: {
        InputNumber,
        DatePicker,
        InputText
    },

    setup() {
        const numeroInforme = ref(null);
        const fecha = ref(null);
        const tipo_movimiento = ref(null);
        const origen = ref(null);
        const cantidad = ref(null);
        const permiso_trabajo_asociado = ref(null);

        return {
            numeroInforme,
            fecha,
            tipo_movimiento,
            origen,
            cantidad,
            permiso_trabajo_asociado,

        }
    }
})

</script>