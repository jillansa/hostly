// /js/router.js

// Importa la lógica de cada vista
import DashboardView from './views/dashboardView.js';
import PedidosView from './views/pedidosView.js';

// Selecciona el contenedor principal de la app
const appContainer = document.getElementById('app');
const router = new Navigo('/'); // Inicializa Navigo en la raíz del sitio

// Función para cargar vistas
const loadView = async (view) => {
    // Carga el fragmento HTML
    const response = await fetch(`/views/${view.htmlFile}`);
    appContainer.innerHTML = await response.text();
    // Ejecuta el JS de la vista
    view.init(); 
};

router.on({
    '/': () => loadView(DashboardView),
    '/pedidos': () => loadView(PedidosView),
    '/habitaciones': () => { /* Cargar vista de habitaciones */ },
    // ... más rutas
}).resolve(); // ¡Muy importante! Pone en marcha el router

// Añade links en tu menú de navegación con el atributo data-navigo
// <a href="/pedidos" data-navigo>Pedidos</a>