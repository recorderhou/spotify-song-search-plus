let deleteResult;
let modifyResult;

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

function displayModifyData () {
    let res = modifyResult;
    let element = document.getElementById('modify-query-result')
    for (let [entryIndex, entry] of res.entries()) {
        let div = document.createElement("div");
        div.className = 'search-result'
        div.innerHTML = `
                <div class="result-media">
                    <img src="${entry.album.images[0].url}" class="result-img" alt="${entry.album.name}">
                </div>
                <div class="result-text">
                    <p class="result-song">${entry.name}</p>
                    <p class="result-artist">${entry.artists.map(artist => artist.name).join(', ')}</p>
                    <p class="result-album">${entry.album.name}</p>
                </div>
                <div class="delete-button">
                    <span class="material-symbols-outlined delete-button-icon" data-id="${entryIndex}" onclick="deleteSong(this)">delete</span>
                </div>
            `;
        element.appendChild(div);
    }
}

document.getElementById('modify-form-input').addEventListener('submit', function (e) {
    e.preventDefault()
    let element = document.getElementById('modify-query-result')
    element.innerHTML = ''
    let modifySong = document.getElementById('modify-song').value
    let modifyArtist = document.getElementById('modify-artist').value
    let query = `/adminquery?song=${encodeURIComponent(modifySong)}&artist=${encodeURIComponent(modifyArtist)}`
    fetch(query)
        .then(result => result.json())
        .then(data => {
            if (data && data.length){
                console.log(data)
                modifyResult = data;
                displayModifySongs()
            }
            else {
                element.innerHTML = '<p id="no-match-delete">No match entry! Try another song name/ artist name</p>'
            }
        }
        )
})


function deleteData() {
    let insertElement = document.getElementById('insert-choice');
    insertElement.style.display = 'none';
    let modifyElement = document.getElementById('modify-form');
    modifyElement.style.display = 'none';
    let deleteElement = document.getElementById('delete-form');
    deleteElement.style.display = 'block';
}

function deleteSong(element) {
    // Your code to handle the click event
    let index = element.getAttribute('data-id')
    let deletion = {
        '_id': deleteResult[index]._id
    };
    console.log('inside delete')
    fetch('/delete', {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deletion)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('deletion successful');
                deleteResult.splice(index, 1);
                let parentDiv = element.closest('.search-result');
                if (parentDiv) {
                    parentDiv.remove();
                }
            } else {
                console.log('deletion failed');
            }
        })
}


function displayDeleteSongs () {
    let res = deleteResult;
    let element = document.getElementById('delete-query-result')
    for(let [entryIndex, entry] of res.entries()) {
        let div = document.createElement("div");
        div.className = 'search-result'
        div.innerHTML = `
                <div class="result-media">
                    <img src="${entry.album.images[0].url}" class="result-img" alt="${entry.album.name}">
                </div>
                <div class="result-text">
                    <p class="result-song">${entry.name}</p>
                    <p class="result-artist">${entry.artists.map(artist => artist.name).join(', ')}</p>
                    <p class="result-album">${entry.album.name}</p>
                </div>
                <div class="delete-button">
                    <span class="material-symbols-outlined delete-button-icon" data-id="${entryIndex}" onclick="deleteSong(this)">delete</span>
                </div>
            `;
        element.appendChild(div);
    }
}


document.getElementById('delete-form-input').addEventListener('submit', function (e) {
    e.preventDefault()
    let element = document.getElementById('delete-query-result')
    element.innerHTML = ''
    let deleteSong = document.getElementById('delete-song').value
    let deleteArtist = document.getElementById('delete-artist').value
    let query = `/adminquery?song=${encodeURIComponent(deleteSong)}&artist=${encodeURIComponent(deleteArtist)}`
    fetch(query)
        .then(result => result.json())
        .then(data => {
            if (data && data.length){
                console.log(data)
                deleteResult = data;
                displayDeleteSongs()
            }
            else {
                element.innerHTML = '<p id="no-match-delete">No match entry! Try another song name/ artist name</p>'
            }
        }
        )
})

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