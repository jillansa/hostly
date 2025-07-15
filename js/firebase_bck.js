// Firebase SDK -->
// Importa las funciones que necesitas de los SDKs de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc,
    addDoc,
    collection, 
    onSnapshot,
    query,
    where,
    Timestamp,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";



// --- CONFIGURACIÓN Y VARIABLES GLOBALES ---

// La configuración de Firebase se inyectará aquí.
// En un entorno real, estos valores vendrían de tu consola de Firebase.
//const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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


let currentUser = null;
let currentUserProfile = null;
let map = null;
let driverMarkers = {};
let locationWatcherId = null;


// --- LÓGICA DE AUTENTICACIÓN ---

onAuthStateChanged(auth, async (user) => {
    //console.log("onAuthStateChanged");
    if (user) {
        //console.log("onAuthStateChanged + user");
        
        // Usuario ha iniciado sesión
        currentUser = user;

        //for (let clave in user) {
        //    console.log(clave + ": " + user[clave]);
        //}
        //console.log("onAuthStateChanged - fetchUserProfile");
        //console.log("onAuthStateChanged - fetchUserProfile - user.uid=" + user.uid);
        await fetchUserProfile(user.uid);
        //console.log("onAuthStateChanged + fetchUserProfile");
        
        document.getElementById('user-email').textContent = user.email;
        //loginView.classList.add('hidden');
        //mainView.classList.remove('hidden');
        //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
        //for (let clave in currentUserProfile) {
        //    console.log("currentUserProfile:" + clave + ": " + currentUserProfile[clave]);
        //}

        if (currentUserProfile && currentUserProfile.role === 'admin') {
            //console.log("onAuthStateChanged + setupAdminView");
            //setupAdminView();
            router.navigate('/dashboard');
        } else {
            //console.log("onAuthStateChanged + setupEmployeeView");
            //setupEmployeeView();
            router.navigate('/dashboard2');
        }
    } else {
        // Usuario no ha iniciado sesión
        currentUser = null;
        currentUserProfile = null;
        //loginView.classList.remove('hidden');
        //mainView.classList.add('hidden');
        //if (locationWatcherId) {
        //navigator.geolocation.clearWatch(locationWatcherId);
        //    locationWatcherId = null;
        //}
        router.navigate('/login');
    }
});

async function fetchUserProfile(uid) {
    //console.log("fetchUserProfile: " + `artifacts/${appId}/public/data/users/` + uid);
    const userDocRef = doc(db, `artifacts/${appId}/public/data/users`, uid);
    //console.log("fetchUserProfile: userDocRef=" + userDocRef);

    //for (let clave in userDocRef) {
    //    console.log(clave + ": " + userDocRef[clave]);
    //}

    const userDocSnap = await getDoc(userDocRef);
    //console.log("fetchUserProfile GUAY");
    //console.log("fetchUserProfile GUAY");
    //console.log("");
    //console.log("");

    //for (let clave in userDocSnap) {
    //    console.log("userDocSnap." + clave + ": " + userDocSnap[clave]);
    //}

    if (userDocSnap.exists()) {
        //console.error("HAy currentUserProfile:", uid);
        currentUserProfile = { id: userDocSnap.id, ...userDocSnap.data() };
    } else {
        console.error("No user profile found for UID:", uid);
        // Podríamos crear un perfil por defecto o cerrar sesión
    }
}

// Exporta todo lo necesario para usar en otros scripts
export {
  auth
};