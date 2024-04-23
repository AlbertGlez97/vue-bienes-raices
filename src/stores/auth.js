import { ref, computed, onMounted } from "vue";
import { defineStore } from "pinia";
import { useFirebaseAuth } from 'vuefire';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore('auth', () => {
    // Obtener la instancia de autenticación de Firebase
    const auth = useFirebaseAuth();
    // Estado para almacenar el usuario autenticado
    const authUser = ref(null);
    // Instancia de Vue Router para manejar el enrutamiento
    const router = useRouter();

    // Estado para almacenar mensajes de error
    const errorMsg = ref('');
    // Mapeo de códigos de error de Firebase a mensajes descriptivos
    const errorCodes = {
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/invalid-credential': 'Credenciales inválidas',
        'auth/wrong-password': 'Password incorrecto',
    };

    // Ejecutar código cuando el componente se monta
    onMounted(() => {
        // Escuchar cambios en el estado de autenticación
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Actualizar el estado del usuario autenticado
                authUser.value = user;
            }
        });
    });

    // Función para iniciar sesión
    const login = ({ email, password }) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                authUser.value = user;
                // Redireccionar al usuario a la página de Admin Panel
                router.push({ name: 'admin-propiedades' });
            })
            .catch(error => {
                // Capturar y mostrar errores de autenticación
                errorMsg.value = errorCodes[error.code];
            });
    };

    // Función para cerrar sesión
    const logout = () => {
        signOut(auth).then(() => {
            // Limpiar el estado del usuario autenticado
            authUser.value = null;
            // Redireccionar al usuario a la página de inicio de sesión
            router.push({ name: 'login' });
        }).catch(error => {
            console.log(error);
        });
    };

    // Computed property para verificar si hay errores
    const hasError = computed(() => {
        return errorMsg.value !== '';
    });

    // Computed property para verificar si el usuario está autenticado
    const isAuth = computed(() => {
        return authUser.value !== null;
    });

    // Devolver las funciones y estados necesarios para el manejo de la autenticación
    return {
        login,
        logout,
        hasError,
        errorMsg,
        isAuth
    };
});
