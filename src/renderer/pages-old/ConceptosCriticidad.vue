<template>
    <div class="p-4">
        
        <div class="flex items-center">

            <img :src="logo" alt="logo">
            <h1 class="text-center font-semibold text-3xl mb-10 w-full text-center ">
                CONCEPTOS DE CRITICIDAD 
            </h1>
        </div>
      <Card class="mb-4">
        <template #content>
                <DataTable showGridlines :value="criterios" class="p-datatable-striped">
                    <!-- Columna personalizada para "nivel" con colores -->
                    <Column field="nivel" header="Criterio" style="width: 10rem">
                        <template #body="slotProps">
                            <span :class="getNivelClass(slotProps.data.nivel)" class="nivel-tag">
                                {{ slotProps.data.nivel }}
                            </span>
                        </template>
                    </Column>
                    <Column field="aplicacion" header="Aplicación" />
                </DataTable>
            </template>
      </Card>
<div class="flex justify-end">

  <!-- <Button severity="info" class="ml-auto" label="Descargar Documento" icon="pi pi-download" /> -->
</div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import Card from 'primevue/card';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
import logo from '../../resources/pdflogo.png';
import Button from 'primevue/button';
  
  export default {
    components: { Card, DataTable, Column, Button },
    setup() {
      const criterios = ref([
        { nivel: 'Bajo - 180 Días', aplicacion: 'Instrumentos o elementos en funcionamiento pero con posibilidad de renovación por actualización tecnológica sin plazos fijados por fabricante o desarrollador. Reparación o reemplazo de materiales por golpes, filtraciones, daño estructural menor o detalles estéticos que no modifican o interrumpen su normal funcionamiento o activación. Instrumentos o elementos en funcionamiento pero con pequeñas roturas, fallas, fugas o detalles que no activen o provoquen alarmas, activación de sistemas de mitigación o interrupción del funcionamiento de otros sistemas. ' },
        { nivel: 'Medio - 90 Días', aplicacion: 'Sistemas de mitigación o extinción que estén vencidos, fuera de su período operativo documentado o con signos de contaminación. Sistemas de mitigación o extinción que no cumplen de forma documentada por laboratorio con las normas de calidad, se desconoce su origen, antigüedad o no hay forma de contrastarlo con otros para comparar su rendimiento. Instrumentos o elementos calibrables en plazos fijados por fabricante o desarrollador, que se encuentren funcionando y efectuando monitoreo. Instrumentos o elementos que se encuentren funcionando y no perjudiquen la realización del monitoreo, muestreo o testeo. Sistemas de doble señalización que no efectúen una de las dos operaciones de notificación. Sistemas de doble mitigación o extinción descargados que estén a la espera de recarga mientras esté operativa la reserva. ' },
        { nivel: 'Alto - 30 Días', aplicacion: 'Sistemas de doble mitigación o extinción descargados tanto la unidad principal como la de reserva. Inexistencia de protección o presencia de instrumentos no acordes con el ambiente o los análisis de riesgo del sector. Instrumentos o elementos de funcionamiento limitado por obligada renovación o actualización tecnológica con plazos fijados por fabricante o desarrollador. Instrumentos o elementos con o sin funcionamiento, presentando graves roturas, fallas o pérdidas que impiden o interrumpen su activación. Reemplazo de materiales por golpes, filtraciones, daño estructural mayor que modifican o interrumpen señales, energización, funcionamiento o activación de instrumentos propios o sistemas vinculados o dependientes. Instrumentos o elementos con funcionamiento erróneo o sin funcionamiento que activen o provoquen falsas alarmas, activación de sistemas de mitigación o interrupción del funcionamiento de otros sistemas vinculados o dependientes.' }
      ]);

      const getNivelClass = (nivel) => {
            if (nivel.includes('Bajo')) return 'nivel-bajo';
            if (nivel.includes('Medio')) return 'nivel-medio';
            if (nivel.includes('Alto')) return 'nivel-alto';
            return '';
        };

      return { criterios, logo, getNivelClass };
    }
  };
  </script>
  
  <style scoped>
  .p-datatable {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .nivel-tag {
    display: inline-block;
    padding: 6px 12px;
    font-weight: bold;
    /* border-radius: 5px; */
    border: 0.5px solid black;
    text-align: center;
}

/* Colores personalizados */
.nivel-bajo {
    background-color: #4CAF50; /* Verde */
    color: black;
}

.nivel-medio {
    background-color: #FFC107; /* Amarillo */
    color: black;
}

.nivel-alto {
    background-color: #F44336; /* Rojo */
    color: black;
}
  </style>
  