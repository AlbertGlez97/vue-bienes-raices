import APIServiceGeocode from "@/services/APIServiceCountries"
import { ref } from "vue";
import { defineStore } from "pinia";

export const useLocationStore = defineStore('location', () => {
    
    const paises = ref();
    const estados = ref();
    const ciudades = ref();

    async function mostrarPaises(){
        const data = await APIServiceGeocode.loadCountries()
        paises.value = data;
    }

    async function mostrarEstados(stateCountry){
        const data = await APIServiceGeocode.loadStates(stateCountry)
        estados.value = data;
    }

    async function mostrarCiudades(stateCountry, stateCode){
        const data = await APIServiceGeocode.loadCities(stateCountry, stateCode)
        ciudades.value = data;
    }

    return {
        paises,
        estados,
        ciudades,
        mostrarPaises,
        mostrarEstados,
        mostrarCiudades
    };
});
