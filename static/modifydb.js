
function insertData() {
    console.log('insert place')
    let insertElement = document.getElementById('insert-choice');
    insertElement.style.display = 'block';
    let modifyElement = document.getElementById('modify-form');
    modifyElement.style.display = 'none';
    let deleteElement = document.getElementById('delete-form');
    deleteElement.style.display = 'none';

    let buttonElement = document.getElementById('modify-choice');
    let buttons = buttonElement.querySelectorAll('button');
    for (let index in buttons) buttons[index].disabled = true;
}

function modifyData() {
    console.log('modify place')
    let insertElement = document.getElementById('insert-choice');
    insertElement.style.display = 'none';
    let modifyElement = document.getElementById('modify-form');
    modifyElement.style.display = 'block';
    let deleteElement = document.getElementById('delete-form');
    deleteElement.style.display = 'none';
}

function deleteData() {
    let insertElement = document.getElementById('insert-choice');
    insertElement.style.display = 'none';
    let modifyElement = document.getElementById('modify-form');
    modifyElement.style.display = 'none';
    let deleteElement = document.getElementById('delete-form');
    deleteElement.style.display = 'block';
}

document.getElementById('insert-choice-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting

    const selectElement = document.getElementById('insert-select');
    const selectedOptions = Array.from(selectElement.selectedOptions).map(option => option.value);

    const insertElement = document.getElementById('insert-form')
    insertElement.style.display = 'block'

    const displayElement = document.getElementById('insert-choice');
    displayElement.style.display = 'none'

    if (selectedOptions.includes('song', 0)) {
        const songElement = document.getElementById('insert-song-field')
        songElement.style.display = 'block'
    }
    if (selectedOptions.includes('video', 0)) {
         const videoElement = document.getElementById('insert-video-field')
         videoElement.style.display = 'block'
    }
    if (selectedOptions.includes('lyrics', 0)) {
        const lyricsElement = document.getElementById('insert-lyrics-field')
        lyricsElement.style.display = 'block'
    }
    console.log(selectedOptions); // Do something with the selected options
})

document.getElementById('insert-form-input').addEventListener('reset', function () {
    let displayElement = document.getElementById('insert-form');
    displayElement.style.display = 'none';
    let buttonElement = document.getElementById('modify-choice');
    let buttons = buttonElement.querySelectorAll('button');
    for (let index in buttons) buttons[index].disabled = false;
})