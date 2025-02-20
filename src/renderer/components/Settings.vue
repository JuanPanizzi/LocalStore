<template>
  <div class="card">
    <ConfirmDialog></ConfirmDialog>

    <div class="w-full ml-5">

      <h2 class="text-2xl uppercase p-3 font-bold mb-4">
        Configuración
      </h2>
      <div class="flex flex-col mb-4">
        <label for="numeroInforme" class="font-semibold">N° De informe</label>
        <div class="flex items-center">
          <InputNumber id="numeroInforme" class="w-56 mr-2" v-model="formNumber" />
          <Button icon="pi pi-save" class="mx-2" @click="saveFormNumber" />
        </div>
      </div>
    </div>

    
  </div>





  <div class="">



    <TreeTable :value="nodes" tableStyle="min-width: 50rem" :expandedKeys="expandedKeys"
      @toggle="expandedKeys = $event">
      <!-- Cabecera -->
      <template #header>



        <div class="text-xl font-bold">
          Gestión de Plantas, Sistemas y Equipos</div>
        <div class="flex my-2 gap-2 justify-start">
          <Button size="small" :outlined="selectedForm.name !== 'Incendios'" severity="info"
            @click="selectedForm.name = 'Incendios'; loadData()" label="Incendios" />
          <Button size="small" :outlined="selectedForm.name !== 'Gases'" severity="info"
            @click="selectedForm.name = 'Gases'; loadData()" label="Gases" />
          <Button size="small" :outlined="selectedForm.name !== 'Hidrantes'" severity="info"
            @click="selectedForm.name = 'Hidrantes'; loadData()" label="Hidrantes" />
          <Button size="small" :outlined="selectedForm.name !== 'Alarmas'" severity="info"
            @click="selectedForm.name = 'Alarmas'; loadData()" label="Estaciones de Alarma" />
          <Button size="small" :outlined="selectedForm.name !== 'Valvulas'" severity="info"
            @click="selectedForm.name = 'Valvulas'; loadData()" label="Válvulas Diluvio" />
          <Button size="small" :outlined="selectedForm.name !== 'BombaEspuma'" severity="info"
            @click="selectedForm.name = 'BombaEspuma'; loadData()" label="Bomba Espuma" />
          <Button size="small" :outlined="selectedForm.name !== 'Mangueras'" severity="info"
            @click="selectedForm.name = 'Mangueras'; loadData()" label="Caja de Mangueras" />
          <Button size="small" :outlined="selectedForm.name !== 'TanquesEspuma'" severity="info"
            @click="selectedForm.name = 'TanquesEspuma'; loadData()" label="Tanques de Espuma" />
          <Button size="small" :outlined="selectedForm.name !== 'Asfaltos'" severity="info"
            @click="selectedForm.name = 'Asfaltos'; loadData()" label="Informe Asfaltos" />
          <Button size="small" :outlined="selectedForm.name !== 'Lubricantes'" severity="info"
            @click="selectedForm.name = 'Lubricantes'; loadData()" label="Informe Lubricantes" />


        </div>
      </template>

      <template #empty>
        <div class="text-center text-gray-500">
          No hay datos para mostrar.
        </div>
      </template>
      <!-- Columnas -->
      <Column field="name" header="Nombre" expander style="width: 40rem">
        <template #body="slotProps">
          <template v-if="!slotProps.node.editing">
            {{ slotProps.node.data.name }}
          </template>
          <template v-else>
            <div class="form-fields">
              <InputText v-if="slotProps.node.data.type === 'Planta'" v-model="slotProps.node.data.name" />
              <InputText v-if="slotProps.node.data.type === 'Sistema'" v-model="slotProps.node.data.name" />
              <div class="flex flex-wrap gap-1" v-if="slotProps.node.data.type === 'Equipo'">
                <InputText size="small" v-model="slotProps.node.data.name" placeholder="N°" />

              </div>
            </div>
          </template>
        </template>
      </Column>

      <Column field="type" header="Tipo" style="width: 150px"></Column>

      <!-- Botones de Acción (Editar/Guardar/Eliminar) -->
      <Column style="width: 5rem">
        <template #body="slotProps">
          <div class="flex justify-end gap-2">
            <!-- Botón para añadir Sistemas o Equipos -->
            <button v-if="slotProps.node.data.type === 'Planta'" class="btn" @click="addNode(slotProps.node)">
              <i class="pi pi-plus"></i> Sistema
            </button>
            <button v-if="slotProps.node.data.type === 'Sistema'" class="btn" @click="addNode(slotProps.node)">
              <i class="pi pi-plus"></i> Equipo
            </button>
          </div>
        </template>
      </Column>
      <Column style="width: 5rem">
        <template #body="slotProps">
          <div class="flex justify-end gap-2">
            <!-- Botones para editar y guardar -->
            <button v-if="!slotProps.node.editing" class="btn" @click="editNodeInline(slotProps.node)">
              <i class="pi pi-pencil"></i>
            </button>
            <button v-if="slotProps.node.editing" class="btn" @click="saveNodeInline(slotProps.node)">
              <i class="pi pi-save"></i>
            </button>

            <!-- Botón para eliminar -->
            <Button @click="deleteNode(slotProps.node)" icon="pi pi-trash" text severity="danger" />
          </div>
        </template>
      </Column>

      <!-- Pie de tabla -->
      <template #footer>
        <div class="flex justify-start gap-4 mt-4">
          <Button @click="createFirstNode" label="Agregar Planta" icon="pi pi-plus" />

          <Button outlined severity="info" @click="exportToXLSX" icon="pi pi-file-export" label="Exportar a XLSX" />

          <Button outlined severity="danger" icon="pi pi-file-import" label="Importar XLSX"
            @click="() => $refs.fileInput.click()" />
          <input type="file" @change="importFromXLSX" accept=".xlsx" class="hidden-input" ref="fileInput" />

        </div>
      </template>
    </TreeTable>
  </div>
  <Toast />
</template>

<script>
import { ref, onMounted } from 'vue';
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import * as XLSX from 'xlsx';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import InputNumber from 'primevue/inputnumber';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Select from 'primevue/select';

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';


export default {
  emits: ['goConfig'],
  components: {
    TreeTable,
    Column,
    InputText,
    InputNumber,
    Button,
    ConfirmDialog,
    Toast,
    Select,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel
  },
  setup() {
    const forms = ref([
      { name: 'Incendios' },
      { name: 'Gases' },
      { name: 'Hidrantes' },
      { name: 'Alarmas' },
      { name: 'Valvulas' },
      { name: 'BombaEspuma' },
      { name: 'Mangueras' },
      { name: 'TanquesEspuma' },
      { name: 'Asfaltos' },
      { name: 'Lubricantes' }
    ])
    const selectedForm = ref({ name: 'Incendios' });
    const confirm = useConfirm();
    const nodes = ref([]);
    const expandedKeys = ref({}); // Para expandir Sistemas automáticamente
    const formNumber = ref(0)
    const toast = useToast();

    // const createFirstNode = () => {
    //   nodes.value.push({
    //     key: Date.now(),
    //     data: { name: 'Nueva Planta', type: 'Planta' },
    //     children: []
    //   });
    //   saveToLocalStorage();
    // };

    const createFirstNode = () => {
      // Obtener el último ID del localStorage o inicializarlo en 0
      const lastId = parseInt(localStorage.getItem('lastId'), 10) || 0;

      // Generar un nuevo ID único
      const newId = lastId + 1;

      // Crear el nuevo nodo
      nodes.value.push({
        key: newId,
        data: { name: 'Nueva Planta', type: 'Planta' },
        children: []
      });

      // Guardar el nuevo ID en localStorage para futuras llamadas
      localStorage.setItem('lastId', newId);

      saveToLocalStorage();
    };



    // Cargar datos del localStorage
    
    const loadData = () => {

      let savedPlants;
      switch (selectedForm.value.name) {
        case 'Incendios':
          savedPlants = JSON.parse(localStorage.getItem('Incendios') || '[]');
          break;
        case 'Gases':
          savedPlants = JSON.parse(localStorage.getItem('Gases') || '[]');
          break;
        case 'Hidrantes':
          savedPlants = JSON.parse(localStorage.getItem('Hidrantes') || '[]');
          break;
        case 'Alarmas':
          savedPlants = JSON.parse(localStorage.getItem('Alarmas') || '[]');
          break;
        case 'Valvulas':
          savedPlants = JSON.parse(localStorage.getItem('Valvulas') || '[]');
          break;
        case 'BombaEspuma':
          savedPlants = JSON.parse(localStorage.getItem('BombaEspuma') || '[]');
          break;
        case 'Mangueras':
          savedPlants = JSON.parse(localStorage.getItem('Mangueras') || '[]');
          break;
        case 'TanquesEspuma':
          savedPlants = JSON.parse(localStorage.getItem('TanquesEspuma') || '[]');
          break;
        case 'Asfaltos':
          savedPlants = JSON.parse(localStorage.getItem('Asfaltos') || '[]');
          break;
        case 'Lubricantes':
          savedPlants = JSON.parse(localStorage.getItem('Lubricantes') || '[]');
          break;
        default:
          savedPlants = []; // En caso de que no coincida con ningún caso
          break;
      }

      nodes.value = savedPlants.map(plant => ({
        key: plant.id,
        data: { name: plant.name, type: 'Planta' },
        children: plant.sistemas.map(sistema => ({
          key: sistema.id,
          data: { name: sistema.name, type: 'Sistema' },
          children: sistema.equipos.map(equipo => ({
            key: equipo.id,
            data: {
              name: equipo.name,
              // brand: equipo.brand,
              // model: equipo.model,
              // unit: equipo.unit,
              // name: `${equipo.name} - ${equipo.brand} - ${equipo.model} - ${equipo.unit}`,
              name: `${equipo.name}`,
              type: 'Equipo'
            }
          }))
        }))
      }));
    };

    // Guardar datos en el localStorage
    const saveToLocalStorage = () => {
      const plants = nodes.value.map(node => ({
        id: node.key,
        name: node.data.name,
        sistemas: node.children.map(sistemaNode => ({
          id: sistemaNode.key,
          name: sistemaNode.data.name,
          equipos: sistemaNode.children.map(instrumentNode => ({
            id: instrumentNode.key,
            name: instrumentNode.data.name,
            // brand: instrumentNode.data.brand,
            // model: instrumentNode.data.model,
            // unit: instrumentNode.data.unit
          }))
        }))
      }));
      switch (selectedForm.value.name) {
        case 'Incendios':
          localStorage.setItem('Incendios', JSON.stringify(plants));
          break;
        case 'Gases':
          localStorage.setItem('Gases', JSON.stringify(plants));
          break;
        case 'Hidrantes':
          localStorage.setItem('Hidrantes', JSON.stringify(plants));
          break;
        case 'Alarmas':
          localStorage.setItem('Alarmas', JSON.stringify(plants));
          break;
        case 'Valvulas':
          localStorage.setItem('Valvulas', JSON.stringify(plants));
          break;
        case 'BombaEspuma':
          localStorage.setItem('BombaEspuma', JSON.stringify(plants));
          break;
        case 'Mangueras':
          localStorage.setItem('Mangueras', JSON.stringify(plants));
          break;
        case 'TanquesEspuma':
          localStorage.setItem('TanquesEspuma', JSON.stringify(plants));
          break;
        case 'Asfaltos':
          localStorage.setItem('Asfaltos', JSON.stringify(plants));
          break;
        case 'Lubricantes':
          localStorage.setItem('Lubricantes', JSON.stringify(plants));
          break;

      }
      loadData();
    };

    // Modo edición en línea
    const editNodeInline = (node) => {
      node.editing = true;
    };

    const saveNodeInline = (node) => {
      node.editing = false;
      saveToLocalStorage();
    };

    // Añadir un sistema o un equipo según el nodo seleccionado
    // const addNode = (node) => {
    //   if (node.data.type === 'Planta') {
    //     const newSistema = {
    //       key: Date.now(),
    //       data: { name: 'Nuevo Sistema', type: 'Sistema' },
    //       children: []
    //     };
    //     node.children.push(newSistema);
    //   } else if (node.data.type === 'Sistema') {
    //     const newInstrument = {
    //       key: Date.now(),
    //       data: {
    //         name: 'Nuevo Equipo',
    //         name: 'Nuevo Equipo',
    //         type: 'Equipo'
    //       }
    //     };
    //     node.children.push(newInstrument);
    //     expandedKeys.value[node.key] = true; // Expandir el sistema automáticamente
    //   }
    //   saveToLocalStorage();
    // };
   
    const addNode = (node) => {
    // Obtener el último ID del localStorage o inicializarlo en 0
    const lastId = parseInt(localStorage.getItem('lastId'), 10) || 0;

    // Generar un nuevo ID único
    const newId = lastId + 1;

    if (node.data.type === 'Planta') {
        const newSistema = {
            key: newId, // Usar el ID incremental
            data: { name: 'Nuevo Sistema', type: 'Sistema' },
            children: []
        };
        node.children.push(newSistema);
    } else if (node.data.type === 'Sistema') {
        const newInstrument = {
            key: newId, // Usar el ID incremental
            data: { name: 'Nuevo Equipo', type: 'Equipo' }
        };
        node.children.push(newInstrument);
        expandedKeys.value[node.key] = true; // Expandir el sistema automáticamente
    }

    // Guardar el nuevo ID en localStorage para futuras llamadas
    localStorage.setItem('lastId', newId);

    saveToLocalStorage();
};

    // Función para eliminar un nodo (incluye búsqueda recursiva en todos los niveles)
    const deleteNode = (node, nodesArray = nodes.value) => {

      // if first node show confirm message
      if (node.data.type === 'Planta') {

        confirm.require({
          message: 'Se eliminarán todos los Sistemas e Equipos asociados',
          header: 'Está seguro que desea eliminar la planta? ',
          icon: 'pi pi-info-circle',
          rejectLabel: 'Cancelar',
          rejectProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true
          },
          acceptProps: {
            label: 'Eliminar',
            severity: 'danger'
          },
          accept: () => {
            // Recorrer todos los nodos (nivel actual)
            for (let i = 0; i < nodesArray.length; i++) {
              let currentNode = nodesArray[i];

              // Si el nodo a eliminar está en el nivel actual
              if (currentNode === node) {
                nodesArray.splice(i, 1); // Eliminar el nodo
                saveToLocalStorage();
                return; // Salir de la función después de eliminar
              }

              // Si hay hijos, buscar recursivamente en los hijos
              if (currentNode.children && currentNode.children.length > 0) {
                deleteNode(node, currentNode.children); // Llamada recursiva en los hijos
              }
            }
          },
          reject: () => {
            return;
          }
        });



      } else {
        // Recorrer todos los nodos (nivel actual)
        for (let i = 0; i < nodesArray.length; i++) {
          let currentNode = nodesArray[i];

          // Si el nodo a eliminar está en el nivel actual
          if (currentNode === node) {
            nodesArray.splice(i, 1); // Eliminar el nodo
            saveToLocalStorage();
            return; // Salir de la función después de eliminar
          }

          // Si hay hijos, buscar recursivamente en los hijos
          if (currentNode.children && currentNode.children.length > 0) {
            deleteNode(node, currentNode.children); // Llamada recursiva en los hijos
          }}}};


    const exportToXLSX = () => {
      const plants = JSON.parse(localStorage.getItem(`${selectedForm.value.name}`) || '[]');

      // Función para verificar si los datos contienen todos los campos requeridos
      const validateFields = (data, requiredFields) => {
        return data.length > 0 && data.every(item =>
          requiredFields.every(field => field in item && item[field] !== undefined && item[field] !== null)
        );
      };

      // Preparar datos para la hoja de plantas
      const plantsData = plants.map(plant => ({
        id: plant.id,
        nombre: plant.name
      }));

      // Validar si la hoja de Plantas tiene los campos requeridos
      if (!validateFields(plantsData, ['id', 'nombre'])) {
        alert('Por favor complete todos los campos.');
        return;
      }

      // Preparar datos para la hoja de Sistemas
      const sistemasData = plants.flatMap(plant =>
        plant.sistemas?.map(sistema => ({
          id: sistema.id,
          planta: plant.name, // Para referencia a la planta
          sistema: sistema.name
        })) || []
      );

      // Validar si la hoja de Sistemas tiene los campos requeridos
      if (!validateFields(sistemasData, ['id', 'planta', 'sistema'])) {
        alert('Por favor complete todos los campos.');
        return;
      }

      // Preparar datos para la hoja de Equipos
      const instrumentsData = plants.flatMap(plant =>
        plant.sistemas?.flatMap(sistema =>
          sistema.equipos?.map(equipo => ({
            id: equipo.id,
            planta: plant.name,    // Para referencia a la planta
            sistema: sistema.name, // Para referencia al sistema
            equipo: equipo.name
          })) || []
        ) || []
      );

      // Validar si la hoja de Equipos tiene los campos requeridos
      if (!validateFields(instrumentsData, ['id', 'planta', 'sistema', 'equipo'])) {
        alert('Por favor complete todos los campos.');
        return;
      }

      // Crear el libro de Excel
      const workbook = XLSX.utils.book_new();

      // Crear hojas de cálculo
      const plantsSheet = XLSX.utils.json_to_sheet(plantsData);
      const sistemasSheet = XLSX.utils.json_to_sheet(sistemasData);
      const instrumentsSheet = XLSX.utils.json_to_sheet(instrumentsData);

      // Establecer anchos de columnas para cada hoja
      plantsSheet['!cols'] = [
        { wch: 10 }, // Ancho de columna para "id"
        { wch: 20 }  // Ancho de columna para "nombre"
      ];

      sistemasSheet['!cols'] = [
        { wch: 10 }, // Ancho de columna para "id"
        { wch: 20 }, // Ancho de columna para "planta"
        { wch: 20 }  // Ancho de columna para "sistema"
      ];

      instrumentsSheet['!cols'] = [
        { wch: 10 }, // Ancho de columna para "id"
        { wch: 20 }, // Ancho de columna para "planta"
        { wch: 20 }, // Ancho de columna para "sistema"
        { wch: 25 }  // Ancho de columna para "equipo"
      ];

      // Añadir hojas al libro
      XLSX.utils.book_append_sheet(workbook, plantsSheet, 'Plantas');
      XLSX.utils.book_append_sheet(workbook, sistemasSheet, 'Sistemas');
      XLSX.utils.book_append_sheet(workbook, instrumentsSheet, 'Equipos');

      // Guardar el archivo
      XLSX.writeFile(workbook, `${selectedForm.value.name}-Exported.xlsx`);
    };




    const importFromXLSX = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Validar que las hojas requeridas existen
        const requiredSheets = ['Plantas', 'Sistemas', 'Equipos'];
        const missingSheets = requiredSheets.filter(sheet => !workbook.Sheets[sheet]);

        if (missingSheets.length > 0) {
          alert(`El excel tiene hojas y/o campos faltantes`);
          event.target.value = null; // Resetea el input de archivo
          return;
        }

        // Validar que las columnas requeridas existen en cada hoja
        const validateSheetColumns = (sheetName, requiredColumns) => {
          const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
          if (!sheet || sheet.length === 0) return false; // La hoja está vacía
          const headers = sheet[0]; // Primer fila como encabezados
          return requiredColumns.every(column => headers.includes(column));
        };

        const validations = [
          { sheet: 'Plantas', columns: ['id', 'nombre'] },
          { sheet: 'Sistemas', columns: ['id', 'planta', 'sistema'] },
          { sheet: 'Equipos', columns: ['id', 'planta', 'sistema', 'equipo'] },
        ];

        const invalidSheets = validations.filter(({ sheet, columns }) => !validateSheetColumns(sheet, columns));

        if (invalidSheets.length > 0) {
          // const invalidSheetNames = invalidSheets.map(({ sheet }) => sheet);
          alert(`El excel tiene hojas y/o campos faltantes`);
          event.target.value = null; // Resetea el input de archivo
          return;
        }

        // Leer cada hoja de cálculo
        const plantsSheet = XLSX.utils.sheet_to_json(workbook.Sheets['Plantas']);
        const sistemasSheet = XLSX.utils.sheet_to_json(workbook.Sheets['Sistemas']);
        const instrumentsSheet = XLSX.utils.sheet_to_json(workbook.Sheets['Equipos']);

        // Reconstruir la estructura jerárquica
        const plants = plantsSheet.map(plant => ({
          id: plant.id,
          name: plant.nombre,
          sistemas: sistemasSheet
            .filter(sistema => sistema.planta === plant.nombre)
            .map(sistema => ({
              id: sistema.id,
              name: sistema.sistema,
              equipos: instrumentsSheet
                .filter(
                  equipo =>
                    equipo.sistema === sistema.sistema &&
                    equipo.planta === plant.nombre
                )
                .map(equipo => ({
                  id: equipo.id,
                  name: equipo.equipo,
                })),
            })),
        }));

        // Guardar la nueva estructura en localStorage o usarla directamente
        localStorage.setItem(`${selectedForm.value.name}`, JSON.stringify(plants));
        nodes.value = plants; // Suponiendo que nodes es donde almacenas tus datos.

        // Refrescar la vista
        loadData();

        // Resetea el input de archivo para permitir nueva selección
        event.target.value = null;
      };

      reader.readAsArrayBuffer(file);
    };



    const saveFormNumber = () => {
      localStorage.setItem('formNumber', JSON.stringify(formNumber.value));
      toast.add({ severity: 'success', summary: 'Operación Exitosa', detail: 'N° de informe guardado correctamente', life: 3000 });
    };

    const defaultLoadData = () => {

      nodes.value = [
        {
          key: 1,
          data: { name: 'Planta 1', type: 'Planta' },
          children: [
            {
              key: 2,
              data: { name: 'Sistema 1', type: 'Sistema' },
              children: [
                {
                  key: 3,
                  data: { name: 'Equipo 1', type: 'Equipo' }
                },
                {
                  key: 4,
                  data: { name: 'Equipo 2', type: 'Equipo' }
                }
              ]
            },
            {
              key: 5,
              data: { name: 'Sistema 2', type: 'Sistema' },
              children: [
                {
                  key: 6,
                  data: { name: 'Equipo 3', type: 'Equipo' }
                },
                {
                  key: 7,
                  data: { name: 'Equipo 4', type: 'Equipo' }
                }
              ]
            }
          ]
        }
      ];
    }
    onMounted(() => {

      // loadData()
      const storedData = localStorage.getItem('formNumber');

      if (storedData !== null && !isNaN(Number(storedData))) {
        formNumber.value = Number(storedData);
      } else {
        formNumber.value = 0;
      }

      // check if Incendios is in localstorage
      if (localStorage.getItem('Incendios') === null) {
        //createFirstNode();
        //cargar por defecto
        // defaultLoadData();
      }

      loadData();

    });

    return {
      nodes,
      expandedKeys,
      editNodeInline,
      saveNodeInline,
      addNode,
      deleteNode,
      exportToXLSX,
      importFromXLSX,
      createFirstNode,
      formNumber,
      saveFormNumber,
      forms,
      selectedForm,
      loadData
    };
  }
};
</script>

<style scoped>
.p-inputtext[readonly] {
  background-color: #d6cfcf;
  border-color: #f9f9f9;
  color: #333;
}

.btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  margin: 2px;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
}

.btn-save {
  background-color: #28a745;
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
}

.btn i {
  margin-right: 5px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hidden-input {
  display: none;
}

.text-right {
  text-align: right;
}
</style>