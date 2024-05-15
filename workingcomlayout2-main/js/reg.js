document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем стандартное действие отправки формы
    const profileData = `
      Фамилия и имя:
    - ${this.last_name.value} ${this.first_name.value}

    Контактная информация:
    - Телефон: ${this.phone_number.value}
    - Электронная почта: ${this.email.value}

    Опыт работы:
    - Последнее место работы: 
    - Предыдущее место работы: 

    Образование:
    - Название учебного заведения:
    - Степень:
    - Год окончания:

    Навыки:
    -

    Какую работу вы хотели бы найти?
    -
    `;

    // Получаем данные из формы
    var formData = {
        username: this.username.value,
        first_name: this.first_name.value,
        last_name: this.last_name.value,
        email: this.email.value,
        password: this.password.value, // Убедитесь, что пароль отправляется безопасно и не в открытом виде
        phone_number: this.phone_number.value.replace(/[\s+()]/g, ''),
        address: this.address.value,
        bio: profileData
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

window.addEventListener("DOMContentLoaded", function() {
  [].forEach.call( document.querySelectorAll('.tel'), function(input) {
    var keyCode;
    function mask(event) {
      event.keyCode && (keyCode = event.keyCode);
      var pos = this.selectionStart;
      if (pos < 3) event.preventDefault();
      var matrix = "+7 (___) ___ ____",
          i = 0,
          def = matrix.replace(/\D/g, ""),
          val = this.value.replace(/\D/g, ""),
          new_value = matrix.replace(/[_\d]/g, function(a) {
              return i < val.length ? val.charAt(i++) : a
          });
      i = new_value.indexOf("_");
      if (i != -1) {
          i < 5 && (i = 3);
          new_value = new_value.slice(0, i)
      }
      var reg = matrix.substr(0, this.value.length).replace(/_+/g,
          function(a) {
              return "\\d{1," + a.length + "}"
          }).replace(/[+()]/g, "\\$&");
      reg = new RegExp("^" + reg + "$");
      if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
        this.value = new_value;
      }
      if (event.type == "blur" && this.value.length < 5) {
        this.value = "";
      }
    }

    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false);

  });

});