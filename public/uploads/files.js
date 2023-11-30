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
