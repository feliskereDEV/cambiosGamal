import { leerLocal, guardarLocal } from './utils.js';


document.addEventListener('DOMContentLoaded', () => {
    // Escucha el evento del botón de reseteo.
    document.getElementById('resetCarritos').addEventListener('click', controladorResetear);
});

/**
 * Controlador para resetear todos los carritos guardados y restaurar el stock.
 */
function controladorResetear() {
    const confirmacion = confirm(
        '¿Seguro que deseas borrar TODOS los carritos guardados?\n\n' +
        'ESTO TAMBIÉN RESTAURARÁ EL STOCK DE PRODUCTOS A SU VALOR INICIAL.'
    );

    if (confirmacion) {
        // Eliminar carritos guardados
        localStorage.removeItem('carritos');
        
        // Cargar el JSON original para restaurar el stock base
        fetch('data/productos.json') 
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(productosOriginales => {
                // Sobrescribir el stock persistente con los datos originales
                guardarLocal('productos', productosOriginales); 
                alert('✅ Todos los carritos fueron eliminados y el stock ha sido restaurado.');
                location.reload(); 
            })
            .catch(error => {
                console.error('Error al restaurar el stock:', error);
                alert('❌ Error al restaurar el stock. Verifica la ruta del archivo productos.json.');
            });   
    }
}