<template>
<Dialog v-model:visible="dialogVisible" :modal="true" :header="`EDITAR MOVIMIENTO`" @hide="cerrarDialog">
        <div class="grid grid-cols-2 gap-4">
            <div class="flex  items-center justify-start">
                <label class="legend w-1/5 mr-4  text-left font-semibold">Origen:</label>
                <InputText v-model="formData.material_repuesto" class="w-4/5 " aria-required="required" />
            </div>
            <div class=" flex items-center justify-between">
                <label class="legend w-1/5 mr-4 text-left font-semibold">Destino:</label>
                <InputText v-model="formData.marca" class="w-4/5" aria-required="required" />
            </div>
            
            <div class="mt-8 col-span-2 flex items-center justify-end">
            <Button label="Cancelar" icon="pi " class="mr-2" severity="danger" @click="cerrarDialog" />
            <Button label="Guardar" icon="pi pi-save" severity="success" class="" @click="actualizarArticulo" />
            </div>



        </div>
    </Dialog>
</template>
<script>
import Dialog from 'primevue/dialog';
import { defineComponent } from 'vue';


defineComponent({
    name: 'DialogEditarMov',
    components: {
        Dialog
    }
})


</script>