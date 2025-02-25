<template>

    <Dialog v-model:visible="dialogVisible" :modal="true" :header="`EDITAR ARTÍCULO`" @hide="cerrarDialog">

        <div class="grid grid-cols-2 gap-4">
            <div class="flex  items-center justify-start">
                <label class="legend w-1/5 mr-4  text-left font-semibold">Material / Repuesto:</label>
                <InputText v-model="formData.material" class="w-4/5 " aria-required="required" />
            </div>
            <div class=" flex items-center justify-between">
                <label class="legend w-1/5 mr-4 text-left font-semibold">Marca:</label>
                <InputText v-model="formData.marca" class="w-4/5" aria-required="required" />
            </div>

            <div class="flex items-center  justify-between ">
                <label class="legend w-1/5 mr-4 text-left font-semibold">Modelo:</label>
                <InputText v-model="formData.modelo" class="w-4/5" />
            </div>
            <div class=" flex justify-between items-center">
                <label class="legend w-1/5 mr-4 text-left font-semibold">Cantidad:</label>
                <InputNumber readonly v-model="formData.cantidad" class="w-4/5" />
            </div>
            <div class="flex flex-col col-span-2 items-center justify-center ">
                <div class="py-5">
                    <!-- <label class="legend w-1/5 text-right font-semibold mr-2">Imagen:</label> -->
                    <Button label="Adjuntar Imagen" icon="pi pi-file" @click="seleccionarImagen" />
                </div>
                <p>{{ formData.imagen || '' }}</p>
            </div>
            
            <div class="mt-8 col-span-2 flex items-center justify-end">
            <Button label="Cancelar" icon="pi " class="mr-2" severity="danger" @click="cerrarDialog" />
            <Button label="Guardar" icon="pi pi-save" severity="success" class="" @click="guardarArticulo" />
            </div>



        </div>
    </Dialog>

</template>
<script>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import { defineComponent, reactive, ref, watch } from 'vue';


export default defineComponent({
    name: 'DialogEditar',
    components: {
        Dialog,
        Button,
        InputNumber
    },


    setup(props) {

        const formData = reactive({ ...props.articuloSeleccionado })
        const dialogVisible = ref(true);

        const cerrarDialog = () => {
            dialogVisible.value = false;
        }

        const seleccionarImagen = async () => {

            try {
                const response = await window.electronAPI.seleccionarImagen();
                if (!response.canceled) {
                    formData.imagen = response.filePaths[0]
                }

            } catch (error) {
                console.log('error')
            }
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
            cerrarDialog,
            seleccionarImagen
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