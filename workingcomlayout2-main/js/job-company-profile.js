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

function pluralize(count, singular, plural) {
    if (count === 1) {
        return `${count} ${singular}`;
    } else {
        return `${count} ${plural}`;
    }
}

function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


var jwtInCookies = getAllCookies().jwtToken;
var vacancyCount = getAllCookies().VacancyCount;
var jwtPayload = parseJwt(jwtInCookies).user_id;


function renderJob(job) {
    var element = document.getElementById('jobs');
    element.innerHTML += `
    <div class="job-body">
        <h4 class="job-title">
            <a href="job-details.html" class="job-title-link">${job.VacancyName}</a>
        </h4>

        <div class="d-flex align-items-center">
            <div class="job-image-wrap d-flex align-items-center bg-white shadow-lg mt-2 mb-4">\
                <p class="mb-0">${job.VacancyUsername}</p>
            </div>
        </div>

        <div class="d-flex align-items-center">
            <p class="job-location">
                <i class="custom-icon bi-geo-alt me-1"></i>
                ${job.VacancyGeo}
            </p>

            <p class="job-date">
                <i class="custom-icon bi-clock me-1"></i>
                ${job.Busyness}
            </p>
        </div>

        <div class="d-flex align-items-center border-top pt-3">
            <p class="job-price mb-0">
                <i class="custom-icon bi-cash me-1"></i>
                ${job.Salary} \u20bd
            </p>

            <a href="job-details.html" class="custom-btn btn ms-auto">Откликнуться</a>
        </div>
    </div>
    <br>
    `;
}


function fetchAndRenderJobs(page = 1, pageSize = 10) {
    let counter = document.getElementById('VacancyCount');
    let jobsList = document.getElementById('jobs');
    jobsList.innerHTML = '';

    fetch(`http://localhost:8000/api/v1/vacancylist?page=${page}&page_size=${pageSize}&user_id=${jwtPayload}`, {
        headers: {
            'Authorization': `Bearer ${jwtInCookies}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        counter.innerHTML = pluralize(data.count, 'вакансия', 'вакансии');

        // Вызываем функцию createPagination для создания пагинации
        createPagination(data.count, page, pageSize);

        data.results.forEach(job => {
            renderJob(job);
        });
    })
    .catch(error => {
        console.error('Ошибка при получении данных:', error);
    });
}

fetchAndRenderJobs();

document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let jobsList = document.getElementById('jobs');
    jobsList.innerHTML = " ";
    var vacancyName = document.getElementById('job-title').value;

    var page = 1;
    var pageSize = 10; 

    var url = `http://localhost:8000/api/v1/vacancylist/?VacancyName=${encodeURIComponent(vacancyName)}`;

    fetch(url, {
        headers: {
            'Authorization': `Bearer ${jwtInCookies}`
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('VacancyCount').innerHTML = pluralize(data.count, 'вакансия', 'вакансии');
        if (data.results.length == 0) {
            jobsList.innerHTML = "<h1>Вакансии не найдены</h1>";
        } else {
            data.results.forEach(job => {
                renderJob(job);
            });
            // Создание пагинации
            createPagination(data.count, page, pageSize);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function createPagination(totalItems, currentPage, pageSize) {
    let pagination = document.getElementById('Pag');
    pagination.innerHTML = ''; // Очищаем текущие элементы пагинации

    let totalPages = Math.ceil(totalItems / pageSize);
    for (let i = 1; i <= totalPages; i++) {
        let li = document.createElement('li');
        li.classList.add('page-item');
        if (i === currentPage) {
            li.classList.add('active');
        }
        let a = document.createElement('a');
        a.classList.add('page-link');
        a.href = '#';
        a.textContent = i;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            // Обновляем страницу и размер страницы перед вызовом функции поиска вакансий
            fetchAndRenderJobs(i, pageSize);
        });
        li.appendChild(a);
        pagination.appendChild(li);
    }
}