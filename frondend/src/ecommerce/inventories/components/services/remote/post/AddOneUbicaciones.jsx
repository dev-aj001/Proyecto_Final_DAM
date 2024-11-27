import axios from "axios";
const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'api/v1/ubicaciones/'}`;
export const AddOneUbicaciones = async (idNeg,idAlma,idSer,data) => {
    console.log("servis",servis);
    try {
        
        const response = await axios.post(apiUrl+idNeg+"/almacen/"+idAlma+"/series/"+idSer+"/ubicacion", data);
        return response;
    } catch (error) {
        console.error("Error en AddOneUbicaciones:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error al realizar la solicitud");
    }
    
};

