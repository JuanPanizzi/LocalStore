
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
            console.log('response del useArticulos' , response)
            
            if(response.success){
                return {success: true, data: response.data}
            }else{
                throw new Error();
            }

        } catch (error) {
            return {success: false}
        }

    }

    return {
        obtenerArticulos,
        crearArticulo
    }



}

