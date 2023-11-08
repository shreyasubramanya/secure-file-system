
// // Function to handle user sign up
// function signUp(username, password) {
//   // TODO: Implement user sign up logic here
//   // This could involve sending a POST request to a server with the user's credentials
// }

// // Function to handle user sign in
// function signIn(username, password) {
//   // TODO: Implement user sign in logic here
//   // This could involve sending a POST request to a server with the user's credentials
// }

// // Example usage:
// const username = "exampleUser";
// const password = "examplePassword";

// // Sign up the user
// signUp(username, password);

// // Sign in the user
// signIn(username, password);
// Function to handle user sign up
function signUp(username, password) {
    // Create a user object with the provided credentials
    const user = { username, password };
  
    // Send a POST request to the server to register the user
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (response.ok) {
          console.log('User signed up successfully');
        } else {
          console.error('Failed to sign up');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  // Function to handle user sign in
  function signIn(username, password) {
    // Create a user object with the provided credentials
    const user = { username, password };
  
    // Send a POST request to the server to authenticate the user
    fetch('/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (response.ok) {
          console.log('User signed in successfully');
          // You can perform additional actions after successful sign-in
        } else {
          console.error('Failed to sign in');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  // Add an event listener to the sign-up button
  const signupButton = document.getElementById('signup-button');
  signupButton.addEventListener('click', () => {
    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;
    signUp(username, password);
  });
  
  // Add an event listener to the sign-in button
  const signinButton = document.getElementById('signin-button');
  signinButton.addEventListener('click', () => {
    const username = document.getElementById('signin-username-input').value;
    const password = document.getElementById('signin-password-input').value;
    signIn(username, password);
  });
  