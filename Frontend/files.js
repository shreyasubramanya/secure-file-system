
// Get the file input element and the delete button element
const fileInput = document.getElementById('file-input');
const deleteButton = document.getElementById('delete-button');

// Add an event listener to the file input element to handle file uploads
fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Send a POST request to the server to upload the file
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      console.log('File uploaded successfully');
    } else {
      console.error('Failed to upload file');
    }
  } catch (error) {
    console.error(error);
  }
});

// Add an event listener to the delete button element to handle file deletions
deleteButton.addEventListener('click', async () => {
  try {
    // Send a DELETE request to the server to delete the file
    const response = await fetch('/delete', {
      method: 'DELETE'
    });

    if (response.ok) {
      console.log('File deleted successfully');
    } else {
      console.error('Failed to delete file');
    }
  } catch (error) {
    console.error(error);
  }
});
