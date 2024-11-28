import axios from 'axios';

export const getAllAlmacenes = async () => {
    return new Promise((resolve, reject) => {
         
        const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'api/v1/almacenes/almacenes'}`;//FIC: URL = http://localhost:8080/api/pwa/inventories
        
        // console.log("URL de la solicitud:", apiUrl);
        
        axios.get(apiUrl)
          .then((response) => {
            const data = response.data;
            // console.log(data);
            
            if (!data.success) {
              console.error("Error en la petición <<getAllAlmacenes - Services>>", data);
              reject(data);
            } else {
              // console.log("Almacenes obtenidos:", data.data);
              resolve(data.data); // Devolver el array de inventarios
            }
          })
          .catch((error) => {
            console.error("Error al obtener los almacenes:", error);
            reject(error);
          });
    
    })
}