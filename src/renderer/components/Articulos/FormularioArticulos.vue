<template>
    <Form  class="px-3 pb-20">
        <div>
            <h1 class="text-center text-3xl font-semibold mt-6">
                Registro de Materiales
            </h1>
        </div>

        <!-- Grid de inputs alineados -->
        <div class="grid grid-cols-2 gap-4 p-4 border border-gray rounded-lg">
            <!-- Columna 1 -->
            <div class="col-span-1 space-y-4 flex flex-col justify-between">
                <div class="flex items-center justify-start">
                    <label class="legend w-2/5 text-left font-semibold">Material:</label>
                    <InputText v-model="formData.material" class="w-3/5" aria-required="required" />
                </div>
                <div class="flex items-center justify-between">
                    <label class="legend w-2/5 text-left font-semibold">Marca:</label>
                    <InputText v-model="formData.marca" class="w-3/5" aria-required="required" />
                </div>
                <div class="flex items-center justify-between">
                    <label class="legend w-2/5 text-left font-semibold">Modelo:</label>
                    <InputText v-model="formData.modelo" class="w-3/5" aria-required="required" />
                </div>
            </div>

            <!-- Columna 2 -->
            <div class="col-span-1 space-y-4 flex flex-col justify-between">
                <div class="flex items-center justify-between">
                    <label class="legend w-2/5 text-right font-semibold mr-3">Imagen:</label>
                    <FileUpload v-model="formData.imagen" class="w-3/5" mode="basic" accept="image/*" />
                </div>
                <div class="flex items-center justify-between">
                    <label class="legend w-2/5 text-right font-semibold mr-3">Cantidad:</label>
                    <InputNumber v-model="formData.cantidad" class="w-3/5" />
                </div>
            </div>
        </div>

        <div class="mt-8 flex items-center justify-end">
            <Button label="Reiniciar" icon="pi pi-refresh" class="mr-2" outlined severity="secondary"
                @click="reiniciarFormulario" />
            <Button label="Guardar" icon="pi pi-save" severity="success" @click="guardarArticulo" />
        </div>
    </Form>
</template>

<script>
import { defineComponent, reactive } from 'vue';
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

    emits: ['guardarArticulo'],
    setup(props, { emit }) {

        const formData = {
            material: '',
            marca: '',
            modelo: '',
            cantidad: '',
            imagen: ''
        }

        const guardarArticulo = () => {
            emit('guardarArticulo', formData)
        }

        return {
            formData,
            guardarArticulo
        }
    },
    props: {
        showForm: {
            type: Boolean,
            default: false
        }
    }

})

</script>