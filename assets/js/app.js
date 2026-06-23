
let titulo = document.getElementsByTagName('title')[0];
let h1Title = document.getElementById('titulo').innerText;


const cabecera = document.getElementById('header');
const navegacion = document.createElement('div');
const nav = document.createElement('nav');
const ul = document.createElement('ul');

cabecera.appendChild(navegacion);
navegacion.appendChild(nav);
nav.appendChild(ul);

navegacion.className = 'navbar';

const links = ["Juegos", "Rompecabezas","Contactos"];

const liImagen = document.createElement('li');
const img = document.createElement('img');
const origen = document.createElement('a');

origen.href = './index.html';  
origen.appendChild(img);

img.src = './assets/img/logos/logo.png';
img.alt = "MagicKing logo";

liImagen.appendChild(origen);
ul.appendChild(liImagen);


for (const link of links) {
    const li = document.createElement('li');

    li.innerHTML = `
        <a href="${link.toLowerCase()}.html">
            ${link}
        </a>
    `;

    ul.appendChild(li);
}

// Carrito Li--------------------------

const liCarrito = document.createElement('li');
liCarrito.classList.add('carrito-nav');

const aCarrito = document.createElement('a');
aCarrito.href = 'carrito.html';

const contador = document.createElement('span');
contador.id = 'contador-carrito';
contador.textContent = '0';

aCarrito.innerHTML = `🛒 <span class="carrito-label">Carrito</span> (<span id="contador-carrito-inline"></span>)`;

aCarrito.innerHTML = `🛒 <span id="contador-carrito">0</span>`;

liCarrito.appendChild(aCarrito);
ul.appendChild(liCarrito);

