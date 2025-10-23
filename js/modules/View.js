/**
 * Clase Vista (V)
 * Encargada de la manipulación directa del DOM y de renderizar los datos.
 * NO contiene lógica de negocio.
 */
export class Vista {
    constructor() {
        // Referencias a los elementos del DOM (se asume que existen en crearCarrito.html)
        this.elements = {
            listaProductos: document.getElementById('listaProductos'),
            listaCarrito: document.getElementById('listaCarrito'),
            totalDisplay: document.getElementById('total'),
            nombreUsuario: document.getElementById('nombreUsuario'),
            guardarCarritoBtn: document.getElementById('guardarCarrito'),
            volverBtn: document.querySelector('.volver')
        };
    }

    /**
     * Renderiza la lista de productos disponibles con su stock y botón de agregar.

     */
    mostrarProductos(productos, agregarHandler) {
        this.elements.listaProductos.innerHTML = ''; // Limpiar lista

        productos.forEach((p, index) => {
            const li = document.createElement('li');
            li.innerHTML = `${p.nombre} - **$${p.precio}** (Stock: ${p.stock})`;

            const btn = document.createElement('button');
            btn.textContent = 'Agregar';
            btn.classList.add('btn-agregar');
            btn.disabled = p.stock === 0;

            // Delegación del evento al Controlador
            btn.addEventListener('click', () => agregarHandler(index));

            li.appendChild(btn);
            this.elements.listaProductos.appendChild(li);
        });
    }

    /**
     * Actualiza la vista del carrito actual (productos en carrito y total).

     */
    actualizarCarrito(carrito, total, eliminarHandler) {
        this.elements.listaCarrito.innerHTML = ''; // Limpiar lista

        carrito.forEach((p, i) => {
            const li = document.createElement('li');
            li.innerHTML = `${p.nombre} - **$${p.precio}**`;

            const btn = document.createElement('button');
            btn.textContent = 'Eliminar';
            
            // Evento para eliminar: llama al controlador con el índice
            btn.addEventListener('click', () => eliminarHandler(i));

            li.appendChild(btn);
            this.elements.listaCarrito.appendChild(li);
        });

        this.elements.totalDisplay.textContent = total.toFixed(2);
    }
    
    /**
     * Obtiene el valor actual del campo de nombre de usuario.

     */
    getNombreUsuario() {
        return this.elements.nombreUsuario.value.trim();
    }
}