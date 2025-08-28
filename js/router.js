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

// Cargar nav.html al iniciar
async function loadNavbar() {
  const res = await fetch('/nav.html');
  const html = await res.text();
  document.getElementById('navbar').innerHTML = html;
  Alpine.initTree(document.getElementById('navbar')); // Reactivar Alpine si es necesario
}

// Inicializar
document.addEventListener('DOMContentLoaded', async () => {
  await loadNavbar();
  await initCommon();
});



router.on({
'/login': async () => {
    if (auth.currentUser) {
      router.navigate('/dashboard');
      return;
    }

    const module = await import('/js/views/login.js');
    module.init();

    const html = await fetch('/views/login.html').then(r => r.text());
    document.getElementById('app').innerHTML = html;
    // El navegador no ejecuta los <script> embebidos en el HTML inyectado con innerHTML.

    Alpine.initTree(document.getElementById('app')); // para reactivar Alpine en el nuevo HTML
  },

'/dashboard': async () => {
    if (!auth.currentUser || !currentUserProfile) {
      router.navigate('/login');
      return;
    }

    // ejemplo de navegación según rol
    if (currentUserProfile.role === 'admin') {
        router.navigate('/dashboardAdmin');
        return;
    } else if (currentUserProfile.role === 'empleado') {
        router.navigate('/dashboardEmpleado');
        return;
    } else {
         const module = await import('/js/views/dashboard.js');
        module.init();

        const html = await fetch('/views/dashboard.html').then(r => r.text());
        document.getElementById('app').innerHTML = html;

        Alpine.initTree(document.getElementById('app')); // para reactivar Alpine en el nuevo HTML
    }
  },

'/dashboardAdmin': async () => {
    if (!auth.currentUser || !currentUserProfile) {
      router.navigate('/login');
      return;
    }

    // ejemplo de navegación según rol
    if (currentUserProfile.role !== 'admin') {
        router.navigate('/dashboard');
        return;
    } else {        
        const module = await import('/js/views/dashboardAdmin.js');
        module.init(); 
        
        const html = await fetch('/views/dashboardAdmin.html').then(r => r.text());
        document.getElementById('app').innerHTML = html;
   
        Alpine.initTree(document.getElementById('app')); // para reactivar Alpine en el nuevo HTML
    }
  },

'/dashboardEmpleado': async () => {
    if (!auth.currentUser || !currentUserProfile) {
      router.navigate('/login');
      return;
    }

    // ejemplo de navegación según rol
    if (currentUserProfile.role !== 'empleado') {
        router.navigate('/dashboard');
        return;
    } else {
        
        const module = await import('/js/views/dashboardEmpleado.js');
        module.init();
        
        const html = await fetch('/views/dashboardEmpleado.html').then(r => r.text());
        document.getElementById('app').innerHTML = html;

        Alpine.initTree(document.getElementById('app')); // para reactivar Alpine en el nuevo HTML
    }
  },

  
'/tpv': async () => {
    if (!auth.currentUser || !currentUserProfile) {
      router.navigate('/login');
      return;
    }
    const module = await import('/js/views/tpv.js');
    module.init();

    const html = await fetch('/views/tpv.html').then(r => r.text());
    document.getElementById('app').innerHTML = html;

    // volver a escanear los <a data-navigo> que se inyectaron en la nueva vista
    router.updatePageLinks();
    /*
    Navigo funciona así:
      Cuando lo inicializas, escanea el DOM en busca de todos los <a data-navigo> que ya existen.
      Intercepta sus click para evitar que el navegador haga un GET real y en su lugar dispara la ruta SPA.
      Pero cuando tú inyectas HTML nuevo con fetch + innerHTML, esos enlaces no existían al momento del escaneo inicial → quedan “huérfanos” y el navegador intenta ir al servidor (404).
      Por eso router.updatePageLinks() es la forma de decirle a Navigo:
       “Oye, vuelve a mirar el DOM, que acabo de meter nuevos <a data-navigo>”.
      */

    Alpine.initTree(document.getElementById('app')); // para reactivar Alpine en el nuevo HTML
  },

  '/tpvPedidos': async () => {
    if (!auth.currentUser || !currentUserProfile) {
      router.navigate('/login');
      return;
    }
    const module = await import('/js/views/tpvPedidos.js');
    module.init();

    const html = await fetch('/views/tpvPedidos.html').then(r => r.text());
    document.getElementById('tpv-content-app').innerHTML = html;

    Alpine.initTree(document.getElementById('tpv-content-app'));
    },

  '/tpvRepartos': async () => {
    if (!auth.currentUser || !currentUserProfile) {
      router.navigate('/login');
      return;
    }
    const module = await import('/js/views/tpvRepartos.js');
    module.init();

    const html = await fetch('/views/tpvRepartos.html').then(r => r.text());
    document.getElementById('tpv-content-app').innerHTML = html;

    Alpine.initTree(document.getElementById('tpv-content-app'));
    },

  '/tpvComandero': async () => {
    if (!auth.currentUser || !currentUserProfile) {
      router.navigate('/login');
      return;
    }
    const module = await import('/js/views/tpvComandero.js');
    module.init();

    const html = await fetch('/views/tpvComandero.html').then(r => r.text());
    document.getElementById('tpv-content-app').innerHTML = html;

    Alpine.initTree(document.getElementById('tpv-content-app'));
    },

  '/tpvCobrar': async () => {
    if (!auth.currentUser || !currentUserProfile) {
      router.navigate('/login');
      return;
    }
    const module = await import('/js/views/tpvCobrar.js');
    module.init();

    const html = await fetch('/views/tpvCobrar.html').then(r => r.text());
    document.getElementById('app').innerHTML = html;

    Alpine.initTree(document.getElementById('app'));
    },

  '/personal': async () => {
    if (!auth.currentUser || !currentUserProfile) {
      router.navigate('/login');
      return;
    }

    const module = await import('/js/views/personal.js');
    module.init();

    const html = await fetch('/views/personal.html').then(r => r.text());
    document.getElementById('app').innerHTML = html;

    Alpine.initTree(document.getElementById('app'));
    },

  '/gastos': async () => {
    if (!auth.currentUser || !currentUserProfile) {
      router.navigate('/login');
      return;
    }

    const module = await import('/js/views/gastos.js');
    module.init();

    const html = await fetch('/views/gastos.html').then(r => r.text());
    document.getElementById('app').innerHTML = html;

    Alpine.initTree(document.getElementById('app'));
    },

  '/gestionFacturas': async () => {
    if (!auth.currentUser || !currentUserProfile) {
      router.navigate('/login');
      return;
    }

    const module = await import('/js/views/gestionFacturas.js');
    module.init();

    const html = await fetch('/views/gestionFacturas.html').then(r => r.text());
    document.getElementById('app').innerHTML = html;

    Alpine.initTree(document.getElementById('app'));
    },

  '/gestionDocumentos': async () => {
    if (!auth.currentUser || !currentUserProfile) {   
      router.navigate('/login');
      return;
    }

    const module = await import('/js/views/gestionDocumentos.js');
    module.init();  

    const html = await fetch('/views/gestionDocumentos.html').then(r => r.text());
    document.getElementById('app').innerHTML = html;  
    Alpine.initTree(document.getElementById('app'));
    },

  '/gestionImpuestos': async () => {
    if (!auth.currentUser || !currentUserProfile) { 
      router.navigate('/login');
      return;
    }   
    const module = await import('/js/views/gestionImpuestos.js');
    module.init();  

    const html = await fetch('/views/gestionImpuestos.html').then(r => r.text());
    document.getElementById('app').innerHTML = html;
    Alpine.initTree(document.getElementById('app'));
    },  

  '/gestionInformes': async () => {
    if (!auth.currentUser || !currentUserProfile) {
      router.navigate('/login');
      return;
    } 
    const module = await import('/js/views/gestionInformes.js');
    module.init();    

    const html = await fetch('/views/gestionInformes.html').then(r => r.text());
    document.getElementById('app').innerHTML = html;  

    Alpine.initTree(document.getElementById('app'));
    },  

  '/miFicha': async () => {
    if (!auth.currentUser || !currentUserProfile) {
      router.navigate('/login');
      return;
    }

    const module = await import('/js/views/miFicha.js');
    module.init();

    const html = await fetch('/views/miFicha.html').then(r => r.text());
    document.getElementById('app').innerHTML = html;

    Alpine.initTree(document.getElementById('app'));
    },


  '*': async () => {
    router.navigate('/dashboard');
    return;
  }
}).resolve();

