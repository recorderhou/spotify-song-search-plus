let inputQuery;

function hideImages() {
    // Hide the image container
    let imageContainer = document.querySelector('.image-container');
    if (imageContainer) {
        imageContainer.style.display = 'none'; // Or add a class that sets display to none
    }
}

function submitQuery() {
    let query = `/searchresult?query=${encodeURIComponent(inputQuery)}`;
    return fetch(query)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        });
}

function displayResult() {
    submitQuery().then(result => {
        console.log(result);
        let element = document.getElementById('search-placeholder');
        let displayedResult = 0;
        for (let res of result) {
            if (displayedResult === 20) {
                break;
            }
            console.log(res.name);
            let div = document.createElement("div");
            div.className = 'search-result';
            div.innerHTML = `
                <div class="result-media">
                    <img src="${res.album.images[0].url}" class="result-img" alt="${res.album.name}">
                </div>
                <div class="result-text">
                    <p class="result-song">${res.name}</p>
                    <p class="result-artist">${res.artists.map(artist => artist.name).join(', ')}</p>
                    <p class="result-album">${res.album.name}</p>
                </div>
            `;
            if (res.video_info.length > 0) {
                let p = document.createElement('div');
                p.className = 'video-link';
                let videoLink = 'https://www.youtube.com/watch?v=' + res.video_info[0].video_id;
                p.innerHTML = `<a href="${videoLink}" target="_blank">Video Link</a>`;
                div.appendChild(p);
            } else {
                let p = document.createElement('div');
                p.className = 'video-link';
                p.innerHTML = 'No Video';
                div.appendChild(p);
            }
            element.appendChild(div);
            displayedResult++;
        }
    });
}

document.getElementById('query-input').addEventListener('submit', function (e) {
    e.preventDefault();
    document.body.classList.add('search-performed');
    let element = document.getElementById('search-placeholder');
    element.innerHTML = '';
    inputQuery = document.getElementById('query-text').value;
    console.log(inputQuery);
    hideImages(); // Hide images before displaying results
    displayResult();
});
