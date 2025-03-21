document.addEventListener("DOMContentLoaded", async function() {
    const hoy = new Date();
    const dia = hoy.getDate().toString().padStart(2, "0");
    const mes = (hoy.getMonth() + 1).toString().padStart(2, "0");
    const anio = hoy.getFullYear();
    const fechaActual = `${dia}/${mes}/${anio}`;

    document.getElementById("fecha-actual").innerText = `Fecha actual: ${fechaActual}`;

    let productos = [];
    
    // Cargar los productos desde el archivo JSON
    try {
        const response = await fetch("/assets/js/productos.json");
        productos = await response.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error("Error cargando los productos:", error);
    }

    // Función para mostrar productos
    function mostrarProductos(productos) {
        const tbody = document.getElementById("productos-lista");
        tbody.innerHTML = "";

        productos.forEach(producto => {
            const fechaVencimiento = new Date(producto.fecha_vencimiento);
            const diasRestantes = Math.floor((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));

            const diaVencimiento = fechaVencimiento.getDate().toString().padStart(2, "0");
            const mesVencimiento = (fechaVencimiento.getMonth() + 1).toString().padStart(2, "0");
            const anioVencimiento = fechaVencimiento.getFullYear();
            const fechaFormateada = `${diaVencimiento}/${mesVencimiento}/${anioVencimiento}`;

            let estadoHTML = "";

            if (diasRestantes < 0) {
                estadoHTML = `<span class="text-center bg-red-800 px-3 py-1 rounded-full text-gray-50 font-bold"><i class="fas fa-exclamation-triangle"></i></span>`;
            } else if (diasRestantes <= 3 && diasRestantes >= 0) {
                estadoHTML = `<span class="text-center bg-yellow-600 px-3 py-1 rounded-full text-gray-50 font-bold"><i class="fas fa-exclamation-triangle"></i></span>`;
            } else {
                estadoHTML = `<span class="text-center bg-green-800 px-3 py-1 rounded-full text-gray-50 font-bold"><i class="fas fa-check-circle"></i></span>`;
            }

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td class="border p-2">${producto.nombre}</td>
                <td class="border p-2 text-center">${fechaFormateada}</td>
                <td class="border p-2">${producto.gondola}</td>
                <td class="border p-2 text-center">${estadoHTML}</td>
            `;

            tbody.appendChild(tr);
        });
    }

    // Ordenar por la opción seleccionada
    document.getElementById("ordenar").addEventListener("change", function(event) {
        const opcionSeleccionada = event.target.value;

        let productosOrdenados = [];

        if (opcionSeleccionada === "defecto") {
            productosOrdenados = productos; // No se cambia el orden
        } else if (opcionSeleccionada === "fecha") {
            productosOrdenados = [...productos].sort((a, b) => new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento));
        } else if (opcionSeleccionada === "gondola") {
            productosOrdenados = [...productos].sort((a, b) => a.gondola.localeCompare(b.gondola));
        }

        mostrarProductos(productosOrdenados);
    });
});
