import axios from "axios";
const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'api/v1/movimientos/'}`;
export const UpdateOneMoviminetos = async (idNeg,idAlm, idMov,movimientos) => {
    // console.log("valores:", movimientos);
    try {
        const response = await axios.put(`${apiUrl}${idNeg}/almacen/${idAlm}/movimientos/${idMov}`, movimientos);
        return response;
    } catch (error) {
        console.error("Error en UpdateOneMoviminetos:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error al realizar la solicitud");
    }
    
};
