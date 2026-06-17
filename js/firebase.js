// Importar funciones de Firebase desde CDN (versión 10.11.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.sa0/firebase-app.js";
import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Configurar Firebase usando variables de entorno de Vite
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

// Inicializar la aplicación Firebase
const app = initializeApp(firebaseConfig);

// Obtener referencia a la base de datos en tiempo real
const database = getDatabase(app);

/**
 * Función para guardar un voto en la base de datos
 * @param {string} productID - ID del producto sobre el cual se vota
 * @returns {Promise<Object>} Objeto con status y mensaje de éxito o error
 */
const saveVote = async (productID) => {
  try {
    // Obtener referencia a la colección "votes"
    const votesRef = ref(database, 'votes');
    
    // Crear una nueva referencia para un usuario con push()
    const newVoteRef = push(votesRef);
    
    // Guardar los datos (productID y fecha actual) con set()
    await set(newVoteRef, {
      productID: productID,
      timestamp: new Date().toISOString(),
    });
    
    // Devolver objeto con estado y mensaje de éxito
    return {
      status: 'success',
      message: 'Voto guardado correctamente',
      voteId: newVoteRef.key,
    };
  } catch (error) {
    // Devolver objeto con estado y mensaje de error
    return {
      status: 'error',
      message: `Error al guardar el voto: ${error.message}`,
    };
  }
};

// Exportar la función saveVote
export { saveVote };
