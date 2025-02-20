export function compararUltimoRegistro(registroNuevo, ultimoRegistro) {
    const claves1 = Object.keys(registroNuevo).filter(key => key !== 'id'); // Excluir "id"
    const claves2 = Object.keys(ultimoRegistro).filter(key => key !== 'id'); // Excluir "id"
  
    if (claves1.length !== claves2.length) return false; // Si tienen diferente cantidad de claves (sin contar "id"), no son iguales
  
    return claves1.every(key => 
      ultimoRegistro.hasOwnProperty(key) && registroNuevo[key] === ultimoRegistro[key]
    );
  }