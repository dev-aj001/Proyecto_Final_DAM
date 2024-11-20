import axios from 'axios';

export function UpdateOneInstitute(instituteData) {
    console.log("<<EJECUTA>> API <<UpdateOneInstitute>> Requiere:", instituteData);

    return new Promise((resolve, reject) => {
        // Enviar la solicitud PUT al endpoint correcto, utilizando `IdInstitutoOK` como parámetro de ruta
        axios.put(
            `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE}actualizar/${instituteData.IdInstitutoOK}`,
            instituteData
        )
        .then((response) => {
            const data = response.data;
            console.log("<<RESPONSE>> UpdateOneInstitute", data);

            if (!data.success) {
                console.error("<<ERROR>> <<NO>> se ejecutó la API <<UpdateOneInstitute>> de forma correcta", data);
                reject(data); // Rechaza la promesa si no es exitoso
            } else {
                resolve(data); // Resuelve la promesa si la respuesta es exitosa
            }
        })
        .catch((error) => {
            console.error("<<ERROR>> en API <<UpdateOneInstitute>>", error);
            reject(error); // Rechaza la promesa en caso de error
        });
    });
}
