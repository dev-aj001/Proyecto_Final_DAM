import axios from "axios";

export function getInstituteById(id) {
  return new Promise((resolve, reject) => {
    const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'buscar/' + id}`;

    // console.log("URL de la solicitud:", apiUrl);  // Verificar la URL generada

    axios.get(apiUrl)
      .then((response) => {
        const data = response.data;

        // Verificar si la respuesta tiene el formato esperado
        if (!data.success) {
          console.error("No se pudo realizar correctamente la petición <<getInstituteById - Services>>", data);
          reject(data); // Enviar el objeto de error como rechazo
        } else {
          // console.log("Instituto obtenido:", data.data);
          resolve(data.data);  // Solo devolver los datos necesarios del instituto
        }
      })
      .catch((error) => {
        if (error.response) {
          // Error en la respuesta del servidor (código de estado diferente de 2xx)
          console.error("Error de respuesta:", error.response.data);
          console.error("Código de estado:", error.response.status);
        } else if (error.request) {
          // No se recibió respuesta del servidor
          console.error("Error en la solicitud:", error.request);
        } else {
          // Error al configurar la solicitud
          console.error("Error al configurar la solicitud:", error.message);
        }
        reject(error); // Rechazar con el error completo para mayor depuración
      });
  });
}
