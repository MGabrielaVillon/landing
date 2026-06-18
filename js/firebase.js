import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const saveVote = async (productID) => {
  const votesRef = ref(database, 'votes');
  const newVoteRef = push(votesRef);
  const voteData = {
    productID,
    fecha: new Date().toISOString(),
  };

  try {
    await set(newVoteRef, voteData);
    return {
      estado: 'success',
      mensaje: 'Voto guardado correctamente.',
    };
  } catch (error) {
    return {
      estado: 'error',
      mensaje: `Error al guardar el voto: ${error.message}`,
    };
  }
};

const getVotes = async () => {
  const votesRef = ref(database, 'votes');

  try {
    const snapshot = await get(votesRef);
    if (snapshot.exists()) {
      return {
        estado: 'success',
        datos: snapshot.val(),
      };
    }
    return {
      estado: 'empty',
      mensaje: 'No hay datos disponibles en votes.',
    };
  } catch (error) {
    return {
      estado: 'error',
      mensaje: `Error al leer votos: ${error.message}`,
    };
  }
};

export { app, database, ref, set, push, get, child, saveVote, getVotes };
