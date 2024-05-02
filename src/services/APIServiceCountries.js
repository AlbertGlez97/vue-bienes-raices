import apiCountries from "../lib/axiosCountries";

export default {
    async loadCountries() {
        try {
            const response = await apiCountries.get('/countries');

            if (response.status === 200) {
                
                return response.data;
            } else {
                console.error('Error:', response);
            }

        } catch (error) {
            console.error(error);
        }
    },
    async loadStates(stateCountry) {
        try {
            const response = await apiCountries.get(`/countries/${stateCountry}/states`);

            if (response.status === 200) {
                
                return response.data;
            } else {
                console.error('Error:', response);
            }

        } catch (error) {
            console.error(error);
        }
    },
    async loadCities(stateCountry,stateCode) {
        try {
            const response = await apiCountries.get(`/countries/${stateCountry}/states/${stateCode}/cities`);

            if (response.status === 200) {
                
                return response.data;
            } else {
                console.error('Error:', response);
            }

        } catch (error) {
            console.error(error);
        }
    },
};