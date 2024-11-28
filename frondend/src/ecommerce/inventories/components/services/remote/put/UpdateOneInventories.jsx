import axios from "axios";
const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'api/v1/inventory/'}`;
export const UpdateOneInventory = async (inventoryId, inventory) => {
    // console.log("valores:", inventoryId, inventory);
    try {
        const response = await axios.put(`${apiUrl}${inventoryId}`, inventory);
        return response;
    } catch (error) {
        console.error("Error en UpdateOneInventory:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error al realizar la solicitud");
    }
    
};
