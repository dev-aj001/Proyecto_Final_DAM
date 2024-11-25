import axios from "axios";

const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'api/v1/almacenes/'}`;

export const DeleteOneAlmacen = async (idNeg,idAlm) => {
    try {
        const response = await axios.delete(apiUrl + idNeg + '/almacen/' + idAlm);
        return response;
    } catch (error) {
        console.error("Error en DeleteOneInventory:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error al realizar la solicitud de eliminación");
    }
};
