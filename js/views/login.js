import { auth, signInWithEmailAndPassword } from '/js/firebase.js';

//import { validarEmail } from '../utils/validacion.js';
//import { mostrarError } from '../ui/mensajes.js';

export function init() {
    // Definimos una función global accesible desde Alpine
    window.loginForm = () => ({
        email: '',
        password: '',
        async login() {
            try {
            await signInWithEmailAndPassword(auth, this.email, this.password);
            } catch (err) {
            alert("Login failed: " + err.message);
            }
        },
    });
    
}



