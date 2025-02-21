
export function useArticulos(){


    const obtenerArticulos  = async () => {


        try {
            const response = await window.electronAPI.obtenerArticulos();

            if(response.success){
                return {success: true, data: response.data};
            }else{
                throw new Error('Error al obtener los datos, intente nuevamente')
            }
            
        } catch (error) {
            return {success: false, error: error?.message || 'Error al obtener los datos, intente nuevamente' }
        }

    }

    return {
        obtenerArticulos
    }

}