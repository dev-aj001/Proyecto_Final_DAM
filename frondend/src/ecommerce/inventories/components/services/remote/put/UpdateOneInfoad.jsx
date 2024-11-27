import axios from "axios";
const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'api/v1/infoad/'}`;
export const UpdateOneInfoad = async (idNeg, idAlm, idInfoad, data) => {
    
    try {
        const response = await axios.put(`${apiUrl}${idNeg}/almacen/${idAlm}/serieSs/${idInfoad}`, data);
        return response;
    } catch (error) {
        console.error("Error en UpdateOneInfoad :", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error al realizar la solicitud");
    }
    
};
