import axios from "axios";
const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'api/v1/almacenes/'}`;
export const UpdateOneAlmacen = async (negocioId, almacenId, almacen) => {
    try {
        
        const response = await axios.put(`${apiUrl}${negocioId}/almacen/${almacenId}`, almacen);    
       // console.log(`${apiUrl}${negocioId}/almacen/${almacenId}`);
        return response;
    } catch (error) {
        console.error("Error en UpdateOneInventory:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error al realizar la solicitud");
    }
};
