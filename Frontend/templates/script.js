// document.getElementById('signupForm').addEventListener('submit', function(event) {
//     event.preventDefault();
   
//     var username = document.getElementById('username').value;
//     var password = document.getElementById('password').value;
   
//     // Here, you can store the credentials in a text file
//     // or use a different approach to handle authentication.
//     // This is just a simple example to get you started.
//     alert('User created successfully. Username: ' + username + ', Password: ' + password);
//     console.log('User created successfully. Username: ' + username + ', Password: ' + password);
//    });

function submitForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Send login information to the server
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(response => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error('User login failed');
      }
    })
    .then(data => {
      console.log(data); // Output success message
    })
    .catch(error => {
      console.error(error); // Output error message
    });
  }
  