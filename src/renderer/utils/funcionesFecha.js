
// Función para formatear la fecha importada
// Si la celda es un objeto Date (caso de celdas de tipo fecha en Excel) se formatea usando métodos UTC,
// de lo contrario se asume que es una cadena en formato "DD/MM/YYYY" o "DD-MM-YYYY"
export const formatFechaToYYYYMMDD = (fecha) => {
  if (!fecha) return '';

  // Si es un objeto Date, se formatea en UTC para mantener la consistencia con la interpretación de SheetJS
  if (fecha instanceof Date) {
    const year = fecha.getUTCFullYear();
    const month = (fecha.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`; // Formato para el backend: YYYY-MM-DD
  }

  // Si es cadena, se asume el formato dd/mm/yyyy (ya que es lo que se espera que ingrese el usuario)
  if (typeof fecha === "string") {
    if (fecha.includes("/")) {
      const [dia, mes, anio] = fecha.split("/");
      return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }
    if (fecha.includes("-")) {
      const [dia, mes, anio] = fecha.split("-");
      return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }
  }

  return fecha;
};

// Convertir una fecha de YYYY-MM-DD a DD-MM-YYYY
export const formatFechaDDMMYYYY = (fecha) => {
  const [year, month, day] = fecha.split("-");

  return `${day}/${month}/${year}`; //Formato para actualizar el frontend
};



export const formatFechaExcel = (fecha) => {
  console.log('fehca format excel', fecha)

  const dateParts = fecha.split("-");
  if (dateParts.length === 3) {
    // Suponiendo que la fecha viene como DD-MM-YYYY
    return `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
  }
  return fecha; // Si no se puede formatear, devolver la fecha tal cual

}


//Convierte fecha en formato Date (Mon Feb 10 2025 08:19:08 GMT-0300) a YYYY-MM-DD - evita los problemas de huso horario
export function formatFechaDate(dateString) {
  const date = new Date(dateString);

  // Obtener los valores en la zona horaria local
  const anio = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0'); // Mes en base 0
  const dia = String(date.getDate()).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
}


export function validarFormatoFecha(fecha) {
  // Si el valor es un objeto Date, lo consideramos válido
  if (fecha instanceof Date) {
    // Verifica que la fecha sea válida (por ejemplo, que no sea "Invalid Date")
    return !isNaN(fecha.getTime());
  }

  // Si es una cadena, se evaluará contra los formatos aceptados
  if (typeof fecha === "string") {
    const formatosAceptados = [
      /^\d{1,2}\/\d{1,2}\/\d{4}$/,  // D/M/YYYY o DD/MM/YYYY
      /^\d{1,2}-\d{1,2}-\d{2}$/,     // DD-MM-YY
      /^\d{1,2}\/\d{1,2}\/\d{2}$/,   // D/M/YY o DD/MM/YY
      /^\d{4}-\d{2}-\d{2}$/          // YYYY-MM-DD
    ];
    // Retorna true si alguna de las expresiones regulares coincide
    return formatosAceptados.some(regex => regex.test(fecha));
  }

  // Si no es ni Date ni string, retorna false
  return false;
}

export const fechaActual = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()); //  Fija la hora en 00:00:00
};

// convierte objeto date a dd/mm/aaaa
export const formatearFecha = (fecha) => {

  const fechaDate = new Date(fecha);
  const dia = String(fechaDate.getDate()).padStart(2, '0');
  const mes = String(fechaDate.getMonth() + 1).padStart(2, '0');
  const año = fechaDate.getFullYear();

  const fechaFormateada = `${dia}/${mes}/${año}`;
  return fechaFormateada;
}

export const stringToDate = (fechaStr) => {
    const partes = fechaStr.split("-"); // Divide la fecha en partes [YYYY, MM, DD]
    return new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2])); 
 }