import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdwAAJ6UwN4ekwDFepjrUJXPrIDM0x2qA",
  authDomain: "sistem-maklumat-murid-srbm.firebaseapp.com",
  projectId: "sistem-maklumat-murid-srbm",
  storageBucket: "sistem-maklumat-murid-srbm.firebasestorage.app",
  messagingSenderId: "532951554931",
  appId: "1:532951554931:web:d3551739b68420af1a0306"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
