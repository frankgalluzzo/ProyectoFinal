const cards = document.getElementById('cards');
let productosDisponibles = [];

const peticion1 = () => {
    fetch('./rompecabezas.json')  
        .then((respuesta) => {
            if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
            return respuesta.json();
        })
        .then((datos) => {
            productosDisponibles = datos;
            console.log("🧩 Rompecabezas cargados:", datos);

            datos.forEach((item) => {
                const card = document.createElement('div');
                card.classList.add('col-sm-6', 'col-md-4', 'col-lg-3', 'mb-4');

                card.innerHTML = `
                    <div class="card h-100 shadow-sm">
                        <img 
                            class="card-img-top" 
                            src="${item.imagen}" 
                            alt="${item.nombre}"
                            style="height: 200px; object-fit: cover;"
                            onerror="this.src='./assets/img/default.webp'"
                        />
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${item.nombre}</h5>
                            <p class="card-text text-muted small flex-grow-1">
                                ${item.descripcion}
                            </p>
                            <p class="card-text fw-bold fs-5 text-primary">
                                $${item.precio.toLocaleString('es-AR')}.-
                            </p>
                            <p class="card-text small text-${item.stock > 0 ? 'success' : 'danger'}">
                                ${item.stock > 0 ? `✅ Stock: ${item.stock} unid.` : '❌ Sin stock'}
                            </p>
                            <button 
                                class="btn btn-primary mt-auto" 
                                data-id-producto="${item.id_producto}"
                                ${item.stock === 0 ? 'disabled' : ''}
                            >
                                🛒 Agregar al carrito
                            </button>
                        </div>
                    </div>
                `;

                card.querySelector('button').addEventListener('click', () => {
                    agregarAlCarrito(item);
                });

                cards.appendChild(card);
            });
        })
        .catch((error) => {
            console.error("❌ Error:", error);
            cards.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-danger">Error al cargar los rompecabezas.</p>
                </div>
            `;
        })
        .finally(() => console.log("Petición rompecabezas finalizada"));
};

peticion1();