let librosCache = [];

async function cargarLibros() {
    const res = await fetch("http://localhost:3000/libros");
    librosCache = await res.json();
    mostrarLibros(librosCache);
}

function mostrarLibros(libros) {
    const lista = document.getElementById("lista-libros");
    lista.innerHTML = ""; 

    libros.forEach(libro => {
        const div = document.createElement("div");
        div.classList.add("libro");

        div.innerHTML = `
            <strong>${libro.titulo}</strong> 
            <span>${libro.autorxs}</span>
            <span>${libro.ubicacion || "No especificado"}</span>
            <span>${libro.prestado_a ? "Prestado a: " + libro.prestado_a : "Disponible"}</span>
            <div class="botones">
                <button onclick="editarLibro(${libro.id})">editar</button>
                <button onclick="eliminarLibro(${libro.id})">X</button>
            </div>
        `;

        lista.appendChild(div);
    });
}

async function guardarLibro() {
    const id = document.getElementById("libro_id").value;
    const titulo = document.getElementById("titulo").value;
    const autorxs = document.getElementById("autorxs").value;
    const ubicacion = document.getElementById("ubicacion").value || null;
    const prestado_a = document.getElementById("prestado_a").value || null;

    if (!titulo || !autorxs) {
        alert("Título y autorxs son obligatorios.");
        return;
    }

    if (id) {
        // Editar libro existente
        await fetch(`http://localhost:3000/libros/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titulo, autorxs, ubicacion, prestado_a })
        });
    } else {
        // Agregar nuevo libro
        await fetch("http://localhost:3000/libros", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titulo, autorxs, ubicacion, prestado_a })
        });
    }

    cancelarEdicion();
    cargarLibros();
}

function editarLibro(id) {
    const libro = librosCache.find(l => l.id === id);
    if (!libro) return;

    document.getElementById("libro_id").value = libro.id;
    document.getElementById("titulo").value = libro.titulo;
    document.getElementById("autorxs").value = libro.autorxs;
    document.getElementById("ubicacion").value = libro.ubicacion || "";
    document.getElementById("prestado_a").value = libro.prestado_a || "";

    document.getElementById("cancelar-btn").style.display = "inline";
}

function cancelarEdicion() {
    document.getElementById("libro_id").value = "";
    document.getElementById("titulo").value = "";
    document.getElementById("autorxs").value = "";
    document.getElementById("ubicacion").value = "";
    document.getElementById("prestado_a").value = "";

    document.getElementById("cancelar-btn").style.display = "none";
}

async function eliminarLibro(id) {
    await fetch(`http://localhost:3000/libros/${id}`, { method: "DELETE" });
    cargarLibros();
}

function buscarLibros() {
    const filtro = document.getElementById("buscador").value.toLowerCase();
    const librosFiltrados = librosCache.filter(libro =>
        libro.titulo.toLowerCase().includes(filtro) ||
        libro.autorxs.toLowerCase().includes(filtro) ||
        (libro.ubicacion && libro.ubicacion.toLowerCase().includes(filtro)) ||
        (libro.prestado_a && libro.prestado_a.toLowerCase().includes(filtro))
    );
    mostrarLibros(librosFiltrados);
}

document.addEventListener("DOMContentLoaded", cargarLibros);
