import { ref } from 'vue';
import APIServiceGeocode from "../services/APIServiceGeocode";

export default function useLocationMap() {

    const zoom = ref(18)
    const center = ref([19.4333492, -99.1329646])

    async function obtenerCordenas(cadenaUbicacion) {
        const { data } = await APIServiceGeocode.buscarPosicion(cadenaUbicacion);

        if (data && data.items && data.items.length > 0) {
            // Extract the first location's position
            const position = data.items[0].position;
            const latitude = position.lat;
            const longitude = position.lng;

            // Update the 'center' ref with the extracted latitude and longitude
            center.value = [latitude, longitude];
        }
    }

    //Obtener Cordenas del Pin que se muestra en el mapa
    function pin(e) {
        const marker = e.target.getLatLng();
        center.value = [marker.lat, marker.lng]
    }

    return {
        zoom,
        center,
        obtenerCordenas,
        pin
    }
}