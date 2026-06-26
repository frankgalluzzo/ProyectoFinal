const botonTest = document.getElementById('boton-test')

botonTest.classList.add('btn', 'btn-success');


botonTest.addEventListener('click', () => {
    Swal.fire({
        title: "Queres guardar los cambios?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        denyButtonText: `No Guardar`,
        cancelButtonText: "Cancelar"
    }).then((result) => {
        
        if (result.isConfirmed) Swal.fire("Guardado!", "El producto fue guardado con exito", "success");
        else if (result.isDenied) Swal.fire("No guardado", "El producto no fue guardado", "info");
    });
})

const origen = document.querySelector('#origen'); 
const img = document.createElement('img');

const link = document.createElement('a');
link.href = '/index.html';

link.appendChild(img);
origen.appendChild(link);

img.src = '/assets/img/logos/logo.png';
img.alt = 'MagicKing logo';


