<template>

    <Dialog v-model:visible="dialogVisible" :modal="true" :header="`EDITAR ARTÍCULO`" @hide="cerrarDialog">


        <div class="grid grid-cols-4 gap-6">
            <div class="flex  items-center justify-start">
                <label class="legend w-1/5  text-left font-semibold">Material / Repuesto:</label>
                <InputText v-model="formData.material" class="w-4/5 " aria-required="required" />
            </div>
            <div class=" flex items-center justify-between">
                <label class="legend w-1/5 text-left font-semibold">Marca:</label>
                <InputText v-model="formData.marca" class="w-4/5" aria-required="required" />
            </div>

            <div class="flex items-center  justify-between ">
                <label class="legend w-1/5 text-left font-semibold">Modelo:</label>
                <InputText v-model="formData.modelo" class="w-4/5" />
            </div>
            <div class=" flex justify-between items-center">
                <label class="legend w-1/5 text-left font-semibold">Cantidad:</label>
                <InputNumber v-model="formData.cantidad" class="w-4/5" />
            </div>
            <div class="flex flex-col items-center justify-center ">
                <div class="py-5">
                    <!-- <label class="legend w-1/5 text-right font-semibold mr-2">Imagen:</label> -->
                    <Button label="Adjuntar Imagen" icon="pi pi-file" @click="seleccionarImagen" />
                </div>
                <p>{{ formData.imagen }}</p>
            </div>

        </div>
    </Dialog>

</template>
<script>
import Dialog from 'primevue/dialog';
import { defineComponent, reactive, ref, watch } from 'vue';


export default defineComponent({
    name: 'DialogEditar',
    components: {
        Dialog
    },


    setup(props) {

        const formData = reactive({ ...props.articuloSeleccionado })
        const dialogVisible = ref(true);

        const cerrarDialog = () => {
            dialogVisible.value = false;
        }
        watch(
      () => props.articuloSeleccionado,
      (newVal) => {
        Object.assign(formData, newVal);
        dialogVisible.value = true;
      }
    );
        return {
            formData,
            dialogVisible,
            cerrarDialog
        }
    },
    props: {
        articuloSeleccionado: {
            type: Object,
            required: true,
            // Valor por defecto en caso de que no se reciba la prop
            default: () => ({
                id: null,
                marca: '',
                modelo: '',
                material: '',
                cantidad: 0,
                imagen: ''
            })

        }
    }
})
</script>