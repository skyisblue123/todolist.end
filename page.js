const signupPart = document.querySelector('.signup-part');
const loginPart = document.querySelector('.login-part');
const signUplogInPart = document.querySelector('.signUplogInPart')
const signup = document.querySelector('.signup');
const backSignup = document.querySelector('.backSignup');
const backLogin = document.querySelector('.backLogin');
const todolistPart = document.querySelector('.todolist-part');
const login = document.querySelector('.login');

const topBar = document.querySelector('.topBar');
const incompletePart = document.querySelector('.incomplete-part');
const completePart = document.querySelector('.complete-part');
const allPart = document.querySelector('.all-part');
const totalPart = document.querySelector('.totalPart');

const nameInput = document.querySelector('#nameInput');
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const emailInput2 = document.querySelector('#emailInput2');
const passwordInput2 = document.querySelector('#passwordInput2');

const eyeIcon = document.querySelectorAll('.eyeicon');

const addInput = document.querySelector('.addInput');
const dateInput = document.querySelector('.dateInput');
const sendIcon = document.querySelector('.sendIcon');

const deleteIcon = document.querySelector('.deleteIcon');


//註冊功能
signup.addEventListener('click', function (e) {
    signUp(emailInput.value, nameInput.value, passwordInput.value);
})
//按enter註冊
passwordInput.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        signUp(emailInput.value, nameInput.value, passwordInput.value);
    }
});
const apiUrl = `https://todoo.5xcamp.us`;
function signUp(email, nickname, password) {
    axios.post(`${apiUrl}/users`, {
        "user": {
            "email": email,
            "nickname": nickname,
            "password": password
        }
    })
        .then(function (response) {
            if (response.data.message == '註冊成功') {
                signupPart.setAttribute('style', 'display: none;');
                loginPart.setAttribute('style', 'display: block;');
            }
            Swal.fire({
                icon: 'success',
                title: 'success',
                text: 'Sign up successful, please log in again!',
            })
        })
        .catch(function (error) {
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            })
        });
}

//登入功能
// 加入axios.defaults.headers.common['Authorization']後，下面不用每個都帶入
// {
//     headers: {
//         "Authorization": token
//     }
// }
login.addEventListener('click', function (e) {
    signIn(emailInput2.value, passwordInput2.value);
})
//按enter登入
passwordInput2.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        signIn(emailInput2.value, passwordInput2.value);
    }
});
function signIn(email, password) {
    axios.post(`${apiUrl}/users/sign_in`, {
        "user": {
            "email": email,
            "password": password
        }
    })
        .then(function (response) {
            axios.defaults.headers.common['Authorization'] = response.headers.authorization;
            if (response.data.message == '登入成功') {
                signUplogInPart.setAttribute('style', 'display: none !important;');
                todolistPart.setAttribute('style', 'display:block;');
                getTodo();
            }
        })
        .catch(function (error) {
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            })
        });
}
//返回註冊頁
backSignup.addEventListener('click', function (e) {
    signupPart.setAttribute('style', 'display:block;');
    loginPart.setAttribute('style', 'display:none;');
})
//返回登入頁
backLogin.addEventListener('click', function (e) {
    signupPart.setAttribute('style', 'display:none;');
    loginPart.setAttribute('style', 'display:block;');
})

//切換完成/未完成頁
topBar.addEventListener('click', function (e) {
    if (e.target.textContent == 'Incomplete') {
        incompletePart.setAttribute('style', 'display:block;');
        allPart.setAttribute('style', 'display:none;');
        completePart.setAttribute('style', 'display:none;');
    } else if (e.target.textContent == 'Complete') {
        completePart.setAttribute('style', 'display:block;');
        incompletePart.setAttribute('style', 'display:none;');
        allPart.setAttribute('style', 'display:none;');
    } else if (e.target.textContent == 'All') {
        allPart.setAttribute('style', 'display:block;');
        completePart.setAttribute('style', 'display:none;');
        incompletePart.setAttribute('style', 'display:none;');
    }
})

//密碼可見/不可見
eyeIcon.forEach(function (item, index) {
    item.addEventListener('click', function (e) {
        if (e.target.classList.contains('bi-eye')) {
            e.target.classList.remove('bi-eye');
            e.target.classList.add('bi-eye-slash');
            passwordInput.setAttribute('type', 'text');
            passwordInput2.setAttribute('type', 'text');
        } else {
            e.target.classList.add('bi-eye');
            e.target.classList.remove('bi-eye-slash');
            passwordInput.setAttribute('type', 'password');
            passwordInput2.setAttribute('type', 'password');
        }
    })
})

//新增 TODO
sendIcon.addEventListener('click', function (e) {
    addTodo(addInput.value);
    addInput.value = '';
    dateInput.value = '';
})
function addTodo(content) {
    axios.post(`${apiUrl}/todos`, {
        "todo": {
            "content": content,
        }
    })
        .then(function (response) {
            getTodo();
        })
        .catch(error => console.log(error.response))//error要加response才能看到自己data內容
}
//按enter新增
addInput.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        addTodo(addInput.value);
        getTodo();
        addInput.value = '';
        dateInput.value = '';
    }
});
//刪除 TODO
totalPart.addEventListener('click', function (e) {
    if (e.target.classList.contains('deleteIcon')) {
        delTodo(e.target.getAttribute('data-id'));
    }
})
function delTodo(id) {
    axios.delete(`${apiUrl}/todos/${id}`)
        .then(function (response) {
            getTodo();

        })
        .catch(error => console.log(error.response))//error要加response才能看到自己data內容
}

//TODO 列表
function getTodo() {
    axios.get(`${apiUrl}/todos`)
        .then(function (response) {
            let completed = response.data.todos.filter(function (item) {
                return item.completed_at !== null;
            })
            let incompleted = response.data.todos.filter(function (item) {
                return item.completed_at == null;
            })
            let strAll = '';
            if (incompleted == '') {
                incompletePart.innerHTML = `<li class="list-group-item list-group-item-secondary w-100 w-lg-50 mx-auto text-center text-secondary fs-4 mt-5 opacity-50 shadow-mine" style="padding:150px 0;">
                Nothing added yet </li>`;
            } else {
                let str = '';
                incompleted.forEach(function (item) {
                    let incompletedStr = `<li class="list-group-item list-group-item-action py-2 d-flex list-item addItem">
                    <input class="form-check-input me-2" type="checkbox" data-id="${item.id}">
                    ${item.content}<span class="ms-auto">2023/05/25</span><i
                        class="bi bi-trash fs-4 ms-2 deleteIcon" style="cursor:pointer;" data-id="${item.id}"></i>
                </li>`;
                    str += incompletedStr;
                    strAll += incompletedStr;
                })
                incompletePart.innerHTML = str;
            }
            let str2 = '';
            completed.forEach(function (item) {
                let completedStr = `<li class="list-group-item list-group-item-action py-2 d-flex list-item addItem">
                <input class="form-check-input me-2" type="checkbox" data-id="${item.id}" checked>
                ${item.content}<span class="ms-auto">2023/05/25</span><i
                    class="bi bi-trash fs-4 ms-2 deleteIcon" style="cursor:pointer;" data-id="${item.id}"></i>
            </li>`;
                str2 += completedStr;
                strAll += completedStr;
            })
            completePart.innerHTML = str2;
            allPart.innerHTML = strAll;
        })
        .catch(error => console.log(error.response))//error要加response才能看到自己data內容
}

//完成未完成
incompletePart.addEventListener('click', function (e) {
    toggleTodo(e.target.getAttribute('data-id'));
})
function toggleTodo(id) {
    axios.patch(`${apiUrl}/todos/${id}/toggle`)
        .then(function (response) {
            getTodo();
        })
        .catch(error => console.log(error.response))//error要加response才能看到自己data內容
}



//v@gmail.com
//vvvvvv
