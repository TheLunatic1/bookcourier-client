import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDMu4jpSqLsdfGgzGiVtkYO291g5LSFqsc",
  authDomain: "bookcourier-c7681.firebaseapp.com",
  projectId: "bookcourier-c7681",
  storageBucket: "bookcourier-c7681.firebasestorage.app",
  messagingSenderId: "993895185680",
  appId: "1:993895185680:web:35945d8908c4aa90bf7995",
  measurementId: "G-6BN9J2TBW8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;