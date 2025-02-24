<template>
    <Form class="px-3 pb-20">
      
        <!-- Grid de inputs alineados -->
        <div class="grid grid-cols-2 gap-4 p-4 border border-gray rounded-lg">
            <!-- Columna 1 -->
                <div class="flex items-center justify-start">
                    <label class="legend  text-left font-semibold">Material:</label>
                    <InputText v-model="formData.material" class="" aria-required="required" />
                </div>
                <div class="flex items-center justify-between">
                    <label class="legend  text-left font-semibold">Marca:</label>
                    <InputText v-model="formData.marca" class="" aria-required="required" />
                </div>
                <div class="flex items-center justify-between">
                    <label class="legend  text-left font-semibold">Modelo:</label>
                    <InputText v-model="formData.modelo" class="" aria-required="required" />
                </div>

                <div class="flex items-center justify-between">
                    <label class="legend  text-right font-semibold mr-3">Imagen:</label>
                    <FileUpload v-model="formData.imagen" class="" mode="basic" accept="image/*" />
                </div>
                <div class="flex items-center justify-between">
                    <label class="legend  text-right font-semibold mr-3">Cantidad:</label>
                    <InputNumber v-model="formData.cantidad" class="" />
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

    emits: ['guardarArticulo'],
    setup(props, { emit }) {

        const formData = reactive({
            material: '',
            marca: '',
            modelo: '',
            cantidad: '',
            imagen: ''
        })

        const reiniciarFormulario = () => {
            form.material = '';
            form.marca = '';
            form.modelo = '';
            form.imagen = null;
            form.cantidad = 0;
        }

        const guardarArticulo = () => {
            emit('guardarArticulo', {...formData});
            reiniciarFormulario();
        }

        return {
            formData,
            guardarArticulo,
            reiniciarFormulario
        }
    }

})

</script>