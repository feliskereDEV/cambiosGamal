import { Modelo } from './Model.js';
import { Vista } from './View.js';

/**

 * Contiene la lógica de la aplicación y maneja los eventos del usuario.
 */
class Controlador {
    constructor() {
        // Inicializar instancias del Modelo y la Vista
        this.modelo = new Modelo();
        this.vista = new Vista();

        // Enlazar métodos del controlador a los eventos de la vista
        this.setupEventListeners();
    }

    /**
     Inicializa la aplicación: carga datos y renderiza la vista inicial.
     */
    async inicializarApp() {
        //  Inicializa datos del Modelo
        await this.modelo.inicializarStock();
        
        //  Renderiza la vista inicial
        this.actualizarVistas();
    }

   
    setupEventListeners() {
        // Listener para Guardar Carrito
        this.vista.elements.guardarCarritoBtn.addEventListener('click', this.controladorGuardarCarrito.bind(this));

        // Listener para Volver al Inicio
        if (this.vista.elements.volverBtn) {
            this.vista.elements.volverBtn.addEventListener('click', (e) => {
                // Previene la navegación inmediata para manejar la lógica de descarte
                e.preventDefault(); 
                this.controladorManejarVolver();
            });
        }
    }

  
    actualizarVistas() {
        // Muestra productos disponibles, pasando el controlador de agregar como callback
        this.vista.mostrarProductos(this.modelo.productos, this.controladorAgregarProducto.bind(this));
        
        // Actualiza el carrito, pasando el controlador de eliminar como callback
        this.vista.actualizarCarrito(this.modelo.carrito, this.modelo.total, this.controladorEliminarProducto.bind(this));
    }

  

  
    controladorAgregarProducto(index) {
        const exito = this.modelo.agregarItemACarrito(index);
        if (exito) {
            this.actualizarVistas(); // Actualiza la interfaz si fue exitoso
        } else {
            alert('No hay stock disponible para este producto.');
        }
    }

    /**
     * Maneja la eliminación de un producto del carrito.
     */
    controladorEliminarProducto(index) {
        this.modelo.eliminarItemDeCarrito(index);
        this.actualizarVistas(); // Actualiza la interfaz
    }

    /**
     * Maneja el proceso de guardar el carrito actual.
     */
    controladorGuardarCarrito() {
        const nombre = this.vista.getNombreUsuario();
        
        if (!nombre) {
            return alert('Debes ingresar un nombre para guardar el carrito.');
        }
        if (this.modelo.carrito.length === 0) {
            return alert('No puedes guardar un carrito vacío.');
        }

        this.modelo.guardarCarrito(nombre); // Persistir en LocalStorage
        
        alert(`Carrito de ${nombre} guardado correctamente.`);
        // Redirige a la vista de carritos
        window.location.href = 'verCarritos.html'; 
    }

    /**
     * Maneja la lógica al intentar volver al inicio con un carrito no vacío.
     */
    controladorManejarVolver() {
        if (this.modelo.carrito.length === 0) {
            window.location.href = 'index.html';
            return;
        }

        const accion = confirm(
            'Tienes productos en tu carrito sin guardar.\n\n' +
            'Presiona Aceptar para DESHACER los cambios de stock y volver al inicio.\n' +
            'Presiona Cancelar para volver a la página y poder Guardar el carrito.'
        );

        if (accion) {
            // Descartar carrito y recuperar stock
            this.modelo.descartarCarritoYRecuperarStock();
            window.location.href = 'index.html';
        }
    }
}

// Creación de la instancia del Controlador al cargar el DOM.
document.addEventListener('DOMContentLoaded', () => {
    const app = new Controlador();
    app.inicializarApp();
});