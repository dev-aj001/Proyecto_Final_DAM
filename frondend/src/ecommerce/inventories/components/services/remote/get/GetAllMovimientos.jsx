import axios from 'axios';  // Importar axios

export function getAllMovimientos() {
  return new Promise((resolve, reject) => {
    //const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'api/v1/inventories'}`;
    const apiUrl = `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE + 'api/v1/movimientos'}`;
    axios.get(apiUrl)
      .then((response) => {
        const data = response.data;
        // console.log('All movimientos: ', response.data);

        if (!data.success) {
          console.error("Error en la petición <<getAllInventories - Services>>", data);
          reject(data);
        } else {
          resolve(data.data); // Devolver el array de inventarios
        }
      })
      .catch((error) => {
        console.error("Error al obtener los inventarios:", error);
        reject(error);
      });
  });
}
