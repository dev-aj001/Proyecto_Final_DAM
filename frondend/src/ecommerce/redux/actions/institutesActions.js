import axios from 'axios';
export async function getInstitutesAll() {
	let result = await axios.get(`${import.meta.env.VITE_REST_API_SECURITY_ECOMMERCE} + 'api/v1/inventory'`);
	console.log('<<AXIOS-INSTITUTOS>>: ', result.data);
	return result.data;
}
