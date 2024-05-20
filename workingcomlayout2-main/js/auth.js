document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (username == "" || password == ""){
        showError('Заполните поля и повторите попытку')
        return
    }


    fetch('http://localhost:8000/api/v1/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            alert("Неверный пароль или логин");
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        var username = document.getElementById('username').value;
        var token = data.access;
        document.cookie = "jwtToken=" + token + "; path=/";
        document.cookie = "username=" + username + "; path=/";
        window.location.href = 'http://localhost:7000/index.html'
    })
    .catch(error => {
        showError('Неверный пароль или логин');
        console.error('There was a problem with the fetch operation:', error);
    });
});

function showError(text){
    let error = document.getElementById("error");
    error.style.display = 'block';
    error.value = text
}
