const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('fileList');
const deleteButton = document.getElementById('delete-button');
const uploadButton = document.getElementById('upload-button');

const files = [];

fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];

    const fileObject = {
        name: file.name,
        size: file.size,
        type: file.type,
    };

    files.push(fileObject);

    displayFileList();
});

uploadButton.addEventListener('click', async () => {
    try {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
            fetchFileList();
        } else {
            console.error('Upload failed');
        }
    } catch (error) {
        console.error('Error during upload:', error);
    }
});

deleteButton.addEventListener('click', async () => {
    const selectedIndex = document.getElementById('fileSelect').value;

    if (selectedIndex) {
        try {
            const response = await fetch(`http://localhost:3000/delete/${selectedIndex}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);
                fetchFileList();
            } else {
                console.error('Delete failed');
            }
        } catch (error) {
            console.error('Error during delete:', error);
        }
    }
});

function displayFileList() {
    fileList.innerHTML = '';

    const fileSelect = document.getElementById('fileSelect');
    fileSelect.innerHTML = '<option value="">Select a file to delete</option>';
    
    files.forEach((file, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `File ${index + 1}: ${file.name} (${file.size} bytes)`;
        fileList.appendChild(listItem);

        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = `File ${index + 1}: ${file.name}`;
        fileSelect.appendChild(option);
    });
}

async function fetchFileList() {
    try {
        const response = await fetch('http://localhost:3000/fileList');
        if (response.ok) {
            const fileData = await response.json();
            files.length = 0;
            files.push(...fileData);
            displayFileList();
        } else {
            console.error('Failed to fetch file list');
        }
    } catch (error) {
        console.error('Error during file list fetch:', error);
    }
}

fetchFileList();
