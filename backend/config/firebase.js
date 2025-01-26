// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDO6iReKXzvo-PmL1vptiCPavI61_G7gUM",
  authDomain: "iuh-uv.firebaseapp.com",
  projectId: "iuh-uv",
  storageBucket: "iuh-uv.firebasestorage.app",
  messagingSenderId: "753887075528",
  appId: "1:753887075528:web:f6cd93a9c66726032a19fd",
  measurementId: "G-FDWBCKEBST",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
