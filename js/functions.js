"use strict"; // Activa el modo estricto para evitar errores silenciosos y malas prácticas.

// Archivo de funciones JavaScript

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

// Exporta la función para que pueda ser utilizada en otros módulos.
export { fetchProducts };
