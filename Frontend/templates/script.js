
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
  