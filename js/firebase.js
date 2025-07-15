// Firebase SDK -->
// Importa las funciones que necesitas de los SDKs de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";



// --- CONFIGURACIÓN ---
const firebaseConfig = {
    apiKey: "AIzaSyBZRE3MDgZrrCFBN-NIQm3FaaCkH8WSc-E",
    authDomain: "tavolatpv.firebaseapp.com",
    projectId: "tavolatpv",
    storageBucket: "tavolatpv.firebasestorage.app",
    messagingSenderId: "1094358998769",
    appId: "1:1094358998769:web:007696239b19cd87acd350",
    measurementId: "G-EHHK43P9Q0"
};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'pizzeria-app-default';

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);   

let currentUserProfile = null;

async function fetchUserProfile(uid) {
    const userDocRef = doc(db, `artifacts/${appId}/public/data/users`, uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        currentUserProfile = { id: userDocSnap.id, ...userDocSnap.data() };
        return { id: userDocSnap.id, ...userDocSnap.data() };
    } else {
        console.error("No user profile found for UID:", uid);
        throw new Error("Perfil no encontrado");
    }
}

// Exporta todo lo necesario para usar en otros scripts
export {
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  fetchUserProfile
};