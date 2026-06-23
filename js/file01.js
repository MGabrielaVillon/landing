"use strict"; // Activa el modo estricto para que JavaScript detecte errores comunes.

import { fetchProducts, fetchCategories } from './functions.js'; // Importa las funciones desde el archivo functions.js.
// 1. Importar getVotes junto con saveVote desde firebase.js
import { saveVote, getVotes } from './firebase.js';

/**
 * Carga y renderiza las categorías disponibles en el elemento select con id "categories".
 * @returns {Promise<void>} No retorna un valor, actualiza el DOM directamente.
 */
const renderCategories = async () => {
    try {
        const result = await fetchCategories('https://data-dawm.github.io/datum/reseller/categories.xml');
        if (result.success) {
            const container = document.getElementById('categories');
            if (container) {
                container.innerHTML = `<option disabled selected>Seleccione una categoría</option>`;
                const categoriesXML = result.body;
                const categories = categoriesXML.getElementsByTagName('category');
                for (let category of categories) {
                    const id = category.getElementsByTagName('id')[0].textContent;
                    const name = category.getElementsByTagName('name')[0].textContent;
                    let categoryHTML = `<option value="${id}">${name}</option>`;
                    container.innerHTML += categoryHTML;
                }
            }
        } else {
            alert(`Error: ${result.body}`);
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};

/**
 * Muestra el toast interactivo si existe el elemento en el DOM.
 * @returns {void}
 */
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

/**
 * Configura el formulario de votación para guardar votos en Firebase.
 * @returns {void}
 */
const enableForm = () => {
    const form = document.getElementById('form_voting');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const selectElement = document.getElementById('select_product');
        const productID = selectElement?.value;

        if (!productID) {
            alert('Por favor seleccione un producto antes de votar.');
            return;
        }

        const result = await saveVote(productID);

        if (result.estado === 'success') {
            alert(`✓ ${result.mensaje}`);
            form.reset();
        } else {
            alert(`✗ ${result.mensaje}`);
        }
    });
};

/**
 * Solicita la lista de productos y renderiza hasta seis tarjetas en el contenedor del DOM.
 * @returns {Promise<{success: boolean, body: any}>} La promesa con el resultado de la petición de productos.
 */
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

/**
 * 2, 3 y 4. Función asíncrona tipo flecha para obtener y mostrar los votos en una tabla.
 */
const displayVotes = async () => {
    try {
        const result = await getVotes();
        const resultsContainer = document.getElementById('results');

        if (!resultsContainer) {
            return;
        }

        if (result.estado !== 'success' || !result.datos) {
            resultsContainer.innerHTML = `
                <p class="text-gray-500 text-center mt-16">${result.mensaje || 'No hay votos disponibles.'}</p>
            `;
            return;
        }

        const votesArray = Object.values(result.datos);
        const totalsByProduct = votesArray.reduce((acc, vote) => {
            const productID = vote.productID || vote.producto || vote.product || 'Producto desconocido';
            acc[productID] = (acc[productID] || 0) + 1;
            return acc;
        }, {});

        let tableHTML = `
            <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr>
                        <th style="padding: 8px;">Producto</th>
                        <th style="padding: 8px;">Total de Votos</th>
                    </tr>
                </thead>
                <tbody>
        `;

        Object.entries(totalsByProduct).forEach(([product, total]) => {
            tableHTML += `
                <tr>
                    <td style="padding: 8px;">${product}</td>
                    <td style="padding: 8px;">${total}</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        resultsContainer.innerHTML = tableHTML;
    } catch (error) {
        console.error(`Error al mostrar los votos: ${error.message}`);
    }
};

// Función de autoejecución (IIFE)
(() => {
    showToast(); // Muestra el toast al cargar la página.
    showVideo(); // Activa el evento para el botón de video.
    renderProducts(); // Llama a renderProducts para cargar y mostrar los productos.
    renderCategories(); // Llama a renderCategories para cargar y mostrar las categorías.
    enableForm(); // Configura el envío del formulario de votación.
    
    // 6. Invoca la función displayVotes al cargar
    displayVotes(); 
})();
