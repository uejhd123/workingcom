//получаем куки
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

//разбиваем JWT токен для получения id ползователя
function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

let vacancyUserId = 0;

//функция для вставки разметки
async function renderJob(job) {
    let companyAccount;
    let usr;
    try {
        let currentUserData = await fetchUserData(jwtPayload);
        companyAccount = currentUserData.CompanyAccount;
        console.log(currentUserData)
        usr = currentUserData.username;
    } catch(error) {
        console.log("Произошла ошибка");
    }
    let vacancyInfo = document.getElementById('vacancyInfo');
    const htmlElement = `
        <div class="col-lg-8 col-12">
            <h2 class="job-title mb-0">${job.VacancyName}</h2>
            <div class="job-thumb job-thumb-detail">
                <div class="d-flex flex-wrap align-items-center border-bottom pt-lg-3 pt-2 pb-3 mb-4">
                    <p class="job-location mb-0">
                        <i class="custom-icon bi-geo-alt me-1"></i>
                        ${job.VacancyGeo}
                    </p>
                    <p class="job-date mb-0">
                        <i class="custom-icon bi-clock me-1"></i>
                        ${job.Busyness}
                    </p>
                    <p class="job-price mb-0">
                        <i class="custom-icon bi-cash me-1"></i>
                        ${job.Salary} \u20bd
                    </p>
                </div>
                <h4 class="mt-4 mb-2">Описание вакансии</h4>
                <p>${job.VacancyDescription}</p>
                <h5 class="mt-4 mb-3">Обязанности</h5>
                <ul>
                    ${job.VacancyResponsibilities.split('\n').map(requirement => `<li>${requirement}</li>`).join('')}
                </ul>
                <h5 class="mt-4 mb-3">Требования к кандидату</h5>

                <ul>
                    ${job.VacancyRequirements.split('\n').map(requirement => `<li>${requirement}</li>`).join('')}
                </ul>
                <h5 class="mt-4 mb-3">Условия</h5>
                <ul>
                    ${job.VacancyConditions.split('\n').map(requirement => `<li>${requirement}</li>`).join('')}
                </ul>
                <div class="d-flex justify-content-center flex-wrap mt-5 border-top pt-4">
                    <a onclick="sendMail()" style="display: ${companyAccount ? "none" : "block"};" class="custom-btn btn mt-2">Откликнуться на вакансию</a>
                </div>
            </div>
        </div>
        <div class="col-lg-4 col-12 mt-5 mt-lg-0">
            <div class="job-thumb job-thumb-detail-box bg-white shadow-lg">
                <div class="d-flex align-items-center">
                    <div class="job-image-wrap d-flex align-items-center bg-white shadow-lg mb-3">
                        <p class="mb-0">${job.VacancyUsername}</p>
                    </div>
                </div>
                <h6 class="mt-4 mb-3">Контактная информация</h6>
                ${job.Contacts.split('\n').map(requirement => `
                    <p class="mb-2">
                        <a href="#" class="site-footer-link">${requirement}</a>
                    </p>
                `).join('')}
            </div>
            <a id="deleteVacancy" onclick="deleteVacancy()" class="custom-btn btn ms-auto" style="display: ${companyAccount && usr == job.VacancyUsername ? "block" : "none"};">Закрыть вакансию</a>
            <br>
            <dialog id="dialog1">
                <h1 id="results1"></h1>
                <button onclick="window.location.href='localhost:7000'" aria-label="close" class="x">❌</button>
            </dialog>
            <a class="custom-btn btn ms-auto" onclick="showVacancyEditDialog()" style="display: ${companyAccount && usr == job.VacancyUsername ? "block" : "none"};">Изменить вакансию</a>
        </div>
    `;
    vacancyInfo.innerHTML = htmlElement;
}


function showVacancyEditDialog() {
    window.dialog2.show();
    fetch(`http://localhost:8000/api/v1/vacancylist/${vacancyIdPrev}`, {
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
        // Заполнение полей формы данными из объекта data
        document.getElementById('VacancyName').value = data.VacancyName;
        document.getElementById('Salary').value = data.Salary;
        document.getElementById('Busyness').value = data.Busyness;
        document.getElementById('Experience').value = data.Experience;
        document.getElementById('VacancyDescription').value = data.VacancyDescription;
        document.getElementById('VacancyRequirements').value = data.VacancyRequirements;
        document.getElementById('VacancyResponsibilities').value = data.VacancyResponsibilities;
        document.getElementById('VacancyConditions').value = data.VacancyConditions;
        document.getElementById('Contacts').value = data.Contacts;
        document.getElementById('VacancyGeo').value = data.VacancyGeo;
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
}

document.getElementById('vacancyForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let data = {
        VacancyName: document.getElementById('VacancyName').value,
        Salary: document.getElementById('Salary').value,
        Busyness: document.getElementById('Busyness').value,
        Experience: document.getElementById('Experience').value,
        VacancyDescription: document.getElementById('VacancyDescription').value,
        VacancyRequirements: document.getElementById('VacancyRequirements').value,
        VacancyResponsibilities: document.getElementById('VacancyResponsibilities').value,
        VacancyConditions: document.getElementById('VacancyConditions').value,
        Contacts: document.getElementById('Contacts').value,
        VacancyGeo: document.getElementById('VacancyGeo').value,
        userId: jwtPayload,
        VacancyUsername: getAllCookies().username
    };
    fetch(`http://localhost:8000/api/v1/vacancylist/${vacancyIdPrev}/`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${jwtInCookies}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Данные успешно отправлены на сервер:', data);
        window.dialog2.close();
    })
    .catch(error => {
        console.error('Ошибка при отправке данных:', error);
        // Обработка ошибки, если нужно
    });
});


//получаем вакансии с api
function fetchAndRenderJobs(vacancyId, jwt) {
    fetch(`http://localhost:8000/api/v1/vacancylist/${vacancyId}`, {
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }
        return response.json();
    })
    .then(data => { 
        vacancyUserId = data.userId;
        renderJob(data);
    })
    .catch(error => {
        console.error('Ошибка при получении данных:', error);
    });
}

function closeVacancy(vacancyId, jwt) {
    fetch(`http://localhost:8000/api/v1/vacancydelete/${vacancyId}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwt}`

        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .catch(error => {
        window.location.href = 'localhost:7000/index.html'
    });
}
let vacancyIdPrev;
var jwtInCookies = getAllCookies().jwtToken;
let jwtPayload = parseJwt(jwtInCookies).user_id;

let deleteVacancy = () => {
    closeVacancy(vacancyIdPrev, jwtInCookies);
    document.getElementById('results1').value = "Вакансия закрыта";
    window.dialog1.show();    
}



//отправляем письмо
async function sendMail() {
    const subject = 'На вашу вакансию откликнулся пользователь!';
    let createBodyString = (userName, userEmail, phoneNumber, resume) => `На вашу вакансию откликнулся пользователь: ${userName}.\nВот его контактные данные:\nEmail: ${userEmail}\nНомер телефона: ${phoneNumber}, и резюме: \n${resume}`;

    try {
        let data = await fetchUserData(vacancyUserId);
        const companyEmail = data.email;
        let currentUserData = await fetchUserData(jwtPayload);
        let body = createBodyString(currentUserData.first_name + " " + currentUserData.last_name, currentUserData.email, currentUserData.phone_number, currentUserData.bio);

        fetch('http://localhost:8000/api/v1/sendmail/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subject, body, to: companyEmail }),
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('results').innerHTML = "Письмо отправлено";
            window.dialog.show()
        })
        .catch(error => console.error('Error:', error));
    } catch (error) {
        console.error("Ошибка при загрузке вакансий");
    }
};

//парсинг данных из поисковой строки
document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const vacancyId = urlParams.get('vacancyId');
    vacancyIdPrev = vacancyId;
    if (vacancyId) {
        fetchAndRenderJobs(vacancyId, jwtInCookies)
    } else {
        console.error('Параметр vacancyId не найден в URL');
    }
});


//функция для получения данных о пользователе
async function fetchUserData(userId) {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/userupdate/${userId}`, {
            headers: {
                'Authorization': `Bearer ${jwtInCookies}`
            }
        });

        if (!response.ok) {
            throw new Error('Ошибка при получении данных');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Ошибка при получении данных");
        return "ошибка";
    }
}