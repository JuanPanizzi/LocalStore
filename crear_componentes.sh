#!/bin/bash

# Lista de nombres de componentes a crear
componentes=(
    "IncendioComponent"
    "GasesComponent"
    "HidratantesComponent"
    "AlarmasComponent"
    "ValvulasComponent"
    "BombaEspumaComponent"
    "CajasManguerasComponent"
    "TanquesEspumaComponent"
    "InformeAsfaltosComponent"
    "InformeLubricantesComponent"
    "ConfiguracionComponent"
)

# Directorio donde se crearán los componentes (cámbialo si es necesario)
dir="./src/components"

# Verifica si el directorio existe, si no lo crea
if [ ! -d "$dir" ]; then
  mkdir -p "$dir"
fi

# Recorre la lista de componentes y crea cada archivo .vue
for componente in "${componentes[@]}"; do
    archivo="$dir/$componente.vue"
    if [ -f "$archivo" ]; then
        echo "El archivo $archivo ya existe, se omite."
    else
        # Escribe el contenido básico del componente
        cat <<EOL > "$archivo"
<template>
  <div>
    <!-- Componente $componente -->
  </div>
</template>

<script>
export default {
  name: '$componente',
};
</script>

<style scoped>
/* Estilos del componente $componente */
</style>
EOL

        echo "Componente $componente creado en $archivo."
    fi
done
