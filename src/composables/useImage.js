// Importar las funciones necesarias desde las bibliotecas Vue y Firebase
import { computed } from "vue"
import { ref as storageRef } from "firebase/storage"
import { useFirebaseStorage, useStorageFile } from "vuefire"
import { uid } from "uid"

// Definir una función exportable llamada useImagen
export default function useImagen() {
    // Inicializar el almacenamiento de Firebase
    const storage = useFirebaseStorage()

    // Crear una referencia al directorio /propiedades con un nombre de archivo único generado por uid() y extensión .jpg
    const storageRefPath = storageRef(storage, `/propiedades/${uid()}.jpg`)

    // Obtener la URL de la imagen y la función de carga del almacenamiento de Firebase
    const { url, upload } = useStorageFile(storageRefPath)

    // Función para cargar la imagen al almacenamiento de Firebase
    function uploadImage(e) {
        const data = e.target.files[0]
        // Verificar si se seleccionó algún archivo
        if(data){
            // Cargar el archivo utilizando la función de carga
            upload(data)
        }
    }

    // Propiedad computada para devolver la URL de la imagen si está disponible, de lo contrario devuelve null
    const image = computed(() =>{
        return url.value ? url.value : null
    })

    // Devolver un objeto con las propiedades url (URL de la imagen), uploadImage (función para cargar imágenes) y image (propiedad computada para la URL de la imagen)
    return {
        url,
        uploadImage,
        image
    }
}
