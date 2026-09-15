import { auth, db } from "../firebase/firebase-config.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// ==========================================
// PROTECT THE DASHBOARD / LOAD USER DATA
// ==========================================
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("Logged in user:", user.uid);

        try {
            const userRef = ref(db, "users/" + user.uid);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                const userData = snapshot.val();
                console.log("User data:", userData);

                document.querySelector(".dashboard-header p").textContent =
                    "Welcome back, " + userData.username + "!";
            }
        } catch (error) {
            console.error("Error reading user data:", error);
        }
    } else {
        // No authenticated user — bounce back to login
        window.location.href = "../login/login.html";
    }
});

// ==========================================
// LOGOUT
// ==========================================
async function logout() {
    try {
        await signOut(auth);
        alert("You have been logged out.");
        window.location.href = "../login/login.html";
    } catch (error) {
        console.error("Logout error:", error);
    }
}

// Make logout available to the HTML onclick handler
window.logout = logout;
