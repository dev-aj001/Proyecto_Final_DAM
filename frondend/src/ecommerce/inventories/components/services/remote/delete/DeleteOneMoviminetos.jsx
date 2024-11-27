import axios from 'axios';  // Importar axios

export const DeleteOneMoviminetos = async (idNeg,idAlmac, id)  => {
    
    const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'api/v1/movimientos/' + idNeg + '/almacen/' + idAlmac + '/movimientos/' + id}`;

        try {
            
            const response = await axios.delete(apiUrl);
            console.log(response);
            return response;
        } catch (error) {
            console.error("Error en DeleteOneSeries:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || "Error al realizar la solicitud de eliminación");
        }
    };
    
    
