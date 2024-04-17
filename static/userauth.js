function UserAuth(userName, userPassword){
    let data = {
        username: userName,
        password: userPassword
    }
    console.log(JSON.stringify(data))
    fetch('/userauth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.success)
        if (data.success) {
            window.location.href = data.redirect_url;
        } else {
            window.location.href = data.redirect_url;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle errors, e.g., show an error message
    });
}

document.getElementById('user-login-input').addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('got event')
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value
    UserAuth(username, password)
})