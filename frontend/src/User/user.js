//import { resetFeed, toggleFeed } from './remove.js'

// Generate a user's details if id is supplied or not
export function getUserInfo(apiUrl, id) {
  // If id is supplied, return user's details
  if (id) {
    let options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("token"),
        id: id,
      },
      method: "GET",
    };
    return fetch(`${apiUrl}/user/?id=${id}`, options)
      .then((res) => res.json())
      .then((json) => {
        return json;
      });
  }
  // If id is not supplied return current user's details
  else {
    let options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("token"),
      },
      method: "GET",
    };
    return fetch(`${apiUrl}/user/`, options)
      .then((res) => res.json())
      .then((json) => {
        return json;
      });
  }
}

// Update a user's information
export function updateStatus(apiUrl) {
  // Generate data from modal inputs
  const email = document.getElementById("emailInput").value;
  const realName = document.getElementById("nameInput").value;
  const passOne = document.getElementById("updatePassOne").value;
  const passTwo = document.getElementById("updatePassTwo").value;
  const updateError = document.getElementById("updateError");

  // If all fields are empty, return an error
  if (email === "" && realName === "" && passOne === "" && passTwo === "") {
    updateError.innerText = "Fields must not be Empty";
    return;
  }
  // If passwords do not match, return error
  else if (passOne != passTwo) {
    updateError.innerText = "Passwords do not match";
    return;
  }
  // If password is one character, return error
  else if (passOne.length === 1) {
    updateError.innerText = "Password must be greater than one character";
    return;
  }

  // Send request to update user's details
  let options = {
    method: "PUT",
    body: JSON.stringify({
      email: email,
      name: realName,
      password: passOne,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + localStorage.getItem("token"),
    },
  };
  fetch(`${apiUrl}/user`, options).then((response) => {
    response.json().then((json) => {
      // Live update details in profile
      if (email) {
        document.getElementById("emailAddress").innerText = email;
      }
      if (realName) {
        document.getElementById("realNameOut").innerText = realName;
      }
      document.getElementById("updateModal").remove();
    });
  });
}
