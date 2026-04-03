
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAcIyRvtnJPlpmWx_EUPprDhBSwaCMhFYs",
  authDomain: "db-search-alumni.firebaseapp.com",
  projectId: "db-search-alumni",
  storageBucket: "db-search-alumni.firebasestorage.app",
  messagingSenderId: "832870790218",
  appId: "1:832870790218:web:32e84d1de769bde477a2b3",
  measurementId: "G-CCB4BVTRKB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);