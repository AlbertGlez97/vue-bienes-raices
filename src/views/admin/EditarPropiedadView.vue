<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // Función para acceder a la ruta actual
import { useFirestore, useDocument } from 'vuefire'; // Funciones para interactuar con Firestore en Vue
import { doc, updateDoc } from 'firebase/firestore'; // Funciones específicas de Firestore para trabajar con documentos
import { useField, useForm } from 'vee-validate'
import "leaflet/dist/leaflet.css";
import {
    LMap,
    LTileLayer,
    LMarker
} from "@vue-leaflet/vue-leaflet";
import useImage from '@/composables/useImage'
import usePropiedades from '@/composables/usePropiedades';
import useLocationMap from '@/composables/useLocationMap'
import { validationSchema } from '@/validation/propiedadSchema'
import { useLocationStore } from "@/stores/userLocation"

const locationStore = useLocationStore();
const paises = ref();

const docImagen = ref();

const items = [1, 2, 3, 4, 5]

const { url, uploadImage, image } = useImage()
const { deleteImagen } = usePropiedades()
const { zoom, center, obtenerCordenas, pin } = useLocationMap()

const { handleSubmit } = useForm({ validationSchema });

const titulo = useField('titulo')
const imagen = useField('imagen')
const precio = useField('precio')
const habitaciones = useField('habitaciones')
const wc = useField('wc')
const estacionamiento = useField('estacionamiento')
const descripcion = useField('descripcion')
const alberca = useField('alberca')
const pais = useField('pais')
const estado = useField('estado')
const ciudad = useField('ciudad')
const calle = useField('calle')
const colonia = useField('colonia')
const codigoPostal = useField('codigoPostal')

// Obtener la ruta actual
const route = useRoute();
const router = useRouter();

// Inicializar Firestore y obtener la referencia al documento 'propiedades' con el ID de la ruta
const db = useFirestore();
const docRef = doc(db, 'propiedades', route.params.id);

// Obtener la propiedad correspondiente al documento con el ID de la ruta
const docPropiedad = useDocument(docRef);

const submit = handleSubmit(async values => {
    const { imagen, ...propiedad } = values
    if (image.value) {
        const data = {
            ...propiedad,
            imagen: url.value,
            ubicacion: center.value
        }

        await updateDoc(docRef, data)
        await deleteImagen(docImagen.value)
    } else {
        const data = {
            ...propiedad,
            ubicacion: center.value
        }
        await updateDoc(docRef, data)
    }
    
    router.push({ name: 'admin-propiedades' })
})

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

    obtenerCordenas(cadenaUbicacion)
}

onMounted(async () => {
    await locationStore.mostrarPaises();
    paises.value = locationStore.paises;
});

watch(pais.value, (newValue, oldValue) => {
    if (newValue !== null) {
        locationStore.mostrarEstados(newValue)
    }
}, {
    deep: true
})

watch(estado.value, (newValue, oldValue) => {
    if (newValue !== null) {
        locationStore.mostrarCiudades(pais.value.value, newValue)
    }
}, {
    deep: true
})

watch(docPropiedad, (docPropiedad) => {
    titulo.value.value = docPropiedad.titulo;
    imagen.value.value = docPropiedad.imagen;
    docImagen.value = docPropiedad.imagen;
    precio.value.value = docPropiedad.precio;
    habitaciones.value.value = docPropiedad.habitaciones;
    wc.value.value = docPropiedad.wc;
    estacionamiento.value.value = docPropiedad.estacionamiento;
    descripcion.value.value = docPropiedad.descripcion;
    alberca.value.value = docPropiedad.alberca;
    pais.value.value = docPropiedad.pais;
    estado.value.value = docPropiedad.estado;
    ciudad.value.value = docPropiedad.ciudad;
    calle.value.value = docPropiedad.calle;
    colonia.value.value = docPropiedad.colonia;
    codigoPostal.value.value = docPropiedad.codigoPostal;
    center.value = docPropiedad.ubicacion;
})

</script>


<template>
    <v-card max-width="800" flat class="mx-auto my-10">
        <v-card-title class="mt-5">
            <h1 class="text-h4 font-weight-bold">Editar Propiedad</h1>
        </v-card-title>
        <v-card-subtitle>
            <p class="text-h5">Edita los detalles de la propiedad</p>
        </v-card-subtitle>

        <v-form class="mt-10">
            <v-text-field v-model="titulo.value.value" :error-messages="titulo.errorMessage.value" label="Titulo"
                class="mb-5"></v-text-field>

            <v-file-input v-model="imagen.value.value" :error-messages="imagen.errorMessage.value" accept="image/jpeg"
                prepend-icon="mdi-camera" label="Fotografía" class="mb-5" @change="uploadImage"></v-file-input>

            <div class="my-5">
                <p class="font-weight-bold">Imagen Actual:</p>
                <img v-if="image" class="w-50" :src="image" />
                <img v-else class="w-50" :src="docPropiedad?.imagen" />
            </div>


            <v-text-field v-model="precio.value.value" :error-messages="precio.errorMessage.value" label="Precio"
                class="mb-5"></v-text-field>

            <v-row>
                <v-col cols="12" md="4">
                    <v-select label="Habitaciones" class="mb-5" :items="items" v-model="habitaciones.value.value"
                        :error-messages="habitaciones.errorMessage.value" />
                </v-col>

                <v-col cols="12" md="4">
                    <v-select label="WC" class="mb-5" :items="items" v-model="wc.value.value"
                        :error-messages="wc.errorMessage.value" />
                </v-col>

                <v-col cols="12" md="4">
                    <v-select label="Lugares Estacionamiento" class="mb-5" :items="items"
                        v-model="estacionamiento.value.value" :error-messages="estacionamiento.errorMessage.value" />
                </v-col>
            </v-row>

            <v-textarea v-model="descripcion.value.value" :error-messages="descripcion.errorMessage.value"
                label="Descripción" class="mb-5"></v-textarea>

            <v-checkbox v-model="alberca.value.value" label="Alberca"></v-checkbox>


            <h2 class="font-weight-bold text-center my-5">Ubicación</h2>

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
                <div style="height:600px">
                    <LMap v-model:zoom="zoom" :center="center" :use-global-leaflet="false">
                        <LMarker :lat-lng="center" draggable @moveend="pin" />
                        <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></LTileLayer>
                    </LMap>
                </div>
            </div>

            <v-btn color="pink-accent-3" block @click="submit">
                Guardar Cambios
            </v-btn>
        </v-form>
    </v-card>
</template>