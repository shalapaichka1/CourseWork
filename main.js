// Глобальные переменные
authorized = 0;
currentUserId = -1;
currentUserName = '';
categoriesLimit = 6 ;
expensesScore = 0;
incomeScore = 0;
currentElementClassName = '';
isDarkTheme = 0;
lock = 0;
deletedElement = 0;
changedElement = 0;
operationIsClosed = 1;
currentPrice = 0;
isExpensesWindow = true;
sumAmountScore = 0;


// Данные для круговой диаграммы (начальные данные)
const chartData = {
  labels: [],
  datasets: [{
    data: [],
    backgroundColor: [
      'rgba(255, 99, 132)',
      'rgba(54, 162, 235)',
      'rgba(255, 206, 86)',
      'rgba(75, 192, 192)',
      'rgba(153, 102, 255)',
    ],
    borderWidth: 1,
    borderWidth: 0,
    
  }]
};

function amountScoreDB() {
  DBScore = 0
  fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/categories')
  .then(response => response.json())
  .then(data => {
    for (let i = 1; i < data.length; i++) {
      if (data[i].userId === currentUserId) {
        if (data[i].categoryType === 'income') {
          DBScore += eval(data[i].price);
          console.log(DBScore);

        } else if (data[i].categoryType === 'expenses') {
          DBScore -= eval(data[i].price);
          console.log(DBScore);

        }
      }
    }
  });
  fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/users/' + currentUserId, {
    method: 'PUT', // or PATCH
    headers: {'content-type':'application/json'},
    body: JSON.stringify({score: String.DBScore})
  }).then(res => {
    if (res.ok) {
        return res.json();
    }
    // handle error
  }).then(task => {
    // Do something with updated task
  }).catch(error => {
    // handle error
  })
}

const ctx = document.getElementById('myChart');
const myChart = new Chart(ctx, {
  type: 'doughnut',
  data: chartData,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    borderColor: 'black',
    hoverOffset: 20,
    rotation: 180,
    offset: 5,
    cutout: "85%",
    borderRadius: 5,
  }
});

function sumScore () {
  sumAmount.textContent = eval(incomeScore - expensesScore);
}


function renderOperationsData(){
  const operationsItemList = document.getElementsByClassName('operationsItemList')[0];
  operationsItemList.innerHTML = ''
  // искусственная задержка 2 секунды

  fetch('https://663fd818e3a7c3218a4e1d6e.mockapi.io/operations')
  .then(response => response.json())
  .then(data => {
    for (let i = 0; i < data.length; i++) { // создание элементов операций
      if (data[i].operationsUserId === parseInt(currentUserId)) {
        const operationElement = document.createElement('div');
        operationElement.classList.add('operationElement');
        operationElement.classList.add('operationItem_' + eval(i+1));
  
        const operationCategoryName = document.createElement('p');
        operationCategoryName.classList.add('operationCategoryTitles');
        operationCategoryName.textContent = data[i].categoryName;

        const operationDate = document.createElement('p');
        operationDate.classList.add('operationDates');
        operationDate.textContent = data[i].date;

        const operationTime = document.createElement('p');
        operationTime.classList.add('operationTimes');
        operationTime.textContent = data[i].time;

        const operationType = document.createElement('p');
        operationType.classList.add('operationType');
        if (data[i].categoryType === 'addendum' && data[i].price < 0) {
        operationType.textContent = 'Новый расход: ';
        }
        else if (data[i].categoryType === 'addendum' && data[i].price > 0) {
          operationType.textContent = 'Новый доход: ';
          }
        else if (data[i].categoryType === 'income') {
          operationType.textContent = 'Пополнение: '; 
        }
        else if (data[i].categoryType === 'expense') {
          operationType.textContent = 'Расход: ';
        }
        else if (data[i].categoryType === 'removal') {
          operationType.textContent = 'Удаление: ';
        }
  
        const operationPrice = document.createElement('p');
        operationPrice.classList.add('operationPrice');
        operationPrice.textContent = data[i].price.toLocaleString()  + " ₽";

        if(data[i].price < 0) {
          operationPrice.classList.add('operationPriceNegative');
        }
        else if(data[i].price > 0) {
          operationPrice.classList.add('operationPricePositive');
        }
        else {
          operationPrice.classList.add('operationPriceNeutral');
        }
        
        operationElement.appendChild(operationCategoryName);
        operationElement.appendChild(operationPrice);
        operationElement.appendChild(operationType);
        operationElement.appendChild(operationDate);
        operationElement.appendChild(operationTime);
        
        operationsItemList.appendChild(operationElement);

        operationElement.addEventListener('click', () => { // создание подробной информации об операции
          if (data[i].categoryType !== 'removal') {
            const backDialogWindow = document.createElement('div');
            backDialogWindow.classList.add('backOperationsInfoWindow');
            document.body.appendChild(backDialogWindow);
            const dialogWindow = document.createElement('div');
            dialogWindow.classList.add('dialogWindow');
  
            const operationsItemInfo = document.createElement('div');
            operationsItemInfo.classList.add('operationsItemInfo');
            backDialogWindow.appendChild(operationsItemInfo);
  
            const close = document.createElement('img');
            close.classList.add('close');
            close.src = 'imgs/close.png';
            
            close.addEventListener('click', () => {
              backDialogWindow.remove();
              dialogWindow.remove();
            })
            operationsItemInfo.appendChild(close);
      
            const operationCategoryName = document.createElement('p');
            operationCategoryName.classList.add('operationCategoryTitle');
            operationCategoryName.textContent = data[i].categoryName;
            
            const operationDescriptionInput = document.createElement('input');
            operationDescriptionInput.classList.add('operationDescriptionInput');
            operationDescriptionInput.placeholder = "Описание операции";
            operationDescriptionInput.value = data[i].description;
  
            const operationPrice = document.createElement('input');
            operationPrice.classList.add('operationPriceInfo');
            operationPrice.placeholder = "Новый счёт";
            operationPrice.value = data[i].price;
      
            const operationDate = document.createElement('p');
            operationDate.classList.add('operationDate');
            operationDate.textContent = data[i].date;
      
            const operationTime = document.createElement('p');
            operationTime.classList.add('operationTime');
            operationTime.textContent = data[i].time;
            
            const operationConfirmButton = document.createElement('button');
            operationConfirmButton.classList.add('operationConfirmButton');
            operationConfirmButton.textContent = 'Изменить';
            operationConfirmButton.addEventListener('click', () => {
              if (operationPrice.value !== '') {
                fetch('https://663fd818e3a7c3218a4e1d6e.mockapi.io/operations/' + data[i].id, {
                  method: 'PUT', // or PATCH
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    "id": data[i].id,
                    "categoryName": data[i].categoryName,
                    "categoryType": data[i].categoryType,
                    "price": eval(operationPrice.value),
                    "date": data[i].date,
                    "time": data[i].time,
                    "description": data[i].description,
                    "operationsUserId": data[i].operationsUserId
                  }),
                })
                alert("asd")
                showSuccess(`Операция ${data[i].categoryName} изменена`);
                backDialogWindow.remove();
                dialogWindow.remove();
                setTimeout(() => {renderOperationsData()}, 500);
  
              }else {
                showWarning('Заполните поле "Новый счёт"');
              }
            })
  
            const deleteOperationButton = document.createElement('button');
            deleteOperationButton.classList.add('deleteOperationButton');
            deleteOperationButton.textContent = 'Удалить операцию';
            deleteOperationButton.addEventListener('click', () => {
              fetch('https://663fd818e3a7c3218a4e1d6e.mockapi.io/operations/' + data[i].id, {
                method: 'DELETE',
                  }).then(res => {
                    if (res.ok) {
                        return res.json();
                    }
                    // handle error
                  }).then(task => {
                    // Do something with deleted task
                  }).catch(error => {
                    // handle error
                  })
  
              showSuccess(`Операция ${data[i].categoryName} удалена`);
              setTimeout(() => {renderOperationsData()}, 500);
              backDialogWindow.remove();
              dialogWindow.remove();
            })
  
  
            operationsItemInfo.appendChild(operationCategoryName);
            operationsItemInfo.appendChild(operationPrice);
            operationsItemInfo.appendChild(operationDate);
            operationsItemInfo.appendChild(operationTime);
            operationsItemInfo.appendChild(operationDescriptionInput);
            operationsItemInfo.appendChild(operationConfirmButton);
            operationsItemInfo.appendChild(deleteOperationButton);
          }
          else {
            const backDialogWindow = document.createElement('div');
            backDialogWindow.classList.add('backOperationsInfoWindow');
            document.body.appendChild(backDialogWindow);
            
  
            const operationsItemInfo = document.createElement('div');
            operationsItemInfo.classList.add('operationsItemInfo');
            operationsItemInfo.classList.add('deletedOperationsItemInfo');
            backDialogWindow.appendChild(operationsItemInfo);
  
            const close = document.createElement('img');
            close.classList.add('close');
            close.src = 'imgs/close.png';
            
            close.addEventListener('click', () => {
              backDialogWindow.remove();
              dialogWindow.remove();
            })
            
      
            const operationCategoryName = document.createElement('p');
            operationCategoryName.classList.add('operationCategoryTitle');
            operationCategoryName.textContent = `Категория "${data[i].categoryName}" была удалена`;

            const operationDate = document.createElement('p');
            operationDate.classList.add('operationDate');
            operationDate.textContent = data[i].date;
  
            const operationTime = document.createElement('p');
            operationTime.classList.add('operationTime');
            operationTime.textContent = data[i].time;

            const deleteCategoryButton = document.createElement('button');
            deleteCategoryButton.classList.add('deleteCategoryButton');
            deleteCategoryButton.textContent = 'Удалить операцию';
            deleteCategoryButton.addEventListener('click', () => {
              fetch('https://663fd818e3a7c3218a4e1d6e.mockapi.io/operations/' + data[i].id, {
                method: 'DELETE',
                  }).then(res => {
                    if (res.ok) {
                        return res.json();
                    }
                    // handle error
                  }).then(task => {
                    // Do something with deleted task
                  }).catch(error => {
                    // handle error
                  })
  
              showSuccess(`Категория ${data[i].categoryName} удалена`);
              setTimeout(() => {renderOperationsData()}, 500);
              backDialogWindow.remove();
              dialogWindow.remove();
            })

            operationsItemInfo.appendChild(operationCategoryName);
            operationsItemInfo.appendChild(close);
            operationsItemInfo.appendChild(operationDate);
            operationsItemInfo.appendChild(operationTime);
            operationsItemInfo.appendChild(deleteCategoryButton);
          }
          

        })
      }
    }
  })
}

// Функция для добавления данных в диаграмму
function addData(label, value) {
  chartData.labels.push(label);
  chartData.datasets[0].data.push(value);
  myChart.update();
}

let expensesItems = [];

let incomeItems = [];



RenderData()

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
      return parts.pop().split(';').shift();
  }
}

function openAccount(){
  const backAccauntWindow = document.createElement('div');
  backAccauntWindow.classList.add('backLogRegWindow');

  const close = document.createElement('img');
  close.classList.add('close');
  close.src = 'imgs/close.png';
  close.addEventListener('click', () => {
    backAccauntWindow.remove();
    account.remove();
  })
   const account = document.createElement('div');
   account.classList.add('logRegWindow');
   account.classList.add('account');
   
   fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/users/')
   .then(res => res.json())
   .then(data => {
    const loginTitle = document.createElement('input');
    loginTitle.classList.add('loginTitle');
    loginTitle.placeholder = `Вы: `
    loginTitle.disabled = true
    loginTitle.value = data[currentUserId-1].login;
 
    const passwordTitle = document.createElement('input');
    passwordTitle.classList.add('passwordTitle');
    passwordTitle.type = 'password';
    passwordTitle.placeholder = `Пароль: `
    passwordTitle.value = data[currentUserId-1].password;
    passwordTitle.disabled = true

    const phoneTitle = document.createElement('input');
    phoneTitle.classList.add('phoneTitle');
    phoneTitle.placeholder = `Телефон: `
    phoneTitle.value = data[currentUserId-1].phone;
    phoneTitle.disabled = true

    const emailTitle = document.createElement('input');
    emailTitle.classList.add('emailTitle');
    emailTitle.placeholder = `Email: `
    emailTitle.value = data[currentUserId-1].email;
    emailTitle.disabled = true

    const birthTitle = document.createElement('input');
    birthTitle.classList.add('birthTitle');
    birthTitle.placeholder = `Дата рождения: `
    birthTitle.value = data[currentUserId-1].birthDay;
    birthTitle.disabled = true

    const saveChangedButton = document.createElement('button');
    saveChangedButton.classList.add('saveChangedButton');
    saveChangedButton.textContent = 'Сохранить';
    saveChangedButton.addEventListener('click', () => {
      fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/users/' + data[currentUserId-1].id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          login: loginTitle.value,
          password: passwordTitle.value,
          phone: phoneTitle.value,
          email: emailTitle.value,
          birthDay: birthTitle.value
        })
      })
      showSuccess('Изменения сохранены')
      backAccauntWindow.remove(); 
      account.remove();
    })
    
    const changePasswordButton = document.createElement('img');
    changePasswordButton.classList.add('changePasswordButton');
    changePasswordButton.classList.add('changeButtons');
    changePasswordButton.src = '/imgs/cnangeButtonLightTheme.svg';
    changePasswordButton.addEventListener('click', () => {
    passwordTitle.disabled = !passwordTitle.disabled
    loginTitle.disabled = !loginTitle.disabled
    phoneTitle.disabled = !phoneTitle.disabled
    emailTitle.disabled = !emailTitle.disabled
    birthTitle.disabled = !birthTitle.disabled
    })

    const visiblePasswordButton = document.createElement('img');
    visiblePasswordButton.classList.add('visiblePasswordButton');
    visiblePasswordButton.classList.add('changeButtons');
    visiblePasswordButton.src = '/imgs/notVisibilityLightTheme.svg';
    visiblePasswordButton.addEventListener('click', () => {
    if (passwordTitle.type === 'password') {
      passwordTitle.type = 'text';
      visiblePasswordButton.src = '/imgs/visibilityLightTheme.svg';
    } else {
      passwordTitle.type = 'password';
      visiblePasswordButton.src = '/imgs/notVisibilityLightTheme.svg';
    }
    })

    const exitButton = document.createElement('button');
    exitButton.classList.add('exitButton');
    exitButton.textContent = 'Выйти';
    exitButton.addEventListener('click', () => {

    const operationsItemList = document.getElementsByClassName('operationsItemList')[0];
    operationsItemList.innerHTML = '';
    document.cookie = "currentUserId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    const userName = document.getElementsByClassName('userName')[0];
    const userImg = document.createElement('img');
    document.body.classList.contains('dark-theme') ? userImg.src = 'imgs/userDarkTheme.svg' : userImg.src = 'imgs/userLightTheme.svg';
    userImg.classList.add('userImg');
    userName.appendChild(userImg);

    const userImgs = document.getElementsByClassName('userImg')[0];
    userImgs.addEventListener('click', logWindow);

    userName.parentNode.replaceChild(userImg, userName);
    const container = document.getElementById('categoriesContainer');
    container.innerHTML = '';
    expensesItems = [];
    incomeItems = [];
    for (let i = 0; i < expensesItems.length; i++) {
      addDataElement(expensesItems[i].name, expensesItems[i].price);
      addCategoryElement(expensesItems[i].name, expensesItems[i].price);
    }
    for (let i = 0; i < incomeItems.length; i++) {
      addDataElement(incomeItems[i].name, incomeItems[i].price);
      addCategoryElement(incomeItems[i].name, incomeItems[i].price);
    }
    myChart.data.datasets[0].data = incomeItems.map(item => eval(item.price));
    myChart.data.labels = incomeItems.map(item => item.name);
    myChart.update();
     expensesScore = 0;
     sumAmount.textContent = expensesScore;
     authorized = 0;
     currentUserId = -1;
     currentUserName = '';
     document.cookie = `currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
     backAccauntWindow.remove();
     account.remove();
     showSuccess('Вы вышли из аккаунта');
   })

   document.body.appendChild(backAccauntWindow);
   backAccauntWindow.appendChild(account);
   account.appendChild(loginTitle);
   account.appendChild(exitButton);
   account.appendChild(close);
   account.appendChild(passwordTitle);
   account.appendChild(changePasswordButton);
   account.appendChild(visiblePasswordButton);
   account.appendChild(phoneTitle);
   account.appendChild(emailTitle);
   account.appendChild(saveChangedButton);
   account.appendChild(birthTitle);
   })


   
}
// Добавление данных при загрузке страницы
function RenderData(){

  document.addEventListener('DOMContentLoaded', () => { 
    renderOperationsData ();
    fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/users')
      .then(response => response.json())
      .then(data => {
        if (data.login === getCookie('currnetUser')) {
          currentUserId = data.id;
          currentUserName = data.name;
        }
      })
    fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories')
      .then(response => response.json())
      .then(data => {
        data.forEach(data => {
          
            if (data.userId === currentUserId && data.categoryType === 'expenses') {
              expensesItems.push({ name: data.name, price: data.price, category: 'expenses' });
              addData(data.name, data.price);
            }
            else if (data.userId === currentUserId && data.categoryType === 'income') {
              incomeItems.push({ name: data.name, price: data.price, category: 'income' });
              addData(data.name, data.price);
            }

            const sumAmountTitle = document.getElementsByClassName('sumAmountTitle')[0];
    });


    });
      // Получение контейнера элементов
     

  });

}

function updateDataFromAPI() {
  expensesItems = [];
  incomeItems = [];
  if (isExpensesWindow) {
    for (let i = 0; i < expensesItems.length; i++) {
      addDataElement(expensesItems[i].name, expensesItems[i].price);
      addCategoryElement(expensesItems[i].name, expensesItems[i].price);
    }
    myChart.data.datasets[0].data = expensesItems.map(item => eval(item.price));
    myChart.data.labels = expensesItems.map(item => item.name);
    myChart.update();
  fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories')
    .then(response => response.json())
    .then(data => {
      data.forEach(data => {
        if (data.userId === currentUserId) {
          expensesItems.push({ name: data.name, price: data.price, category: 'expenses' });
          addData(data.name, data.price);
        }
      });
    });
    console.log(expensesItems)
  }
  else{
    for (let i = 0; i < incomeItems.length; i++) {
      addDataElement(incomeItems[i].name, incomeItems[i].price);
      addCategoryElement(incomeItems[i].name, incomeItems[i].price);
    }
    myChart.data.datasets[0].data = incomeItems.map(item => eval(item.price));
    myChart.data.labels = incomeItems.map(item => item.name);
    myChart.update();
    fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories')
    .then(response => response.json())
    .then(data => {
      data.forEach(data => {
        if (data.userId === currentUserId) {
          incomeItems.push({ name: data.name, price: data.price, category: 'income' });
          addData(data.name, data.price);
        }
      });
    });
    console.log(incomeItems)
  }
    
}

function swipCategories() {
  const headerTitle = document.getElementsByClassName('headerTitle')[0];
  let categoriesContainer = document.getElementById('categoriesContainer');
  categoriesContainer.innerHTML = '';
  if(isExpensesWindow){

    headerTitle.textContent = "Доходы";
    chartData.labels = incomeItems.map(item => item.name);
    chartData.datasets[0].data = incomeItems.map(item => eval(item.price));

    fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories')
    .then(response => response.json())
    .then(data => {
      data.forEach(data => {
        if (data.userId === currentUserId && data.categoryType === 'income') {
          addCategoryElement(data.name, data.price);
        }
      });
    });
  } else {
    headerTitle.textContent = "Расходы";
    chartData.labels = expensesItems.map(item => item.name);
    chartData.datasets[0].data = expensesItems.map(item => eval(item.price));

    fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories')
    .then(response => response.json())
    .then(data => {
      data.forEach(data => {
        if (data.userId === currentUserId && data.categoryType === 'expenses') {
          addCategoryElement(data.name, data.price);
        }
      });
    });
  }
  myChart.update();
  isExpensesWindow = !isExpensesWindow;
}

function logWindow() { // авторизация
  if (authorized == 0) {
    const backLogRegWindow = document.createElement('div');
    backLogRegWindow.classList.add('backLogRegWindow');
  
    const logRegWindow = document.createElement('div');
    logRegWindow.classList.add('logRegWindow');
  
    const close = document.createElement('img');
    close.classList.add('close');
    close.src = 'imgs/close.png';
    close.addEventListener('click', () => {
      backLogRegWindow.remove();
      logRegWindow.remove();
    })
  
    const text = document.createElement('h1');
    text.classList.add('logRegTitle');
    text.textContent = 'Авторизация';
  
    const login = document.createElement('input');
    login.type = 'text';
    login.placeholder = 'Логин или телефон';
  
    const password = document.createElement('input');
    password.type = 'password';
    password.placeholder = 'Пароль';
  
    const confirmButton = document.createElement('button');
    confirmButton.classList.add('confirmButton');
    confirmButton.textContent = 'Войти';
    confirmButton.addEventListener('click', () => {
      if (!login.value || !password.value) {
        showWarning('Заполните все поля');
      }
      else {
        //тело изменений
        const userImg = document.getElementsByClassName('userImg')[0];
        const userName = document.createElement('button');
        userName.classList.add('userName');
        userName.textContent = 'Личный кабинет';
        userName.addEventListener('click', openAccount) 
        userImg.parentNode.replaceChild(userName, userImg);

        const header = document.getElementsByClassName('header')[0];
        header.style.flexDirection = "row-reverse";
        header.appendChild(userName);
        lock = 0;
        document.cookie = `currentUser=${login.value}`;
        expensesItems = [];
        const container = document.getElementById('categoriesContainer');
        container.innerHTML = '';
        fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/users')
        .then(response => response.json())
        .then(data => {
          for (let i = 0; i < data.length; i++) {
            if (data[i].login === login.value || data[i].phone === login.value && data[i].password === password.value) {
              lock = 1;
              authorized = 1;
              showSuccess(`С возвращением, ${data[i].login}!`);
              document.cookie = `currentUserId=${data[i].id}`;
              currentUserId = data[i].id;
              currentUserName = data[i].login;
              logRegWindow.remove();
              backLogRegWindow.remove();
                fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories')
                .then(response => response.json())
                .then(data => {
                  for (let i = 0; i < data.length; i++) {
                    if (isExpensesWindow){}
                    if (data[i].userId === currentUserId && data[i].categoryType === 'income') {
                      incomeItems.push({ name: data[i].name, price: data[i].price, categoryType: 'income' });
                      incomeScore += eval(data[i].price);
                      addData(data[i].name, data[i].price);
                      addCategoryElement(data[i].name, data[i].price)
                      chartData.labels = incomeItems.map(item => item.name);
                      chartData.datasets[0].data = incomeItems.map(item => eval(item.price));
                      myChart.update();
                      sumAmountScore += eval(data[i].price);

                }
                    else if (data[i].userId === currentUserId && data[i].categoryType === 'expenses') {
                      expensesItems.push({ name: data[i].name, price: data[i].price, categoryType: 'expenses' });
                      expensesScore += eval(data[i].price);
                      addData(data[i].name, data[i].price);
                      addCategoryElement(data[i].name, data[i].price)
                      chartData.labels = expensesItems.map(item => item.name);
                      chartData.datasets[0].data = expensesItems.map(item => eval(item.price));
                      sumAmountScore -= eval(data[i].price);

                    }
                    const sumAmountTitle = document.getElementsByClassName('sumAmountTitle')[0];
                    myChart.update();
              }
              });
                
              
              // fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories')
              // .then(response => response.json())
              // .then(data => {
              //   for (let i = 0; i < data.length; i++) {
              //     if (data[i].userId === currentUserId && data[i].categoryType === 'expenses') {
              //       expensesItems.push({ name: data[i].name, price: data[i].price, categoryType: 'expenses' });
              //       expensesScore += eval(data[i].price);
              //       addData(data[i].name, data[i].price);
              //       addCategoryElement(data[i].name, data[i].price)
              //       sumAmount.textContent = `Итого: ${expensesScore}` + ' ₽';
              // }}});
              
              // break;
            }
          }
          setTimeout(() => {renderOperationsData()}, 500);
          if (lock === 0) {
            showWarning('Неверный логин или пароль');
          }
        })
      }
    })
  
    const alreadyReg = document.createElement('p');
    alreadyReg.textContent = 'Ещё нет аккаунта?';
    alreadyReg.classList.add('alreadyReg');
    alreadyReg.addEventListener('click', () => {
      backLogRegWindow.remove();
      logRegWindow.remove();
      regWindow();
    })
  
    document.body.appendChild(backLogRegWindow);
    backLogRegWindow.appendChild(logRegWindow);
    logRegWindow.appendChild(text);
    logRegWindow.appendChild(login);
    logRegWindow.appendChild(password);
    logRegWindow.appendChild(close);
    logRegWindow.appendChild(confirmButton);
    logRegWindow.appendChild(alreadyReg);
  }
 else {
    
  openAccount();
 }
}

function regWindow() { // регистрация

  const backLogRegWindow = document.createElement('div');
  backLogRegWindow.classList.add('backLogRegWindow');

  const logRegWindow = document.createElement('div');
  logRegWindow.classList.add('logRegWindow');

  const close = document.createElement('img');
  close.classList.add('close');
  close.src = 'imgs/close.png';
  close.addEventListener('click', () => {
    backLogRegWindow.remove();
    logRegWindow.remove();
  })

    const text = document.createElement('h1');
    text.classList.add('logRegTitle');
    text.textContent = 'Регистрация';

    const login = document.createElement('input');
    login.type = 'text';
    login.placeholder = 'Логин';

    const password = document.createElement('input');
    password.type = 'password';
    password.placeholder = 'Пароль';

    const phone = document.createElement('input');
    phone.type = 'phone';
    phone.placeholder = 'Номер телефона';

    const confirmButton = document.createElement('button');
    confirmButton.classList.add('confirmButton');
    confirmButton.textContent = 'Зарегистрироваться';
    confirmButton.addEventListener('click', () => {
    lock = 0;
    if (!login.value || !password.value || !phone.value) {
      showWarning('Заполните все поля')
    } 
    else if (login.value.length < 4 || password.value.length < 4) {
      showWarning('Логин или пароль слишком короткие');
    }
    else if (!phone.value.includes('+79') && !phone.value.includes('89')) {
      showWarning('Некорректный номер телефона');
    } 
      else {
      fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/users')
      .then(response => response.json())
      .then(data => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].login === login.value) {
            lock = 1;
            showWarning('Аккаунт с таким логином уже существует');
            break;
          }
        }
        if (lock === 0) { // рендер даннных после регистрации

          // подтверждение телефона


          const newTask = {
            login: login.value, 
            password: password.value,
            phone: phone.value, 
            score: 0,
          };
          fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/users', {
            method: 'POST',
            headers: {'content-type':'application/json'},
            body: JSON.stringify(newTask)
          }).then(res => {
            if (res.ok) {
                return res.json();
            }
          })
          showSuccess('Регистрация прошла успешно');
          currentUserName = login.value;
          currentUserId = data.length + 1;
          logRegWindow.remove();
          backLogRegWindow.remove();

          // обновление данных в диаграмме после регистриции
          fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories') 
          .then(response => response.json())
          .then(data => {
            for (let i = 0; i < data.length; i++) {
              if (data[i].userId === currentUserId && data[i].categoryType === 'expenses') {
                expensesItems.push({ name: data.name, price: data.price, categoryType: 'expenses' });
                break;
              }
              else if (data[i].userId === currentUserId && data[i].categoryType === 'income') {
                incomeItems.push({ name: data.name, price: data.price, categoryType: 'income' });
                break;
              }
            }
          })
        }
      })
    }
    if (lock === 1) {
      showSuccess('Регистрация прошла успешно');
      logRegWindow.remove();
      backLogRegWindow.remove();
      authorized = 1;
      document.cookie = `currentUser=${login.value}`;
    }
  })

  const alreadyReg = document.createElement('p');
  alreadyReg.classList.add('alreadyLogReg');
  alreadyReg.textContent = 'Уже есть аккаунт?';
  alreadyReg.classList.add('alreadyReg');
  alreadyReg.addEventListener('click', () => {
    backLogRegWindow.remove();
    logRegWindow.remove();
    logWindow();
  })

  document.body.appendChild(backLogRegWindow);
  backLogRegWindow.appendChild(logRegWindow);
  logRegWindow.appendChild(text);
  logRegWindow.appendChild(login);
  logRegWindow.appendChild(password);
  logRegWindow.appendChild(phone);

  logRegWindow.appendChild(close);
  logRegWindow.appendChild(confirmButton);
  logRegWindow.appendChild(alreadyReg);
}

function closeOperationsWindow() {
  const operationsWindow = document.getElementsByClassName('operationsWindow')[0];
  const closeX = document.getElementsByClassName('closeX')[0];
  if (operationIsClosed === 0) {
    closeX.style = "transform: rotate(0deg)";
    operationsWindow.style.top = '855px';
    operationIsClosed = 1;
  }
  else {
    closeX.style = "transform: rotate(180deg)";
    operationsWindow.style.top = '0px';
    operationIsClosed = 0;  
  }
  operationsWindow.appendChild(closeX);

}

// сделать изменение цены и названия категории