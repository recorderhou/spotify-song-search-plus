let inputQuery;
let currentUser = '';
let clicked = new Array(20).fill(false);
let userRating = new Array(0);

function hideImages() {
    // Hide the image container
    let imageContainer = document.querySelector('.image-container');
    if (imageContainer) {
        imageContainer.style.display = 'none'; // Or add a class that sets display to none
    }
}


function submitQuery() {
    let let query = `/searchresult?query=${encodeURIComponent(inputQuery)}`;
    return fetch(query)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            return data
        });
}


function getRating(){
    let query = `/rating?query=${encodeURIComponent(currentUser)}`
    return fetch(query)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        });
}

function updateStars(rate_div, curRating, resIndex, res) {
    let stars = rate_div.querySelectorAll('.rating-star');
            console.log(stars.length)
            console.log('currently in', this.tagName);
            // Add click event listeners to each star
            stars.forEach(star => {
                let rating = Array.from(stars).indexOf(star);
                if (rating < curRating) {
                    star.style.fill = 'goldenrod';
                }
            });

            stars.forEach(star => {
                let rating = Array.from(stars).indexOf(star);
                if (rating < curRating) {
                    star.style.fill = 'goldenrod';
                }
                star.onclick = function (event) {
                    event.stopPropagation()
                    clicked[resIndex] = true;

                    console.log('inside onclick')

                    let ratingData = {
                        'song_id': res['_id'],
                        'rating': rating + 1
                    }

                    fetch('/rating', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(ratingData)
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                console.log('rate successful');
                            } else {
                                console.log('rate failed');
                            }
                        })

                    // Set the rating based on the star's data-value attribute
                    console.log('click rating', rating)
                    for (let i = 0; i < stars.length; i++) {
                        if (i <= rating) {
                            stars[i].style.fill = 'goldenrod';
                        } else {
                            stars[i].style.fill = 'grey';
                        }
                    }
                    console.log(`Rated: ${rating} stars`);
                };
                star.addEventListener('mouseenter', () => {
                    if (!clicked[resIndex]) {
                        console.log('mouseenter rating', rating)
                        for (let i = 0; i < stars.length; i++) {
                            if (i <= rating) {
                                stars[i].style.fill = 'goldenrod';
                            } else {
                                stars[i].style.fill = 'grey';
                            }
                        }
                    }
                });

                star.addEventListener('mouseleave', () => {
                    if (!clicked[resIndex]) {
                        console.log('mouseenter rating', rating)
                        if (rating === 0) {
                            stars[0].style.fill = 'grey';
                        }
                    }
                });
            });
}


function displayResult() {
    submitQuery().then(result => {
        console.log(result);
        let element = document.getElementById('search-placeholder');
        let displayedResult = 0;
        for (let [resIndex, res] of result.entries()) {
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
                let p = document.createElement('div')
                p.className = 'video-link'
                let videoLink = 'https://www.youtube.com/watch?v=' + res.video_info[0].video_id
                p.innerHTML = `
                    <p class="result-video"><a href="${videoLink}" target="_blank">Video Link</a></p>
                `
                div.appendChild(p)
            } else {
                let p = document.createElement('div')
                p.className = 'video-link'
                p.innerHTML = `
                    <p class="result-video"><a href="#">No Video</a></p>
                `
                div.appendChild(p)
            }

            let rate_div = document.createElement('div')
            rate_div.className = 'rate-button'
            let curRating = 0;
            console.log('userRating inside click', userRating);
            let targetIndex = userRating.map(obj => obj['song_id']).indexOf(res['_id']);
            console.log('targetIndex', targetIndex)
            if (targetIndex >= 0) {
                curRating = userRating[targetIndex].rating;
                clicked[resIndex] = true;
                rate_div.innerHTML = `
                    <svg class="starIcon rating-star" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                    </svg>
                    <svg class="starIcon rating-star" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                    </svg>
                    <svg class="starIcon rating-star" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                    </svg>
                    <svg class="starIcon rating-star" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                    </svg>
                    <svg class="starIcon rating-star" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                    </svg>
                `;
                updateStars(rate_div, curRating, resIndex, res);
            } else {
                rate_div.innerHTML = `<p class="rate-init">Rate</p>`
                rate_div.onclick = function () {
                    this.innerHTML = `
                        <svg class="starIcon rating-star" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                        </svg>
                        <svg class="starIcon rating-star" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                        </svg>
                        <svg class="starIcon rating-star" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                        </svg>
                        <svg class="starIcon rating-star" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                        </svg>
                        <svg class="starIcon rating-star" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                        </svg>
                    `;
                    updateStars(this, curRating, resIndex, res);
                }
            }
            div.appendChild(rate_div)
            element.appendChild(div)
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
    fetch('/session_data')
        .then(result => result.json())
        .then(data => {
            if (data['username']) {
                currentUser = data['username']
                console.log('current User is', currentUser)
                let ratingQuery = `/rating?query=${encodeURIComponent(currentUser)}`
                fetch(ratingQuery)
                    .then(response => response.json())
                    .then(data => {
                        userRating = data.rating
                    });
                console.log('userRating is', userRating);
                hideImages(); // Hide images before displaying results
    displayResult();
            }
            else {
                element.innerHTML = '<p id="no-login-warn">You need to login to view content! Go to <a href="/user">Login</a></p>'
            }
        }
        )
});
