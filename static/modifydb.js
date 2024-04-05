let deleteResult;
let modifyResult;
let insertResult;

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

function toggleExpandable(titleElement) {
    let content = titleElement.nextElementSibling;
    if (content.style.display === "block") {
        content.style.display = "none";
        titleElement.parentElement.classList.remove('expanded');
    } else {
        content.style.display = "block";
        titleElement.parentElement.classList.add('expanded');
    }
}

function removeArtist(element, index) {
    // Here, you'd handle the logic to remove the artist from your data
    // For example, if you have an array `artists` that reflects the data, you'd do:
    // artists.splice(index, 1);

    // Then, remove the artist entry from the DOM
    element.closest('.artist-entry').remove();

    // You would also need to re-render the form or update indexes if necessary
}

function removeVideo(element, index) {
    // Here, you'd handle the logic to remove the artist from your data
    // For example, if you have an array `artists` that reflects the data, you'd do:
    // artists.splice(index, 1);

    // Then, remove the artist entry from the DOM
    element.closest('.video-entry').remove();

    // You would also need to re-render the form or update indexes if necessary
}


function displayModifySongs () {
    let res = modifyResult;
    let element = document.getElementById('modify-query-result')
    for (let [entryIndex, entry] of res.entries()) {
        let div = document.createElement("div");
        div.className = 'modify-template'
        div.innerHTML = `
                <div class="search-result">
                    <div class="result-media">
                        <img src="${entry.album.images[0].url}" class="result-img" alt="${entry.album.name}">
                    </div>
                    <div class="result-text">
                        <p class="result-song">${entry.name}</p>
                        <p class="result-artist">${entry.artists.map(artist => artist.name).join(', ')}</p>
                        <p class="result-album">${entry.album.name}</p>
                    </div>
                </div>
            `;
        div.onclick = function () {
            let searchResult = this.querySelector('.search-result');
            let insertedDiv = searchResult.nextElementSibling; // Get the sibling element immediately following result-text
            if (insertedDiv && insertedDiv.classList.contains('inserted-div')) {
                // If the div exists, remove it
                insertedDiv.remove();
            } else {
                // If the div doesn't exist, create and insert it
                let newDiv = document.createElement("div");
                newDiv.className = "inserted-div";
                newDiv.onclick = function (event) {
                    event.stopPropagation()
                }
                newDiv.innerHTML = `
                    <form id="songForm" class="song-form">
                        <label for="name">Name:</label>
                        <input type="text" id="name" name="name" value="${entry.name}"><br><br>
                        
                        <label for="artists">Artists:</label>
                        <input type="text" id="artists" name="artists" value="${entry.artists.map(artist => artist.name).join(', ')}"><br><br>
                        
                        <div class="expandable-section">
                            <p class="expandable-title" onclick="toggleExpandable(this)">Artists</p>
                            <div class="expandable-content expandable-artist">
                                ${entry.artists.map((artist, index) => `
                                    <div class="artist-entry">
                                        <input type="text" class="artist-name-input" value="${artist.name}" data-index="${index}" />
                                        ${index > 0 ? `<span class="material-symbols-outlined cancel-icon" onclick="removeArtist(this, ${index})">cancel</span>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <label for="albumName">Album Name:</label>
                        <input type="text" id="albumName" name="albumName" value="${entry.album.name}"><br><br>
                        
                        <label for="explicit">Explicit:</label>
                        <select id="explicit" name="explicit">
                            <option value="true" selected>True</option>
                            <option value="false">False</option>
                        </select><br><br>
                        
                        <label for="durationMs">Duration (ms):</label>
                        <input type="number" id="durationMs" name="durationMs" value="119871"><br><br>
                        
                        <label for="previewUrl">Preview URL:</label>
                        <input type="url" id="previewUrl" name="previewUrl" value="https://p.scdn.co/mp3-preview/7d8cded800c0a0c0431c8da0ffa86..."><br><br>
                        
                        <label for="albumId">Album ID:</label>
                        <input type="text" id="albumId" name="albumId" value="2yZKBF1qe0EpnBsIhAg9Z0"><br><br>
                        
                        <div class="expandable-section">
                            <p class="expandable-title" onclick="toggleExpandable(this)">Video Info</p>
                            <div class="expandable-content expandable-video">
                                ${entry.video_info.map((video, index) => `
                                    <div class="video-entry">
                                        <fieldset>
                                            <legend> Video ${index} ${video.title}</legend>
                                            <span class="material-symbols-outlined cancel-icon" data-index="${index}" onclick="removeVideo(this, ${index})">cancel</span>
                                            <input type="text" class="video-name-input" value="${video.title}" data-index="${index}" />
                                            <input type="text" class="video-url-input" value="${video.url}" data-index="${index}" />
                                            <input type="text" class="video-artist-input" value="${video.artist}" data-index="${index}" />
                                            <input type="text" class="video-id-input" value="${video._id}" data-index="${index}" />
                                        </fieldset>
                                    </div>
                                    
                                    `).join('')}
                            </div>
                        </div>
                        
                        <!-- Repeat for any other fields you need -->
                        
                        <button type="button" onclick="saveChanges()">Save Changes</button>
                    </form>

                `;
                searchResult.insertAdjacentElement("afterend", newDiv);
            }

        }
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