// ==========================================
// FIREBASE IMPORTS
// ==========================================
import { auth, db } from "../firebase/firebase-config.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
    ref,
    get,
    update
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// ==========================================
// PROFILE FORM
// ==========================================
const profileForm = document.getElementById("profileForm");

// ==========================================
// AUTHENTICATION CHECK
// ==========================================
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        // No authenticated user
        window.location.href = "../login/login.html";
        return;
    }

    console.log("Logged in user:", user.uid);

    // ==========================================
    // LOAD USER PROFILE
    // ==========================================
    try {
        const userRef = ref(db, "users/" + user.uid);
        const snapshot = await get(userRef);

        // ==========================================
        // DISPLAY FIREBASE AUTH EMAIL
        // ==========================================
        document.getElementById("email").value = user.email || "";

        // ==========================================
        // CHECK DATABASE
        // ==========================================
        if (snapshot.exists()) {
            const userData = snapshot.val();
            console.log("User data:", userData);

            // ==========================================
            // CHECK PROFILE
            // ==========================================
            if (userData.profile) {
                const profile = userData.profile;

                // ==========================================
                // PERSONAL INFORMATION
                // ==========================================
                document.getElementById("givenName").value = profile.givenName || "";
                document.getElementById("middleName").value = profile.middleName || "";
                document.getElementById("surname").value = profile.surname || "";
                document.getElementById("birthdate").value = profile.birthdate || "";

                // ==========================================
                // CONTACT INFORMATION
                // ==========================================
                document.getElementById("mobileNumber").value = profile.mobileNumber || "";
                document.getElementById("alternativeContact").value = profile.alternativeContact || "";
                document.getElementById("emergencyContactName").value = profile.emergencyContactName || "";
                document.getElementById("emergencyContactNumber").value = profile.emergencyContactNumber || "";

                // ==========================================
                // ADDRESS
                // ==========================================
                if (profile.address) {
                    document.getElementById("blockLot").value = profile.address.blockLot || "";
                    document.getElementById("barangay").value = profile.address.barangay || "";
                    document.getElementById("city").value = profile.address.city || "";
                    document.getElementById("province").value = profile.address.province || "";
                    document.getElementById("postalCode").value = profile.address.postalCode || "";
                    document.getElementById("country").value = profile.address.country || "Philippines";
                }
            }
        }
    } catch (error) {
        console.error("Error loading profile:", error);
    }
});

// ==========================================
// NUMBER-ONLY INPUT
// ==========================================
function numbersOnly(inputId) {
    const input = document.getElementById(inputId);
    input.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "");
    });
}

// ==========================================
// APPLY NUMBER-ONLY FUNCTION
// ==========================================
numbersOnly("mobileNumber");
numbersOnly("alternativeContact");
numbersOnly("emergencyContactNumber");
numbersOnly("postalCode");

// ==========================================
// MOBILE NUMBER VALIDATION
// ==========================================
function validateMobileNumber(value) {
    // Philippine mobile format: 09XXXXXXXXX, 11 digits total
    return /^09\d{9}$/.test(value);
}

// ==========================================
// POSTAL CODE VALIDATION
// ==========================================
function validatePostalCode(value) {
    // Philippine postal code: 4 digits
    return /^\d{4}$/.test(value);
}

// ==========================================
// BIRTHDATE VALIDATION
// ==========================================
function validateBirthdate(value) {
    if (value === "") {
        return false;
    }
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time
    return selectedDate <= today;
}

// ==========================================
// CLEAR ERRORS
// ==========================================
function clearErrors() {
    document.querySelectorAll(".error").forEach(function (error) {
        error.textContent = "";
    });
    document.querySelectorAll("input").forEach(function (input) {
        input.classList.remove("error-border");
    });
    document.getElementById("profileMessage").textContent = "";
}

// ==========================================
// DISPLAY ERROR
// ==========================================
function showError(inputId, errorId, message) {
    document.getElementById(errorId).textContent = message;
    document.getElementById(inputId).classList.add("error-border");
}

// ==========================================
// SAVE PROFILE
// ==========================================
profileForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // ==========================================
    // CLEAR PREVIOUS ERRORS
    // ==========================================
    clearErrors();
    let valid = true;

    // ==========================================
    // GET VALUES
    // ==========================================
    const givenName = document.getElementById("givenName").value.trim();
    const middleName = document.getElementById("middleName").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const birthdate = document.getElementById("birthdate").value;

    const mobileNumber = document.getElementById("mobileNumber").value.trim();
    const alternativeContact = document.getElementById("alternativeContact").value.trim();
    const emergencyContactName = document.getElementById("emergencyContactName").value.trim();
    const emergencyContactNumber = document.getElementById("emergencyContactNumber").value.trim();

    const blockLot = document.getElementById("blockLot").value.trim();
    const barangay = document.getElementById("barangay").value.trim();
    const city = document.getElementById("city").value.trim();
    const province = document.getElementById("province").value.trim();
    const postalCode = document.getElementById("postalCode").value.trim();
    const country = document.getElementById("country").value.trim();

    // ==========================================
    // GIVEN NAME
    // ==========================================
    if (givenName === "") {
        showError("givenName", "givenNameError", "Given Name is required.");
        valid = false;
    }

    // ==========================================
    // SURNAME
    // ==========================================
    if (surname === "") {
        showError("surname", "surnameError", "Surname is required.");
        valid = false;
    }

    // ==========================================
    // BIRTHDATE
    // ==========================================
    if (birthdate === "") {
        showError("birthdate", "birthdateError", "Birthdate is required.");
        valid = false;
    } else if (!validateBirthdate(birthdate)) {
        showError("birthdate", "birthdateError", "Birthdate cannot be a future date.");
        valid = false;
    }

    // ==========================================
    // MOBILE NUMBER
    // ==========================================
    if (mobileNumber === "") {
        showError("mobileNumber", "mobileNumberError", "Mobile number is required.");
        valid = false;
    } else if (!validateMobileNumber(mobileNumber)) {
        showError("mobileNumber", "mobileNumberError", "Enter a valid 11-digit Philippine mobile number (09XXXXXXXXX).");
        valid = false;
    }

    // ==========================================
    // ALTERNATIVE CONTACT
    // ==========================================
    if (alternativeContact !== "" && !validateMobileNumber(alternativeContact)) {
        showError("alternativeContact", "alternativeContactError", "Enter a valid 11-digit mobile number.");
        valid = false;
    }

    // ==========================================
    // EMERGENCY CONTACT NUMBER
    // ==========================================
    if (emergencyContactNumber !== "" && !validateMobileNumber(emergencyContactNumber)) {
        showError("emergencyContactNumber", "emergencyContactNumberError", "Enter a valid 11-digit mobile number.");
        valid = false;
    }

    // ==========================================
    // BLOCK / LOT
    // ==========================================
    if (blockLot === "") {
        showError("blockLot", "blockLotError", "Block / Lot is required.");
        valid = false;
    }

    // ==========================================
    // BARANGAY
    // ==========================================
    if (barangay === "") {
        showError("barangay", "barangayError", "Barangay is required.");
        valid = false;
    }

    // ==========================================
    // CITY
    // ==========================================
    if (city === "") {
        showError("city", "cityError", "City / Municipality is required.");
        valid = false;
    }

    // ==========================================
    // PROVINCE
    // ==========================================
    if (province === "") {
        showError("province", "provinceError", "Province is required.");
        valid = false;
    }

    // ==========================================
    // POSTAL CODE
    // ==========================================
    if (postalCode === "") {
        showError("postalCode", "postalCodeError", "ZIP / Postal Code is required.");
        valid = false;
    } else if (!validatePostalCode(postalCode)) {
        showError("postalCode", "postalCodeError", "ZIP / Postal Code must contain exactly 4 digits.");
        valid = false;
    }

    // ==========================================
    // COUNTRY
    // ==========================================
    if (country === "") {
        showError("country", "countryError", "Country is required.");
        valid = false;
    }

    // ==========================================
    // STOP IF INVALID
    // ==========================================
    if (!valid) {
        return;
    }

    // ==========================================
    // CHECK AUTHENTICATED USER
    // ==========================================
    const user = auth.currentUser;
    if (!user) {
        window.location.href = "../login/login.html";
        return;
    }

    // ==========================================
    // SAVE TO FIREBASE
    // ==========================================
    try {
        await update(ref(db, "users/" + user.uid), {
            profile: {
                // Personal Information
                givenName: givenName,
                middleName: middleName,
                surname: surname,
                birthdate: birthdate,

                // Contact Information
                mobileNumber: mobileNumber,
                alternativeContact: alternativeContact,
                emergencyContactName: emergencyContactName,
                emergencyContactNumber: emergencyContactNumber,

                // Address
                address: {
                    blockLot: blockLot,
                    barangay: barangay,
                    city: city,
                    province: province,
                    postalCode: postalCode,
                    country: country
                }
            }
        });

        // ==========================================
        // SUCCESS MESSAGE
        // ==========================================
        alert("Profile saved successfully.");

        // ==========================================
        // REDIRECT TO DASHBOARD
        // ==========================================
        window.location.href = "../main_dashboard/main_dashboard.html";
    } catch (error) {
        console.error("Error saving profile:", error);
        const message = document.getElementById("profileMessage");
        message.textContent = "Unable to save profile. Please try again.";
        message.className = "profile-message profile-error";
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

// ==========================================
// MAKE LOGOUT AVAILABLE TO HTML
// ==========================================
window.logout = logout;
