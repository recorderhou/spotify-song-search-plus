function adminAuth(adminName, adminPassword) {
    const data = {
        admin_name: adminName,
        password: adminPassword
    };

    console.log(JSON.stringify(data))

    fetch('/adminauth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
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

document.getElementById('admin-login-input').addEventListener('submit', function (e) {
    e.preventDefault();
    let adminName = document.getElementById('admin-name').value
    let adminPassword = document.getElementById('admin-password').value
    console.log(adminName)
    console.log(adminPassword)
    adminAuth(adminName, adminPassword)
})