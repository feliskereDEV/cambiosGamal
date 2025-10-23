import { guardarLocal, leerLocal } from '../utils.js';


export class Modelo {
    constructor() {
        this.productos = []; // Stock actual de productos
        this.carrito = [];   // Productos en el carrito actual
        this.total = 0;      // Total del carrito actual
    }

    /**
     * Carga el stock inicial de productos desde LocalStorage o desde el JSON.
     */
    async inicializarStock() {
        const productosGuardados = leerLocal('productos');

        if (productosGuardados.length > 0) {
            this.productos = productosGuardados;
        } else {
            try {
                // Cargar datos iniciales desde el JSON
                const res = await fetch('data/productos.json');
                const data = await res.json();
                this.productos = data;
                this.actualizarStockPersistente(); // Guardar el stock por primera vez
            } catch (error) {
                console.error("Error al cargar productos iniciales:", error);
            }
        }
    }

    /**
     * Actualiza el stock persistente en LocalStorage.
     */
    actualizarStockPersistente() {
        guardarLocal('productos', this.productos);
    }

    /**
     * Agrega un producto al carrito, disminuyendo su stock.

     */
    agregarItemACarrito(index) {
        const producto = this.productos[index];
        if (producto.stock > 0) {
            producto.stock--; // Disminuir stock en el modelo
            this.carrito.push({ ...producto }); // Clonar y agregar al carrito
            this.total += producto.precio;
            this.actualizarStockPersistente();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Elimina un producto del carrito y recupera el stock.
     */
    eliminarItemDeCarrito(i) {
        const producto = this.carrito[i];
        this.carrito.splice(i, 1); // Eliminar del carrito
        this.total -= producto.precio;

        // Recuperar stock en el array de productos principal
        const prodStock = this.productos.find(p => p.nombre === producto.nombre);
        if (prodStock) prodStock.stock++;

        this.actualizarStockPersistente();
    }

    /**
     * Guarda el carrito actual como un carrito histórico en LocalStorage.
  
     */
    guardarCarrito(nombreUsuario) {
        const carritos = leerLocal('carritos');
        carritos.push({
            nombre: nombreUsuario,
            productos: this.carrito,
            total: this.total,
            pagado: false,
            fecha: new Date().toLocaleString() // Añadir una marca de tiempo
        });
        guardarLocal('carritos', carritos);
        // Limpiar el carrito actual después de guardar
        this.carrito = [];
        this.total = 0;
    }

    /**
     * Devuelve el stock de los productos en el carrito actual y limpia el carrito.
     */
    descartarCarritoYRecuperarStock() {
        // Devolver el stock de todos los ítems del carrito
        this.carrito.forEach(prodCarrito => {
            const prodStock = this.productos.find(p => p.nombre === prodCarrito.nombre);
            if (prodStock) prodStock.stock++;
        });

        this.actualizarStockPersistente(); // Guardar el stock recuperado
        
        // Limpiar la sesión actual
        this.carrito = [];
        this.total = 0;
    }
    
    /**
     * Obtiene todos los carritos guardados.

     */
    getCarritosGuardados() {
        return leerLocal('carritos');
    }

    /**
     * Alterna el estado de pago de un carrito guardado y lo persiste.

     */
    toggleEstadoPago(index) {
        const carritos = this.getCarritosGuardados();
        if (carritos[index]) {
            carritos[index].pagado = !carritos[index].pagado;
            guardarLocal('carritos', carritos);
        }
    }
}