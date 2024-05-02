import apiGeocode from "../lib/axiosGeocode";

export default {
    async buscarPosicion(direccion) {
        try {
            const response = await apiGeocode.get(`/geocode?q=${direccion}&apiKey=${import.meta.env.VITE_HERE_API_KEY}`);
            if (response.status === 200) {
                return response;
            } else {
                console.error('Error:', response);
            }

        } catch (error) {
            console.error(error);
        }
    },
};