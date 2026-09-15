import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBfRNZTrtjALxFrfQqhjz24CJHSHY4Xuk8",
  authDomain: "web-application-47cde.firebaseapp.com",
  databaseURL: "https://web-application-47cde-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "web-application-47cde",
  storageBucket: "web-application-47cde.firebasestorage.app",
  messagingSenderId: "833926635513",
  appId: "1:833926635513:web:ba09f0f2bddb061d4da728",
  measurementId: "G-RBKMQS8G8Y"
};

// ==========================================
// INITIALIZE FIREBASE
// ==========================================
const app = initializeApp(firebaseConfig);

// ==========================================
// INITIALIZE AUTHENTICATION
// ==========================================
const auth = getAuth(app);

// ==========================================
// INITIALIZE REALTIME DATABASE
// ==========================================
const db = getDatabase(app);

// ==========================================
// EXPORT
// ==========================================
export { app, auth, db };
