// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwrmUstnX2Gmuupung4L8ouz_QHUUwIk0",
  authDomain: "uberclone07-40a0f.firebaseapp.com",
  projectId: "uberclone07-40a0f",
  storageBucket: "uberclone07-40a0f.firebasestorage.app",
  messagingSenderId: "607387360360",
  appId: "1:607387360360:web:88e8cda0d6353682f4afdd",
  measurementId: "G-9TBT2VMBLS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
