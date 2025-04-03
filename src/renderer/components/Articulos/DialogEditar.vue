<template>
    
    <Dialog v-model:visible="dialogVisible" :modal="true" :header="`EDITAR ARTÍCULO`" @hide="cerrarDialog" :pt="{ header: ' mx-5' }">
        <hr class="mx-5 border-t border-[#334155] mb-5">
        <div class="grid grid-cols-2 gap-4 p-6">
            <div class="flex  items-center justify-start">
                <label class="legend w-1/5 mr-4  text-left font-semibold">Material / Repuesto:</label>
                <InputText v-model="formData.material_repuesto" class="w-4/5 " aria-required="required" />
            </div>
            <div class=" flex items-center justify-between">
                <label class="legend w-1/5 mr-4 text-left font-semibold">Marca:</label>
                <InputText v-model="formData.marca" class="w-4/5" aria-required="required" />
            </div>

            <div class="flex items-center  justify-between ">
                <label class="legend w-1/5 mr-4 text-left font-semibold">Modelo:</label>
                <InputText v-model="formData.modelo_serie" class="w-4/5" />
            </div>
            <div class=" flex justify-between items-center">
                <label class="legend w-1/5 mr-4 text-left font-semibold">Stock Actual:</label>
                <InputNumber readonly v-model="formData.cantidad" class="w-4/5" disabled />
            </div>
            

            <div class="flex flex-col col-span-2 items-center justify-center ">
                <div class="py-5">
                    <!-- <label class="legend w-1/5 text-right font-semibold mr-2">Imagen:</label> -->
                    <Button label="Adjuntar Imagen" icon="pi pi-file" @click="elegirImagen" />
                </div>
                <p v-if="formData.imagen"> <b> Imagen Seleccionada: </b> </p>
                <p>{{ formData.imagen }}</p>
            </div>
            
            <div class="mt-5 col-span-2 flex items-center justify-end">
            <Button label="Cancelar" icon="pi pi-times" class="mr-2" severity="secondary" @click="cerrarDialog" />
            <Button label="Guardar" icon="pi pi-save" severity="success" class="" @click="actualizarArticulo" />
            </div>



        </div>
    </Dialog>
<Toast/>
</template>
<script>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import { defineComponent, reactive, ref, watch } from 'vue';
import { useArticulos } from '../../composables/useArticulos.js'
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';

export default defineComponent({
    name: 'DialogEditar',
    components: {
        Dialog,
        Button,
        InputNumber,
        Toast
    },

    emits: ['actualizarArticulo'],
    setup(props, { emit } ) {

        const { seleccionarImagen } = useArticulos();

        const formData = reactive({ ...props.articuloEdicion })
        const dialogVisible = ref(true);
        const toast = useToast()

        const cerrarDialog = () => {
            dialogVisible.value = false;
        }

        const actualizarArticulo = async () => {
                emit('actualizarArticulo', {...formData})
        }

        const elegirImagen = async ( ) =>{
            const response = await seleccionarImagen();
            console.log('response', response)
            if(response.success && !response.data.canceled){
                    formData.imagen = response.data.filePaths[0];
            }else if(!response.success){
                toast.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al seleccionar la imagen, intente nuevamente', life: 3000 });

            }
        }

   
        watch(
            () => props.articuloEdicion,
            (newVal) => {
                Object.assign(formData, newVal);
                dialogVisible.value = true;
            }
        );
        return {
            formData,
            dialogVisible,
            cerrarDialog,
            seleccionarImagen,
            elegirImagen,
            actualizarArticulo,
        }
    },
    props: {
        articuloEdicion: {
            type: Object,
            required: true,
            // Valor por defecto en caso de que no se reciba la prop
            default: () => ({
                id: null,
                marca: '',
                modelo: '',
                material: '',
                cantidad: 0,
                imagen: '',
                unidad_medida: ''
            })

        }
    }
})
</script>