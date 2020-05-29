import { createBasePage, createBanner } from "../Feed/base.js";
import { resetFeed } from "../Feed/reset.js";
import { profilePage } from "../User/profile.js";

export function buildLoggedIn(arg, apiUrl) {
  localStorage.setItem("token", arg);
  resetFeed();
  document.getElementById("navHeader").remove();
  document.getElementById("loginModal").remove();
  createBanner(apiUrl);
  createBasePage(apiUrl);
}

// Create login modal
export function createLogin(apiUrl) {
  // Create modal wrapper
  const loginModal = document.createElement("div");
  loginModal.id = "loginModal";
  loginModal.classList = "modal";
  root.appendChild(loginModal);

  // Create login form for username
  const loginForm = document.createElement("div");
  loginForm.classList = "modal-content";
  loginModal.appendChild(loginForm);

  // Create login wrapper
  const loginBox = document.createElement("div");
  loginBox.id = "loginBox";
  loginBox.classList = "container";
  loginForm.appendChild(loginBox);

  // Create label for username
  const usernameLabel = document.createElement("label");
  usernameLabel.innerText = "Username";
  loginBox.appendChild(usernameLabel);

  // Create an exit button
  const closeModal = document.createElement("span");
  closeModal.classList = "close";
  closeModal.innerText = "x";
  closeModal.id = "loginClose";
  loginBox.appendChild(closeModal);

  // Create an input field for a username
  const usernameInput = document.createElement("input");
  usernameInput.id = "usernameInput";
  usernameInput.value = "Mary";
  usernameInput.placeholder = "Enter Username";
  usernameInput.setAttribute("type", "text");
  loginBox.appendChild(usernameInput);

  // Create a password label
  const passwordLabel = document.createElement("label");
  passwordLabel.innerText = "Password";
  loginBox.appendChild(passwordLabel);

  // Create a password input field
  const passwordInput = document.createElement("input");
  passwordInput.id = "passwordInput";
  passwordInput.value = "cents_caught";
  passwordInput.placeholder = "Enter Password";
  passwordInput.setAttribute("type", "password");
  loginBox.appendChild(passwordInput);

  // Create a login button
  const loginButton = document.createElement("button");
  loginButton.innerText = "Log In";
  loginButton.classList = "loginButton";
  loginButton.addEventListener("click", () => {
    // When clicked, request is sent
    loginStatus(apiUrl);
  });
  loginBox.appendChild(loginButton);

  // Create hidden error field for potential login status errors
  const loginError = document.createElement("div");
  loginError.id = "loginError";
  loginError.classList = "loginError";
  loginBox.appendChild(loginError);

  // When x or outside modal skeleton is clicked, exit modal
  window.addEventListener("click", function (event) {
    if (event.target == loginModal || event.target == closeModal) {
      loginModal.style.display = "none";
      loginError.innerText = "";
    }
  });
}

// Send and check a login status request
export function loginStatus(apiUrl) {
  // Grab details from previous login input field
  const username = document.getElementById("usernameInput").value;
  const password = document.getElementById("passwordInput").value;
  const loginError = document.getElementById("loginError");

  // Send request to the server to login with provided details
  let options = {
    method: "POST",
    body: JSON.stringify({ username: username, password: password }),
    headers: { "Content-Type": "application/json" },
  };
  fetch(`${apiUrl}/auth/login`, options).then((response) => {
    response.json().then((json) => {
      // If server returns an error, display message in modal
      if (response.status != 200) {
        loginError.innerText = json.message;
      } else {
        // Build logged in state of web page
        localStorage.setItem("token", json.token);
        resetFeed("login");
        createBanner(apiUrl);
        createBasePage(apiUrl, 0);
        profilePage(apiUrl);
      }
    });
  });
}
