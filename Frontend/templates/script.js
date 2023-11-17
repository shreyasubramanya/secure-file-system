document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
   
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
   
    // Here, you can store the credentials in a text file
    // or use a different approach to handle authentication.
    // This is just a simple example to get you started.
    alert('User created successfully. Username: ' + username + ', Password: ' + password);
   });