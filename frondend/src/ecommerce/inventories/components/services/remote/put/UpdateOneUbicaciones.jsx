import axios from "axios";
const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'api/v1/ubicaciones/'}`;
export const UpdateOneUbicacion = async (idNeg, idAlm, idSer,idUbi, data) => {
    
    try {
        const response = await axios.put(`${apiUrl}${idNeg}/almacen/${idAlm}/series/${idSer}/ubicaciones/${idUbi}`, data);
        return response;
    } catch (error) {
        console.error("Error en UpdateOneubicaciones:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error al realizar la solicitud");
    }
    
};
