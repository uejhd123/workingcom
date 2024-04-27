username = document.getElementById('username')
function getAllCookies() {
    var cookies = document.cookie.split(';');
    var cookiesObject = {};

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie) {
            var cookieParts = cookie.split('=');
            var cookieName = cookieParts[0];
            var cookieValue = cookieParts[1];
            cookiesObject[cookieName] = decodeURIComponent(cookieValue);
        }
    }

    return cookiesObject;
}

// форматирование даты
function formatDate(dateString) {
    // Создаем объект Date из строки
    var date = new Date(dateString);
  
    // Получаем компоненты даты
    var day = date.getDate();
    var month = date.getMonth() + 1; // Месяцы считаются с 0, поэтому добавляем 1
    var year = date.getFullYear();
  
    // Форматируем день и месяц, если они состоят из одной цифры, добавляем 0 спереди
    day = (day < 10 ? '0' : '') + day;
    month = (month < 10 ? '0' : '') + month;
  
    // Возвращаем отформатированную дату
    return day + '.' + month + '.' + year;
}

// Использование функции
var jwtInCookies = getAllCookies().jwtToken;
var vacancyCount = getAllCookies().VacancyCount;


// Функция для отрисовки вакансии
function renderJob(job) {
        // Получаем элемент по ID
    var element = document.getElementById('jobs');

    // Устанавливаем ему содержимое в виде HTML
    element.innerHTML += `
    <div class="job-body">
        <h4 class="job-title">
            <a href="job-details.html" class="job-title-link">${job.VacancyName}</a>
        </h4>

        <div class="d-flex align-items-center">
            <div class="job-image-wrap d-flex align-items-center bg-white shadow-lg mt-2 mb-4">
                <img src="images/companyavatar/gazprom-logo.jpg" class="job-image me-3 img-fluid" alt="">
                <p class="mb-0">Газпром</p>
            </div>

            <a href="#" class="bi-bookmark ms-auto me-2"></a>
            <a href="#" class="bi-heart"></a>
        </div>

        <div class="d-flex align-items-center">
            <p class="job-location">
                <i class="custom-icon bi-geo-alt me-1"></i>
                ${job.Busyness} занятость
            </p>

            <p class="job-date">
                <i class="custom-icon bi-clock me-1"></i>
                ${formatDate(job.VacancyDate)}
            </p>
        </div>

        <div class="d-flex align-items-center border-top pt-3">
            <p class="job-price mb-0">
                <i class="custom-icon bi-cash me-1"></i>
                ${job.Salary}.
            </p>

            <a href="job-details.html" class="custom-btn btn ms-auto">Откликнуться</a>
        </div>
    </div>
    <br>
    `;
}

function fetchAndRenderJobs() {
    const jwtToken = getAllCookies().jwtToken; // Предполагаем, что вы сохранили токен в localStorage
    fetch(`http://46.148.229.104:8000/api/v1/vacancylist`, {
        headers: {
            'Authorization': `Bearer ${jwtInCookies}` // Добавляем токен в заголовок
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        var count = data.count;
        data.results.forEach(job => {
            renderJob(job)
        });
    })
    .catch(error => {
        console.error('Ошибка при получении данных:', error);
    });
}

// Вызов функции для запуска процесса получения и отрисовки вакансий
fetchAndRenderJobs();

var authAndReg = document.getElementById('nav-bar-list');


if (document.cookie.includes(jwtInCookies)) {
    // Удаляем первый элемент списка
    authAndReg.removeChild(authAndReg.children[2]);
    authAndReg.removeChild(authAndReg.children[2]);

     // Создаем новый элемент li
    var newTask = document.createElement('li');
  
    // Создаем новый элемент a (ссылка)
    var newLink = document.createElement('a');
    // Устанавливаем текстовое содержимое ссылки
    newLink.textContent = 'Мой профиль';
    // Устанавливаем атрибут href для ссылки (URL новой страницы)
    newLink.href = 'profile.html';
  
    // Добавляем ссылку в элемент li
    newTask.appendChild(newLink);
  
    // Добавляем элемент li в конец списка
    authAndReg.appendChild(newTask);
}

document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Предотвращаем стандартное действие отправки формы

    var vacancyName = document.getElementById('VacancyName').value;
    var url = 'http://46.148.229.104:8000/api/v1/vacancylist/?VacancyName=' + encodeURIComponent(vacancyName);

    fetch(url, {
        headers: {
            'Authorization': `Bearer ${jwtInCookies}` // Добавляем токен в заголовок
        }
    }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            var element = document.getElementById('jobs');
            // Устанавливаем ему содержимое в виде HTML
            element.innerHTML = "";
            if (data.results.length == 0) {
                console.log(data.results.length)
                element.innerHTML += `
                <div class="job-body">
                    <h2>Вакансии не найдены</h2>
                </div>
                <br>`;
            } else {
                data.results.forEach(job => {
                    renderJob(job)
                });
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
});

document.getElementById('pagination').g
