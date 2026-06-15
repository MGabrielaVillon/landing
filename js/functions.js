"use strict"; // Activa el modo estricto para evitar errores silenciosos y malas prácticas.

// Archivo de funciones JavaScript

/**
 * Solicita un recurso JSON de productos y devuelve un objeto con el estado de la operación.
 * @param {string} url - URL desde la que se obtienen los productos.
 * @returns {Promise<{success: boolean, body: any}>} Objeto con el resultado de la petición.
 */
const fetchProducts = (url) => {
  // Inicia la petición HTTP a la URL recibida y retorna la promesa resultante.
  return fetch(url)
    .then(response => {
      // Verifica si la respuesta HTTP no fue exitosa.
      if (!response.ok) {
        // Si hubo un error HTTP, lanza una excepción con el código de estado.
        throw new Error(`Error HTTP: ${response.status}`);
      }
      // Si la respuesta es correcta, convierte el cuerpo a JSON.
      return response.json();
    })
    .then(data => {
      // Recibe los datos procesados del JSON y retorna un objeto con éxito.
      return {
        success: true,
        body: data,
      };
    })
    .catch(error => {
      // Captura cualquier error en la cadena de promesas y retorna un objeto de fallo.
      return {
        success: false,
        body: error.message,
      };
    });
};

// Exporta las funciones para que puedan ser utilizadas en otros módulos.
/**
 * Solicita un XML de categorías y lo convierte en un Document XML.
 * @param {string} url - URL del recurso XML de categorías.
 * @returns {Promise<{success: boolean, body: Document|string}>} Objeto con el resultado y el XML parseado.
 */
let fetchCategories = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const text = await response.text();
    const parser = new DOMParser();
    const data = await parser.parseFromString(text, "application/xml");
    return {
      success: true,
      body: data,
    };
  } catch (error) {
    return {
      success: false,
      body: error.message,
    };
  }
};

export { fetchProducts, fetchCategories };
