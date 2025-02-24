<template>


    <Form  class="px-3 pb-20">

        <!-- Grid de inputs alineados -->
        <div class="grid grid-cols-2 gap-4 p-4 border border-gray rounded-lg ">
            <!-- Columna 1 -->
            <div class="col-span-1 space-y-4 flex flex-col    justify-between">
                <div class="flex  items-center justify-start">
                    <label class="legend w-2/5  text-left font-semibold">Material:</label>
                    <InputText v-model="formData.material" class="w-3/5 " aria-required="required" />


                </div>
                <div class=" flex items-center justify-between">
                    <label class="legend w-2/5 text-left font-semibold">Marca:</label>
                    <InputText v-model="formData.marca" class="w-3/5" aria-required="required" />

                </div>



                <div class="flex items-center  justify-between">
                    <label class="legend w-2/5 text-left font-semibold">Modelo:</label>
                    <InputText v-model="formData.modelo" readonly class="w-3/5" />

                </div>
            </div>

            <!-- Columna 2 -->
            <div class="col-span-1 space-y-4 flex flex-col bg-red">


                <div class=" flex justify-between items-center">

                    <label class="legend w-2/5 text-left font-semibold">Cantidad:</label>
                    <InputText v-model="formData.cantidad" readonly class="w-3/5" />


                </div>
                <div class="flex items-center justify-between">
                    <label class="legend w-2/5 text-right font-semibold mr-3">Imagen:</label>
                    <Button label="Seleccionar Imagen" />
                </div>
            </div>
        </div>
        <div class="mt-8 flex items-center justify-end">
            <Button label="Reiniciar" icon="pi pi-refresh" class="mr-2"  severity="secondary" @click="reiniciarFormulario" />
            <Button label="Cancelar" icon="pi " class="mr-2" severity="danger" @click="cerrarDialog" />
            <Button label="Guardar" icon="pi pi-save" severity="success" class="" @click="guardarArticulo" />
            <!-- <Button v-if="showForm" type="button" label="Generar PDF" severity="danger" icon="pi pi-file-pdf"
   class=" ml-2 text-right " :disabled="!formCompleto"  @click="generarPdf"  /> -->
        </div>
    </Form>

</template>

<script>
import { defineComponent, reactive, ref } from 'vue';
import InputText from 'primevue/inputtext';
import FileUpload from 'primevue/fileupload';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';

export default defineComponent({
    name: 'FormularioArticulos',
    components: {
        InputText,
        FileUpload,
        InputNumber,
        Button
    },

    emits: ['guardarArticulo', 'cancelar'],
    setup(props, { emit }) {

        const formData = reactive({
            material: '',
            marca: '',
            modelo: '',
            cantidad: '',
            imagen: ''
        })

        const cerrarDialog = () =>{
            reiniciarFormulario();
            emit('cancelar')
        }
        const reiniciarFormulario = () => {
            formData.material = '';
            formData.marca = '';
            formData.modelo = '';
            formData.imagen = null;
            formData.cantidad = 0;
        }

        const guardarArticulo = () => {
            emit('guardarArticulo', { ...formData });
            reiniciarFormulario();
        }

        return {
            formData,
            guardarArticulo,
            reiniciarFormulario,
            cerrarDialog
        }
    }

})

</script>