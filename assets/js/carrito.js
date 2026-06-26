// ══════════════════════════════════════════════════════
//   CLAVE ÚNICA para localStorage
// ══════════════════════════════════════════════════════
const STORAGE_KEY = "carrito"; // ← un solo lugar para cambiarla

// ══════════════════════════════════════════════════════
//   AGREGAR AL CARRITO
// ══════════════════════════════════════════════════════
function agregarAlCarrito(producto) {
    const memoria = localStorage.getItem(STORAGE_KEY);
    let carrito = memoria ? JSON.parse(memoria) : [];

    const idProducto = Number(producto.id_producto);

    producto = {
        ...producto,
        id_producto: idProducto,
        precio:      Number(producto.precio),
        stock:       Number(producto.stock),
        cantidad:    Number(producto.cantidad) || 1, // ✅ nunca undefined
    };

    const productoExistente = carrito.find(
        (item) => Number(item.id_producto) === idProducto
    );

    if (productoExistente) {
        productoExistente.cantidad = Number(productoExistente.cantidad) || 0;

        if (productoExistente.cantidad < producto.stock) {
            productoExistente.cantidad++;
            mostrarToast(`${producto.nombre} actualizado (x${productoExistente.cantidad})`);
        } else {
            Swal.fire({
                title: "Sin stock suficiente",
                text: `No hay más unidades de ${producto.nombre}`,
                icon: "warning",
                confirmButtonText: "Entendido",
            });
            return;
        }
    } else {
        carrito.push({ ...producto, cantidad: 1 });
        mostrarToast(`${producto.nombre} agregado al carrito`);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito)); // ✅ clave unificada
    actualizarContadorCarrito();                                 // ✅ sin parámetro
}

// ══════════════════════════════════════════════════════
//   ACTUALIZAR CONTADOR — lee siempre desde localStorage
// ══════════════════════════════════════════════════════
function actualizarContadorCarrito() {
    const carrito  = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const total    = carrito.reduce((acc, item) => acc + Number(item.cantidad || 0), 0);
    const contador = document.getElementById("contador-carrito");

    if (contador) {
        contador.innerText = total;
    }
}

// ══════════════════════════════════════════════════════
//   TOAST
// ══════════════════════════════════════════════════════
function mostrarToast(mensaje) {
    Toastify({
        text:     mensaje,
        duration: 2000,
        gravity:  "bottom",
        position: "right",
        style: {
            background: "linear-gradient(to right, #6a11cb, #2575fc)",
        },
    }).showToast();
}


function cargarCarritoDesdeLocalStorage() {
    const memoria = localStorage.getItem(STORAGE_KEY); // ✅ clave unificada
    const carrito = memoria ? JSON.parse(memoria) : [];

    return carrito.map((item) => ({
        ...item,
        id_producto: Number(item.id_producto),
        precio:      Number(item.precio),
        stock:       Number(item.stock),
        cantidad:    Number(item.cantidad || 0),
    }));
}
function mostrarCarrito() {
    const carrito            = cargarCarritoDesdeLocalStorage();
    const carritoItems       = document.getElementById("carrito-items");
    const carritoVacio       = document.getElementById("carrito-vacio");
    const btnVaciarContainer = document.getElementById("btn-vaciar-container");
    const subtotalEl         = document.getElementById("subtotal");
    const totalEl            = document.getElementById("total");

    if (!carritoItems || !carritoVacio || !btnVaciarContainer || !totalEl) return;

    carritoItems.innerHTML = "";

    const tieneItems = carrito.length > 0;
    carritoVacio.classList.toggle("d-none", tieneItems);
    btnVaciarContainer.classList.toggle("d-none", !tieneItems);

    if (!tieneItems) {
        if (totalEl) totalEl.textContent = "$0";
        return;
    }

    let subtotal = 0;

    carrito.forEach((item) => {
        subtotal += Number(item.precio) * Number(item.cantidad);

        const fila = document.createElement("div");
        fila.classList.add(
            "d-flex", "justify-content-between", "align-items-center",
            "border", "rounded", "p-3", "mb-2"
        );

        fila.innerHTML = `
            <div>
                <div class="fw-bold">${item.nombre}</div>
                <div class="text-muted">Precio: $${Number(item.precio).toLocaleString("es-AR")}.-</div>
                <div class="text-muted">Stock: ${item.stock ?? ""}</div>
                <div class="text-muted small">
                    Subtotal: $${(Number(item.precio) * Number(item.cantidad)).toLocaleString("es-AR")}.-
                </div>
            </div>

            <div class="d-flex align-items-center gap-2">
                <button class="btn btn-outline-secondary btn-sm" data-minus="${item.id_producto}">-</button>
                <span class="px-2">x${item.cantidad}</span>
                <button class="btn btn-outline-secondary btn-sm" data-plus="${item.id_producto}">+</button>
                <button class="btn btn-outline-danger btn-sm" data-remove="${item.id_producto}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;

        carritoItems.appendChild(fila);
    });

    if (totalEl) totalEl.textContent = `$${subtotal.toLocaleString("es-AR")}`;

    carritoItems.onclick = (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const minusId  = btn.dataset.minus;
        const plusId   = btn.dataset.plus;
        const removeId = btn.dataset.remove;

        const id = minusId ?? plusId ?? removeId;
        if (id === undefined) return;

        let carritoActual = cargarCarritoDesdeLocalStorage();
        let item = carritoActual.find((x) => Number(x.id_producto) === Number(id));
        if (!item) return;

        if (minusId !== undefined) {
            item.cantidad--;
            if (item.cantidad <= 0) {
                carritoActual = carritoActual.filter(
                    (x) => Number(x.id_producto) !== Number(item.id_producto)
                );
                mostrarToast(`${item.nombre} eliminado del carrito`);
            }
        }

        if (plusId !== undefined) {
            if (item.cantidad < item.stock) {
                item.cantidad++;
            } else {
                Swal.fire({
                    title: "Límite de stock",
                    text: `No hay más unidades de ${item.nombre}`,
                    icon: "warning",
                    confirmButtonText: "Entendido",
                });
                return;
            }
        }

        if (removeId !== undefined) {
            carritoActual = carritoActual.filter(
                (x) => Number(x.id_producto) !== Number(item.id_producto)
            );
            mostrarToast(`${item.nombre} eliminado del carrito`);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(carritoActual)); // ✅
        actualizarContadorCarrito();                                       // ✅
        mostrarCarrito();
    };
}

if (document.getElementById("carrito-items")) {
    mostrarCarrito();

    // ── Vaciar carrito ──
    const btnVaciar = document.getElementById("btn-vaciar");
    if (btnVaciar) {
        btnVaciar.addEventListener("click", () => {
            Swal.fire({
                title: "¿Desea vaciar el carrito?",
                icon: "warning",
                showCancelButton:   true,
                confirmButtonText:  "Sí, vaciar",
                cancelButtonText:   "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem(STORAGE_KEY); // ✅
                    actualizarContadorCarrito();
                    mostrarCarrito();
                }
            });
        });
    }

    // ── Comprar ──
    const btnComprar = document.getElementById("btn-comprar");
    if (btnComprar) {
        btnComprar.addEventListener("click", () => {
            const carrito = cargarCarritoDesdeLocalStorage();

            if (carrito.length === 0) {
                Swal.fire({
                    title: "Carrito vacío",
                    text: "Agregá productos antes de comprar.",
                    icon: "info",
                    confirmButtonText: "Entendido",
                });
                return;
            }

            const subtotal      = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
            const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

            Swal.fire({
                title: "✅ Compra Exitosa",
                html: `
                    <div style="text-align:left;">
                        <p><b>Items:</b> ${cantidadTotal}</p>
                        <p><b>Total:</b> $${subtotal.toLocaleString("es-AR")}.-</p>
                    </div>
                `,
                icon: "success",
                confirmButtonText:  "Finalizar",
                allowOutsideClick:  false,
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem(STORAGE_KEY); // ✅
                    actualizarContadorCarrito();
                    mostrarCarrito();
                }
            });
        });
    }
}

// ══════════════════════════════════════════════════════
//   INICIALIZAR CONTADOR AL CARGAR CUALQUIER PÁGINA
// ══════════════════════════════════════════════════════
actualizarContadorCarrito(); // ✅ actualiza el badge del navbar siempre

peticion();