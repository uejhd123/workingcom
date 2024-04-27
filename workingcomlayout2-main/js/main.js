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

var jwtInCookies = getAllCookies().jwtToken;
var vacancyCount = getAllCookies().VacancyCount;


// Функция для отрисовки вакансии
function renderJob(job) {
    htmlElement = `    
    <div class="col-lg-4 col-md-6 col-12">
        <div class="job-thumb job-thumb-box">
            <div class="job-body">
                <h4 class="job-title">
                <a href="job-details.html?vacancyId=${job.id}" class="job-title-link">${job.VacancyName}</a>
                </h4>
                <div class="d-flex align-items-center">
                    <div class="job-image-wrap d-flex align-items-center bg-white shadow-lg mt-2 mb-4">
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
                    <a href="job-details.html?vacancyId=${job.id}" class="custom-btn btn ms-auto">Откликнуться</a>
                </div>
            </div>
        </div>
    </div>
    `;
    var element = document.querySelector('.clearfix');
    element.insertAdjacentHTML('afterend', htmlElement);
}

function fetchAndRenderJobs() {
    const jwtToken = getAllCookies().jwtToken;
    fetch(`http://localhost:8000/api/v1/vacancylist/?page=1&page_size=3`, {
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
        var count = data.count;
        data.results.forEach(job => {
            console.log(job)
            renderJob(job)
        });
    })
    .catch(error => {
        console.error('Ошибка при получении данных:', error);
    });
}

fetchAndRenderJobs();



if (document.cookie.includes(jwtInCookies)) {
    document.getElementById('reg').style.display = "none";
    document.getElementById('reg-company').style.display = "none";
    document.getElementById('auth').style.display = "none";
} else {
    document.getElementById('profile').style.display = "none";
}

document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var vacancyName = document.getElementById('VacancyName').value;
    var url = 'http://localhost:8000/api/v1/vacancylist/?VacancyName=' + encodeURIComponent(vacancyName);

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
            window.location.href = 'http://localhost:7000/job-listings.html'
            var stopElement = document.querySelector('.col-lg-4.col-12.recent-jobs-bottom.d-flex.ms-auto.my-4');
            var parentElement = stopElement.parentNode;
            var elementsToRemove = parentElement.querySelectorAll('.col-lg-4.col-md-6.col-12');
            elementsToRemove.forEach(function(element) {
                parentElement.removeChild(element);
            });

            if (data.results.length == 0) {
                console.log(data.results.length)
                var element = document.querySelector('.clearfix');
                element.insertAdjacentHTML('afterend', `<h1>Вакансии не найдены</h1>`);
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