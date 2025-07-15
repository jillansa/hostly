import { auth, onAuthStateChanged, fetchUserProfile } from './firebase.js';
import Navigo from 'https://unpkg.com/navigo?module';
import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js';
import { initCommon } from '/js/common.js';


const router = new Navigo('/');

// --- LÓGICA DE AUTENTICACIÓN ---

let currentUser = null;
let currentUserProfile = null;

onAuthStateChanged(auth, async (user) => {
    if (user) {
    
        currentUser = user;
        await fetchUserProfile(user.uid).then((profile) => {
            currentUserProfile = profile;

            Alpine.store('user', {
                uid: currentUser.uid,
                email: currentUser.email,
                role: currentUserProfile.role,
                profile: currentUserProfile // cuidado si también es complejo
            });

            // ejemplo de navegación según rol
            if (currentUserProfile.role === 'admin') {
                router.navigate('/dashboardAdmin');
                return;
            } else if (currentUserProfile.role === 'empleado') {
                router.navigate('/dashboardEmpleado');
                return;
            } else {
                router.navigate('/dashboard');
                return;
            }
        });
    
    /*).catch(() => {
            console.error("No se pudo obtener el perfil");
            currentUser = null;
            currentUserProfile = null;
            router.navigate('/login');
        });
    */
    } else {
        currentUser = null;
        currentUserProfile = null;
        
        //Alpine.store('user', null);

        router.navigate('/login');
        return;
    }
});



router.on({
'/login': async () => {
    if (auth.currentUser) {
      router.navigate('/dashboard');
      return;
    }

    initCommon();

    const html = await fetch('/views/login.html').then(r => r.text());
    document.getElementById('app').innerHTML = html;
    // El navegador no ejecuta los <script> embebidos en el HTML inyectado con innerHTML.
    const module = await import('/js/views/login.js');
    module.init();
    Alpine.initTree(document.getElementById('app')); // para reactivar Alpine en el nuevo HTML
  },

'/dashboard': async () => {
    if (!auth.currentUser || !currentUserProfile) {
      router.navigate('/login');
      return;
    }
    
    initCommon();

    // ejemplo de navegación según rol
    if (currentUserProfile.role === 'admin') {
        router.navigate('/dashboardAdmin');
        return;
    } else if (currentUserProfile.role === 'empleado') {
        router.navigate('/dashboardEmpleado');
        return;
    } else {
        
        const html = await fetch('/views/dashboard.html').then(r => r.text());
        document.getElementById('app').innerHTML = html;
        const module = await import('/js/views/dashboard.js');
        module.init();
        Alpine.initTree(document.getElementById('app')); // para reactivar Alpine en el nuevo HTML
    }
  },

'/dashboardAdmin': async () => {
    if (!auth.currentUser || !currentUserProfile) {
      router.navigate('/login');
      return;
    }

    initCommon();

    // ejemplo de navegación según rol
    if (currentUserProfile.role !== 'admin') {
        router.navigate('/dashboard');
        return;
    } else {        
        const html = await fetch('/views/dashboardAdmin.html').then(r => r.text());
        document.getElementById('app').innerHTML = html;
        const module = await import('/js/views/dashboardAdmin.js');
        module.init();    
        Alpine.initTree(document.getElementById('app')); // para reactivar Alpine en el nuevo HTML
    }
  },

'/dashboardEmpleado': async () => {
    if (!auth.currentUser || !currentUserProfile) {
      router.navigate('/login');
      return;
    }

    initCommon();

    // ejemplo de navegación según rol
    if (currentUserProfile.role !== 'empleado') {
        router.navigate('/dashboard');
        return;
    } else {
        
        const html = await fetch('/views/dashboardEmpleado.html').then(r => r.text());
        document.getElementById('app').innerHTML = html;
        const module = await import('/js/views/dashboardEmpleado.js');
        module.init();
        Alpine.initTree(document.getElementById('app')); // para reactivar Alpine en el nuevo HTML
    }
  },

  '*': async () => {
    router.navigate('/dashboard');
    return;
  }
}).resolve();
