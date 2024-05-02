import axios from 'axios'

const apiKey = import.meta.env.VITE_Country_State_City_API_KEY;

const api = axios.create({
    baseURL:"https://api.countrystatecity.in/v1",
    headers: {
        'X-CSCAPI-KEY': apiKey
      }
})

export default api