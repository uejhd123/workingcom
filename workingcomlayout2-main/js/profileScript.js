function getAllCookies() {
    let cookies = document.cookie.split(';');
    let cookiesObject = {};

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie) {
            let cookieParts = cookie.split('=');
            let cookieName = cookieParts[0];
            let cookieValue = cookieParts[1];
            cookiesObject[cookieName] = decodeURIComponent(cookieValue);
        }
    }

    return cookiesObject;
}

let jwtInCookies = getAllCookies().jwtToken;
let jwtPayload = parseJwt(jwtInCookies).user_id;
let message = document.getElementById('message');


function fetchUserData(userId) {
    return fetch(`http://localhost:8000/api/v1/userupdate/${userId}`, {
        headers: {
            'Authorization': `Bearer ${jwtInCookies}`
        }
    })
    .then(response => {
        return response.json();
    });
}

let companyName = "";

function updateFormAndSubmit(userId) {
    fetchUserData(userId)
        .then(data => {
            if (data.CompanyAccount == false) {
                document.getElementById("addVacancy").style.display = "none";
                document.getElementById("actualVacancy").style.display = "none";
            } else {
                document.getElementById("last_name-group").style.display = "none";
            }
            document.getElementById('username').value = data.username;
            document.getElementById('first_name').value = data.first_name;
            document.getElementById('last_name').value = data.last_name;
            document.getElementById('email').value = data.email;
            document.getElementById('phone_number').value = data.phone_number;
            document.getElementById('address').value = data.address;
            document.getElementById('bio').value = data.bio;
            companyName = data.first_name;
        })
        .catch(error => {
            message.innerHTML = 'Ошибка при получении данных пользователя';
            window.dialog1.showModal();
        });
}


var summary = document.getElementById('bio');
summary.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    var start = this.selectionStart;
    var end = this.selectionEnd;

    var content = this.value;

    this.value = content.substring(0, end)
      + "\n" + "-"
      + content.substring(start);

    this.selectionStart = this.selectionEnd = end + 2;
  }
});

function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.onload = () => {
    updateFormAndSubmit(jwtPayload);
}
let deleteJwt = () => {
    let jwtInCookies = getAllCookies().jwtToken;
    document.cookie = 'jwtToken=' + jwtInCookies + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    let username = getAllCookies().username;
    document.cookie = 'username=' + username + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = 'http://localhost:7000/index.html' 
}

document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (this.password.value == "" || this.password.value == " " || this.password.value == undefined) {
        document.getElementById('error').style.display = 'block';
    }
    let phoneNum = this.phone_number.value.replaceAll("+", "").replaceAll(" ", "").replaceAll("(","").replaceAll(")", "");
    let formData = {
        username: this.username.value,
        first_name: this.first_name.value,
        last_name: this.last_name.value,
        email: this.email.value,
        phone_number: phoneNum,
        address: this.address.value,
        bio: this.bio.value,
        password: this.password.value
    };
    fetch(`http://localhost:8000/api/v1/userupdate/${jwtPayload}`, {
        method: 'PUT',
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
        message.innerHTML = 'данные успешно сохранены';
        window.dialog1.showModal();

    })
    .catch(error => {
        message.innerHTML = 'Ошибка при сохранении данных';
        window.dialog1.showModal();
    });
});

document.getElementById('vacancyForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    let formData = {
        VacancyName: this.VacancyName.value,
        Salary: this.Salary.value,
        Busyness: this.Busyness.value,
        Experience: this.Experience.value,
        VacancyDescription: this.VacancyDescription.value,
        VacancyGeo: this.VacancyGeo.value,
        userId: jwtPayload,
        VacancyUsername: companyName,
        VacancyRequirements: this.VacancyRequirements.value,
        VacancyResponsibilities: this.VacancyResponsibilities.value,
        VacancyConditions: this.VacancyConditions.value,
        Contacts: this.Contacts.value
    };
    fetch(`http://localhost:8000/api/v1/vacancylist/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtInCookies}`
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
        console.log('Данные успешно отправлены', data);
        message.innerHTML = 'Вакансия добавлена';
        window.dialog1.showModal();
        window.dialog2.close();
    })
    .catch(error => {
        console.error('Ошибка при добавлении вакансии', error);
        window.dialog2.close();
    });
});

function showVacancyModal() {
    window.dialog2.showModal();
}


function renderJob(job) {
    var element = document.getElementById('jobs');
    element.innerHTML += `
    <br>
    <div class="job-body">
        <h1 class="job-title">
            <a href="job-details.html" class="job-title-link">${job.VacancyName}</a>
        </h4>

        <div class="d-flex align-items-center">
            <div class="job-image-wrap d-flex align-items-center bg-white shadow-lg mt-2 mb-4">\
                <p class="mb-0">${job.VacancyUsername}</p>
            </div>

            <a href="#" class="bi-bookmark ms-auto me-2"></a>
            <a href="#" class="bi-heart"></a>
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


function fetchAndRenderJobs() {
    let counter = document.getElementById('VacancyCount');
    let jobsList = document.getElementById('jobs');
    jobsList.innerHTML = '';

    fetch(`http://localhost:8000/api/v1/vacancylist/?user_id=${jwtPayload}`, {
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

        data.results.forEach(job => {
            renderJob(job);
        });
    })
    .catch(error => {
        console.error('Ошибка при получении данных:', error);
    });
}

function showActualVacancy() {
    window.location.href = `http://localhost:7000/job-company-listing.html`;
}



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
                return i < val.length ? val.charAt(i++) || def.charAt(i) : a
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
        if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
        if (event.type == "blur" && this.value.length < 5)  this.value = ""
    }

    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false)

  });

});