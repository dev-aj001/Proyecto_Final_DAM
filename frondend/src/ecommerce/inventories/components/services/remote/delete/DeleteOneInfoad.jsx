import axios from "axios";

const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'api/v1/infoad/'}`;

export const DeleteOneInfoad = async (idNeg,idAlm,idInfo) => {
    try {
        
        const response = await axios.delete(apiUrl + idNeg + '/almacen/' + idAlm+'/series/'+idInfo);
        console.log(response);
        return response;
    } catch (error) {
        console.error("Error en DeleteOneInfoad:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error al realizar la solicitud de eliminación");
    }
};
