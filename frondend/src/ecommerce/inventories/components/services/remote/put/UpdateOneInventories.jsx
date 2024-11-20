import axios from "axios";
const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'api/v1/inventory/'}`;
export const UpdateOneInventory = async (inventoryId, inventory) => {
    try {
        const filteredInventory = Object.fromEntries(
            Object.entries(inventory).filter(([_, value]) => value !== null && value !== undefined && value !== "")
        );

        const response = await axios.put(`${apiUrl}${inventoryId}`, filteredInventory);
        return response;
    } catch (error) {
        console.error("Error en UpdateOneInventory:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error al realizar la solicitud");
    }
};
