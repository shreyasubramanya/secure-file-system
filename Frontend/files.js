// Get the file input element, the file list element, and the delete button
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('fileList');
const deleteButton = document.getElementById('delete-button');

// Create an array to store the file objects
const files = [];

// Add an event listener to the file input element to handle file uploads
fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];

    // Create a file object with metadata
    const fileObject = {
        name: file.name,
        size: file.size,
        type: file.type,
    };

    // Add the file object to the array
    files.push(fileObject);

    // Display the updated file list
    displayFileList();
});

// Function to delete a file object from the array
function deleteFile(index) {
    if (index >= 0 && index < files.length) {
        files.splice(index, 1); // Remove the file object at the specified index
        displayFileList();
    }
}

// Add an event listener to the delete button
deleteButton.addEventListener('click', () => {
    // Get the selected file index from the select element
    const selectedIndex = document.getElementById('fileSelect').value;
    // Ensure a valid selection before attempting to delete
    if (selectedIndex) {
        deleteFile(selectedIndex - 1); // Subtract 1 to adjust for 0-based index
    }
});

// Function to display the file list
function displayFileList() {
    // Clear the file list element
    fileList.innerHTML = '';

    // Populate the select element with options for file selection
    const fileSelect = document.getElementById('fileSelect');
    fileSelect.innerHTML = '<option value="">Select a file to delete</option>';
    files.forEach((file, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `File ${index + 1}: ${file.name} (${file.size} bytes)`;
        fileList.appendChild(listItem);

        // Add an option to the select element for each file
        const option = document.createElement('option');
        option.value = index + 1; // Add 1 to adjust for 1-based index in the select element
        option.textContent = `File ${index + 1}: ${file.name}`;
        fileSelect.appendChild(option);
    });
}
