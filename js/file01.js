"use strict"; // Activa el modo estricto para que JavaScript detecte errores comunes.

import { fetchProducts } from './functions.js'; // Importa la función fetchProducts desde el archivo functions.js.


const showToast = () => {
    const toastElement = document.getElementById('toast-interactive'); // Obtiene el elemento con id 'toast-interactive'.
    if (toastElement) {
        toastElement.classList.add('md:block'); // Agrega la clase para mostrar el toast si existe el elemento.
    }
};


const showVideo = () => {
    const demoElement = document.getElementById('demo'); // Obtiene el elemento con id 'demo'.
    if (demoElement) {
        demoElement.addEventListener('click', () => {
            window.open('https://www.youtube.com', '_blank'); // Abre YouTube en una nueva pestaña al hacer clic.
        });
    }
};

const renderProducts = () => {
    return fetchProducts('https://data-dawm.github.io/datum/reseller/products.json') // Llama a fetchProducts con la URL de los productos.
        .then(result => {
            if (result.success) { // Si la respuesta indica éxito, procesa los datos.
                const container = document.getElementById('products-container'); // Busca el contenedor de productos en el DOM.
                if (container) {
                    container.innerHTML = ''; // Limpia cualquier contenido anterior del contenedor.
                }

                const products = result.body.slice(0, 6); // Selecciona solo los primeros 6 productos del arreglo.
                products.forEach(product => { // Recorre cada producto para construir su tarjeta HTML.
                    let productHTML = `
                        <article class="product-card">
                            <img src="[PRODUCT.IMGURL]" alt="[PRODUCT.TITLE]" />
                            <div class="product-info">
                                <p class="product-price">$[PRODUCT.PRICE]</p>
                                <h3 class="product-title">[PRODUCT.TITLE]</h3>
                                <a href="[PRODUCT.PRODUCTURL]" target="_blank" rel="noopener noreferrer">Ver en Amazon</a>
                                <span class="product-category">[PRODUCT.CATEGORY_ID]</span>
                            </div>
                        </article>
                    `; // Define la plantilla HTML con marcadores de posición para el producto.

                    productHTML = productHTML.replaceAll('[PRODUCT.IMGURL]', product.imgUrl); // Reemplaza la URL de la imagen.
                    productHTML = productHTML.replaceAll('[PRODUCT.PRICE]', product.price); // Reemplaza el precio.
                    productHTML = productHTML.replaceAll('[PRODUCT.TITLE]', product.title.length > 20 ? product.title.substring(0, 20) + '...' : product.title); // Reemplaza el título, acortándolo si es muy largo.
                    productHTML = productHTML.replaceAll('[PRODUCT.PRODUCTURL]', product.productURL); // Reemplaza la URL del producto.
                    productHTML = productHTML.replaceAll('[PRODUCT.CATEGORY_ID]', product.category_id); // Reemplaza el ID de categoría.

                    if (container) {
                        container.innerHTML += productHTML; // Agrega la tarjeta HTML generada al contenedor.
                    }
                });

                return result; // Devuelve el resultado para que se pueda encadenar otra promesa si se desea.
            } else {
                alert(`Error: ${result.body}`); // Muestra una alerta con el mensaje de error cuando el resultado no fue exitoso.
                return result; // Devuelve el resultado con información de error.
            }
        });
};


(() => {
    showToast(); // Muestra el toast al cargar la página.
    showVideo(); // Activa el evento para el botón de video.
    renderProducts(); // Llama a renderProducts para cargar y mostrar los productos.
})();
