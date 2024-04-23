<script setup>
import { useForm, useField } from 'vee-validate' // Importación de funciones de validación de VeeValidate
import { collection, addDoc } from 'firebase/firestore'; // Importación de funciones de Firebase Firestore
import { useFirestore } from 'vuefire'; // Importación de la función useFirestore de VueFire
import { useRouter } from 'vue-router'; // Importación de la función useRouter de Vue Router
import { validationSchema, imageSchema } from '@/validation/propiedadSchema' // Importación de esquemas de validación

const items = [0, 1, 2, 3, 4, 5]; // Definición de un array de números

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

// Función de envío del formulario
const submit = handleSubmit(async (values) => {
    const { imagen, ...propiedad } = values // Extrae la imagen de los valores

    // Agrega un documento a la colección "propiedades" en Firestore
    const docRef = await addDoc(collection(db, "propiedades"), {
        ...propiedad // Datos de la propiedad
    });

    // Si se agregó el documento correctamente, redirige al panel de propiedades
    if (docRef.id) {
        router.push({ name: 'admin-propiedades' }) // Redirección a la vista de propiedades de administrador
    }
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
                v-model="imagen.value.value" :error-messages="imagen.errorMessage.value" />

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

            <v-btn color="pink-accent-3" block @click="submit">Agregar Propiedad</v-btn>
        </v-form>
    </v-card>
</template>