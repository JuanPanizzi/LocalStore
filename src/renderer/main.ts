import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'  
import Aura from '@primevue/themes/aura';
// primeicons
import 'primeicons/primeicons.css'
import './index.css'
import ConfirmationService from 'primevue/confirmationservice';
import InputText from 'primevue/inputtext';
import RadioButton from 'primevue/radiobutton';
import ToastService from 'primevue/toastservice';
import { definePreset } from '@primevue/themes';

const MyPreset = definePreset(Aura, {
  semantic: {
      primary: {
          50: '{sky.50}',
          100: '{sky.100}',
          200: '{sky.200}',
          300: '{sky.300}',
          400: '{sky.400}',
          500: '{sky.500}',
          600: '{sky.600}',
          700: '{sky.700}',
          800: '{sky.800}',
          900: '{sky.900}',
          950: '{sky.950}'
      },
      colorScheme: {
        light: {
            surface: {
                0: '#ffffff',
                50: '{zinc.50}',
                100: '{zinc.100}',
                200: '{zinc.200}',
                300: '{zinc.300}',
                400: '{zinc.400}',
                500: '{zinc.500}',
                600: '{zinc.600}',
                700: '{zinc.700}',
                800: '{zinc.800}',
                900: '{zinc.900}',
                950: '{zinc.950}'
            }
        },
        dark: {
            surface: {
                0: '#ffffff',
                50: '{slate.50}',
                100: '{slate.100}',
                200: '{slate.200}',
                300: '{slate.300}',
                400: '{slate.400}',
                500: '{slate.500}',
                600: '{slate.600}',
                700: '{slate.700}',
                800: '{slate.800}',
                900: '{slate.900}',
                950: '{slate.950}'
            }
        }
    }

    } 
});

const app = createApp(App)

app.use(ConfirmationService);
app.use(ToastService);
app.use(PrimeVue, {
    // Default theme configuration
    theme: {
        preset: MyPreset,
        options: {
            prefix: 'p',
            // darkModeSelector: '.light-mode',
            darkModeSelector: '.my-app-dark',
          
            cssLayer: false
        }
    },
    pt: {
        select: {
            
                  root: {
                    class: 'select-root',
                  },
                  dropdown: {
                    class: 'select-dropdown',
                    style: 'display: flex; align-items:center; margin-right: 2px; '
                  },
                  listContainer: {
                    // class: 'p-select-list-container'
                    style: 'background: white; border: 1px solid gray; padding: 5px '
                  },
                  option: {
                    class: 'select-option',
                  },
                  optionLabel: {
                    class: 'select-optionLabel'
                  }
                
        }
    },
    locale: {
      clear: 'Reiniciar',
      // Puedes agregar otras traducciones según lo necesites:
      apply: 'Aplicar',
      monthNames: [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ],
      // ...otras propiedades de traducción
  }


});
app.component('RadioButton', RadioButton)
app.component('InputText', InputText);
app.mount('#app')