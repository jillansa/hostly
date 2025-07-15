import { auth } from '/js/firebase.js';

//import { validarEmail } from '../utils/validacion.js';
//import { mostrarError } from '../ui/mensajes.js';

export function initCommon() {
  window.logout = async () => {
    try {
      await auth.signOut();
      alert("Sesión cerrada");
      // Por ejemplo, recarga o redirige a login
      //window.location.href = '/login';
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Error cerrando sesión");
    }
  };

  window.getEnvironment = () => {
    return "PRUEBAS"; // o "PRODUCCIÓN"
  };

  // Puedes añadir más funciones comunes aquí
}



