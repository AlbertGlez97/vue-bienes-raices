<script setup>
import { onMounted, ref, watch } from 'vue';
import { useForm, useField } from 'vee-validate' // Importación de funciones de validación de VeeValidate
import { collection, addDoc } from 'firebase/firestore'; // Importación de funciones de Firebase Firestore
import { useFirestore } from 'vuefire'; // Importación de la función useFirestore de VueFire
import { useRouter } from 'vue-router'; // Importación de la función useRouter de Vue Router
import { validationSchema, imageSchema } from '@/validation/propiedadSchema' // Importación de esquemas de validación
import useImagen from '@/composables/useImage'; // Importación de composable para cargar las iamgenes
import useLocationMap from '@/composables/useLocationMap'; // Importación de composable para cargar mapa
import "leaflet/dist/leaflet.css"; // Importación de estilos CSS de Leaflet
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
//LMap: Es un componente que representa un mapa Leaflet en tu aplicación Vue.js.
//LTileLayer: Es un componente para agregar capas de teselas (tiles) al mapa. 
//LMarker: Es un componente para agregar marcadores al mapa.
import { useLocationStore } from "@/stores/userLocation"

const locationStore = useLocationStore();
const paises = ref();
const items = [0, 1, 2, 3, 4, 5]; // Definición de un array de números

const { url, uploadImage, image } = useImagen() // Subir nuestra imagen a traves del composable de useImagen.js
const { zoom, center, obtenerCordenas, pin } = useLocationMap()

const router = useRouter() // Obtiene la instancia del enrutador de Vue Router
const db = useFirestore() // Obtiene la instancia de Firestore de VueFire

// Configuración del formulario y esquemas de validación
const { handleSubmit } = useForm({
    validationSchema: {
        ...validationSchema, // Esquema de validación para propiedades
        ...imageSchema // Esquema de validación para imágenes
    }
})

// Definición de campos del formulario utilizando useField de VeeValidate
const titulo = useField('titulo') // Campo para el título
const imagen = useField('imagen') // Campo para la imagen
const precio = useField('precio') // Campo para el precio
const habitaciones = useField('habitaciones') // Campo para el número de habitaciones
const wc = useField('wc') // Campo para el número de baños
const estacionamiento = useField('estacionamiento') // Campo para el número de estacionamientos
const descripcion = useField('descripcion') // Campo para la descripción
const alberca = useField('alberca', null, { // Campo para la opción de alberca
    initialValue: false // Valor inicial false, aunque no sea obligatorio
})
const pais = useField('pais')  // Campo para pais  
const estado = useField('estado') // Campo para estado
const ciudad = useField('ciudad')  // Campo para ciudad
const calle = useField('calle')  // Campo para calle
const colonia = useField('colonia')  // Campo para colonia
const codigoPostal = useField('codigoPostal')  // Campo para Codigo Postal

// Función de envío del formulario
const submit = handleSubmit(async (values) => {
    const { imagen, ...propiedad } = values // Extrae la imagen de los valores

    // Agrega un documento a la colección "propiedades" en Firestore
    const docRef = await addDoc(collection(db, "propiedades"), {
        ...propiedad, // Datos de la propiedad
        imagen: url.value, //Imagen previamente cargada en el Firestore
        ubicacion: center.value //Cordenas de la ubicacion del pin
    });

    // Si se agregó el documento correctamente, redirige al panel de propiedades
    if (docRef.id) {
        router.push({ name: 'admin-propiedades' }) // Redirección a la vista de propiedades de administrador
    }
})

// Función de verificaion de ubicacion
const verificacionUbicacion = async () => {
    const objUbicacion = {
        calle: calle.value.value,
        colonia: colonia.value.value,
        ciudad: ciudad.value.value,
        estado: estado.value.value,
        codigoPostal: codigoPostal.value.value,
        pais: pais.value.value,
    }

    const cadenaUbicacion = `${objUbicacion.calle} ${objUbicacion.colonia} ${objUbicacion.ciudad}, ${objUbicacion.codigoPostal} ${objUbicacion.estado}, ${objUbicacion.pais}`;

    console.log(cadenaUbicacion);

    obtenerCordenas(cadenaUbicacion)
}

// Llamada a la función mostrarPaises del store al montar la página
onMounted(async () => {
    await locationStore.mostrarPaises();
    paises.value = locationStore.paises;
});

// Observar si el valor del pais cambio, para mostrar los estados 
watch(pais.value, (newValue, oldValue) => {
    if (newValue !== null) {
        locationStore.mostrarEstados(newValue)
    }
}, {
    deep: true
})

// Observar si el valor del estado cambio, para mostrar los estados 
watch(estado.value, (newValue, oldValue) => {
    if (newValue !== null) {
        locationStore.mostrarCiudades(pais.value.value, newValue)
    }
}, {
    deep: true
})


</script>


<template>
    <v-card max-width="800" flat class="mx-auto my-10">
        <v-card-title class="text-h4 font-weight-bold" tag="h3">
            Nueva Propiedad
        </v-card-title>

        <v-card-subtitle class="text-h5 py-5">
            Crea una nueva propiedad llenando el siguiente formulario
        </v-card-subtitle>

        <v-form class="mt-10">
            <v-text-field class="mb-5" label="Titulo Propiedad" v-model="titulo.value.value"
                :error-messages="titulo.errorMessage.value" />

            <v-file-input class="mb-5" accept="image/jpeg" label="Fotografia" prepend-icon="mdi-camera"
                v-model="imagen.value.value" :error-messages="imagen.errorMessage.value" @change="uploadImage" />

            <div v-if="image" class="mb-5">
                <p class="font-weight-bold">Imagen Propiedad:</p>
                <img class="w-50" :src="image" />
            </div>

            <v-text-field class="mb-5" label="Precio" v-model="precio.value.value"
                :error-messages="precio.errorMessage.value" />

            <v-row>

                <v-col cols="12" md="4"><v-select label="Habitaciones" class="mb-5" :items="items"
                        v-model="habitaciones.value.value" :error-messages="habitaciones.errorMessage.value" /></v-col>

                <v-col cols="12" md="4"><v-select label="WC" class="mb-5" :items="items" v-model="wc.value.value"
                        :error-messages="wc.errorMessage.value" /></v-col>

                <v-col cols="12" md="4"><v-select label="Lugares Estacionamiento" class="mb-5" :items="items"
                        v-model="estacionamiento.value.value"
                        :error-messages="estacionamiento.errorMessage.value" /></v-col>

            </v-row>

            <v-textarea class="mb-5" label="Descripcion" v-model="descripcion.value.value"
                :error-messages="descripcion.errorMessage.value" />

            <v-checkbox label="Alberca" v-model="alberca.value.value" :error-messages="alberca.errorMessage.value" />

            <h2 class="font-weight-bold text-center my-5">Ubicacion</h2>

            <v-autocomplete class="mb-5" label="Pais" v-model="pais.value.value" :items="paises" item-title="name"
                item-value="iso2" :error-messages="pais.errorMessage.value" />

            <v-autocomplete class="mb-5" label="Estado" v-model="estado.value.value" :items="locationStore.estados"
                item-title="name" item-value="iso2" :error-messages="estado.errorMessage.value" />

            <v-autocomplete class="mb-5" label="Ciudad" v-model="ciudad.value.value" :items="locationStore.ciudades"
                item-title="name" item-value="iso2" :error-messages="ciudad.errorMessage.value" />

            <v-text-field class="mb-5" label="Calle" v-model="calle.value.value"
                :error-messages="calle.errorMessage.value" />

            <v-row>

                <v-col cols="12" md="9"><v-text-field class="mb-5" label="Colonia" v-model="colonia.value.value"
                        :error-messages="colonia.errorMessage.value" /></v-col>

                <v-col cols="12" md="3"><v-text-field class="mb-5" label="Codigo Postal"
                        v-model="codigoPostal.value.value" :error-messages="codigoPostal.errorMessage.value" /></v-col>

            </v-row>

            <v-btn class="mb-5" color="light-blue-lighten-4" block @click.prevent="verificacionUbicacion">Verificar
                Ubicacion en el Mapa</v-btn>

            <div class="pb-10">
                <div style="height:600px;">
                    <LMap v-model:zoom="zoom" :center="center" :use-global-leaflet="false">
                        <LMarker :lat-lng="center" draggable @moveend="pin" />
                        <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></LTileLayer>
                    </LMap>
                </div>
            </div>

            <v-btn color="pink-accent-3" block @click="submit">Agregar Propiedad</v-btn>
        </v-form>
    </v-card>
</template>