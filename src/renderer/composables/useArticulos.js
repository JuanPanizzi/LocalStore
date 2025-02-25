
export function useArticulos(){


    const obtenerArticulos  = async () => {

        try {
            const response = await window.electronAPI.obtenerArticulos();
            if(response.success){
                return {success: true, data: response.data};
            }else{
                throw new Error('Error al obtener los datos')
            }
            
        } catch (error) {
            return {success: false, error: error?.message || 'Error al obtener los datos, intente nuevamente' }
        }
    }

    const crearArticulo = async (articulo) => {
        
        try {
            const response = await window.electronAPI.crearArticulo(articulo);
            
            if(response.success){
                return {success: true, data: response.data}
            }else{
                if(response.error == 'Ya existe un artículo con esa marca y modelo'){
                    return {success: false, error: response.error}
                }
                throw new Error();
            }
        } catch (error) {
            return {success: false}
        }

    }

    
    const eliminarArticulo = async (id) => {

        try {
          const response = await window.electronAPI.eliminarArticulo(id);
          if (response.success) {
            return { success: true, error: response.error }
          }else{

            if(response.error == 'No se encontró el articulo'){
                return {sucess: false, error: response.error}
            }

          }
        } catch (error) {
          return { success: false, error: response.error }
        }
      }
  
      const seleccionarImagen = async () => {

        try {
            const response = await window.electronAPI.seleccionarImagen();
           
                return {success: true, data: response}
            

        } catch (error) {
            console.log('error')
            return {success: false}
        }
    }

    return {
        obtenerArticulos,
        crearArticulo,
        eliminarArticulo,
        seleccionarImagen
    }



}

