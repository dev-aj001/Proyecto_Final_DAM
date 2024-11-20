import axios from "axios";
const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'api/v1/inventory'}`;
export const AddOneInventory = async (inventory) => {
    try {
        const response = await axios.post(apiUrl, inventory);
        return response;
    } catch (error) {
        console.error("Error en AddOneInventory:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error al realizar la solicitud");
    }
};

