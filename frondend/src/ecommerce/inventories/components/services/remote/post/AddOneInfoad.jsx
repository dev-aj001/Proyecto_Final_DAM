import axios from "axios";
const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'api/v1/infoad/'}`;

export const AddOneInfoad = async (idNeg,idAlma, infoad) => {
    console.log("infoad: ",infoad);
    try {
        
        const response = await axios.post(apiUrl+idNeg+"/almacen/"+idAlma, infoad);
        return response;
    } catch (error) {
        console.error("Error en AddOneService:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error al realizar la solicitud");
    }
    
};

