import { clearBody, showHideFeed } from './remove.js'

// Send and check a signup status request
export function signUpStatus (apiUrl) {

    // Fetch signup details from previous signup inputs
    const email = document.getElementById('registerEmail').value;
    const username = document.getElementById('registerUsername').value;
    const passOne = document.getElementById('registerPass1').value; 
    const passTwo = document.getElementById('registerPass2').value;  
    const realName = document.getElementById('registerName').value;          
    const signUpError = document.getElementById('signUpError');

    // If any of the fields are empty, display error message in modal
    if (passOne === "" || passTwo === "" || email === "" || realName === ""
    || username === "") {
        signUpError.innerText = "Fields must not be Empty";
        return;
    } 
    // If passwords do not match, display error message in modal   
    else if (passOne != passTwo) {
        signUpError.innerText = "Passwords do not match";
        return;   
    }
    
    // Send request to server to signup
    let options = {
        method: "POST",
        body: JSON.stringify({
            "username":username,
            "password":passOne,
            "email":email,
            "name":realName}),
        headers:{"Content-Type":"application/json"},
    };
    fetch(`${apiUrl}/auth/signup`, options)
    .then(response => {
        response.json().then(json => {
            // If error occurs, display error message in modal
            if (response.status != 200) {
                signUpError.innerText = json.message;
            } else { 
                // If signup successful clear contents of signup field for reuse  
                document.getElementById('registerEmail').value = "";
                document.getElementById('registerUsername').value = "";
                document.getElementById('registerPass1').value = ""; 
                document.getElementById('registerPass2').value = "";  
                document.getElementById('registerName').value = ""; 
                document.getElementById("signUpModal").style.display = "";
                document.getElementById("loginModal").style.display = "inline";
                let printSucess = document.getElementById("loginError");
                // Display sucess message in login modal
                printSucess.innerText = "Sign up sucessful. You may now log in";
            }    
        })
    })         
}




// Create sign up modal
export function createSignUp (apiUrl) {
    
    // Create modal wrapper
    const signUpModal = document.createElement('div');
    signUpModal.id = 'signUpModal';
    signUpModal.classList = 'modal';
    root.appendChild(signUpModal);    
    
    // Create form wrapper
    const signupForm = document.createElement('div');
    signupForm.classList = 'modal-content';
    signUpModal.appendChild(signupForm);    
    
    // Create signup wrapper
    const signUpBox = document.createElement('div');
    signUpBox.id = 'signUpBox';
    signUpBox.classList = 'container';
    signupForm.appendChild(signUpBox);
    
    // Create label for username
    const createUsername = document.createElement('label');
    createUsername.innerText = "Username";
    signUpBox.appendChild(createUsername);
    
    // Create exit symbol
    const closeSignUp = document.createElement('span');
    closeSignUp.classList = 'close';
    closeSignUp.innerText = "x";
    signUpBox.appendChild(closeSignUp);    
        
    // Create a username register input
    const registerUser = document.createElement('input');
    registerUser.id = 'registerUsername';
    registerUser.placeholder = "Enter Username";
    registerUser.setAttribute('type', 'text');
    signUpBox.appendChild(registerUser);
     
    // Create a password label
    const createPassword = document.createElement('label');
    createPassword.innerText = "Password";
    signUpBox.appendChild(createPassword);
    
    // Create a register password input
    const registerPass = document.createElement('input');
    registerPass.id = 'registerPass1';    
    registerPass.placeholder = "Enter Password";
    registerPass.setAttribute('type', 'password');    
    signUpBox.appendChild(registerPass);    
    
    // Create a confirm passowrd input
    const secondPass = document.createElement('input');
    secondPass.id = 'registerPass2';    
    secondPass.placeholder = "Confirm Password";
    secondPass.setAttribute('type', 'password');    
    signUpBox.appendChild(secondPass);      
    
    // Create an email label
    const labelEmail = document.createElement('label');
    labelEmail.innerText = "Email";
    signUpBox.appendChild(labelEmail);    
        
    // Create a register email input
    const registerEmail = document.createElement('input');
    registerEmail.id = 'registerEmail';    
    registerEmail.placeholder = "Enter Email";
    registerEmail.setAttribute('type', 'text');    
    signUpBox.appendChild(registerEmail); 
    
    // Create a name label
    const labelName = document.createElement('label');
    labelName.innerText = "Name";
    signUpBox.appendChild(labelName);    

    // Create a register name input
    const registerName = document.createElement('input');
    registerName.id = 'registerName';    
    registerName.placeholder = "Enter Name";
    registerName.setAttribute('type', 'text');    
    signUpBox.appendChild(registerName);             
    
    // Create a signup button
    const signUpButton = document.createElement('button');
    signUpButton.innerText = "Sign Up";
    signUpButton.classList = 'loginButton';
    signUpButton.addEventListener('click', function () { 
        // If clicked send request to signup to the server
        signUpStatus(apiUrl); 
    });
    signUpBox.appendChild(signUpButton);
       
    // Create an invisible signup error text display for erros
    const signUpError = document.createElement('div'); 
    signUpError.id = 'signUpError';
    signUpError.classList = 'loginError';
    signUpBox.appendChild(signUpError);
    
    // If x or outside modal skeleton is clicked, hide modal    
    window.addEventListener('click', function (event) {
      if (event.target == signUpModal || event.target == closeSignUp) {
        signUpModal.style.display = "none";
        signUpError.innerText = "";
      }        
    });    
}
