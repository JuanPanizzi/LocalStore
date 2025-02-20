<template>
  <!-- {{correctivoEdicion}} -->
  <div :class="`flex ${showForm ? 'justify-end' : 'justify-between'}  items-center p-4 `">

    <h1 v-if="!showForm" class="text-center  font-semibold text-xl"> Registro de Correctivos</h1>
    <div>
      <Button @click="handleInicio" :disabled="!showForm && !showFilters" icon="pi pi-list" label="Registros" />
      <Button @click="handleFilters" class="mx-2 " icon="pi pi-filter" label="Filtrar" />
      <Button type="button" label="Nuevo" icon="pi pi-plus" class="text-right" @click="handleForm" />
    </div>
  </div>


  <div v-if="showFilters" class="px-10 flex flex-col items-start justify-center">
    <h1 class="font-semibold my-3">Seleccione método de filtrado</h1>
    <div>
      <Button outlined severity="warn" @click="handleFilter('FECHA')" label="Fecha" />
      <Button outlined severity="warn" @click="handleFilter('RANGO DE FECHAS')" class="ml-2" label="Rango de Fechas" />
      <Button outlined severity="warn" @click="handleFilter('SECTOR')" class="ml-2" label="Sector" />
      <Button outlined severity="warn" @click="handleFilter('REPUESTO')" class="ml-2" label="Repuesto" />
      <Button outlined severity="warn" @click="handleFilter('MARCA')" class="ml-2" label="Marca" />
      <Button outlined severity="warn" @click="handleFilter('MODELO')" class="ml-2" label="Modelo" />
      <Button outlined severity="warn" @click="handleFilter('PERMISO DE TRABAJO')" class="ml-2"
        label="Permiso de trabajo" />
      <Button outlined severity="warn" @click="handleFilter('ORDEN DE TRABAJO')" class="ml-2"
        label="Orden de trabajo" />
    </div>
  </div>

  <div v-if="filter == 'FECHA'" class="flex items-center justify-around px-10 mt-10  ">

    <div class="flex justify-between  ">

      <div class="flex  justify-center items-end  ">
        <div :class="` flex flex-col  items-start `">
          <p class="text-left  font-semibold">Fecha:</p>
          <DatePicker v-model="fechaFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
            :showIcon="true" />
        </div>
        <Button @click="filtrarCorrectivosFecha" class="ml-2 mr-2 w-full">Filtrar</Button>
      </div>
      <Button icon="pi pi-refresh" class="mt-auto" label="Reiniciar" outlined severity="danger"
        @click="reiniciarValores" />
    </div>
  </div>
  <div v-if="filter == 'RANGO DE FECHAS'" class="flex items-center justify-around px-10 mt-10  ">


    <div class="flex justify-between  ">

      <div class="flex  justify-center items-end  ">
        <div :class="` flex flex-col  items-start `">
          <p class="text-left  font-semibold">Fecha Inicio:</p>
          <DatePicker v-model="fechaInicioFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
            :showIcon="true" />
        </div>
        <!-- <Button @click="filtrarCorrectivosFecha" class="ml-2 w-full">Filtrar</Button> -->
      </div>


    </div>

    <div class="flex justify-between  ">

      <div class="flex  justify-center items-end  ">
        <div :class="` flex flex-col  items-start `">
          <p class="text-left  font-semibold">Fecha Fin:</p>
          <DatePicker v-model="fechaFinFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
            :showIcon="true" />
        </div>
        <Button @click="filtrarCorrectivosRangoFechas" class="ml-2 w-full">Filtrar por rango</Button>
      </div>
    </div>

    <Button icon="pi pi-refresh" class="mt-auto" label="Reiniciar" outlined severity="danger"
      @click="reiniciarValores" />
  </div>

  <div v-if="filter == 'REPUESTO'" class="flex justify-between mt-10  px-10">
    <div class="flex flex-col">
      <label class="legend  text-start font-semibold">Repuesto</label>
      <InputText v-model="repuestoMaterialFiltro" placeholder="Ingrese el repuesto o material" />
    </div>
    <!-- <Button @click="filtrarCorrectivosRepuesto" class="ml-2 w-full">Filtrar</Button> -->


    <div :class="` flex flex-col  items-start `">
      <p class="text-left  font-semibold">Fecha Inicio:</p>
      <DatePicker v-model="fechaInicioFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
        :showIcon="true" />
    </div>
    <!-- <Button @click="filtrarCorrectivosFecha" class="ml-2 w-full">Filtrar</Button> -->

    <div class="flex  justify-center items-end  ">
      <div :class="` flex flex-col  items-start `">
        <p class="text-left  font-semibold">Fecha Fin:</p>
        <DatePicker v-model="fechaFinFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
          :showIcon="true" />
      </div>
      <Button @click="filtrarCorrectivosRepuesto" class="ml-2 w-full">Filtrar</Button>
    </div>

    <Button icon="pi pi-refresh" class="mt-auto" label="Reiniciar" outlined severity="danger"
      @click="reiniciarValores" />
  </div>

  <div v-if="filter == 'SECTOR'" class="flex justify-between mt-10  px-10">
    <div class="flex flex-col">
      <label class="legend  text-start font-semibold">Sector</label>
      <InputText v-model="sectorFiltro" placeholder="Ingrese el sector" />
    </div>
    <!-- <Button @click="filtrarCorrectivosRepuesto" class="ml-2 w-full">Filtrar</Button> -->


    <div :class="` flex flex-col  items-start `">
      <p class="text-left  font-semibold">Fecha Inicio:</p>
      <DatePicker v-model="fechaInicioFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
        :showIcon="true" />
    </div>
    <!-- <Button @click="filtrarCorrectivosFecha" class="ml-2 w-full">Filtrar</Button> -->

    <div class="flex  justify-center items-end  ">
      <div :class="` flex flex-col  items-start `">
        <p class="text-left  font-semibold">Fecha Fin:</p>
        <DatePicker v-model="fechaFinFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
          :showIcon="true" />
      </div>
      <Button @click="filtrarCorrectivosSector" class="ml-2 w-full">Filtrar</Button>
    </div>

    <Button icon="pi pi-refresh" class="mt-auto" label="Reiniciar" outlined severity="danger"
      @click="reiniciarValores" />
  </div>


  <div v-if="filter == 'MARCA'" class="flex justify-between mt-10  px-10">
    <div class="flex flex-col">
      <label class="legend  text-start font-semibold">Marca</label>
      <InputText v-model="marcaFiltro" placeholder="Ingrese la marca" />
    </div>
    <!-- <Button @click="filtrarCorrectivosRepuesto" class="ml-2 w-full">Filtrar</Button> -->


    <div :class="` flex flex-col  items-start `">
      <p class="text-left  font-semibold">Fecha Inicio:</p>
      <DatePicker v-model="fechaInicioFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
        :showIcon="true" />
    </div>
    <!-- <Button @click="filtrarCorrectivosFecha" class="ml-2 w-full">Filtrar</Button> -->

    <div class="flex  justify-center items-end  ">
      <div :class="` flex flex-col  items-start `">
        <p class="text-left  font-semibold">Fecha Fin:</p>
        <DatePicker v-model="fechaFinFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
          :showIcon="true" />
      </div>
      <Button @click="filtrarCorrectivosMarca" class="ml-2 w-full">Filtrar</Button>
    </div>
    <Button icon="pi pi-refresh" class="mt-auto" label="Reiniciar" outlined severity="danger"
      @click="reiniciarValores" />
  </div>

  <div v-if="filter == 'MODELO'" class="flex justify-between mt-10  px-10">
    <div class="flex flex-col">
      <label class="legend  text-start font-semibold">Modelo</label>
      <InputText v-model="modeloFiltro" placeholder="Ingrese el modelo" />
    </div>
    <!-- <Button @click="filtrarCorrectivosRepuesto" class="ml-2 w-full">Filtrar</Button> -->


    <div :class="` flex flex-col  items-start `">
      <p class="text-left  font-semibold">Fecha Inicio:</p>
      <DatePicker v-model="fechaInicioFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
        :showIcon="true" />
    </div>
    <!-- <Button @click="filtrarCorrectivosFecha" class="ml-2 w-full">Filtrar</Button> -->


    <div class="flex  justify-center items-end  ">
      <div :class="` flex flex-col  items-start `">
        <p class="text-left  font-semibold">Fecha Fin:</p>
        <DatePicker v-model="fechaFinFiltro" class="w-64" aria-required="required" dateFormat="dd/mm/yy"
          :showIcon="true" />
      </div>
      <Button @click="filtrarCorrectivosModelo" class="ml-2 w-full">Filtrar</Button>
    </div>

    <Button icon="pi pi-refresh" class="mt-auto" label="Reiniciar" outlined severity="danger"
      @click="reiniciarValores" />
  </div>


  <div v-if="filter == 'PERMISO DE TRABAJO'" class="flex justify-between mt-10  px-10">
    <div class="flex  justify-center items-end mb-3 ">
      <div class="flex flex-col">
        <label class="legend  text-start font-semibold">Permiso de Trabajo</label>
        <InputText v-model="permisoTrabajoFiltro" placeholder="Ingrese el permiso de trabajo" />
      </div>
      <Button @click="filtrarCorrectivosPermisoTrabajo" class="ml-2 w-full">Filtrar</Button>
    </div>

    <Button icon="pi pi-refresh" class="my-auto" label="Reiniciar" outlined severity="danger"
      @click="reiniciarValores" />
  </div>

  <div v-if="filter == 'ORDEN DE TRABAJO'" class="flex justify-between mt-10  px-10">
    <div class="flex  justify-center items-end mb-3 ">
      <div class="flex flex-col">
        <label class="legend  text-start font-semibold">Orden de Trabajo</label>
        <InputText v-model="ordenTrabajoFiltro" placeholder="Ingrese orden de trabajo" />
      </div>
      <Button @click="filtrarCorrectivosOrdenTrabajo" class="ml-2 w-full">Filtrar</Button>
    </div>

    <Button icon="pi pi-refresh" class="my-auto" label="Reiniciar" outlined severity="danger"
      @click="reiniciarValores" />
  </div>




  <Form v-if="showForm" class="relative pb-10 border">
    <!-- {{ nivelSelecionado }} -->

    <h1 class="text-center text-3xl font-semibold mt-6 ">Registro de Correctivos</h1>
    <div class="absolute top-8 right-5 flex items-center ">
      <p class="legend mr-2  font-semibold">Fecha:</p>
      <DatePicker v-model="fechaActual" class="w-64" aria-required="required" dateFormat="dd/mm/yy" :showIcon="true" />
    </div>

    <!-- Contenedor Inputs Header -->
    <div class="mt-20 mb-5 border rounded-md  p-4 grid grid-cols-2 gap-y-2 gap-x-10 px-3 mx-3">

      <div class="flex justify-between items-center ">
        <label class="w-1/5  font-semibold ">Solicitante:</label>
        <InputText v-model="solicitante" readonly class="w-4/5 " />
      </div>

      <div class=" flex justify-between items-center ">
        <p class=" w-1/5  font-semibold ">Planta Intervenida:</p>

        <Select v-model="plantaSeleccionada" :options="plantas" optionLabel="nombre" placeholder="Seleccionar planta"
          class="w-4/5 " />
      </div>

      <div class="flex justify-between  items-center ">
        <label class=" w-1/5  font-semibold ">Sector Intervenido:</label>
        <InputText v-model="sector" class="w-4/5 " required />
      </div>


      <div class="flex justify-between items-center ">
        <label class=" w-1/5   font-semibold ">Sistemas Informados:</label>
        <InputText v-model="sistemasInformados" readonly class="w-4/5 " />
      </div>
    </div>
    <!-- Fin Contenedor Inputs Header -->

    <!-- Contenedor Inputs Body -->
    <div
      class="grid  md:grid-cols-2 xl:grid-cols-3 custom:grid-cols-3 gap-6 custom:gap-8 border rounded-md py-5  px-3 mx-3">

      <div class="flex justify-between items-center ">
        <label class=" w-2/5   font-semibold ">Tipo y N° de Permiso de trabajo:</label>
        <InputText v-model="permisoTrabajo" class="w-3/5 " />
      </div>

      <div class="flex justify-between items-center ">
        <label class=" w-2/5   font-semibold ">Repuesto / Material utilizado:</label>
        <InputText v-model="repuestoMaterial" class="w-3/5 " />
      </div>


      <div class="flex justify-between items-center ">
        <label class=" w-2/5   font-semibold ">Marca:</label>
        <InputText v-model="marca" class="w-3/5 " />
      </div>

      <div class="flex justify-between items-center ">
        <label class=" w-2/5   font-semibold ">Modelo:</label>
        <InputText v-model="modelo" class="w-3/5 " />
      </div>

      <div class="flex justify-between items-center ">
        <label class=" w-2/5   font-semibold ">Documento de Referencia:</label>
        <InputText v-model="documentoReferencia" class="w-3/5 " />
      </div>

      <div class="flex justify-between items-center ">
        <label class=" w-2/5   font-semibold ">Documento de Intervención:</label>
        <InputText v-model="documentoIntervencion" class="w-3/5 " />
      </div>

      <div class="flex justify-between items-center ">
        <p class="legend w-40  font-semibold">Fecha de Referencia:</p>
        <DatePicker v-model="fechaReferencia" class="w-3/5" dateFormat="dd/mm/yy" :showIcon="true" />
      </div>

      <div class="flex justify-between items-center ">
        <p class="legend w-40  font-semibold">Fecha de Intervención:</p>
        <DatePicker v-model="fechaIntervencion" :minDate="fechaReferencia" class="w-3/5" dateFormat="dd/mm/yy"
          :showIcon="true" />
      </div>

      <div class="flex justify-between items-center ">
        <p class="legend w-40  font-semibold">Días Transcurridos:</p>
        <InputText :value="diasTranscurridos" class="w-3/5" readonly />
      </div>

      <div class="flex justify-between items-center ">
        <p class="legend w-40  font-semibold">Orden de Trabajo Asignada:</p>
        <InputText v-model="ordenTrabajo" class="w-3/5" />
      </div>

      <div class=" flex justify-between items-center">
        <label class=" w-2/5   font-semibold ">Nivel de Criticidad:</label>
        <Select v-model="nivelSeleccionado" :options="nivelesCriticidad" optionLabel="nombre"
          placeholder="Seleccionar planta" class="w-3/5" @change="cambiarNivel" />
      </div>


      <div class="flex justify-between items-center ">
        <p class="legend w-40  font-semibold">Plazo Estimado de Ejecución:</p>
        <InputText :value="plazoEstimado" class="w-3/5 " readonly />
      </div>

      <div class="flex justify-between items-center ">
        <p class="legend w-40  font-semibold ">Plazo Cumplido:</p>
        <InputText :value="plazoCumplido" :class="`w-3/5`" :style="plazoCumplido ? {
          backgroundColor: plazoCumplido === 'Sí' || plazoCumplido === 'Si' || plazoCumplido === 'SI' ? '#22C55E' : '#EF4444',
          color: 'white',
          fontWeight: 'bold'
        } : {}" readonly />
      </div>


    </div>
    <div class="mt-10 flex items-center justify-end ">
      <Button label="Reiniciar" icon="pi pi-refresh" class="mr-2" severity="secondary" @click="reiniciarFormulario" />
      <Button label="Guardar" icon="pi pi-save" severity="success" class="" @click="guardarCorrectivos"
        :disabled="!formCompleto" />
      <Button v-if="showForm" type="button" label="Generar PDF" severity="danger" icon="pi pi-file-pdf"
        class=" mx-2 text-right " @click="generarPdf" :disabled="!formCompleto" />
    </div>

    <!-- <div class="space-y-1 w-full mt-5  px-3">
      <p class="font-semibold">Observaciones</p>
      <label for="observaciones" class="block text-sm font-medium text-2xl"></label>
      <Textarea v-model="observaciones" variant="filled" rows="4" cols="30" class="w-full bg-white"
        style="background-color: white;" />
    </div> -->
  </Form>

  <div class="card mt-20 px-10 pb-10">
    <DataTable showGridlines v-if="showDataTable" :value="dataCorrectivos" paginator :rows="3"
      tableStyle="min-width: 50rem" style="max-width: 90vw">

      <template #empty>
        <Message v-if="!loading" severity="error" variant="outlined">No se encontraron resultados </Message>
        <Message v-if="loading" severity="secondary" variant="outlined">Cargando... </Message>
      </template>

      <!-- <Column field="id" header="Id"></Column> -->
      <Column field="fecha" header="FECHA"></Column>
      <Column style="min-width: 9rem;" field="solicitante" header="SOLICITANTE"></Column>
      <Column field="planta" header="PLANTA INTERVENIDA"></Column>
      <Column field="sector" header="SECTOR INTERVENIDO"></Column>
      <Column style="min-width: 15rem;" field="sistemas" header="SISTEMAS INFORMADOS"></Column>
      <Column style="min-width: 9rem;" field="tipo_numero_permiso_trabajo" header="TIPO Y N° DE PERMISO DE TRABAJO">
      </Column>
      <Column style="min-width: 11rem;" field="repuesto_material" header="REPUESTO / MATERIAL"></Column>
      <Column style="min-width: 11rem;" field="marca" header="MARCA"></Column>
      <Column style="min-width: 11rem;" field="modelo" header="MODELO"></Column>
      <Column field="documento_intervencion" header="DOCUMENTO INTERVENCIÓN"></Column>
      <Column field="fecha_intervencion" header="FECHA INTERVENCIÓN"></Column>
      <Column field="fecha_referencia" header="FECHA REFERENCIA"></Column>
      <Column field="dias_transcurridos" header="DÍAS TRANSCURRIDOS"></Column>
      <Column style="min-width: 9rem;" field="orden_trabajo" header="ÓRDEN DE TRABAJO"></Column>
      <Column field="nivel_criticidad" header="NIVEL DE CRITICIDAD"></Column>
      <Column field="plazo_estimado" header="PLAZO ESTIMADO"></Column>
      <Column field="plazo_cumplido" header="PLAZO CUMPLIDO"></Column>
      <!-- <Column field="documento_referencia" header="DOCUMENTO REFERENCIA"></Column> -->
      <!-- <Column style="min-width: 25rem;" field="observaciones" header="OBSERVACIONES"></Column> -->
      <Column>
        <template #body="slotProps">
          <div class="flex ">
            <Button icon="pi pi-pencil" @click="abrirDialogEditar(slotProps.data)" />
            <Button class="ml-2" icon="pi pi-trash" severity="danger" @click="confirmarEliminacion(slotProps.data)" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>

  <!-- <div v-if="showForm" :class="`flex justify-end items-center p-4  `">
    <Button type="button" label="Generar PDF" icon="pi pi-plus" class="text-right" @click="generarPdf" />
  </div> -->
  <Toast />

  <div v-if="showDataTable" :class="`flex justify-end items-center p-4  `">

    <FileUpload mode="basic" name="file" chooseLabel="Importar Excel" accept=".xlsx,.xls" auto="true"
      @select="importarExcel" />
    <Button label="Exportar Excel" icon="pi pi-file-export" class="ml-2" severity="success" @click="exportarExcel" />
    <Button type="button" label="Generar PDF" severity="danger" icon="pi pi-file-pdf" class=" ml-2 text-right "
      @click="generarListadoPDF" />
  </div>

  <Dialog v-model:visible="showDialogEditar" :modal="true" :header="'Editar Correctivo'" class=""
    style="max-width: 97vw">
    <!-- {{correctivoEdicion}} -->
    <!-- {{diasTranscurridosEdicion}} -->
    <div class="grid grid-cols-5 gap-4">
      <!-- Fecha -->
      <div class="flex flex-col">
        <label for="fecha" class="font-semibold">Fecha</label>
        <DatePicker id="fecha" v-model="correctivoEdicion.fecha" class="flex-auto" dateFormat="dd/mm/yy"
          autocomplete="off" />
      </div>

      <!-- Tipo Número Permiso Trabajo -->
      <div class="flex flex-col">
        <label for="tipo_numero_permiso_trabajo" class="font-semibold">
          N° Permiso Trabajo
        </label>
        <InputText id="tipo_numero_permiso_trabajo" v-model="correctivoEdicion.tipo_numero_permiso_trabajo"
          class="flex-auto" autocomplete="off" />
      </div>

      <!-- Solicitante -->
      <div class="flex flex-col col-span-2">
        <label for="solicitante" class="font-semibold">Solicitante</label>
        <InputText id="solicitante" v-model="correctivoEdicion.solicitante" class="flex-auto" autocomplete="off" />
      </div>

      <!-- Planta -->
      <div class="flex flex-col ">
        <label for="planta" class="font-semibold">Planta</label>
        <InputText id="planta" v-model="correctivoEdicion.planta" class="flex-auto" autocomplete="off" />
      </div>

      <!-- Sector -->
      <div class="flex flex-col col-span-2">
        <label for="sector" class="font-semibold">Sector</label>
        <InputText id="sector" v-model="correctivoEdicion.sector" class="flex-auto" autocomplete="off" />
      </div>

      <!-- Sistemas -->
      <div class="flex flex-col col-span-3">
        <label for="sistemas" class="font-semibold">Sistemas</label>
        <InputText id="sistemas" v-model="correctivoEdicion.sistemas" class="flex-auto" autocomplete="off" />
      </div>



      <!-- Repuesto / Material -->
      <div class="flex flex-col col-span-2">
        <label for="repuesto_material" class="font-semibold">
          Repuesto / Material
        </label>
        <InputText id="repuesto_material" v-model="correctivoEdicion.repuesto_material" class="flex-auto"
          autocomplete="off" />
      </div>

      <!-- Marca -->
      <div class="flex flex-col">
        <label for="marca" class="font-semibold">Marca</label>
        <InputText id="marca" v-model="correctivoEdicion.marca" class="flex-auto" autocomplete="off" />
      </div>

      <!-- Modelo -->
      <div class="flex flex-col">
        <label for="modelo" class="font-semibold">Modelo</label>
        <InputText id="modelo" v-model="correctivoEdicion.modelo" class="flex-auto" autocomplete="off" />
      </div>

      <!-- Fecha Referencia -->
      <div class="flex flex-col">
        <label for="fecha_referencia" class="font-semibold">Fecha Referencia</label>
        <DatePicker id="fecha_referencia" v-model="correctivoEdicion.fecha_referencia" class="flex-auto"
          dateFormat="dd/mm/yy" autocomplete="off" />
      </div>


      <!-- Fecha Intervención -->
      <div class="flex flex-col">
        <label for="fecha_intervencion" class="font-semibold">
          Fecha Intervención
        </label>
        <DatePicker id="fecha_intervencion" v-model="correctivoEdicion.fecha_intervencion" class="flex-auto"
          dateFormat="dd/mm/yy" autocomplete="off" />
      </div>


      <!-- Días Transcurridos -->
      <div class="flex flex-col">
        <label for="dias_transcurridos" class="font-semibold">
          Días Transcurridos
        </label>
        <InputNumber readonly id="dias_transcurridos" v-model="correctivoEdicion.dias_transcurridos"
          class="flex-auto" />
      </div>

      <!-- Nivel Criticidad -->
      <div class="flex flex-col">
        <label for="nivel_criticidad" class="font-semibold">
          Nivel Criticidad
        </label>
        <Select v-model="correctivoEdicion.nivel_criticidad" :options="nivelesCriticidad" optionLabel="nombre"
          placeholder="Seleccionar planta" @change="cambiarNivel" />
      </div>

      <!-- Plazo Estimado -->
      <div class="flex flex-col">
        <label for="plazo_estimado" class="font-semibold">
          Plazo Estimado (días)
        </label>
        <InputNumber readonly id="plazo_estimado" v-model="correctivoEdicion.plazo_estimado" class="flex-auto" />
      </div>

      <!-- Plazo Cumplido -->
      <div class="flex flex-col">
        <label for="plazo_cumplido" class="font-semibold">
          Plazo Cumplido
        </label>
        <InputText id="plazo_cumplido" v-model="correctivoEdicion.plazo_cumplido" class="flex-auto" autocomplete="off"
          :style="correctivoEdicion.plazo_cumplido ? {
            backgroundColor:
              correctivoEdicion.dias_transcurridos >= 0 &&
                ['sí', 'si', 'SI', 'Si'].includes(correctivoEdicion.plazo_cumplido.toLowerCase())
                ? '#22C55E' : '#EF4444',
            color: 'white',
            fontWeight: 'bold'
          } : {}" readonly />
      </div>

      <!-- Observaciones -->
      <!-- <div class="flex flex-col col-span-4">
        <label for="observaciones" class="font-semibold">Observaciones</label>
        <InputTextarea id="observaciones" v-model="correctivoEdicion.observaciones" class="flex-auto" rows="3" />
      </div> -->


      <!-- Documento Referencia -->
      <!-- <div class="flex flex-col col-span-2 ">
        <label for="documento_referencia" class="font-semibold">
          Documento Referencia
        </label>
        <InputText id="documento_referencia" v-model="correctivoEdicion.documento_referencia" class="flex-auto"
          autocomplete="off" />
      </div> -->

      <!-- Documento Intervención -->
      <div class="flex flex-col col-span-2 ">
        <label for="documento_intervencion" class="font-semibold">
          Documento Intervención
        </label>
        <InputText id="documento_intervencion" v-model="correctivoEdicion.documento_intervencion" class="flex-auto"
          autocomplete="off" />
      </div>
      <!-- Orden de Trabajo -->
      <div class="flex flex-col col-span-2 ">
        <label for="orden_trabajo" class="font-semibold">
          Orden de Trabajo
        </label>
        <InputText id="orden_trabajo" v-model="correctivoEdicion.orden_trabajo" class="flex-auto" autocomplete="off" />
      </div>
    </div>




    <div class="mt-10">
      <Button label="Guardar" icon="pi pi-save" class="min-w-[170px] max-w-[250px]" severity="success"
        @click="actualizarCorrectivo" />
    </div>
  </Dialog>

  <ConfirmDialog></ConfirmDialog>

</template>
<script>
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import DatePicker from 'primevue/datepicker';
import FileUpload from 'primevue/fileupload';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import logo from '../../resources/pdflogo.png';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx-js-style";
import Message from 'primevue/message';
import { toRaw, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { compararUltimoRegistro } from '../utils/utils.js'
import { formatFechaToYYYYMMDD, formatFechaDDMMYYYY, validarFormatoFecha } from '../utils/funcionesFecha.js'

import { computed, defineComponent, onMounted, ref } from 'vue';
import Dialog from 'primevue/dialog';
import { useConfirm } from 'primevue/useconfirm';
import ConfirmDialog from 'primevue/confirmdialog';

export default defineComponent({
  name: 'RegistroCorrectivos',
  components: {
    DatePicker,
    InputText,
    InputNumber,
    Select,
    FileUpload,
    Toast,
    Textarea,
    Button,
    DataTable,
    Column,
    Message,
    Dialog,
    ConfirmDialog
  },

  setup() {

    const toast = useToast();
    const confirm = useConfirm();
    const showForm = ref(false);

    const plantas = ref([{ nombre: "C.I.L.E Lubricantes" }, { nombre: "C.I.L.E Asfaltos" }])
    const plantaSeleccionada = ref(null)
    const sector = ref('');
    const sectorFiltro = ref('');
    const fechaActual = ref(null);
    const fechaReferencia = ref(null);
    const solicitante = ref('Inspección Mantenimiento C.I.L.E - Y.P.F')
    const sistemasInformados = ref('Sistemas de Alarmas - Detección de Gases - Fuego y Extinción')
    const permisoTrabajo = ref('');
    const permisoTrabajoFiltro = ref('');
    const repuestoMaterial = ref('');
    const repuestoMaterialFiltro = ref('');
    const marca = ref('');
    const marcaFiltro = ref('');
    const modelo = ref('');
    const modeloFiltro = ref('');
    const documentoIntervencion = ref('');
    const fechaIntervencion = ref(null);
    const maxFechaIntervencion = ref(null);
    const ordenTrabajo = ref(null);
    const ordenTrabajoFiltro = ref(null);
    const nivelesCriticidad = ref([{ nombre: "Bajo" }, { nombre: "Medio" }, { nombre: "Alto" }]);
    const nivelSeleccionado = ref(null);
    const observaciones = ref(null);
    const fileupload = ref();
    const dataCorrectivos = ref(null);
    const documentoReferencia = ref(null);
    // const noFile = ref(false);
    const filter = ref(null);
    const tipoFiltradoPdf = ref('');
    const showFilters = ref(false);
    const fechaFiltro = ref(null);
    const fechaInicioFiltro = ref(null);
    const fechaFinFiltro = ref(null);
    const loading = ref(false);
    const showDataTable = ref(true);
    const registroGuardado = ref(false);
    const ultimoRegistroGuardado = ref(null);
    const showDialogEditar = ref(false);

    const correctivoEdicion = ref({
      id: "",
      fecha: "",
      solicitante: "",
      planta: "",
      sector: "",
      sistemas: "",
      tipo_numero_permiso_trabajo: "",
      repuesto_material: "",
      marca: "",
      modelo: "",
      fecha_intervencion: "",
      dias_transcurridos: "",
      nivel_criticidad: "",
      plazo_estimado: "",
      plazo_cumplido: "",
      observaciones: "",
      created_at: "",
      documento_referencia: "",
      fecha_referencia: "",
      orden_trabajo: "",
      documento_intervencion: ""
    });


    const formCompleto = computed(() => {
      return (
        fechaActual.value &&
        solicitante.value &&
        plantaSeleccionada.value &&
        sector.value &&
        sistemasInformados.value &&
        permisoTrabajo.value &&
        repuestoMaterial.value &&
        marca.value &&
        modelo.value &&
        documentoReferencia.value &&
        documentoIntervencion.value &&
        fechaReferencia.value &&
        fechaIntervencion.value &&
        (diasTranscurridos.value !== undefined && diasTranscurridos.value !== null) &&
        ordenTrabajo.value &&
        nivelSeleccionado.value &&
        plazoEstimado.value &&
        plazoCumplido.value


      );
    })

    const abrirDialogEditar = (correctivo) => {

      correctivoEdicion.value = { ...correctivo, nivel_criticidad: { nombre: correctivo.nivel_criticidad } };

      showDialogEditar.value = true;
    }

    const handleForm = () => {
      showForm.value = true;
      showDataTable.value = false;

      if (showFilters.value) {
        showFilters.value = false;
      }
      if (filter.value) {
        filter.value = null;
      }
    }

    const handleInicio = () => {
      showFilters.value = false;
      showForm.value = false;
      showDataTable.value = true;
      filter.value = null;
      obtenerCorrectivos()
    }


    const handleFilters = () => {
      showFilters.value = true;
      showForm.value = false;
      showDataTable.value = true;
    }
    const handleFilter = (nombreFiltro) => {
      filter.value = nombreFiltro;
      tipoFiltradoPdf.value = nombreFiltro;
      fechaInicioFiltro.value = null;
      fechaFinFiltro.value = null;
    }


    const upload = () => {
      fileupload.value.upload();
    };



    const onUpload = () => {
      toast.add({ severity: 'info', summary: 'Success', detail: 'Archivo cargado', life: 3000 });
    };
    // Lista para almacenar los archivos seleccionados
    const selectedFiles = ref([]);





    watch([() => correctivoEdicion.value.fecha_referencia, () => correctivoEdicion.value.fecha_intervencion], () => {
      const parseFecha = (fecha) => {
        if (typeof fecha === 'string' && fecha.includes('/')) {
          // Convertir de DD/MM/AAAA a Date en UTC
          const [dia, mes, año] = fecha.split('/').map(num => parseInt(num, 10));
          return new Date(Date.UTC(año, mes - 1, dia)); // Usamos Date.UTC para evitar problemas de zona horaria
        } else if (fecha instanceof Date) {
          // Asegurar que sea una fecha en UTC sin modificar la zona horaria
          return new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate()));
        }
        return null;
      };

      // Normalizar las fechas
      const fechaReferencia = parseFecha(correctivoEdicion.value.fecha_referencia);
      const fechaIntervencion = parseFecha(correctivoEdicion.value.fecha_intervencion);



      if (fechaReferencia && fechaIntervencion) {
        // Calcular diferencia en días asegurando precisión sin huso horario
        const diffTime = fechaIntervencion.getTime() - fechaReferencia.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); // Convertir de milisegundos a días
        correctivoEdicion.value.dias_transcurridos = diffDays;

        // Verificar la condición y asignar "Si" o "No" a plazo_cumplido
        if (diffDays >= 0 && diffDays <= correctivoEdicion.value.plazo_estimado) {
          correctivoEdicion.value.plazo_cumplido = "Si";
        } else {
          correctivoEdicion.value.plazo_cumplido = "No";
        }

      } else {
        correctivoEdicion.value.dias_transcurridos = null; // Si alguna fecha no es válida, asignar null
      }
    });


    // Watch para asignar automáticamente el plazo estimado según el nivel de criticidad
    watch(() => correctivoEdicion.value.nivel_criticidad, (nuevoValor) => {
      // const nivel = nivelesCriticidad.value.find(n => n.nombre === nuevoValor.nombre);
      // correctivoEdicion.value.plazo_estimado = nivel ? nivel.plazo : "";
      switch (nuevoValor.nombre) {
        case 'Bajo':
          correctivoEdicion.value.plazo_estimado = '180';
          break;
        case 'Medio':
          correctivoEdicion.value.plazo_estimado = '90';
          break;
        case 'Alto':
          correctivoEdicion.value.plazo_estimado = '30';
          break;
      }


    });

    // // Watch para determinar si el plazo se ha cumplido
    // watch([() => correctivoEdicion.value.dias_transcurridos, () => correctivoEdicion.value.plazo_estimado], () => {
    //   if (correctivoEdicion.value.dias_transcurridos !== "" && correctivoEdicion.value.plazo_estimado !== "") {
    //     correctivoEdicion.value.plazo_cumplido = correctivoEdicion.value.dias_transcurridos <= correctivoEdicion.value.plazo_estimado ? "SI" : "NO";
    //   }
    // });


    // Propiedad computada para calcular la diferencia de días
    const diasTranscurridos = computed(() => {
      if (!fechaReferencia.value || !fechaIntervencion.value) {
        return ""; // Mensaje si falta alguna fecha
      }

      // Convertir fechas a medianoche para evitar errores por hora
      const fechaReferenciaTime = new Date(
        fechaReferencia.value.getFullYear(),
        fechaReferencia.value.getMonth(),
        fechaReferencia.value.getDate()
      ).getTime();

      const intervencionTime = new Date(
        fechaIntervencion.value.getFullYear(),
        fechaIntervencion.value.getMonth(),
        fechaIntervencion.value.getDate()
      ).getTime();

      // Calcular la diferencia en milisegundos y convertir a días
      const diferenciaMs = intervencionTime - fechaReferenciaTime; // No hace falta usar Math.abs para diferencia futura

      // if (diferenciaMs < 0) return "Intervención después";

      const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
      return dias;
    });

    const plazoEstimado = computed(() => {
      if (!nivelSeleccionado.value) {
        return ''
      } else {
        switch (nivelSeleccionado.value.nombre) {
          case 'Bajo':
            return '180';
          case 'Medio':
            return '90';
          case 'Alto':
            return '30';
          default:
            return ''
        }
      }
    })

    const plazoCumplido = computed(() => {
      if (!nivelSeleccionado.value || !fechaReferencia.value || !fechaIntervencion.value) {
        return ''
      } else {

        if (plazoEstimado.value && diasTranscurridos.value >= 0) {

          return diasTranscurridos.value > plazoEstimado.value ? 'No' : 'Si';

        }

      }
    })


    const reiniciarFormulario = () => {
      repuestoMaterial.value = null;
      plantaSeleccionada.value = null;
      sector.value = null;
      permisoTrabajo.value = null;
      marca.value = null;
      modelo.value = null;
      documentoIntervencion.value = null;
      fechaReferencia.value = null;
      fechaIntervencion.value = null;
      diasTranscurridos.value = null;
      ordenTrabajo.value = null;
      nivelSeleccionado.value = null;
      plazoEstimado.value = null;
      plazoCumplido.value = null;
      documentoReferencia.value = null;
      observaciones.value = null;

    }

    const reiniciarValores = async () => {

      try {
        const response = await window.electronAPI.obtenerCorrectivos();
        if (response.success) {
          dataCorrectivos.value = response.data;

          fechaFiltro.value = null;
          fechaInicioFiltro.value = null;
          fechaFinFiltro.value = null;
          repuestoMaterialFiltro.value = null;
          sectorFiltro.value = null;
          marcaFiltro.value = null;
          modeloFiltro.value = null;
          permisoTrabajoFiltro.value = null;
          ordenTrabajoFiltro.value = null;

          toast.add({ severity: "success", summary: "Éxito", detail: "Datos reiniciados correctamente.", life: 3000 });

        } else {
          throw new Error('error al obtener los datos')
        }
      } catch (error) {
        console.log(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al reiniciar los datos, intente nuevamente', life: 3000 });

      }
    }


    const guardarCorrectivos = async () => {

      const datosFormulario = {
        fecha: fechaActual.value ? new Date(fechaActual.value).toISOString().split('T')[0] : null,
        solicitante: solicitante.value,
        planta: plantaSeleccionada.value ? plantaSeleccionada.value.nombre : null,
        sector: sector.value,
        sistemas: sistemasInformados.value,
        tipo_numero_permiso_trabajo: permisoTrabajo.value,
        repuesto_material: repuestoMaterial.value,
        marca: marca.value,
        modelo: modelo.value,
        documento_intervencion: documentoIntervencion.value,
        fecha_referencia: fechaReferencia.value ? new Date(fechaReferencia.value).toISOString().split('T')[0] : null,
        fecha_intervencion: new Date(fechaIntervencion.value).toISOString().split('T')[0],
        dias_transcurridos: diasTranscurridos.value,
        orden_trabajo: ordenTrabajo.value,
        nivel_criticidad: nivelSeleccionado.value ? nivelSeleccionado.value.nombre : null,
        plazo_estimado: plazoEstimado.value,
        plazo_cumplido: plazoCumplido.value,
        documento_referencia: documentoReferencia.value,
        observaciones: observaciones.value
      };

      for (const [campo, valor] of Object.entries(datosFormulario)) {
        if ((valor === undefined || valor === null || valor === "") && campo !== 'observaciones') { // Excluir "observaciones" de la validación
          toast.add({ severity: 'error', summary: 'Error', detail: `Por favor complete todos los campos, donde campo: ${campo} y valor : ${valor}`, life: 3000 });
          return;
        }
      }

      if (ultimoRegistroGuardado.value) {

        const registroRegistrado = compararUltimoRegistro(datosFormulario, toRaw(ultimoRegistroGuardado.value));

        if (registroRegistrado) {
          toast.add({ severity: 'error', summary: 'Atención', detail: 'Acabas de guardar un registro con los mismos datos', life: 3000 });
          return;
        }
      }

      try {

        const response = await window.electronAPI.guardarCorrectivos(datosFormulario);

        if (response.success) {

          dataCorrectivos.value.push(response.data);
          registroGuardado.value = true;
          ultimoRegistroGuardado.value = response.data;
          toast.add({ severity: 'success', summary: 'Éxito', detail: 'Datos guardados correctamente', life: 3000 });
        } else {
          throw new Error()
        }
      } catch (error) {
        console.log(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al enviar los datos, intente nuevamente', life: 3000 });

      }

    }


    const obtenerCorrectivos = async () => {

      loading.value = true;
      try {
        const response = await window.electronAPI.obtenerCorrectivos();
        if (response.success) {

          dataCorrectivos.value = response.data;

        } else {
          throw new Error();
        }

      } catch (error) {
        console.log(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los datos, intente nuevamente', life: 3000 });
      } finally {
        loading.value = false;
      }
    }



    const eliminarCorrectivo = async (correctivoId) => {

      try {
        const response = await window.electronAPI.eliminarCorrectivo(correctivoId);
        if (response.success) {
          return { success: true, error: response.error }
        }
      } catch (error) {
        return { success: false, error: response.error }
      }
    }

    const confirmarEliminacion = (correctivo) => {

      const { id } = correctivo;

      confirm.require({
        message: `¿Estás seguro de eliminar este correctivo?`,
        header: 'Atención',
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
        accept: async () => {

          const eliminacion = await eliminarCorrectivo(id);

          if (eliminacion.success) {
            const indexCorrectivo = dataCorrectivos.value.findIndex(c => c.id === id);

            if (indexCorrectivo !== -1) {

              dataCorrectivos.value.splice(indexCorrectivo, 1);
              // dataCorrectivos.value = dataCorrectivos.value.filter(informe => informe.id !== id);
            }

            toast.add({ severity: 'info', summary: 'Éxito', detail: `Correctivo eliminado`, life: 5000 });
          } else {

            // if (eliminacion.error == 'No se encontró el informe') {
            //   toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontró el correctivo, error al eliminarlo, intente nuevamente', life: 3000 });
            // }

            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el correctivo, intente nuevamente', life: 3000 });

          }

        },
        reject: () => {
          // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
      });

    }


    const actualizarCorrectivo = async () => {

      try {

        const correctivoActualizado = {
          ...correctivoEdicion.value,
          nivel_criticidad: correctivoEdicion.value.nivel_criticidad.nombre,
          fecha: formatFechaToYYYYMMDD(correctivoEdicion.value.fecha),
          fecha_intervencion: formatFechaToYYYYMMDD(correctivoEdicion.value.fecha_intervencion),
          fecha_referencia: formatFechaToYYYYMMDD(correctivoEdicion.value.fecha_referencia),
        }

        if (new Date(correctivoActualizado.fecha_intervencion) < new Date(correctivoActualizado.fecha_referencia)) {
          toast.add({ severity: 'error', summary: 'Error', detail: 'La fecha de intervención no puede ser menor a la fecha de referencia', life: 5000 });
          return;
        }


        const response = await window.electronAPI.actualizarCorrectivo(correctivoActualizado);

        if (response.success) {

          const indexCorrectivoActualizar = dataCorrectivos.value.findIndex(c => c.id === correctivoActualizado.id);
          if (indexCorrectivoActualizar !== -1) {

            dataCorrectivos.value[indexCorrectivoActualizar] = {
              ...dataCorrectivos.value[indexCorrectivoActualizar],
              ...correctivoActualizado,
              fecha: formatFechaDDMMYYYY(correctivoActualizado.fecha),
              fecha_referencia: formatFechaDDMMYYYY(correctivoActualizado.fecha_referencia),
              fecha_intervencion: formatFechaDDMMYYYY(correctivoActualizado.fecha_intervencion),
            };



            showDialogEditar.value = false;

          }

          toast.add({ severity: 'success', summary: 'Éxito', detail: 'Correctivo actualizado correctamente', life: 3000 });
        }
      } catch (error) {
        console.error(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar los datos, intente nuevamente', life: 3000 });
      }
    }


    const filtrarCorrectivosFecha = async () => {

      if (!fechaFiltro.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor ingresa una fecha.', life: 3000 });
        return;
      }

      try {
        const formatoFecha = new Date(fechaFiltro.value).toISOString().split('T')[0]; //A formato YYYY/MM/AA
        const response = await window.electronAPI.filtrarCorrectivosFecha(formatoFecha);

        if (response.success) {
          dataCorrectivos.value = response.data;

          if (response.data.length < 1) {
            toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'No se encontraron resultados.', life: 4000 });
            return;
          }

          toast.add({ severity: "success", summary: "Éxito", detail: "Datos filtrados correctamente.", life: 3000 });

        }
      } catch (error) {
        console.log(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al filtrar los datos, intente nuevamente', life: 3000 });
      }
    }

    const filtrarCorrectivosRangoFechas = async () => {

      if (!fechaInicioFiltro.value || !fechaFinFiltro.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor selecciona las fechas de inicio y/o de fin', life: 3000 });
        return;
      }

      try {
        // Convertir las fechas al formato YYYY-MM-DD
        const formatoFechaInicio = new Date(fechaInicioFiltro.value).toISOString().split('T')[0];
        const formatoFechaFin = new Date(fechaFinFiltro.value).toISOString().split('T')[0];

        const response = await window.electronAPI.filtrarCorrectivosRangoFechas(formatoFechaInicio, formatoFechaFin);

        if (response.success) {
          dataCorrectivos.value = response.data;

          if (response.data.length < 1) {
            toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'No se encontraron resultados.', life: 4000 });
            return;
          }

          toast.add({ severity: "success", summary: "Éxito", detail: "Datos filtrados correctamente.", life: 3000 });


        } else {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se encontraron datos para el rango de fechas seleccionado',
            life: 3000
          });
        }
      } catch (error) {
        console.error(error);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al filtrar los datos, intente nuevamente',
          life: 3000
        });
      }
    };

    const filtrarCorrectivosRepuesto = async () => {

      if (!fechaInicioFiltro.value || !fechaFinFiltro.value) {

        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor selecciona las fechas de inicio y/o de fin', life: 3000 });
        return;
      }
      if (!repuestoMaterialFiltro.value) {

        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor selecciona un repuesto', life: 3000 });
        return;
      }

      try {
        const formatoFechaInicio = new Date(fechaInicioFiltro.value).toISOString().split('T')[0]; // A formato YYYY-MM-DD
        const formatoFechaFin = new Date(fechaFinFiltro.value).toISOString().split('T')[0];       // A formato YYYY-MM-DD

        const response = await window.electronAPI.filtrarCorrectivosRepuesto(
          repuestoMaterialFiltro.value,
          formatoFechaInicio,
          formatoFechaFin
        );

        if (response.success) {
          dataCorrectivos.value = response.data;

          if (response.data.length < 1) {
            toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'No se encontraron resultados.', life: 4000 });
            return;
          }

          toast.add({ severity: "success", summary: "Éxito", detail: "Datos filtrados correctamente.", life: 3000 });


        } else {
          toast.add({
            severity: 'info',
            summary: 'Sin resultados',
            detail: 'No se encontraron registros con los filtros especificados',
            life: 3000
          });
        }
      } catch (error) {
        console.error(error);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al filtrar los datos, intente nuevamente',
          life: 3000
        });
      }
    };

    const filtrarCorrectivosSector = async () => {

      if (!fechaInicioFiltro.value || !fechaFinFiltro.value) {

        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor selecciona las fechas de inicio y/o de fin', life: 3000 });
        return;
      }
      if (!sectorFiltro.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor selecciona un sector.', life: 3000 });
        return;
      }

      try {
        const formatoFechaInicio = new Date(fechaInicioFiltro.value).toISOString().split('T')[0]; // A formato YYYY-MM-DD
        const formatoFechaFin = new Date(fechaFinFiltro.value).toISOString().split('T')[0];       // A formato YYYY-MM-DD

        const response = await window.electronAPI.filtrarCorrectivosSector(
          sectorFiltro.value,
          formatoFechaInicio,
          formatoFechaFin
        );
        if (response.success) {
          dataCorrectivos.value = response.data;

          if (response.data.length < 1) {
            toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'No se encontraron resultados.', life: 4000 });
            return;
          }

          toast.add({ severity: "success", summary: "Éxito", detail: "Datos filtrados correctamente.", life: 3000 });

        } else {
          toast.add({
            severity: 'info',
            summary: 'Sin resultados',
            detail: 'No se encontraron registros con los filtros especificados',
            life: 3000
          });
        }
      } catch (error) {
        console.error(error);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al filtrar los datos, intente nuevamente',
          life: 3000
        });
      }
    };


    const filtrarCorrectivosMarca = async () => {

      if (!fechaInicioFiltro.value || !fechaFinFiltro.value) {

        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor selecciona las fechas de inicio y/o de fin', life: 3000 });
        return;
      }
      if (!marcaFiltro.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor selecciona una marca.', life: 3000 });
        return;
      }

      try {
        const formatoFechaInicio = new Date(fechaInicioFiltro.value).toISOString().split('T')[0]; // A formato YYYY-MM-DD
        const formatoFechaFin = new Date(fechaFinFiltro.value).toISOString().split('T')[0];       // A formato YYYY-MM-DD

        const response = await window.electronAPI.filtrarCorrectivosMarca(
          marcaFiltro.value,
          formatoFechaInicio,
          formatoFechaFin
        );

        if (response.success) {

          dataCorrectivos.value = response.data;

          if (response.data.length < 1) {
            toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'No se encontraron resultados.', life: 4000 });
            return;
          }

          toast.add({ severity: "success", summary: "Éxito", detail: "Datos filtrados correctamente.", life: 3000 });

        } else {
          toast.add({ severity: 'info', summary: 'Sin resultados', detail: 'No se encontraron registros con los filtros especificados', life: 3000 });
        }
      } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al filtrar los datos, intente nuevamente', life: 3000 });
      }
    };

    const filtrarCorrectivosModelo = async () => {

      if (!fechaInicioFiltro.value || !fechaFinFiltro.value) {

        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor selecciona las fechas de inicio y/o de fin', life: 3000 });
        return;
      }
      if (!modeloFiltro.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor selecciona un modelo.', life: 3000 });
        return;
      }

      try {
        const formatoFechaInicio = new Date(fechaInicioFiltro.value).toISOString().split('T')[0]; // A formato YYYY-MM-DD
        const formatoFechaFin = new Date(fechaFinFiltro.value).toISOString().split('T')[0];       // A formato YYYY-MM-DD

        const response = await window.electronAPI.filtrarCorrectivosModelo(
          modeloFiltro.value,
          formatoFechaInicio,
          formatoFechaFin
        );

        if (response.success) {

          dataCorrectivos.value = response.data;

          if (response.data.length < 1) {
            toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'No se encontraron resultados.', life: 4000 });
            return;
          }

          toast.add({ severity: "success", summary: "Éxito", detail: "Datos filtrados correctamente.", life: 3000 });


        } else {
          toast.add({ severity: 'info', summary: 'Sin resultados', detail: 'No se encontraron registros con los filtros especificados', life: 3000 });
        }
      } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al filtrar los datos, intente nuevamente', life: 3000 });
      }
    };
    const filtrarCorrectivosPermisoTrabajo = async () => {

      if (!permisoTrabajoFiltro.value) {
        toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'Por favor ingrese un permiso de trabajo.', life: 4000 });
        return;
      }

      try {
        const response = await window.electronAPI.filtrarCorrectivosPermisoTrabajo(permisoTrabajoFiltro.value);

        if (response.success) {
          dataCorrectivos.value = response.data;

          if (response.data.length < 1) {
            toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'No se encontraron resultados.', life: 4000 });
            return;
          }

          toast.add({ severity: "success", summary: "Éxito", detail: "Datos filtrados correctamente.", life: 3000 });


        }
      } catch (error) {
        console.log(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al filtrar los datos, intente nuevamente', life: 3000 });
      }
    }
    const filtrarCorrectivosOrdenTrabajo = async () => {

      if (!ordenTrabajoFiltro.value) {
        toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'Por favor ingrese una orden de trabajo.', life: 4000 });
        return;
      }

      try {
        const response = await window.electronAPI.filtrarCorrectivosOrdenTrabajo(ordenTrabajoFiltro.value);

        if (response.success) {


          dataCorrectivos.value = response.data;

          if (response.data.length < 1) {
            toast.add({ severity: 'error', summary: 'Sin Resultados', detail: 'No se encontraron resultados.', life: 4000 });
            return;
          }

          toast.add({ severity: "success", summary: "Éxito", detail: "Datos filtrados correctamente.", life: 3000 });


        }
      } catch (error) {
        console.log(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al filtrar los datos, intente nuevamente', life: 3000 });
      }
    }
    const formatearFecha = (fecha) => {

      const fechaDate = new Date(fecha);
      const dia = String(fechaDate.getDate()).padStart(2, '0');
      const mes = String(fechaDate.getMonth() + 1).padStart(2, '0');
      const año = fechaDate.getFullYear();

      const fechaFormateada = `${dia}/${mes}/${año}`;
      return fechaFormateada;
    }

    // Función para formatear las fechas a DD/MM/YYYY
    const formatFechaExcel = (fecha) => {
      const dateParts = fecha.split("-");
      if (dateParts.length === 3) {
        // Suponiendo que la fecha viene como DD-MM-YYYY
        return `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
      }
      return fecha; // Si no se puede formatear, devolver la fecha tal cual
    };



    const exportarExcel = () => {
      // Mapear los datos al formato requerido
      const formattedData = dataCorrectivos.value.map((item) => ({
        FECHA: item.fecha ? formatFechaExcel(item.fecha) : "-",
        "ÁREA SOLICITANTE": item.solicitante || "-",
        "PLANTA INTERVENIDA": item.planta || "-",
        "SECTOR INTERVENIDO": item.sector || "-",
        "SISTEMAS INFORMADOS": item.sistemas || "-",
        "TIPO Y N° PERMISO TRABAJO": item.tipo_numero_permiso_trabajo || "-",
        "ÓRDEN DE TRABAJO": item.orden_trabajo !== null && item.orden_trabajo !== undefined && item.orden_trabajo !== '' ? item.orden_trabajo : "-",
        "REPUESTO / MATERIAL UTILIZADO": item.repuesto_material || "-",
        MARCA: item.marca || "-",
        MODELO: item.modelo || "-",
        "DOCUMENTO INTERVENCIÓN": item.documento_intervencion || "-",
        "FECHA INTERVENCIÓN": item.fecha_intervencion ? formatFechaExcel(item.fecha_intervencion) : "-",
        "DÍAS TRANSCURRIDOS": item.dias_transcurridos !== null && item.dias_transcurridos !== undefined && item.dias_transcurridos !== '' ? item.dias_transcurridos : "-",
        "NIVEL CRITICIDAD": item.nivel_criticidad || "-",
        "PLAZO ESTIMADO DE EJECUCIÓN": item.plazo_estimado || "-",
        "PLAZO CUMPLIDO": item.plazo_cumplido || "-",
        // OBSERVACIONES: item.observaciones || "-",
        // "DOCUMENTO REFERENCIA": item.documento_referencia || "-",
        "FECHA REFERENCIA": item.fecha_referencia ? formatFechaExcel(item.fecha_referencia) : "-",
      }));

      // Crear una hoja de trabajo (worksheet)
      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      // Estilo para el encabezado
      const headerStyle = {
        fill: {
          patternType: "solid",
          fgColor: { rgb: "FF4F81BD" }, // Fondo azul correcto
        },
        font: {
          bold: true,
          color: { rgb: "FFFFFFFF" }, // Texto blanco
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      };

      // Estilo para las celdas de datos (centrado vertical y horizontal)
      const dataStyle = {
        alignment: {
          horizontal: "center", // Centrado horizontal
          vertical: "center",   // Centrado vertical
        },
      };

      // Aplicar estilos a los encabezados
      const headers = Object.keys(formattedData[0]);
      headers.forEach((header, index) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
        if (!worksheet[cellAddress]) return;
        worksheet[cellAddress].s = headerStyle;
      });

      // Aplicar estilo a las celdas de datos
      formattedData.forEach((_, rowIndex) => {
        headers.forEach((_, colIndex) => {
          const cellAddress = XLSX.utils.encode_cell({ r: rowIndex + 1, c: colIndex }); // Las filas empiezan desde 1
          if (!worksheet[cellAddress]) return;
          worksheet[cellAddress].s = dataStyle;
        });
      });

      // Definir el ancho de las columnas
      worksheet["!cols"] = [
        { wch: 12 }, // FECHA
        { wch: 39 }, // ÁREA SOLICITANTE
        { wch: 18 }, // PLANTA
        { wch: 52 }, // SECTOR
        { wch: 59 }, // SISTEMAS
        { wch: 40 }, // TIPO Y N° PERMISO
        { wch: 50 }, // ÓRDEN DE TRABAJO
        { wch: 74 }, // REPUESTO / MATERIAL UTILIZADO
        { wch: 15 }, // MARCA
        { wch: 15 }, // MODELO
        { wch: 30 }, // DOCUMENTO INTERVENCIÓN
        { wch: 22 }, // FECHA INTERVENCIÓN
        { wch: 22 }, // DÍAS TRANSCURRIDOS
        { wch: 20 }, // NIVEL CRITICIDAD
        { wch: 40 }, // PLAZO ESTIMADO
        { wch: 17 }, // PLAZO CUMPLIDO
        // { wch: 130 }, // OBSERVACIONES
        // { wch: 30 }, // DOCUMENTO REFERENCIA
        { wch: 20 }, // FECHA REFERENCIA
      ];

      // Crear un libro de trabajo (workbook)
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Correctivos");

      // Exportar el archivo Excel
      XLSX.writeFile(workbook, "InformeCorrectivos.xlsx");
    };



    const importarExcel = async (event) => {
      const file = event.files[0]; // Obtener el archivo seleccionado
      if (!file) return;

      const reader = new FileReader();

      reader.onload = async (e) => {

        const data = new Uint8Array(e.target.result); // Leer los datos binarios
        // Se activa cellDates para que las celdas con fechas se conviertan a objetos Date
        const workbook = XLSX.read(data, { type: "array", cellDates: true }); // Procesar el archivo Excel

        // Leer la primera hoja del archivo
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Usamos raw: true para que las celdas con fechas se mantengan como objetos Date y no se formateen automáticamente
        const jsonData = XLSX.utils.sheet_to_json(sheet, { raw: true });

        // Obtener las columnas desde la primera fila
        const primeraFila = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] || [];

        // Normalizar las columnas a minúsculas para comparación
        const primeraFilaNormalizada = primeraFila.map(col => col.toLowerCase());

        const columnasRequeridas = ["Fecha",
          "Área Solicitante",
          "Planta Intervenida",
          "Sector Intervenido",
          "Sistemas Informados",
          "Tipo y N° Permiso Trabajo",
          "órden de Trabajo",
          "Repuesto / Material Utilizado",
          "Marca",
          "Modelo",
          "Documento Intervención",
          "Fecha Intervención",
          "Días Transcurridos",
          "Nivel Criticidad",
          "Plazo Estimado de Ejecución",
          "Plazo Cumplido",
          "Fecha Referencia",
          // "Documento Referencia" 
        ];

        // Normalizar columnas requeridas a minúsculas
        const columnasRequeridasNormalizadas = columnasRequeridas.map(col => col.toLowerCase());

        // Verificar si falta alguna columna después de normalizar
        const columnasFaltantes = columnasRequeridasNormalizadas.filter(
          columna => !primeraFilaNormalizada.includes(columna)
        );

        // Verificar si falta alguna columna
        if (columnasFaltantes.length > 0) {
          toast.add({
            severity: "error",
            summary: "No se cargaron los datos",
            detail: `Faltan las siguientes columnas en el archivo: ${columnasFaltantes.join(", ").toUpperCase()}`,
            life: 5000
          });
          return;
        }
        let fechasInvalidas = [];
        const formattedData = jsonData.map((row) => {
          const normalizedRow = {}; // Objeto para almacenar los datos normalizados (pasamos las claves a minusculas )

          // Iterar sobre las columnas y normalizar las claves
          Object.keys(row).forEach(key => {
            const normalizedKey = key.toLowerCase(); // Normalizar la clave a minúsculas
            normalizedRow[normalizedKey] = row[key] !== undefined && row[key] !== null && row[key] !== "" ? row[key] : null; // Asignar valor 

            //row es cada fila del excel representada por un JSON {Fecha: '21/21/2021', ...}
            //key es cada clave de este json, por ej 'Fecha'
            //row[key] es el valor de esa key, en este caso '21/21/2021'

            switch (normalizedKey) {
              case 'fecha':
                if (!validarFormatoFecha(row[key])) {
                  fechasInvalidas.push({ columna: normalizedKey.toUpperCase(), fechaInvalida: row[key] })
                }
                break;
              case 'fecha intervención':
                if (!validarFormatoFecha(row[key])) {
                  fechasInvalidas.push({ columna: normalizedKey.toUpperCase(), fechaInvalida: row[key] })
                }
                break;
              case 'fecha referencia':
                if (!validarFormatoFecha(row[key])) {
                  fechasInvalidas.push({ columna: normalizedKey.toUpperCase(), fechaInvalida: row[key] })
                }
                break;
            }
          });

          // Retornar los datos con las claves normalizadas en minúsculas
          return {
            fecha: normalizedRow["fecha"] ? formatFechaToYYYYMMDD(normalizedRow["fecha"]) : null,
            solicitante: normalizedRow["área solicitante"] || null,
            planta: normalizedRow["planta intervenida"] || null,
            sector: normalizedRow["sector intervenido"] || null,
            sistemas: normalizedRow["sistemas informados"] || null,
            tipo_numero_permiso_trabajo: normalizedRow["tipo y n° permiso trabajo"] || null,
            orden_trabajo: normalizedRow["órden de trabajo"] >= 0 ? normalizedRow["órden de trabajo"] : null,
            repuesto_material: normalizedRow["repuesto / material utilizado"] || null,
            marca: normalizedRow["marca"] || null,
            modelo: normalizedRow["modelo"] || null,
            documento_intervencion: normalizedRow["documento intervención"] || null,
            fecha_intervencion: normalizedRow["fecha intervención"] ? formatFechaToYYYYMMDD(normalizedRow["fecha intervención"]) : null,
            dias_transcurridos: normalizedRow["días transcurridos"] >= 0 ? normalizedRow["días transcurridos"] : null,
            nivel_criticidad: normalizedRow["nivel criticidad"] || null,
            plazo_estimado: normalizedRow["plazo estimado de ejecución"] || null,
            plazo_cumplido: normalizedRow["plazo cumplido"] || null,
            // observaciones: normalizedRow["correctivo realizado"] || null,
            // documento_referencia: normalizedRow["documento referencia"] || null,
            fecha_referencia: normalizedRow["fecha referencia"] ? formatFechaToYYYYMMDD(normalizedRow["fecha referencia"]) : null,
          };
        });

        // console.log('fechas invalidas', fechasInvalidas);
        if (fechasInvalidas.length > 0) {
          const columnasInvalidas = [...new Set(fechasInvalidas.map(item => item.columna))];
          const mensaje = `Se encontraron fechas con un formato distinto a 'DD/MM/YYYY' en las siguientes columnas: ${columnasInvalidas.map(col => `"${col}"`).join(", ")}`;
          toast.add({ severity: "error", summary: "Fechas Inválidas", detail: mensaje, life: 9000 });
          return;
        }


        // Intentar reemplazar los datos en la base de datos
        try {

          const response = await guardarCorrectivosExcel(formattedData);
          if (response.success) {
            // Solo si el reemplazo es exitoso, formatear las fechas para el frontend
            dataCorrectivos.value = response.data.map((row) => ({
              ...row,
              //Se actualiza el formato de las fechas de YYYY-MM-DD a DD-MM-YYYY
              fecha: row.fecha ? formatFechaDDMMYYYY(row.fecha) : null, // Renderizar como DD-MM-YYYY
              fecha_intervencion: row.fecha_intervencion ? formatFechaDDMMYYYY(row.fecha_intervencion) : null,
              fecha_referencia: row.fecha_referencia ? formatFechaDDMMYYYY(row.fecha_referencia) : null,
            }));
            toast.add({ severity: "success", summary: "Éxito", detail: "Datos cargados correctamente.", life: 3000 });
          } else {

            if (response.error == 'Campos incompletos') {
              if (response.campoIncompleto == 'Campo desconocido') {
                toast.add({ severity: "error", summary: `Error al cargar los datos`, detail: "El archivo excel posee datos incompletos.", life: 5000 });
              } else {

                toast.add({ severity: "error", summary: `No se cargaron los datos`, detail: `Se detectaron campos incompletos en las siguientes columnas: "${response.campoIncompleto?.toUpperCase()}".`, life: 6000 });
              }
            }
          }
        } catch (error) {
          console.error(error);
          toast.add({ severity: "error", summary: "Error", detail: "Error al cargar los datos, intente nuevamente.", life: 3000 });
        }
      };

      reader.readAsArrayBuffer(file); // Leer el archivo como ArrayBuffer
    };


    const guardarCorrectivosExcel = async (datos) => {
      try {
        const response = await window.electronAPI.guardarCorrectivosExcel(datos);
        return response;
      } catch (error) {
        console.error("Error al reemplazar datos en la base de datos:", error);
        return response;
      }
    };



    // Convertir una fecha de Excel al formato YYYY-MM-DD
    const convertirFechaYYYYMMDD = (fecha) => {
      if (typeof fecha === "number") {
        const excelDate = XLSX.SSF.parse_date_code(fecha);
        const date = new Date(excelDate.y, excelDate.m - 1, excelDate.d);
        return date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
      }
      const [day, month, year] = fecha.split(/[\/-]/); // Adaptar si viene como DD/MM/YYYY o DD-MM-YYYY
      return `${year}-${month}-${day}`;
    };
    // Convertir una fecha de YYYY-MM-DD a DD-MM-YYYY
    const convertirFechaDDMMYYYY = (fecha) => {
      const [year, month, day] = fecha.split("-");
      return `${day}-${month}-${year}`;
    };


    const generarPdf = () => {

      if (!registroGuardado.value) {
        toast.add({ severity: 'warn', summary: 'Error', detail: 'Debe guardar el registro antes de generar el PDF', life: 3000 });
        return
      }

      const doc = new jsPDF('p', 'mm', 'a4');


      //RECTANGULO INPUTS SUPERIORES
      doc.rect(3, 30, 204, 49)

      //RECTANGULO GENERAL 
      // Definir las dimensiones del documento (tamaño carta en puntos)
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      // Margen deseado
      const margin = 2; // en puntos
      // Dibujar el rectángulo de los márgenes
      doc.rect(
        margin,                // Coordenada X inicial
        margin,                // Coordenada Y inicial
        pageWidth - 2 * margin, // Ancho del rectángulo
        pageHeight - 2 * margin // Alto del rectángulo
      );

      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold');
      doc.rect(173, 6, 30, 5) //rectangulo fecha
      doc.text(`FECHA: `, 159, 10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${formatearFecha(fechaActual.value)}`, 176, 10);

      doc.setFont('helvetica', 'bold');
      doc.text(`PLANTA: `, 7, 40);
      doc.rect(31, 36, 172, 5) //rec codigo informe
      doc.setFont('helvetica', 'normal');
      doc.text(`${plantaSeleccionada.value?.nombre}`, 33, 40)

      doc.setFont('helvetica', 'bold');
      doc.text(`SECTOR:`, 7, 50)
      doc.rect(31, 46, 172, 5)
      doc.setFont('helvetica', 'normal');
      doc.text(`${sector?.value}`, 33, 50)

      doc.setFont('helvetica', 'bold');
      doc.text(`SOLICITANTE:`, 7, 60)
      doc.rect(31, 56, 172, 5) // rec permiso de trabajo
      doc.setFont('helvetica', 'normal');
      doc.text(`${solicitante?.value}`, 33, 60)

      doc.setFont('helvetica', 'bold');
      doc.text(`SISTEMAS:`, 7, 70)
      doc.rect(31, 66, 172, 5)
      doc.setFont('helvetica', 'normal');
      doc.text(` ${sistemasInformados?.value}`, 33, 70)

      //SEGUNDO CUADRO DE INPUTS

      //RECTANGULO INPUTS INFERIORES
      doc.rect(3, 81, 204, 100)

      doc.setFont('helvetica', 'bold');
      doc.text(`PERMISO DE TRABAJO: `, 7, 92);
      doc.rect(47, 88, 157, 5) //rec codigo informe
      doc.setFont('helvetica', 'normal');
      doc.text(`${permisoTrabajo.value}`, 49, 92)

      doc.setFont('helvetica', 'bold');
      doc.text(`REPUESTO / MATERIAL:`, 7, 102)
      doc.rect(47, 98, 157, 5)
      doc.setFont('helvetica', 'normal');
      doc.text(`${repuestoMaterial.value}`, 49, 102)

      doc.setFont('helvetica', 'bold');
      doc.text(`MARCA:`, 7, 112)
      doc.rect(47, 108, 157, 5)
      doc.setFont('helvetica', 'normal');
      doc.text(`${marca.value}`, 49, 112)

      doc.setFont('helvetica', 'bold');
      doc.text(`MODELO:`, 7, 122)
      doc.rect(47, 118, 157, 5)
      doc.setFont('helvetica', 'normal');
      doc.text(`${modelo.value}`, 49, 122)


      doc.setFont('helvetica', 'bold');
      doc.text(`DOC. INTERVENCIÓN:`, 7, 132)
      doc.rect(47, 128, 157, 5)
      doc.setFont('helvetica', 'normal');
      doc.text(`${documentoIntervencion.value}`, 49, 132)

      // doc.setFont('helvetica', 'bold');
      // doc.text(`DOC. REFERENCIA:`, 7, 142)
      // doc.rect(47, 138, 157, 5)
      // doc.setFont('helvetica', 'normal');
      // doc.text(`${documentoReferencia.value}`, 49, 142)

      doc.setFont('helvetica', 'bold');
      doc.text(`ÓRDEN DE TRABAJO:`, 7, 142)
      doc.rect(47, 138, 157, 5)
      doc.setFont('helvetica', 'normal');
      doc.text(`${ordenTrabajo.value}`, 49, 142)


      //Linea fechas
      doc.setFont('helvetica', 'bold');
      doc.text(`FECHA REFERENCIA: `, 7, 162);
      doc.rect(47, 158, 21, 5) //rectangulo fecha
      doc.setFont('helvetica', 'normal');
      doc.text(`${formatearFecha(fechaReferencia.value)}`, 49, 162);

      doc.setFont('helvetica', 'bold');
      doc.text(`FECHA INTERVENCIÓN: `, 73, 162);
      doc.rect(113, 158, 21, 5) //rectangulo fecha
      doc.setFont('helvetica', 'normal');
      doc.text(`${formatearFecha(fechaIntervencion.value)}`, 115, 162);


      doc.setFont('helvetica', 'bold');
      doc.text(`DÍAS TRANSCURRIDOS: `, 141, 162);
      doc.rect(183, 158, 21, 5) //rectangulo fecha
      doc.setFont('helvetica', 'normal');
      doc.text(`${diasTranscurridos.value}`, 185, 162);


      doc.setFont('helvetica', 'bold');
      doc.text(`NIVEL CRITICIDAD: `, 7, 172);
      doc.rect(47, 168, 21, 5) //rectangulo fecha
      doc.setFont('helvetica', 'normal');
      doc.text(`${nivelSeleccionado.value?.nombre}`, 49, 172);

      doc.setFont('helvetica', 'bold');
      doc.rect(113, 168, 21, 5) //rectangulo fecha
      doc.text(`PLAZO ESTIMADO: `, 73, 172);
      doc.setFont('helvetica', 'normal');
      doc.text(`${plazoEstimado.value}`, 115, 172);


      doc.setFont('helvetica', 'bold');
      doc.rect(183, 168, 21, 5) //rectangulo fecha
      doc.text(`PLAZO CUMPLIDO: `, 141, 172);
      doc.setFont('helvetica', 'normal');
      doc.text(`${plazoCumplido.value}`, 185, 172);




      // RECTÁNGULO OBSERVACIONES
      // doc.setFont('helvetica', 'bold');
      // doc.rect(3, 183, 204, 100);
      // doc.text(`OBSERVACIONES: `, 7, 190);
      // doc.rect(7, 195, 196, 70);

      // Ajustar el texto dentro del rectángulo
      doc.setFont('helvetica', 'normal');
      const maxWidth = 185; // Ancho máximo del texto dentro del rectángulo
      const textLines = doc.splitTextToSize(observaciones.value || '', maxWidth);

      // Imprimir el texto multilínea
      doc.text(textLines, 10, 200);

      const appLogo = new Image();
      appLogo.src = logo;
      appLogo.onload = () => {
        doc.addImage(appLogo, 'PNG', 4, 7, 15, 15);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('REGISTRO DE CORRECTIVOS', 28, 16);

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const nombrePdf = `REGISTRO-CORRECTIVO-${yyyy}-${mm}-${dd}.pdf`;

        doc.save(nombrePdf);
      }
    }


    const generarListadoPDF = () => {

      if (!dataCorrectivos.value || dataCorrectivos.value.length === 0) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No hay datos para generar el PDF', life: 3000 });
        return;
      }

      const doc = new jsPDF("l", "mm", "a4"); // Cambiamos a orientación horizontal (landscape)

      // Agregar logo
      const appLogo = new Image();
      appLogo.src = logo;
      appLogo.onload = () => {
        doc.addImage(appLogo, "PNG", 10, 10, 20, 20);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("REGISTRO DE CORRECTIVOS", doc.internal.pageSize.width / 2, 15, { align: "center" });
        doc.setFontSize(10);

        if (tipoFiltradoPdf.value) {
          doc.text(`FILTRADO POR ${tipoFiltradoPdf.value}`, doc.internal.pageSize.width / 2, 22, { align: "center" });
        }

        // Definir columnas y títulos
        const columnas = [
          { title: "FECHA", dataKey: "fecha" },
          { title: "SOLICITANTE", dataKey: "solicitante" },
          // { title: "DOC. REF.", dataKey: "documento_referencia" },
          { title: "DOC. INT.", dataKey: "documento_intervencion" },
          { title: "ÓRDEN TRABAJO", dataKey: "orden_trabajo" },
          // { title: "CORRECTIVO", dataKey: "observaciones" },
          { title: "FECHA REF.", dataKey: "fecha_referencia" },
          { title: "FECHA INT.", dataKey: "fecha_intervencion" },
          { title: "REPUESTO", dataKey: "repuesto_material" },
          { title: "MARCA", dataKey: "marca" },
          { title: "MODELO", dataKey: "modelo" },
          { title: "NIVEL CRITICIDAD", dataKey: "nivel_criticidad" },
          { title: "PLAZO ESTIMADO", dataKey: "plazo_estimado" },
          { title: "DÍAS TRANSCURRIDOS", dataKey: "dias_transcurridos" },
          { title: "PLAZO CUMPLIDO", dataKey: "plazo_cumplido" },
          { title: "PERMISO", dataKey: "tipo_numero_permiso_trabajo" },
          { title: "PLANTA", dataKey: "planta" },
          { title: "SECTOR", dataKey: "sector" },
          { title: "SISTEMAS INFORMADOS", dataKey: "sistemas" },
        ];


        // Función para limpiar caracteres problemáticos en "documento_intervencion", "modelo", "marca"
        const limpiarTexto = (texto) => {
          if (!texto) return "-";
          return texto
            .normalize("NFKD") // Normaliza caracteres Unicode
            .replace(/[\u2010-\u2015]/g, "-") // Reemplaza guiones especiales con un guion normal
            .replace(/\s+/g, " ") // Reemplaza múltiples espacios con un solo espacio
            .trim(); // Elimina espacios innecesarios al inicio y al final
        };

        

        // Mapear los datos y limpiar el campo "documento_intervencion", "modelo", "marca"
        const filas = dataCorrectivos.value.map(item => {
          return columnas.reduce((obj, col) => {
            let valor = item[col.dataKey];

            // Aplicar la función de limpieza solo en "documento_intervencion", "modelo", "marca"
            if (col.dataKey === "documento_intervencion" || col.dataKey === "modelo" || col.dataKey === "marca") {
              valor = limpiarTexto(valor);
            }

            // Asegurar que el valor 0 no sea reemplazado por "-"
            obj[col.dataKey] = (valor !== undefined && valor !== null) ? valor : "-";
            return obj;
          }, {});
        });



        // Configurar tabla con mejores ajustes
        autoTable(doc, {
          startY: 40,
          head: [columnas.map(col => col.title)],
          body: filas.map(fila => columnas.map(col => fila[col.dataKey])),
          styles: { fontSize: 6, cellPadding: 1 },
          headStyles: { fillColor: [0, 128, 255], textColor: 255, fontStyle: "bold", fontSize: 6 },
          columnStyles: {
            0: { cellWidth: 15 }, //Fecha
            1: { cellWidth: 19 }, //Solicitante
            // 2: { cellWidth: 17 }, //Doc. referencia
            2: { cellWidth: 20 }, //Doc. Intervencion
            3: { cellWidth: 17 },//orden trabajo
            // 4: { cellWidth: 30 }, //correctivo
            4: { cellWidth: 17 }, // fecha ref
            5: { cellWidth: 17 }, // fecha int
            6: { cellWidth: 17 }, //repuesto
            7: { cellWidth: 17 }, //marca
            8: { cellWidth: 17 }, //modelo
            9: { cellWidth: 17 }, //nivel criticidad
            10: { cellWidth: 17 }, //plazo estimado
            11: { cellWidth: 17 }, //dias transcurridos
            12: { cellWidth: 16 }, //plazo cumplido
            13: { cellWidth: 16 }, //permiso
            14: { cellWidth: 16 }, // planta
            15: { cellWidth: 16 }, //sector
            16: { cellWidth: 23 }, // sist. informados
          },
          margin: { left: 1, right: 1 },
          theme: "grid"
        });

        // Guardar PDF
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        // const nombrePdf = tipoFiltradoPdf.value ? `INFCOR-${yyyy}-${mm}-${dd}-FILTRADO-POR-${tipoFiltradoPdf.value}.pdf` : `INFCOR-${yyyy}-${mm}-${dd}.pdf`;
        const nombrePdf = `INFCOR-${yyyy}-${mm}-${dd}.pdf`;

        doc.save(nombrePdf);
      };
    };



    onMounted(() => {
      const today = new Date();
      // const yyyy = today.getFullYear();
      // const mm = String(today.getMonth() + 1).padStart(2, '0');
      // const dd = String(today.getDate()).padStart(2, '0');
      fechaActual.value = today;
      obtenerCorrectivos()
    });

    return {
      fechaActual,
      solicitante,
      plantas,
      plantaSeleccionada,
      sistemasInformados,
      permisoTrabajo,
      sector,
      repuestoMaterial,
      marca,
      modelo,
      fileupload,
      documentoIntervencion,
      fechaIntervencion,
      diasTranscurridos,
      maxFechaIntervencion,
      ordenTrabajo,
      nivelesCriticidad,
      nivelSeleccionado,
      plazoEstimado,
      plazoCumplido,
      observaciones,
      showForm,
      dataCorrectivos,
      selectedFiles,
      documentoReferencia,
      logo,
      fechaReferencia,
      upload,
      onUpload,
      handleForm,
      obtenerCorrectivos,
      guardarCorrectivos,
      generarPdf,
      formatearFecha,
      handleFilter,
      handleFilters,
      showFilters,
      filter,
      fechaFiltro,
      fechaInicioFiltro,
      fechaFinFiltro,
      filtrarCorrectivosFecha,
      filtrarCorrectivosRangoFechas,
      repuestoMaterialFiltro,
      filtrarCorrectivosRepuesto,
      sectorFiltro,
      filtrarCorrectivosSector,
      filtrarCorrectivosMarca,
      marcaFiltro,
      modeloFiltro,
      filtrarCorrectivosModelo,
      filtrarCorrectivosPermisoTrabajo,
      permisoTrabajoFiltro,
      ordenTrabajoFiltro,
      filtrarCorrectivosOrdenTrabajo,
      importarExcel,
      guardarCorrectivosExcel,
      convertirFechaYYYYMMDD,
      convertirFechaDDMMYYYY,
      exportarExcel,
      formatFechaExcel,
      generarListadoPDF,
      tipoFiltradoPdf,
      loading,
      handleInicio,
      showDataTable,
      formCompleto,
      registroGuardado,
      ultimoRegistroGuardado,
      reiniciarFormulario,
      compararUltimoRegistro,
      reiniciarValores,
      validarFormatoFecha,
      formatFechaToYYYYMMDD,
      formatFechaDDMMYYYY,
      showDialogEditar,
      correctivoEdicion,
      abrirDialogEditar,
      showDialogEditar,
      actualizarCorrectivo,
      eliminarCorrectivo,
      confirmarEliminacion
    }


  }

})
</script>