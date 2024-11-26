import axios from 'axios';  // Importar axios

export function getAlmacenesById(idNeg) {
  return new Promise((resolve, reject) => {
    // Constuir la URL con el ID
    const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'api/v1/almacenes/' + idNeg + '/almacen/'}`;

    console.log("URL de la solicitud:", apiUrl);

    axios.get(apiUrl)
      .then((response) => {
        const data = response.data;
        console.log(data);

        if (!data.success) {
          console.error("Error en la petición <<getAlmacenesById - Services>>", data);
          reject(data);
        } else {
          console.log("Almacen obtenido:", data.data);
          resolve(data.data); // Devolver los datos del inventario
        }
      })
      .catch((error) => {
        console.error("Error al obtener el almacen:", error);
        reject(error);
      });
  });
}
