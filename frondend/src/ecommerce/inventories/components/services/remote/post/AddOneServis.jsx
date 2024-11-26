import axios from "axios";
const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'api/v1/almacenes/'}`;
export const AddOneAlmacenes = async (almacen) => {
    console.log("alamacen",almacen);
    try {
        
        const response = await axios.post(apiUrl+almacen.id_negocio+"/almacen", almacen);
        return response;
    } catch (error) {
        console.error("Error en AddOneInventory:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error al realizar la solicitud");
    }
    
};

