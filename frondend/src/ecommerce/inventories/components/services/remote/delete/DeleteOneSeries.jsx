import axios from "axios";

const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'api/v1/series/'}`;

export const DeleteOneSeries = async (idNeg,idAlm,idSer) => {
    try {
        
        const response = await axios.delete(apiUrl + idNeg + '/almacen/' + idAlm+'/series/'+idSer);
        // console.log(response);
        return response;
    } catch (error) {
        console.error("Error en DeleteOneSeries:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error al realizar la solicitud de eliminación");
    }
};
