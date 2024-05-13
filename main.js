// Глобальные переменные
authorized = 0;
currentUserId = -1;
currentUserName = '';
categoriesLimit = 10;
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
    labelHover: true,
  }
});

function sumScore () {
  sumAmount.textContent = eval(incomeScore - expensesScore);
}

function addOperationsData(categoryName, priceInput, categoryType) {
  const newTask = { // добавление данных в таблицу operations
    operationsUserId: parseInt(currentUserId),
    categoryName: categoryName,
    price: eval(priceInput),
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    categoryType: categoryType
  };
  
  fetch('https://663fd818e3a7c3218a4e1d6e.mockapi.io/operations', {
    method: 'POST',
    headers: {'content-type':'application/json'},
    // Send your data in the request body as JSON
    body: JSON.stringify(newTask)
  }).then(res => {
    if (res.ok) {
        return res.json();
    }
    // handle error
  }).then(task => {
    // do something with the new task
  }).catch(error => {
    // handle error
  })
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
        operationCategoryName.classList.add('operationCategoryTitle');
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
          const backDialogWindow = document.createElement('div');
          backDialogWindow.classList.add('backOperationsInfoWindow');
          document.body.appendChild(backDialogWindow);
          const dialogWindow = document.createElement('div');
          dialogWindow.classList.add('dialogWindow');

          const operationsItemInfo = document.createElement('div');
          operationsItemInfo.classList.add('operationsItemInfo');
          backDialogWindow.appendChild(operationsItemInfo);

          const close = document.createElement('img');
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
          deleteOperationButton.textContent = 'Удалить';
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

function showWarning(text){
  const audio = new Audio('audio/error.mp3');
  audio.volume = 0.1;
  audio.play();

  const div1 = document.createElement('div');
  div1.classList.add('backDialogWindow');
  document.body.appendChild(div1);
  const div = document.createElement('div');
  div.classList.add('dialogWindow');
  div1.appendChild(div);
  const close = document.createElement('img');
  close.src = 'imgs/close.png';
  div.appendChild(close);

  close.addEventListener('click', () => {
      div.remove();
      div1.remove();
  })

  const name = document.createElement('h3');
  name.textContent = text;
  div.appendChild(name);
}

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

   const loginTitle = document.createElement('p');
   loginTitle.classList.add('loginTitle');
   loginTitle.textContent = `Вы: ${currentUserName}`;

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
function addCategory() {
     // обновление данных на странице

    lock = 0;
    const nameInput = document.getElementById('nameInput');
    const priceInput = document.getElementById('priceInput');
    const sumAmountTitle = document.getElementsByClassName('sumAmountTitle')[0];

    if(!nameInput.value || !priceInput.value){
      showWarning("Все поля должны быть заполнены")
      lock = 1;
    }
    else{
      expensesItems.forEach(element => {
        if(element.name == nameInput.value){
          showWarning("Категория с таким именем уже существует")
          lock = 1;
        }
      });
    }
    if(lock === 0) {

      const operationsItemList = document.querySelector('.operationsItemList');
      operationsItemList.innerHTML = '';
      // тут
      if (isExpensesWindow) {
        sumAmountScore -= eval(priceInput.value);
        sumAmountTitle.textContent = `Итого: ${sumAmountScore}`
        addOperationsData(nameInput.value, eval(priceInput.value * -1), 'addendum');

        fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories')
        .then(response => response.json())
        const newTask = {
          userId: currentUserId,
          name: nameInput.value,
          price: eval(priceInput.value), 
          categoryType: 'expenses'
        };
        fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories', {
          method: 'POST',
          headers: {'content-type':'application/json'},
          body: JSON.stringify(newTask)
        }).then(res => {
          if (res.ok) {
              return res.json();
          }
        }).then(data => {
        })
        
        addCategoryElement(nameInput.value, priceInput.value);
        showSuccess(`Категория "${nameInput.value}" добавлена`)
        addData(nameInput.value.replace(), priceInput.value);
        setTimeout(() => {renderOperationsData()}, 500);

        expensesItems.push({ name: nameInput.value, price: eval(priceInput.value), categoryType: 'expenses' });
        expensesScore += eval(priceInput.value);
      }
      else {
        sumAmountScore -= eval(priceInput.value);
        sumAmountTitle.textContent = `Итого: ${sumAmountScore}`

        addOperationsData(nameInput.value, eval(priceInput.value), 'addendum');
        fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories')
        .then(response => response.json())
        const newTask = {
          userId: currentUserId,
          name: nameInput.value,
          price: eval(priceInput.value), 
          categoryType: 'income'
        };
        fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories', {
          method: 'POST',
          headers: {'content-type':'application/json'},
          body: JSON.stringify(newTask)
        }).then(res => {
          if (res.ok) {
              return res.json();
          }
        }).then(data => {
        })   
        
        addCategoryElement(nameInput.value, priceInput.value);
        showSuccess(`Категория "${nameInput.value}" добавлена`)
        addData(nameInput.value.replace(), priceInput.value);
        setTimeout(() => {renderOperationsData()}, 500);

        incomeItems.push({ name: nameInput.value, price: eval(priceInput.value), categoryType: 'income' });
        incomeScore += eval(priceInput.value);
      }
      nameInput.value = '';
      priceInput.value = '';
  }
}
            
function addCategoryElement(nameInput, priceInput) {
  const container = document.getElementById('categoriesContainer');
  const div = document.createElement('div');

          div.classList.add('categories');
          div.classList.add(nameInput.replace(/\s/g, "_"));

          const name = document.createElement('h3');
          name.textContent = nameInput;
          div.appendChild(name);
        
          const price = document.createElement('p');
          price.textContent = priceInput + ' ₽';
          price.classList.add('priceInfo');

          div.appendChild(price);
          container.appendChild(div);

              div.addEventListener('click', () => {
                fetch(`https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories`)
                .then (response => response.json())
                .then (data => {
                  for (let i = 0; i < data.length; i++) {
                    if (data[i].userId === currentUserId && data[i].name === currentCategory) {
                      deletedElement = data[i].id;
                      changedElement = data[i].id;
                      currentPrice = data[i].price; 
                      console.log(currentPrice)
                      break;
                  }
                  }
                })

            currentCategory = nameInput;
            const div1 = document.createElement('div');
            div1.classList.add('backDialogWindow');
            document.body.appendChild(div1);
            const div = document.createElement('div');
            div.classList.add('dialogWindow');

            const close = document.createElement('img');
            close.src = 'imgs/close.png';
            close.addEventListener('click', () => {
                div.remove();
                div1.remove();
            })
            div.appendChild(close);
          
          const name = document.createElement('h3');
          name.textContent = nameInput;
          div.appendChild(name);

          const price = document.createElement('input');
          price.textContent = priceInput;
          price.classList.add('priceInput');
          price.placeholder = 'Цена';
          price.type = "number"
          price.min = 0
          div.appendChild(price);

          const description = document.createElement('textarea');
          description.classList.add('descriptionInput');
          description.placeholder = 'Описание';
          div.appendChild(description);
          // Кнопка подтверждения
          const confirmButton = document.createElement('button');
          confirmButton.textContent = 'Подтвердить';
          confirmButton.classList.add('confirmButton');
          confirmButton.addEventListener('click', () => {
            div1.remove();
              if (!price) {
                showWarning("Все поля должны быть заполнены");

                const name = document.createElement('h3');
                name.textContent = 'Заполните все поля';
                div.appendChild(name);
                div.appendChild(close);
              }
              else { // добавление 
                // fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories')
                // .then (response => response.json())
                // .then (data => {
                //     if (data.name === currentUserName) {
                //       const operationsContainer = document.getElementsByClassName('operationsContainer')[0];

                //       const newElement = document.createElement('div');
                //       newElement.classList.add('operationElement');
      
                //       const name = document.createElement('p');
                //       name.textContent = data.categoryName;
                //       newElement.appendChild(name);

                //       const price = document.createElement('p');
                //       price.textContent = data.price;
                //       newElement.appendChild(price);

                //       const dataTime = document.createElement('p');
                //       dataTime.textContent = data.dataTime;
                //       newElement.appendChild(dataTime);

                //       operationsContainer.appendChild(newElement);

                //       chartData.data.datasets[0].data = [] // обновление данных в диаграмме
                //       chartData.data.labels = [];

                //       expensesScore += priceInput.value;

                //       myChart.update();
                //   }
                //   }
                  
                // )

                // fetch(`https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories/${changedElement}`, { // обновление данных в API
                //   method: 'PUT', // or PATCH
                //   headers: {'content-type':'application/json'},
                //   body: JSON.stringify({price: currentPrice + eval(price.value)}),
                // }).then(res => {
                //   if (res.ok) {
                //       return res.json();
                //   }
                //   // handle error
                // }).then(task => {
                //   // do something with the new task
                // }).catch(error => {
                //   // handle error
                // })
                // updateDataFromAPI()
                
                // expensesItems.forEach(item => {
                //   expensesScore += item.price
                // })

                
                div.remove();
              } // конец кнопки
          })

          div.appendChild(confirmButton);

          // Удаление категории
          const deleteCategory = document.createElement('button');
          deleteCategory.textContent = 'Удалить категорию';
          deleteCategory.classList.add('exitButton');
          deleteCategory.addEventListener('click', () => {
              div1.remove();

              const newTask = {
                  operationsUserId: parseInt(currentUserId),
                  categoryName: currentCategory,
                  price: 0,
                  date: new Date().toLocaleDateString(),
                  time: new Date().toLocaleTimeString(),
                  description: 'null',
                  categoryType: 'removal'
              };
              
              fetch('https://663fd818e3a7c3218a4e1d6e.mockapi.io/operations/', {
                method: 'POST',
                headers: {'content-type':'application/json'},
                // Send your data in the request body as JSON
                body: JSON.stringify(newTask)
              }).then(res => {
                if (res.ok) {
                    return res.json();
                }
                // handle error
              }).then(task => {
                // do something with the new task
              }).catch(error => {
                // handle error
              })

              fetch(`https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories/${deletedElement}`, {
                  method: 'DELETE',
              }).then(res => {
                  if (res.ok) {
                      return res.json();
                  } else {
                      // handle error
                      console.log('Error deleting task');
                  }
              }).then(task => {
                  // do something with the new task
                  for (let i = 0; i < expensesItems.length; i++) {
                      if (expensesItems[i].name === nameInput) {
                          expensesItems.splice(i, 1);
                          chartData.labels.splice(i, 1);
                          chartData.datasets[0].data.splice(i, 1);
                          myChart.update();
                          break;
                  } 
                  }
                  // handle error
              }).then(task => {
                  // do something with the new task
              }).catch(error => {
                  // handle error 
              })
              for (let i = 0; i < expensesItems.length; i++) {
                  if (expensesItems[i].name === nameInput) {
                      expensesItems.splice(i, 1);
                      chartData.labels.splice(i, 1);
                      chartData.datasets[0].data.splice(i, 1);
                      myChart.update();
                      break;
                  }
              }
              showSuccess(`Категория "${nameInput}" успешно удалена!`);
              div.remove();
              const deletedElements = document.getElementsByClassName(nameInput)[0];
              deletedElements.remove();
              console.log(deletedElements)
              expensesScore -= eval(priceInput);
              setTimeout(() => {renderOperationsData()}, 500);

          })
          div.appendChild(deleteCategory);
          container.appendChild(div);
  });
}

function changeTheme() {
  const logoImg = document.getElementsByClassName('logoTitle')[0];
  const themeImg = document.getElementsByClassName('themeImg')[0];
  const userImg = document.getElementsByClassName('userImg')[0];
  if (document.getElementsByClassName("userImg")[0]) {
    if (userImg.src.includes('Dark')) {
      userImg.src = 'imgs/userLightTheme.svg';
      logoImg.src = 'imgs/logoLightTheme.png';
    } else {
      userImg.src = 'imgs/userDarkTheme.svg';
      logoImg.src = 'imgs/logoDarkTheme.png';
    }
  }
  if (themeImg.src.includes('dark')) {
    themeImg.src = 'imgs/lightTheme.png';
  } else {
    themeImg.src = 'imgs/darkTheme.png';
  }



  const themeText = document.getElementsByClassName('themeText')[0];
  const input = document.querySelector('input');
  const inputNumber = document.querySelector('input[type="number"]');
  const button = document.querySelector('button');
  const operationsWindow = document.getElementsByClassName('operationsWindow')[0];

  themeText.textContent = themeText.textContent === 'dark' ? 'light' : 'dark';
  operationsWindow.classList.toggle('dark-theme')
  input.classList.toggle('dark-theme');
  inputNumber.classList.toggle('dark-theme');
  button.classList.toggle('dark-theme');

  input.classList.toggle('light-theme');
  inputNumber.classList.toggle('light-theme');
  button.classList.toggle('light-theme');

  document.body.classList.toggle('dark-theme');
  document.body.classList.toggle('light-theme');
} 

function showSuccess(text) {

  const audio = new Audio('audio/success.mp3');
  audio.volume = 0.1;
  audio.play();
   
 const succes = document.createElement('div');
 succes.classList.add('success');

 const img = document.createElement('img');
 img.src = 'imgs/check.png';
 img.classList.add('successImg');
 succes.appendChild(img);

 const successText = document.createElement('p');
 successText.classList.add('successText');
 successText.textContent = text;

 succes.appendChild(successText);
 document.body.appendChild(succes);
 setTimeout(() => {
   succes.remove();
 }, 5000);
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
    sumAmount.textContent = "Итого: " + incomeScore;
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
    sumAmount.textContent = "Итого: " + incomeScore;
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
                    if (data[i].userId === currentUserId && isExpensesWindow) {
                      incomeItems.push({ name: data[i].name, price: data[i].price, categoryType: 'income' });
                      incomeScore += eval(data[i].price);
                      addData(data[i].name, data[i].price);
                      addCategoryElement(data[i].name, data[i].price)
                      sumAmount.textContent = `Итого: ${incomeScore}` + ' ₽';
                      chartData.labels = incomeItems.map(item => item.name);
                      chartData.datasets[0].data = incomeItems.map(item => eval(item.price));
                      myChart.update();
                      sumAmountScore += eval(data[i].price);

                }
                    if (data[i].userId === currentUserId && !isExpensesWindow) {
                      expensesItems.push({ name: data[i].name, price: data[i].price, categoryType: 'expenses' });
                      expensesScore += eval(data[i].price);
                      addData(data[i].name, data[i].price);
                      addCategoryElement(data[i].name, data[i].price)
                      sumAmount.textContent = `Итого: ${expensesScore}` + ' ₽';
                      chartData.labels = expensesItems.map(item => item.name);
                      chartData.datasets[0].data = expensesItems.map(item => eval(item.price));
                      sumAmountScore -= eval(data[i].price);

                    }
                    const sumAmountTitle = document.getElementsByClassName('sumAmountTitle')[0];
                    sumAmountTitle.textContent = `Ваш баланс: ${sumAmountScore} ₽`; 
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