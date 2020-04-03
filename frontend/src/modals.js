export function createLogin (apiUrl) {
    
    const loginModal = document.createElement('div');
    loginModal.id = 'loginModal';
    loginModal.classList = 'modal';
    root.appendChild(loginModal);    
    
    const loginForm = document.createElement('div');
    loginForm.classList = 'modal-content';
    loginModal.appendChild(loginForm);    
    
    const loginBox = document.createElement('div');
    loginBox.id = 'loginBox';
    loginBox.classList = 'container';
    loginForm.appendChild(loginBox);
        
    const usernameLabel = document.createElement('label');
    usernameLabel.innerText = "Username";
    loginBox.appendChild(usernameLabel);
    
    const closeModal = document.createElement('span');
    closeModal.classList = 'close';
    closeModal.innerText = "x";
    closeModal.id = 'loginClose';
    loginBox.appendChild(closeModal);    
    
    const usernameInput = document.createElement('input');
    usernameInput.id = 'usernameInput';
    usernameInput.placeholder = "Enter Username";
    usernameInput.setAttribute('type', 'text');
    loginBox.appendChild(usernameInput);
     
    const passwordLabel = document.createElement('label');
    passwordLabel.innerText = "Password";
    loginBox.appendChild(passwordLabel);
    
    const passwordInput = document.createElement('input');
    passwordInput.id = 'passwordInput';    
    passwordInput.placeholder = "Enter Password";
    passwordInput.setAttribute('type', 'password');    
    loginBox.appendChild(passwordInput);    
    
    const loginButton = document.createElement('button');
    loginButton.innerText = "Log In";
    loginButton.classList = 'loginButton';
    loginButton.addEventListener('click', function () { 
        loginStatus(apiUrl); 
    });
    loginBox.appendChild(loginButton);
   
    const loginError = document.createElement('div'); 
    loginError.id = 'loginError';
    loginError.classList = 'loginError';
    loginBox.appendChild(loginError);
            
    window.addEventListener('click', function (event) {
      if (event.target == loginModal || event.target == closeModal) {
        loginModal.style.display = "none";
        loginError.innerText = "";
      }        
    });         
}

export function createSignUp (apiUrl) {
    
    const signUpModal = document.createElement('div');
    signUpModal.id = 'signUpModal';
    signUpModal.classList = 'modal';
    root.appendChild(signUpModal);    
    
    const signupForm = document.createElement('div');
    signupForm.classList = 'modal-content';
    signUpModal.appendChild(signupForm);    
    
    const signUpBox = document.createElement('div');
    signUpBox.id = 'signUpBox';
    signUpBox.classList = 'container';
    signupForm.appendChild(signUpBox);
    
    const createUsername = document.createElement('label');
    createUsername.innerText = "Username";
    signUpBox.appendChild(createUsername);
        
    const closeSignUp = document.createElement('span');
    closeSignUp.classList = 'close';
    closeSignUp.innerText = "x";
    signUpBox.appendChild(closeSignUp);    
        
    const registerUser = document.createElement('input');
    registerUser.id = 'registerUsername';
    registerUser.placeholder = "Enter Username";
    registerUser.setAttribute('type', 'text');
    signUpBox.appendChild(registerUser);
     
    const createPassword = document.createElement('label');
    createPassword.innerText = "Password";
    signUpBox.appendChild(createPassword);
    
    const registerPass = document.createElement('input');
    registerPass.id = 'registerPass1';    
    registerPass.placeholder = "Enter Password";
    registerPass.setAttribute('type', 'password');    
    signUpBox.appendChild(registerPass);    
    
    const secondPass = document.createElement('input');
    secondPass.id = 'registerPass2';    
    secondPass.placeholder = "Confirm Password";
    secondPass.setAttribute('type', 'password');    
    signUpBox.appendChild(secondPass);      
    
    const labelEmail = document.createElement('label');
    labelEmail.innerText = "Email";
    signUpBox.appendChild(labelEmail);    
        
    const registerEmail = document.createElement('input');
    registerEmail.id = 'registerEmail';    
    registerEmail.placeholder = "Enter Email";
    registerEmail.setAttribute('type', 'text');    
    signUpBox.appendChild(registerEmail); 
    
    const labelName = document.createElement('label');
    labelName.innerText = "Name";
    signUpBox.appendChild(labelName);    

    const registerName = document.createElement('input');
    registerName.id = 'registerName';    
    registerName.placeholder = "Enter Name";
    registerName.setAttribute('type', 'text');    
    signUpBox.appendChild(registerName);             
    
    const signUpButton = document.createElement('button');
    signUpButton.innerText = "Sign Up";
    signUpButton.classList = 'loginButton';
    signUpButton.addEventListener('click', function () { 
        signUpStatus(apiUrl); 
    });
    signUpBox.appendChild(signUpButton);
       
    const signUpError = document.createElement('div'); 
    signUpError.id = 'signUpError';
    signUpError.classList = 'loginError';
    signUpBox.appendChild(signUpError);
        
    window.addEventListener('click', function (event) {
      if (event.target == signUpModal || event.target == closeSignUp) {
        signUpModal.style.display = "none";
        signUpError.innerText = "";
      }        
    });    
}

export function loginStatus (apiUrl) {

    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;    
    const loginError = document.getElementById('loginError');

    let options = {
        method: "POST",
        body: JSON.stringify({"username":username,"password":password}),
        headers:{"Content-Type":"application/json"},
    };

    fetch(`${apiUrl}/auth/login`, options)
    .then(response => {
        response.json().then(json => {
            if (response.status != 200) {
                loginError.innerText = json.message;
            } else {   
                let arg = json.token;
                buildLoggedIn(arg, apiUrl);
            }        
        })
    })       
}

export function signUpStatus (apiUrl) {

    const email = document.getElementById('registerEmail').value;
    const username = document.getElementById('registerUsername').value;
    const passOne = document.getElementById('registerPass1').value; 
    const passTwo = document.getElementById('registerPass2').value;  
    const realName = document.getElementById('registerName').value;          
    const signUpError = document.getElementById('signUpError');

    if (passOne === "" || passTwo === "" || email === "" || realName === ""
    || username === "") {
        signUpError.innerText = "Fields must not be Empty";
        return;
    } else if (passOne != passTwo) {
        signUpError.innerText = "Passwords do not match";
        return;   
    }
    
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
            if (response.status != 200) {
                signUpError.innerText = json.message;
            } else {   
                document.getElementById('registerEmail').value = "";
                document.getElementById('registerUsername').value = "";
                document.getElementById('registerPass1').value = ""; 
                document.getElementById('registerPass2').value = "";  
                document.getElementById('registerName').value = ""; 
                document.getElementById("signUpModal").style.display = "";
                document.getElementById("loginModal").style.display = "inline";
                let printSucess = document.getElementById("loginError");
                printSucess.innerText = "Sign up sucessful. You may now log in";
            }    
        })
    })         
}

export function buildLoggedIn(arg, apiUrl) {
    localStorage.setItem("token", arg)
    clearBody();
    document.getElementById("navHeader").remove();
    document.getElementById("loginModal").remove();
    createBanner(apiUrl)
    createBasePage(apiUrl);  
}

export function clearBody () {
    const main = document.getElementById("mainFeed");
    main.parentNode.removeChild(main);

}
