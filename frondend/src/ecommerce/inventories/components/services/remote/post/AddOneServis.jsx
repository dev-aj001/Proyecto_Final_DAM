import axios from "axios";
const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'api/v1/series/'}`;
export const AddOneService = async (idNeg,idAlma,servis) => {
    // console.log("servis",servis);
    try {
        
        const response = await axios.post(apiUrl+idNeg+"/almacen/"+idAlma, servis);
        return response;
    } catch (error) {
        console.error("Error en AddOneService:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error al realizar la solicitud");
    }
    
};

