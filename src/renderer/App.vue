<template>
  <div class="min-h-screen ">
    <div class="card bg-success mx-2">
      <Menubar :model="items" :end="configItem" />
      
      <Button icon="pi pi-moon" @click="toggleDarkMode()" />

    </div>
    <div class="flex">
      <div class="m-2 p-1 bg-white shadow-md rounded-lg w-full">
        <div v-if="loading">
          <div class="flex items-center justify-center h-64">
            <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
          </div>
        </div>
        <div v-else>
          <component :is="currentComponent" @goConfig="gtc" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, markRaw, defineAsyncComponent } from 'vue';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';

export default {
  components: {
    Menubar,
    Button
  },
  
  setup() {

    const items = ref([
      
    {
        label: 'Movimientos de Materiales',
        command: () => loadComponent('Movimientos'),
      },
      {
        label: 'Artículos',
        command: () => loadComponent('Articulos'),
      },
     
    ]);

    const configItem = ref([
      {
        label: 'Configuración',
        icon: 'pi pi-cog',
        command: () => loadComponent('ConfiguracionComponent'),
      },
    ]);

    const loading = ref(false);
    const currentComponent = ref(null);

    const loadComponent = (componentName) => {
      loading.value = true;
      currentComponent.value = markRaw(defineAsyncComponent(() =>
        import(`./pages/${componentName}.vue`).catch((e) => {
          console.log('Error al cargar el componente', e);
          
          return import('./pages/Movimientos.vue'); // Fallback

        })
      ));
      loading.value = false;
    };

    // Load the default component
    loadComponent('Movimientos');

      const gtc = () => {
        
        currentComponent.value = defineAsyncComponent(() =>
          import('./pages/Movimientos.vue').catch((e) => {
         
            return import('./pages/Movimientos.vue'); // Fallback
          })
        );
      };


      function toggleDarkMode() {
    document.documentElement.classList.toggle('my-app-dark');
}


    return {
      items,
      gtc,
      configItem,
      currentComponent,
      loading,
      toggleDarkMode
    };
  },
};
</script>

<style>
body {
  background: #68686b !important;
}

.p-menubar-item:not(.p-disabled) > .p-menubar-item-content:hover {
  /* background-color:  #1DB756 !important; */
   background-color:  #0EA5E9 !important;
  color: white !important;
}
</style>
