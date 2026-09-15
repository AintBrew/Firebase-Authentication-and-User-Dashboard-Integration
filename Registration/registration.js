import { auth, db } from "../firebase/firebase-config.js";
import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
    ref,
    set
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const form = document.getElementById('myForm');

form.addEventListener('submit', async function(event) {
  event.preventDefault();

  // Get Values
  let username = document.getElementById('username').value.trim();
  let email = document.getElementById('email').value.trim();
  let password = document.getElementById('password').value.trim();
  let confirmPassword = document.getElementById('confirmPassword').value.trim();

  // Clear previous messages
  document.getElementById('usernameError').textContent = '';
  document.getElementById('emailError').textContent = '';
  document.getElementById('passwordError').textContent = '';
  document.getElementById('confirmPasswordError').textContent = '';
  document.getElementById('message').textContent = '';

  // Remove previous borders
  document.getElementById('username').classList.remove("error-border", "success-border");
  document.getElementById('email').classList.remove("error-border", "success-border");
  document.getElementById('password').classList.remove("error-border", "success-border");
  document.getElementById('confirmPassword').classList.remove("error-border", "success-border");
  let valid = true;

  // Username Validation
  if (username === "") {
    document.getElementById('usernameError').textContent = 'Username is required.';
    valid = false;
    document.getElementById('username').classList.add("error-border");
  }

  // Email Validation
  if (email === "") {
    document.getElementById('emailError').textContent = 'Email is required.';
    valid = false;
    document.getElementById('email').classList.add("error-border");
  }

  // Password Strength Validation
  if (password === "") {
    document.getElementById('passwordError').textContent = "Password is required.";
    document.getElementById('password').classList.add("error-border");
    valid = false;
  } else if (password.length < 8) {
    document.getElementById('passwordError').textContent = "Password must be at least 8 characters.";
    document.getElementById('password').classList.add("error-border");
    valid = false;
  }

  // Confirm Password Validation
  if (confirmPassword === "") {
    document.getElementById('confirmPasswordError').textContent = 'Please confirm your password.';
    valid = false;
    document.getElementById('confirmPassword').classList.add("error-border");
  } else if (password !== confirmPassword) {
    document.getElementById('confirmPasswordError').textContent = 'Passwords do not match.';
    valid = false;
    document.getElementById('confirmPassword').classList.add("error-border");
  }

  // Email Pattern Validation
  if (email !== "") {
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      document.getElementById('emailError').textContent = "Invalid email address.";
      document.getElementById('email').classList.add("error-border");
      valid = false;
    } else {
      document.getElementById('email').classList.add("success-border");
    }
  }

  // Check if form is valid
  if (valid) {
    try {
      // CREATE FIREBASE ACCOUNT
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // STORE USER INFORMATION
      await set(ref(db, "users/" + user.uid), {
        username: username,
        email: email,
        createdAt: new Date().toISOString()
      });

      // Add success borders to valid fields
      document.getElementById('username').classList.add("success-border");
      document.getElementById('password').classList.add("success-border");
      document.getElementById('email').classList.add("success-border");
      document.getElementById('confirmPassword').classList.add("success-border");

      alert("Registration successful!");
      form.reset();
      window.location.href = "../login/login.html";
    } catch (error) {
      console.error(error);

      // FIREBASE ERROR
      if (error.code === "auth/email-already-in-use") {
        document.getElementById('emailError').textContent = "This email is already registered.";
        document.getElementById('email').classList.add("error-border");
      } else if (error.code === "auth/invalid-email") {
        document.getElementById('emailError').textContent = "Invalid email address.";
        document.getElementById('email').classList.add("error-border");
      } else if (error.code === "auth/weak-password") {
        document.getElementById('passwordError').textContent = "Password is too weak.";
        document.getElementById('password').classList.add("error-border");
      } else {
        document.getElementById('message').textContent = "Registration failed. Please try again.";
      }
    }
  }
});

// Reusable toggle function for password fields
function setupPasswordToggle(toggleId, inputId) {
  const toggleBtn = document.getElementById(toggleId);
  const inputField = document.getElementById(inputId);

  if (!toggleBtn || !inputField) return;

  toggleBtn.addEventListener('click', function () {
    const isPassword = inputField.type === 'password';
    inputField.type = isPassword ? 'text' : 'password';

    this.classList.toggle('fa-eye', !isPassword);
    this.classList.toggle('fa-eye-slash', isPassword);
  });
}

setupPasswordToggle('togglePassword', 'password');
setupPasswordToggle('toggleConfirmPassword', 'confirmPassword');