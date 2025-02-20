// Función para convertir fechas YYYY-MM-DD al formato 'DD-MM-YYYY'
export const formatFecha = (fecha) => {
  if (!fecha) return null; // Manejar valores nulos
  const [year, month, day] = fecha.split('-');
  return `${day}/${month}/${year}`;
};