// Importación de módulos de Vue Router y Firebase
import { createRouter, createWebHistory } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { useFirebaseAuth } from 'vuefire'

// Importación de componentes de las vistas
import HomeView from '../views/HomeView.vue'

// Creación del router con las rutas de la aplicación
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Configuración del historial de navegación
  routes: [ // Definición de las rutas de la aplicación
    {
      path: '/', // Ruta de inicio
      name: 'home', // Nombre de la ruta
      component: HomeView // Componente asociado a la ruta
    },
     {
      path: '/propiedades/:id', // Ruta para mostrar la propiedad
      name: 'propiedad', // Nombre de la ruta
      component: () => import('../views/PropiedadView.vue') // Componente asociado a la ruta
    },
    {
      path: '/login', // Ruta para la página de inicio de sesión
      name: 'login', // Nombre de la ruta
      component: () => import('../views/LoginView.vue') // Componente asociado a la ruta (cargado dinámicamente)
    },
    {
      path: '/admin', // Ruta para el panel de administración
      name: 'admin', // Nombre de la ruta
      component: () => import('../views/admin/AdminLayout.vue'), // Componente del layout de administración
      meta: { requiresAuth: true }, // Metadatos que indican que se requiere autenticación para acceder
      children: [ // Rutas hijas del panel de administración, se puede llamar "anidación" o "anidar rutas"
        {
          path: 'propiedades',
          name: 'admin-propiedades',
          component: () => import('../views/admin/AdminView.vue')
        },
        {
          path: 'nueva',
          name: 'nueva-propiedad',
          component: () => import('../views/admin/NuevaPropiedadView.vue')
        },
        {
          path: 'editar/:id',
          name: 'editar-propiedad',
          component: () => import('../views/admin/EditarPropiedadView.vue')
        },
      ]
    }
  ]
})

// Guardia de navegación, también conocida como "guard" en inglés: Verifica la autenticación del usuario antes de cargar ciertas rutas.
// Redirige a la página de inicio de sesión si el usuario no está autenticado.
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(url => url.meta.requiresAuth) // Verificar si la ruta requiere autenticación
  if (requiresAuth) {
    try {
      await authenticateUser() // Autenticar al usuario
      next() // Continuar navegación si la autenticación es exitosa
    } catch (error) {
      console.log(error) // Manejar errores de autenticación
      next({ name: 'login' }) // Redirigir a la página de inicio de sesión si no está autenticado
    }
  } else {
    next() // Continuar navegación si la ruta no requiere autenticación
  }
})

// Función para autenticar al usuario usando Firebase
function authenticateUser() {
  const auth = useFirebaseAuth() // Obtener la instancia de autenticación de Firebase
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => { // Escuchar cambios en la autenticación
      unsubscribe() // Dejar de escuchar después de la primera respuesta
      if (user) {
        resolve(user) // Resolver la promesa si el usuario está autenticado
      } else {
        reject() // Rechazar la promesa si el usuario no está autenticado
      }
    })
  })
}

export default router // Exportar el router para su uso en la aplicación
