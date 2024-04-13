let deleteResult;
let modifyResult;
let insertResult;
let modifyCache;
let selectedInsert;
let insertSong;
let insertVideo;
let insertLyric;
let insertQueryResult;
let selectedSong;
let selectedTemplate;

function insertData() {
    console.log('insert place')
    document.getElementById('modify-modify').disabled = true;
    document.getElementById('modify-delete').disabled = true;
    let displayElement = document.getElementById('insert-data');
    displayElement.style.display = 'block';
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
    document.getElementById('modify-insert').disabled = true;
    document.getElementById('modify-delete').disabled = true;
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
    modifyCache.artists.splice(index, 1)
    // You would also need to re-render the form or update indexes if necessary
    // Update the indexes of the remaining artist entries
    const artistEntries = document.querySelectorAll('.expandable-artist .artist-entry');
    artistEntries.forEach((entry, newIndex) => {
        const input = entry.querySelector('.artist-name-input');
        const cancelIcon = entry.querySelector('.cancel-icon');
        if (input) {
            input.setAttribute('data-index', newIndex);
        }
        if (cancelIcon) {
            cancelIcon.setAttribute('onclick', `removeArtist(this, ${newIndex})`);
        }
    });
}

function removeLyrics(element, index, entryIndex) {
    // Here, you'd handle the logic to remove the artist from your data
    // For example, if you have an array `artists` that reflects the data, you'd do:
    // artists.splice(index, 1);

    // Then, remove the artist entry from the DOM
    element.closest('.lyrics-entry').remove();
    modifyCache.lyrics_info.splice(index, 1)
    // You would also need to re-render the form or update indexes if necessary
    // Update the indexes of the remaining artist entries
    const videoEntries = document.querySelectorAll('.expandable-lyrics .lyrics-entry');
    videoEntries.forEach((entry, newIndex) => {
        const input = entry.querySelector('.lyrics-title-input');
        const urlInput = entry.querySelector('.lyrics-url-input');
        const artistInput = entry.querySelector('.lyrics-artist-input');
        const cancelIcon = entry.querySelector('.cancel-icon');
        if (input) {
            input.setAttribute('data-index', newIndex);
            urlInput.setAttribute('data-index', newIndex);
            artistInput.setAttribute('data-index', newIndex);
        }
        if (cancelIcon) {
            cancelIcon.setAttribute('onclick', `removeLyrics(this, ${newIndex})`);
        }
    });

    // You would also need to re-render the form or update indexes if necessary
}

function removeVideo(element, index, entryIndex) {
    // Here, you'd handle the logic to remove the artist from your data
    // For example, if you have an array `artists` that reflects the data, you'd do:
    // artists.splice(index, 1);

    // Then, remove the artist entry from the DOM
    element.closest('.video-entry').remove();
    modifyCache.video_info.splice(index, 1)
    // You would also need to re-render the form or update indexes if necessary
    // Update the indexes of the remaining artist entries
    const videoEntries = document.querySelectorAll('.expandable-lyrics .lyrics-entry');
    videoEntries.forEach((entry, newIndex) => {
        const videoId = entry.querySelector('.video-id-input');
        const videoTitle = entry.querySelector('.video-title-input');
        const videoArtist = entry.querySelector('.video-artist-input');
        const cancelIcon = entry.querySelector('.cancel-icon');
        if (videoId) {
            videoId.setAttribute('data-index', newIndex);
            videoTitle.setAttribute('data-index', newIndex);
            videoArtist.setAttribute('data-index', newIndex);
        }
        if (cancelIcon) {
            cancelIcon.setAttribute('onclick', `removeVideo(this, ${newIndex})`);
        }
    });

    // You would also need to re-render the form or update indexes if necessary
}

function updateSearchResult() {
    // Assuming 'entry' is accessible and contains the latest data
    const resultImg = document.querySelector('.result-img');
    resultImg.src = entry.album.images[0].url;
    resultImg.alt = entry.album.name;

    document.querySelector('.result-song').textContent = entry.name;
    document.querySelector('.result-artist').textContent = entry.artists.map(artist => artist.name).join(', ');
    document.querySelector('.result-album').textContent = entry.album.name;
}

function saveChanges(index) {
    console.log('inside modify')
    fetch('/modifyquery', {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(modifyCache)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                modifyResult[index] = modifyCache
            } else {
                console.log('modify failed');
                console.log(data.message)
            }
        })
}

function cancelChanges(index) {
    modifyCache = modifyResult[index]
}

function reformatData(formData) {
    let returnData = {}
    for (let [key, value] of formData.entries()){
        const baseKey = key.split('_')[0];  // Assuming your key format is 'baseName_index'
        if (returnData.hasOwnProperty(baseKey)) {
            // Handle multiple entries with the same name, assume they are multiple selections or arrays
            if (!Array.isArray(returnData[baseKey])) {
                // Convert existing entry into an array
                returnData[baseKey] = [returnData[baseKey]];
            }
            // Push new entry into the array
            returnData[baseKey].push(value);
        } else {
            // Assign single entry value
            returnData[baseKey] = value;
        }
    }
    modifyCache.name = returnData.name;
    modifyCache.prim_artist = returnData.artist[0];
    modifyCache.album.name = returnData.albumName;
    modifyCache.album.release_date = returnData.albumDate;
    modifyCache.popularity = returnData.popularity;
    modifyCache.explicit = returnData.explicit;
    modifyCache.duration_ms = returnData.durationMs;
    for (let [index, entry] of modifyCache.video_info.entries()) {
        entry.video_id = returnData['video-id'][index];
        entry.song_title = returnData['video-title'][index];
        entry.artist_name = returnData['video-artist'][index];
    }
    for (let [index, entry] of modifyCache.lyrics_info.entries()) {
        entry.title = returnData['lyrics-title'][index];
        entry.url = returnData['lyrics-url'][index];
        entry.artist = returnData['lyrics-artist'][index];
    }

    console.log(returnData)
    console.log(modifyCache)

}


function displayModifySongs () {
    let res = modifyResult;
    let element = document.getElementById('modify-query-result')
    for (let [entryIndex, entry] of res.entries()) {
        let div = document.createElement("div");
        div.className = 'modify-template'
        div.innerHTML = `
                <div class="search-result" data-index="${entryIndex}">
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
            let allResult = element.querySelectorAll('.search-result')
            let searchResult = this.querySelector('.search-result');
            let insertedDiv = searchResult.nextElementSibling; // Get the sibling element immediately following result-text
            if (insertedDiv && insertedDiv.classList.contains('inserted-div')) {
                // If the div exists, remove it
                insertedDiv.remove();
                allResult.forEach((element, index) => {
                    if (index !== entryIndex) {
                        element.style.display = '';  // Show the clicked element
                    }
                });
            } else {
                modifyCache = modifyResult[entryIndex];
                allResult.forEach((element, index) => {
                    if (index === entryIndex) {
                        element.style.display = '';  // Show the clicked element
                    } else {
                        element.style.display = 'none';  // Hide other elements
                    }
                });
                // If the div doesn't exist, create and insert it
                let newDiv = document.createElement("div");
                newDiv.className = "inserted-div";
                newDiv.onclick = function (event) {
                    event.stopPropagation()
                }
                newDiv.innerHTML = `
                    <form id="songForm" class="song-form" data-index="${entryIndex}">
                        <label for="name">Name:</label>
                        <input type="text" id="name" name="name" value="${entry.name}"><br><br>
                        
                        <label for="artist">Primary Artist:</label>
                        <input type="text" id="artist" name="artist" value="${entry.prim_artist}"><br><br>
                        
                        <div class="expandable-section">
                            <p class="expandable-title" onclick="toggleExpandable(this)">Featured Artists</p>
                            <div class="expandable-content expandable-artist">
                                ${entry.artists.map((artist, index) => `
                                    <div class="artist-entry">
                                        ${index > 0 ? `
                                        <input type="text" name="artist_${index}" class="artist-name-input" value="${artist.name}" data-index="${index}" />
                                        <span class="material-symbols-outlined cancel-icon" onclick="removeArtist(this, ${index})">cancel</span>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                       
                        <label for="albumName">Album Name:</label>
                        <input type="text" id="albumName" name="albumName" value="${entry.album.name}">
                        <label for="albumDate">Album Release Date:</label>
                        <input type="text" id="albumDate" name="albumDate" value="${entry.album.release_date}"><br><br>
                        <br><br>
                        
                        <label for="popularity">Popularity:</label>
                        <input type="number" id="popularity" name="popularity" value="${entry.popularity}"><br><br>
                        
                        <label for="explicit">Explicit:</label>
                        <select id="explicit" name="explicit">
                            <option value="true" ${entry.explicit ? 'selected' : ''}>True</option>
                            <option value="false" ${entry.explicit ? '' : 'selected'}>False</option>
                        </select><br><br>
                        
                        <label for="durationMs">Duration (ms):</label>
                        <input type="number" id="durationMs" name="durationMs" value="${entry.duration_ms}"><br><br>
                        
                        <label for="previewUrl">Preview URL:</label>
                        <input type="url" id="previewUrl" name="previewUrl" value="${entry.preview_url}"><br><br>
                        
                        <div class="expandable-section">
                            <p class="expandable-title" onclick="toggleExpandable(this)">Lyrics Info</p>
                            <div class="expandable-content expandable-lyrics">
                                ${entry.lyrics_info.map((lyrics, index) => `
                                    <div class="lyrics-entry">
                                        <fieldset>
                                            <legend> Video ${index} ${lyrics.title}</legend>
                                            <input type="text" name="lyrics-title_${index}" class="lyrics-name-input" value="${lyrics.title}" data-index="${index}" />
                                            <input type="text" name="lyrics-url_${index}" class="lyrics-url-input" value="${lyrics.url}" data-index="${index}" />
                                            <input type="text" name="lyrics-artist_${index}" class="lyrics-artist-input" value="${lyrics.artist}" data-index="${index}" />
                                            <span class="material-symbols-outlined cancel-icon" data-index="${index}" onclick="removeLyrics(this, ${index})">cancel</span>
                                        </fieldset>
                                    </div>
                                    
                                    `).join('')}
                            </div>
                        </div>
                        
                        <div class="expandable-section">
                            <p class="expandable-title" onclick="toggleExpandable(this)">Video Info</p>
                            <div class="expandable-content expandable-video">
                                ${entry.video_info.map((video, index) => `
                                    <div class="video-entry">
                                        <fieldset>
                                            <legend> Video ${index} ${video.song_title}</legend>
                                            <input type="text" name="video-id_${index}" class="video-id-input" value="${video.video_id}" data-index="${index}" />
                                            <input type="text" name="video-title_${index}" class="video-title-input" value="${video.song_title}" data-index="${index}" />
                                            <input type="text" name="video-artist_${index}" class="video-artist-input" value="${video.artist_name}" data-index="${index}" />
                                            <span class="material-symbols-outlined cancel-icon" data-index="${index}" onclick="removeVideo(this, ${index})">cancel</span>
                                        </fieldset>
                                    </div>
                                    
                                    `).join('')}
                            </div>
                        </div>
                        
                        <!-- Repeat for any other fields you need -->
                        <button type="submit">Save Changes</button>
                        <button type="reset">Cancel</button>
                    </form>

                `;
                searchResult.insertAdjacentElement("afterend", newDiv);
                document.getElementById('songForm').addEventListener('submit', function (e) {
                    e.preventDefault(); // Prevent the default form submission
                    const formData = new FormData(this);
                    reformatData(formData);
                    saveChanges(entryIndex);
                    let addedDiv = document.querySelector('.inserted-div');
                    addedDiv.remove();
                    allResult.forEach((element, index) => {
                        if (index !== entryIndex) {
                            element.style.display = '';  // Show the clicked element
                        }
                    });
                })
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
                modifyCache = data;
                displayModifySongs()
            }
            else {
                element.innerHTML = '<p id="no-match-delete">No match entry! Try another song name/ artist name</p>'
            }
        }
        )
})

document.getElementById('modify-form-input').addEventListener('reset', function (e) {
    document.getElementById('modify-insert').disabled = false;
    document.getElementById('modify-delete').disabled = false;
    let element = document.getElementById('modify-query-result')
    element.innerHTML = ''
    element.style.display = 'none'
    let parentElement = document.getElementById('modify-data')
    parentElement.style.display = 'none'
})


function deleteData() {
    document.getElementById('modify-insert').disabled = true;
    document.getElementById('modify-modify').disabled = true;
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

function insertSongs (element) {
    let index = element.getAttribute('data-id')
    let insertion = insertSong[index];
    console.log('inside insert')
    fetch('/insert', {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                'type': 'song',
                'track': insertion
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('insert successful');
                let parentDiv = element.closest('.search-result');
                if (parentDiv) {
                    parentDiv.remove();
                }
            } else {
                console.log('insert failed');
            }
        })
}

function insertVideos (element) {
    let index = element.getAttribute('data-id')
    let insertion = selectedTemplate;
    console.log('inside insert')
    fetch('/insert', {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'type': 'video',
                'track': insertion,
                'video': insertVideo[index]
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('insert video successful');
                let parentDiv = element.closest('.video-result');
                if (parentDiv) {
                    parentDiv.remove();
                }
            } else {
                console.log('insert video failed');
            }
        })
}

function insertLyrics (element) {
    let index = element.getAttribute('data-id')
    let insertion = selectedTemplate;
    console.log('inside insert')
    fetch('/insert', {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'type': 'lyrics',
                'track': insertion,
                'lyrics': insertLyric[index]
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('insert video successful');
                let parentDiv = element.closest('.lyrics-result');
                if (parentDiv) {
                    parentDiv.remove();
                }
            } else {
                console.log('insert video failed');
            }
        })
}


function displayInsertSongs () {
    let res = insertSong;
    let element = document.getElementById('insert-query-result')
    for(let [entryIndex, entry] of res.entries()) {
        let div = document.createElement("div");
        div.className = 'search-result'
        // 'album', 'artists', 'available_markets', 'disc_number', 'duration_ms', 'explicit', 'external_ids', 'external_urls', 'href', 'id', 'is_local', 'name', 'popularity', 'preview_url', 'track_number', 'type', 'uri']
        div.innerHTML = `
                <div class="result-media">
                    <img src="${entry.album.images[0].url}" class="result-img" alt="${entry.album.name}">
                </div>
                <div class="result-text">
                    <p class="result-song">${entry.name}</p>
                    <p class="result-artist">${entry.artists.map(artist => artist.name).join(', ')}</p>
                    <p class="result-album">${entry.album.name}</p>
                </div>
                <div class="insert-button">
                    <span class="material-symbols-outlined insert-button-icon"  data-id="${entryIndex}" onclick="insertSongs(this)">add</span>
                </div>
            `;
        element.appendChild(div);
    }
}

function selectInsertTemplate(clickedIndex) {
    console.log('inside insert')
    let elements = document.querySelectorAll('.search-result');  // Get all result elements
    selectedTemplate = insertQueryResult[clickedIndex]
    elements.forEach((element, index) => {
        if (index === clickedIndex) {
            element.style.display = '';  // Show the clicked element
            element.onclick = null;
        } else {
            element.style.display = 'none';  // Hide other elements
        }
    });
   let queryForm = document.getElementById("insert-filter-input");
   queryForm.style.display = 'none';
   console.log(selectedInsert)
   if (selectedInsert === 'video'){
       const videoElement = document.getElementById('insert-video-field')
       videoElement.style.display = 'block';
       const videoInput = videoElement.querySelectorAll('input');
        videoInput.forEach((entry, index) => {
            entry.required = true
        });
   }
   if (selectedInsert === 'lyrics'){
       const videoElement = document.getElementById('insert-lyrics-field')
       videoElement.style.display = 'block';
       const videoInput = videoElement.querySelectorAll('input');
        videoInput.forEach((entry, index) => {
            entry.required = true
        });
   }
}

function displayQueriedSongs() {
    let res = insertQueryResult;
    let element = document.getElementById('insert-filter-result')
    for(let [entryIndex, entry] of res.entries()) {
        console.log('why');
        let div = document.createElement("div");
        div.className = 'search-result'
        div.setAttribute('data-id', entryIndex);  // Correctly set the data-id attribute
        // Bind the click event to the div
        div.onclick = function() {
            selectInsertTemplate(entryIndex);
        };
        // 'album', 'artists', 'available_markets', 'disc_number', 'duration_ms', 'explicit', 'external_ids', 'external_urls', 'href', 'id', 'is_local', 'name', 'popularity', 'preview_url', 'track_number', 'type', 'uri']
        div.innerHTML = `
                <div class="result-media">
                    <img src="${entry.album.images[0].url}" class="result-img" alt="${entry.album.name}">
                </div>
                <div class="result-text">
                    <p class="result-song">${entry.name}</p>
                    <p class="result-artist">${entry.artists.map(artist => artist.name).join(', ')}</p>
                    <p class="result-album">${entry.album.name}</p>
                </div>
            `;
        element.appendChild(div);
    }
}

function displayInsertVideos() {
    let res = insertVideo;
    let element = document.getElementById('insert-query-result')
    for(let [entryIndex, entry] of res.entries()) {
        let div = document.createElement("div");
        // {'publishedAt': '2024-02-28T01:47:45Z', 'channelId': 'UCJICIDAcukS6yTXof6xQCDw', 'title': 'Taylor Swift Songs Playlist 2024 ~ Taylor Swift Greatest Hits', 'description': 'Taylor Swift Songs Playlist 2024 ~ Taylor Swift Greatest Hits.', 'thumbnails': {'default': {'url': 'https://i.ytimg.com/vi/w7tNSbrwRMY/default.jpg', 'width': 120, 'height': 90}, 'medium': {'url': 'https://i.ytimg.com/vi/w7tNSbrwRMY/mqdefault.jpg', 'width': 320, 'height': 180}, 'high': {'url': 'https://i.ytimg.com/vi/w7tNSbrwRMY/hqdefault.jpg', 'width': 480, 'height': 360}}, 'channelTitle': 'MUSIC DOSES', 'liveBroadcastContent': 'none', 'publishTime': '2024-02-28T01:47:45Z'}
        div.className = 'search-result video-result'
        // 'album', 'artists', 'available_markets', 'disc_number', 'duration_ms', 'explicit', 'external_ids', 'external_urls', 'href', 'id', 'is_local', 'name', 'popularity', 'preview_url', 'track_number', 'type', 'uri']
        div.innerHTML = `
                <div class="result-media">
                    <img src="${entry.snippet.thumbnails.default.url}" class="result-img" alt="${entry.snippet.title}">
                </div>
                <div class="result-text">
                    <p class="result-song">${entry.snippet.title}</p>
                    <p class="result-artist">${entry.snippet.description}</p>
                    <p class="result-album">${entry.snippet.channelTitle}</p>
                </div>
                <div class="insert-button">
                    <span class="material-symbols-outlined insert-button-icon"  data-id="${entryIndex}" onclick="insertVideos(this)">add</span>
                </div>
            `;
        element.appendChild(div);
    }
}

function displayInsertLyrics() {
    let res = insertLyric;
    let element = document.getElementById('insert-query-result')
    for(let [entryIndex, entry] of res.entries()) {
        let div = document.createElement("div");
        // {'publishedAt': '2024-02-28T01:47:45Z', 'channelId': 'UCJICIDAcukS6yTXof6xQCDw', 'title': 'Taylor Swift Songs Playlist 2024 ~ Taylor Swift Greatest Hits', 'description': 'Taylor Swift Songs Playlist 2024 ~ Taylor Swift Greatest Hits.', 'thumbnails': {'default': {'url': 'https://i.ytimg.com/vi/w7tNSbrwRMY/default.jpg', 'width': 120, 'height': 90}, 'medium': {'url': 'https://i.ytimg.com/vi/w7tNSbrwRMY/mqdefault.jpg', 'width': 320, 'height': 180}, 'high': {'url': 'https://i.ytimg.com/vi/w7tNSbrwRMY/hqdefault.jpg', 'width': 480, 'height': 360}}, 'channelTitle': 'MUSIC DOSES', 'liveBroadcastContent': 'none', 'publishTime': '2024-02-28T01:47:45Z'}
        div.className = 'search-result lyrics-result'
        // 'album', 'artists', 'available_markets', 'disc_number', 'duration_ms', 'explicit', 'external_ids', 'external_urls', 'href', 'id', 'is_local', 'name', 'popularity', 'preview_url', 'track_number', 'type', 'uri']
        div.innerHTML = `
                <div class="result-media">
                    <img src="${entry.result.header_image_thumbnail_url}" class="result-img" alt="${entry.result.full_title}">
                </div>
                <div class="result-text">
                    <p class="result-song">${entry.result.full_title}</p>
                    <p class="result-artist">${entry.result.primary_artist.name}</p>
                </div>
                <div>
                    <a href=${entry.result.url}>Lyrics Link</a>
                </div>
                <div class="insert-button">
                    <span class="material-symbols-outlined insert-button-icon"  data-id="${entryIndex}" onclick="insertLyrics(this)">add</span>
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

document.getElementById('delete-form-input').addEventListener('reset', function (e) {
    document.getElementById('modify-insert').disabled = false;
    document.getElementById('modify-modify').disabled = false;
    let element = document.getElementById('delete-query-result')
    element.innerHTML = ''
    element.style.display = 'none'
    let parentElement = document.getElementById('delete-data')
    parentElement.style.display = 'none'
})

function updateOptions() {
    const select = document.getElementById('insert-select');
    const options = select.options;
    const isSongSelected = Array.from(options).some(option => option.selected && option.value === 'song');
    const isVideoOrLyricsSelected = Array.from(options).some(option => option.selected && (option.value === 'video' || option.value === 'lyrics'));

    // Disable video and lyrics if song is selected
    if (isSongSelected) {
        for (const option of options) {
            if (option.value !== 'song') {
                option.disabled = true;
            } else {
                option.disabled = false;
            }
        }
    }
    // Disable song if video or lyrics are selected
    else if (isVideoOrLyricsSelected) {
        for (const option of options) {
            if (option.value === 'song') {
                option.disabled = true;
            } else {
                option.disabled = false;
            }
        }
    }
    // Enable all if none of the above conditions are met
    else {
        for (const option of options) {
            option.disabled = false;
        }
    }
}

document.getElementById('insert-choice-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting

    const selectElement = document.getElementById('insert-select');
    const selectedOptions = selectElement.value
    selectedInsert = selectedOptions
    console.log(selectedInsert)

    const insertElement = document.getElementById('insert-form')
    insertElement.style.display = 'block'

    const displayElement = document.getElementById('insert-choice');
    displayElement.style.display = 'none'

    if (selectedOptions === 'song') {
        const songElement = document.getElementById('insert-song-field')
        songElement.style.display = 'block'
        const songInput = songElement.querySelectorAll('input');
        songInput.forEach((entry, index) => {
            entry.required = true
        });

        const queryElement = document.getElementById('insert-song-query')
        queryElement.style.display = 'none'
        const queryInput = queryElement.querySelectorAll('input');
        queryInput.forEach((entry, index) => {
            entry.required = false
        });

    }
    if (selectedOptions === 'video') {
        /*
        const videoElement = document.getElementById('insert-video-field')
        videoElement.style.display = 'block';
        const videoInput = videoElement.querySelectorAll('input');
        videoInput.forEach((entry, index) => {
            entry.required = true
        });*/
        const songElement = document.getElementById('insert-song-field')
        songElement.style.display = 'none'
        const lyricsElement = document.getElementById('insert-lyrics-field')
        lyricsElement.style.display = 'none'
        const queryElement = document.getElementById('insert-song-query')
        queryElement.style.display = 'block'
        const queryInput = queryElement.querySelectorAll('input');
        queryInput.forEach((entry, index) => {
            entry.required = true
        });
    }
    if (selectedOptions === 'lyrics') {
        /*const lyricsElement = document.getElementById('insert-lyrics-field')
        lyricsElement.style.display = 'block'
        const lyricsInput = lyricsElement.querySelectorAll('input');
        lyricsInput.forEach((entry, index) => {
             entry.required = true
        });*/
        const songElement = document.getElementById('insert-song-field')
        songElement.style.display = 'none'
        const videoElement = document.getElementById('insert-video-field')
        videoElement.style.display = 'none';

        const queryElement = document.getElementById('insert-song-query')
        queryElement.style.display = 'block'
        const queryInput = queryElement.querySelectorAll('input');
        queryInput.forEach((entry, index) => {
            entry.required = true
        });
    }
    console.log(selectedOptions); // Do something with the selected options
})

document.getElementById('insert-choice-form').addEventListener('reset', function () {
    let displayElement = document.getElementById('insert-data');
    displayElement.style.display = 'none';
    let buttonElement = document.getElementById('modify-choice');
    let buttons = buttonElement.querySelectorAll('button');
    for (let index in buttons) buttons[index].disabled = false;
    const select = document.getElementById('insert-select');
    const options = select.options;
    for (const option of options) {
        option.disabled = false;
        option.selected = false;
    }
})

document.getElementById('insert-filter-input').addEventListener('submit', function (e) {
    e.preventDefault();
    const songName = document.getElementById('song-name').value
    const songArtist = document.getElementById('song-artist').value
    let query = `/adminquery?song=${encodeURIComponent(songName)}&artist=${encodeURIComponent(songArtist)}`;
    fetch(query)
        .then(result => result.json())
        .then(data => {
            if (data && data.length){
                console.log(data)
                insertQueryResult = data;
                displayQueriedSongs()
            }
            else {
                element.innerHTML = '<p id="no-match-filter">No match entry! Try another song name/ artist name</p>'
            }
        }
        )
    
})

document.getElementById('insert-form-input').addEventListener('reset', function () {
    let displayElement = document.getElementById('insert-form');
    displayElement.style.display = 'none';
    let buttonElement = document.getElementById('modify-choice');
    let buttons = buttonElement.querySelectorAll('button');
    for (let index in buttons) buttons[index].disabled = false;
})

document.getElementById('insert-form-input').addEventListener('submit', function (e) {
    e.preventDefault();
    let displayElement = document.getElementById('insert-form');
    displayElement.style.display = 'none';
    let buttonElement = document.getElementById('modify-choice');
    let buttons = buttonElement.querySelectorAll('button');
    for (let index in buttons) buttons[index].disabled = false;

    if (selectedInsert === 'song') {
        let spotifyKey = document.getElementById('spotify-key').value
        let spotifyQuery = document.getElementById('insert-song').value
        let query = `/insert?type=song&key=${encodeURIComponent(spotifyKey)}&query=${encodeURIComponent(spotifyQuery)}`
        let element = document.getElementById('insert-query-result');
        fetch(query)
            .then(result => result.json())
            .then(data => {
                if (data && data.length){
                    console.log(data)
                    insertSong = data;
                    console.log(insertSong[0]);
                    displayInsertSongs()
                }
                else {
                    element.innerHTML = '<p id="no-match-insert-song">No match entry! Try another song name/ artist name</p>'
                }
            }
            )
    }

    if (selectedInsert === 'video') {
        let youtubeKey = document.getElementById('youtube-key').value
        let youtubeQuery = document.getElementById('insert-video').value
        let query = `/insert?type=video&key=${encodeURIComponent(youtubeKey)}&query=${encodeURIComponent(youtubeQuery)}`
        let element = document.getElementById('insert-query-result');
        fetch(query)
            .then(result => result.json())
            .then(data => {
                if (data && data.length){
                    console.log(data)
                    insertVideo = data;
                    displayInsertVideos()
                }
                else {
                    element.innerHTML = '<p id="no-match-insert-video">No match entry! Try another song name/ artist name</p>'
                }
            }
            )
    }
    if (selectedInsert === 'lyrics') {
        let geniusKey = document.getElementById('genius-key').value
        let geniusQuery = document.getElementById('insert-lyrics').value
        let query = `/insert?type=lyrics&key=${encodeURIComponent(geniusKey)}&query=${encodeURIComponent(geniusQuery)}`
        let element = document.getElementById('insert-query-result');
        fetch(query)
            .then(result => result.json())
            .then(data => {
                if (data && data.length){
                    console.log(data)
                    insertLyric = data;
                    displayInsertLyrics()
                }
                else {
                    element.innerHTML = '<p id="no-match-insert-lyrics">No match entry! Try another song name/ artist name</p>'
                }
            }
            )
    }
})