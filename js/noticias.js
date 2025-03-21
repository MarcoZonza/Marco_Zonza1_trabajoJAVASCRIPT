(async () => {
    const noticiasContainer = document.getElementById("contenedor-noticias");

    const mostrarMensaje = (mensaje, esError = false) => {
        noticiasContainer.innerHTML = `<p class="${esError ? 'error' : 'info'}">${mensaje}</p>`;
    };

    mostrarMensaje("Cargando noticias...");

    try {
        const response = await fetch("data/noticias.json");
        if (!response.ok) {
            throw new Error(`No se pudo cargar el archivo JSON: ${response.status}`);
        }

        const noticias = await response.json();

        noticiasContainer.innerHTML = "";

        if (!Array.isArray(noticias) || noticias.length === 0) {
            mostrarMensaje("No hay noticias disponibles en este momento.");
            return;
        }

        const fragment = document.createDocumentFragment();

        noticias.forEach((noticia, index) => {
            if (!noticia.titulo || !noticia.descripcion) {
                console.warn(`Noticia ${index + 1} incompleta, omitiendo...`);
                return;
            }

            const noticiaElemento = document.createElement("div");
            noticiaElemento.classList.add("noticia");

            let fechaPublicacion = "";
            if (noticia.fecha && !isNaN(Date.parse(noticia.fecha))) {
                fechaPublicacion = `
                    <small>Publicado el: ${new Date(noticia.fecha).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })}</small>
                `;
            } else {
                fechaPublicacion = "<small>Fecha no disponible</small>";
            }

            noticiaElemento.innerHTML = `
                <h3>${noticia.titulo}</h3>
                <p>${noticia.descripcion}</p>
                ${fechaPublicacion}
            `;

            fragment.appendChild(noticiaElemento);
        });

        noticiasContainer.appendChild(fragment);

        if (noticiasContainer.children.length === 0) {
            mostrarMensaje("No se encontraron noticias válidas.");
        }

    } catch (error) {
        console.error("Error al cargar las noticias:", error);
        mostrarMensaje("Error al cargar las noticias. Por favor, intenta de nuevo más tarde.", true);
    }
})();
