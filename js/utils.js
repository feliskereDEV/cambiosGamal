/**
 * Módulo de Utilidades para el manejo de LocalStorage.
 */

// Función para guardar datos en LocalStorage.
function guardarLocal(nombre, data) {
    localStorage.setItem(nombre, JSON.stringify(data));
}

// Función para leer datos de LocalStorage. Retorna un array vacío si no existe el ítem.
function leerLocal(nombre) {
    const data = localStorage.getItem(nombre);
    try {
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error(`Error al parsear el LocalStorage para la clave "${nombre}":`, e);
        return [];
    }
}

// Exportamos las funciones para que puedan ser utilizadas por otros módulos.
export { guardarLocal, leerLocal };