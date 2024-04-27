document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем стандартное действие отправки формы

    // Получаем данные из формы
    var formData = {
        username: this.username.value,
        first_name: this.first_name.value,
        last_name: "Компания",
        email: this.email.value,
        password: this.password.value, // Убедитесь, что пароль отправляется безопасно и не в открытом виде
        phone_number: this.phone_number.value,
        address: this.address.value,
        bio: this.bio.value,
        preferences: "Компания",
        CompanyAccount: true,
    };

    // Отправляем данные на сервер с помощью POST-запроса
    fetch('http://localhost:8000/api/v1/useradd/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        window.location.href = 'http://localhost:7000/index.html'
        console.log('Данные успешно отправлены', data);
        // Обработка успешного ответа сервера
    })
    .catch(error => {
        console.error('Ошибка при отправке данных:', error);
        // Обработка ошибки
    });
});