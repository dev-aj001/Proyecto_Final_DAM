import axios from 'axios';

export function DeleteOneInstitute(instituteId) {
    console.log("<<EJECUTA>> API <<DeleteOneInstitute>> Requiere:", instituteId);

    return new Promise((resolve, reject) => {
        // Enviar la solicitud DELETE al endpoint correcto utilizando `instituteId` como parámetro de ruta
        axios.delete(
            `${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE}eliminar/${instituteId}`
        )
        .then((response) => {
            const data = response.data;
            console.log("<<RESPONSE>> DeleteOneInstitute", data);

            if (!data.success) {
                console.error("<<ERROR>> <<NO>> se ejecutó la API <<DeleteOneInstitute>> de forma correcta", data);
                reject(data); // Rechaza la promesa si no es exitoso
            } else {
                resolve(data); // Resuelve la promesa si la respuesta es exitosa
            }
        })
        .catch((error) => {
            console.error("<<ERROR>> en API <<DeleteOneInstitute>>", error);
            reject(error); // Rechaza la promesa en caso de error
        });
    });
}
