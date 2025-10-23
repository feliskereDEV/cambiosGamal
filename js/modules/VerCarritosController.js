import { Modelo } from './Model.js';
import { leerLocal } from '../utils.js';


class VerCarritosController {
    constructor() {
        this.modelo = new Modelo();
        this.contenedor = document.getElementById('contenedor');
        this.inicializar();
    }

    /**
     * Inicializa la carga y visualización de carritos.
     */
    inicializar() {
        this.mostrarCarritos();
    }

    /**
     * Renderiza todos los carritos guardados en el contenedor del DOM.
     */
    mostrarCarritos() {
        const carritos = this.modelo.getCarritosGuardados();
        this.contenedor.innerHTML = ''; // Limpiar contenedor

        if (carritos.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'No hay carritos creados.';
            this.contenedor.appendChild(p);
        } else {
            carritos.forEach((c, i) => {
                const div = this.crearCarritoBox(c, i);
                this.contenedor.appendChild(div);
            });
        }
    }

    /**
     * Crea y devuelve el elemento DOM para un carrito individual.  
     */
    crearCarritoBox(carrito, index) {
        const div = document.createElement('div');
        div.classList.add('carritoBox');
        // Estilo basado en estado de pago
        div.style.border = carrito.pagado ? '3px solid green' : '3px solid red';

        // Título con nombre 
        const h3 = document.createElement('h3');
        h3.textContent = `Carrito de ${carrito.nombre}`;
        
        div.appendChild(h3);

        // Lista de productos
        const ul = document.createElement('ul');
        carrito.productos.forEach(p => {
            const li = document.createElement('li');
            li.textContent = p.nombre;
            ul.appendChild(li);
        });
        div.appendChild(ul);

        // Total
        const totalP = document.createElement('p');
        totalP.textContent = `Total: $${carrito.total.toFixed(2)}`;
        div.appendChild(totalP);

        // Estado de pago
        const estado = document.createElement('p');
        estado.innerHTML = `<b>${carrito.pagado ? 'Pago realizado ✅' : 'Pago no realizado ❌'}</b>`;
        div.appendChild(estado);

        // Botón de Pagar/Anular
        const boton = document.createElement('button');
        boton.textContent = 'Pagar / Anular Pago';
        boton.classList.add('btn-pagar');
        // Usar .bind(this) o función flecha para mantener el contexto
        boton.addEventListener('click', () => this.controladorCambiarEstado(index)); 
        div.appendChild(boton);

        return div;
    }

    /**
     * Maneja el cambio de estado de pago de un carrito.
  
     */
    controladorCambiarEstado(index) {
        this.modelo.toggleEstadoPago(index);
        // Recargar la vista después de la modificación
        this.mostrarCarritos(); 
    }
}

// Inicializar el controlador de carritos al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    new VerCarritosController();
});