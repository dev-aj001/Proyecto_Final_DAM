import axios from "axios";
const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'api/v1/series/'}`;
export const UpdateOneSeries = async (idNeg, idAlm, idSer, data) => {
    console.log("valores:", inventoryId, inventory);
    try {
        const response = await axios.put(`${apiUrl}+${idNeg}/almacen/${idAlm}/series/${idSer}`, data);
        return response;
    } catch (error) {
        console.error("Error en UpdateOneSeries:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error al realizar la solicitud");
    }
    
};
