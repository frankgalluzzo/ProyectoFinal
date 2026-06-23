const cards = document.getElementById('cards');
let productosDisponibles = [];

const peticion = () => {
    fetch('./juegos.json')
        .then((respuesta) => respuesta.json())
        .then((datos) => {
            productosDisponibles = datos;

            datos.forEach((item) => {
                const card = document.createElement('div');
                card.classList.add('col');

                card.innerHTML = `
                    <div class="card" style="width: 18rem; height: 32rem;">
                        <img 
                            class="card-img-top" 
                            src="${item.imagen}" 
                            alt="${item.nombre}"
                            onerror="this.src='./assets/img/default.webp'"
                        />
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${item.nombre}</h5>
                            <p class="card-text">
                                ${item.descripcion}
                            </p>
                            <p class="card-text fw-bold">
                                Precio: $${item.precio.toLocaleString('es-AR')}.-
                            </p>
                            <p class="card-text text-${item.stock > 0 ? 'success' : 'danger'}">
                                Stock: ${item.stock > 0 ? item.stock + ' Unid.' : 'Sin stock'}
                            </p>
                            <button 
                                class="btn btn-primary comprar-item mt-auto" 
                                data-id-producto="${item.id_producto}"
                                ${item.stock === 0 ? 'disabled' : ''}
                            >
                                🛒 Agregar al carrito
                            </button>
                        </div>
                    </div>
                `;

                const btnComprar = card.querySelector('.comprar-item');
                btnComprar.addEventListener('click', () => {
                    agregarAlCarrito(item);
                });

                cards.appendChild(card);
            });
        })
        .catch((error) => console.error("❌ Error en la petición:", error))
        .finally(() => console.log("✅ Petición finalizada"));
};

