// /js/views/dashboardView.js
const DashboardView = {
    htmlFile: 'dashboard.html',

    init: () => {
        console.log('Inicializando la vista del Dashboard...');
        document.querySelector('h1').style.color = 'blue'; // Ejemplo de manipulación del DOM

        // Lógica específica del dashboard
        // Por ejemplo, llamar a un servicio para obtener estadísticas
        // fetch('/api/stats').then(...)
    }
};

// Exportamos el objeto para que router.js pueda importarlo
export default DashboardView;