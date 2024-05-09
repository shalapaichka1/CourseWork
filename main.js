authorized = 0;
currentUserId = 0;
currentUserName = '';
categoriesLimit = 10;
expensesScore = 0;
incomeScore = 0;
currentElementClassName = '';
isDarkTheme = 0;
lock = 0;

// Данные для круговой диаграммы (начальные данные)
const data = {
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
  data: data,
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

// Функция для добавления данных в диаграмму
function addData(label, value) {
  data.labels.push(label);
  data.datasets[0].data.push(value);
  myChart.update();
  
  RenderData()
}



const expensesItems = [
    // { name: 'Еда', img: 'categories_logo/food.png', price: 10 },
    // { name: 'Авто', img: 'categories_logo/car.png', price: 10 },
    // { name: 'Путешествия', img: 'categories_logo/travel.png', price: 10 },
    // { name: 'Дом', img: 'categories_logo/home.png', price: 10 },
    // { name: 'Услуги', img: 'categories_logo/services.png', price: 10 }
  ];

  const incomeItems = [
    { name: 'Работа', img: 'categories_logo/food.png', price: 20 },
    { name: 'Хобби', img: 'categories_logo/car.png', price: 30 }
  ];


function addItems() {
  
}
function showWarning(text){
  const audio = new Audio('audio/error.mp3');
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

// Добавление данных при загрузке страницы
function RenderData(){

  document.addEventListener('DOMContentLoaded', () => {

    const sumAmount = document.getElementById('sumAmount');

    //отбор данных с бд
    fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories')
      .then(response => response.json())
      .then(data => {
        data.forEach(data => {
            if (data.userId === currentUserId) {
                addData(data.name, data.price);
            
      }});


    });
      // Получение контейнера элементов
      const container = document.getElementById('categoriesContainer');
      
      // Цикл для создания элементов
      expensesItems.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('categories');
        div.classList.add(item.name);
      
        const image = document.createElement('img');
        image.src = item.img;
        div.appendChild(image);

        const name = document.createElement('h3');
        name.textContent = item.name;
        name.classList.add('titleInfo');
        div.appendChild(name);
      
        const price = document.createElement('p');
        price.textContent = item.price;
        price.classList.add('priceInfo');
        div.appendChild(price);
      
        container.appendChild(div);
        div.addEventListener('click', () => {
            currentElementClassName = item.name;
            const div1 = document.createElement('div');
            div1.classList.add('backDialogWindow');
            document.body.appendChild(div1);
            const div = document.createElement('div');
            div.classList.add('dialogWindow');

            const close = document.createElement('img');
            close.classList.add('closeButton');
            close.src = 'imgs/close.png';
            close.addEventListener('click', () => {
                div.remove();
                div1.remove();
            })
            div.appendChild(close);
        

            const name = document.createElement('h3');
            name.textContent = item.name;
            name.before(close);
            div.appendChild(name);
          
            const price = document.createElement('input');
            price.textContent = item.price;
            price.classList.add('priceInput');
            price.placeholder = 'Цена';
            price.type = "number"
            price.min = 0
            div.appendChild(price);

            const description = document.createElement('textarea');
            description.classList.add('descriptionInput');
            description.placeholder = 'Описание';
            div.appendChild(description);

            const confirmButton = document.createElement('button');
            confirmButton.textContent = 'Подтвердить';
            confirmButton.addEventListener('click', () => {
              div1.remove();
                if (!price.value) {
                  showWarning("Все поля должны быть заполнены");
      
                  const name = document.createElement('h3');
                  name.textContent = 'Заполните все поля';
                  div.appendChild(name);
                  div.appendChild(close);
                }
                else {
                    for (let i = 0; i < expensesItems.length; i++) {
                        if (expensesItems[i].name === item.name) {
                            expensesItems[i].price += eval(price.value);
                            data.datasets[0].data[i] = eval(expensesItems[i].price);
                            const removedElement = document.getElementsByClassName(item.name)[0];
                            removedElement.children[2].textContent = eval(expensesItems[i].price);
                            console.log(removedElement.children[2])
                            myChart.update();
                            
                            break;
                        }
                    }

                    showSuccess(`Категория "${item.name}" успешно обновлена`);
                }

                expensesScore += eval(price.value);
                sumAmount.textContent = `Сумма: ${expensesScore} \n` + ' ₽';
                div.remove();
            })
            div.appendChild(confirmButton);
          
            const deleteCategory = document.createElement('button');
            deleteCategory.textContent = 'Удалить категорию';
            deleteCategory.addEventListener('click', () => {
                div1.remove();
                for (let i = 0; i < expensesItems.length; i++) {
                    if (expensesItems[i].name === item.name) {
                        expensesItems.splice(i, 1);
                        data.labels.splice(i, 1);
                        data.datasets[0].data.splice(i, 1);
                        myChart.update();
                        
                        const removedElement = document.getElementsByClassName(item.name)[0];
                        removedElement.remove()
                        break;
                    }
                }
                div.remove();
                showSuccess(`Категория "${item.name}" успешно удалена`);

            })
            div.appendChild(deleteCategory);
            container.appendChild(div);
        })
  
        // Добавление данных
        addData(item.name, item.price);
      });

  });
  sumAmount.textContent = `Сумма: ${expensesScore}` + ' ₽';

}

function addItem() {
    lock = 0;
    const labelText = document.getElementById('nameInput').value;
    const priceText = document.getElementById('priceInput').value;

    expensesScore += eval(priceText);

    if (!labelText || !priceText) {

      showWarning("Все поля должны быть заполнены");
    }
    else {
        expensesItems.forEach(item => {
            if(item.name.toLowerCase() === labelText.toLowerCase().replace(/\s/g, "")) {
                showWarning('Такой элемент уже существует')
                lock = 1;
            }
        })
        if(expensesItems.length === categoriesLimit) {
          showWarning("Вы достигли лимита категорий");
          lock = 1;
        }
        else{
          const container = document.getElementById('categoriesContainer');
          container.innerHTML = '';
          RenderData()
            expensesItems.push({ name: labelText, price: eval(priceText) });
            // addData(labelText, priceText);
            container.innerHTML = '';

            expensesItems.forEach(item => {
              const div = document.createElement('div');
              div.classList.add('categories');
              div.classList.add(item.name);
            
              const name = document.createElement('h3');
              name.textContent = item.name;
              div.appendChild(name);
            
              const price = document.createElement('p');
              price.textContent = item.price;
              price.classList.add('priceInfo');

              div.appendChild(price);
              container.appendChild(div);

              div.addEventListener('click', () => {
                openDialog();
              });

            
            });
        }

    }
}

function addCategory() {
    lock = 0;
    const nameInput = document.getElementById('nameInput');
    const priceInput = document.getElementById('priceInput');

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

      fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories')
        .then(response => response.json())
        const newTask = {
          userId: currentUserId,
          name: nameInput.value,
          price: eval(priceInput.value), 
        };
        fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories', {
          method: 'POST',
          headers: {'content-type':'application/json'},
          body: JSON.stringify(newTask)
        }).then(res => {
          if (res.ok) {
              return res.json();
          }
        })

      showSuccess(`Категория "${nameInput.value}" добавлена`)
      addData(nameInput.value.replace(), priceInput.value);
      expensesItems.push({ name: nameInput.value, price: eval(priceInput.value) });
      expensesScore += eval(priceInput.value);
      sumAmount.textContent = `Сумма: ${expensesScore} \n` + ' ₽';

      const container = document.getElementById('categoriesContainer');
      const div = document.createElement('div');
              div.classList.add('categories');
              div.classList.add(nameInput.value.replace(/\s/g, "_"));

              const name = document.createElement('h3');
              name.textContent = nameInput.value;
              div.appendChild(name);
            
              const price = document.createElement('p');
              price.textContent = priceInput.value;
              price.classList.add('priceInfo');

              div.appendChild(price);
              container.appendChild(div);

              div.addEventListener('click', () => {
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
              name.textContent = nameInput.value;
              div.appendChild(name);

              const price = document.createElement('input');
              price.textContent = priceInput.value;
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
              confirmButton.addEventListener('click', () => {
                div1.remove();
                  if (!price.value) {
                    showWarning("Все поля должны быть заполнены");

                    const name = document.createElement('h3');
                    name.textContent = 'Заполните все поля';
                    div.appendChild(name);
                    div.appendChild(close);
                  }
                  else { // добавление 
                      for (let i = 0; i < expensesItems.length; i++) {
                          if (expensesItems[i].name === nameInput.value) {
                              expensesItems[i].price += eval(priceInput.value);
                              data.datasets[0].data[i] = eval(expensesItems[i].price);
                              myChart.update();
                              
                              break;
                          }
                          const changedElement = document.getElementsByClassName(nameInput.value)[0];
                          changedElement.querySelector('.priceInfo').textContent = eval(priceInput.value);
                      }
                      showSuccess(`${nameInput.value} + ${eval(priceInput.value)} ₽`);
                      console.log(eval(priceInput.value));

                  }

                  expensesScore += eval(price.value);
                  sumAmount.textContent = `Сумма: ${expensesScore} \n` + ' ₽';
                  div.remove();
              })
              div.appendChild(confirmButton);

              // Удаление категории
              const deleteCategory = document.createElement('button');
              deleteCategory.textContent = 'Удалить категорию';
              deleteCategory.addEventListener('click', () => {
                  div1.remove();
                  for (let i = 0; i < expensesItems.length; i++) {
                      if (expensesItems[i].name === nameInput.value) {
                          expensesItems.splice(i, 1);
                          data.labels.splice(i, 1);
                          data.datasets[0].data.splice(i, 1);
                          myChart.update();
                          break;
                      }
                  }
                  showSuccess(`Категория "${nameInput.value}" успешно удалена!`);
                  div.remove();
                  const deleted = document.getElementsByClassName(nameInput.value)[0];
                  deleted.remove();
                  expensesScore -= eval(priceInput.value);
                  sumAmount.textContent = `Сумма: ${expensesScore} \n` + ' ₽';
              })
              div.appendChild(deleteCategory);
              container.appendChild(div);
                          });
                }
            }
            
function changeTheme() {
  const themeImg = document.getElementsByClassName('themeImg')[0];
  const userImg = document.getElementsByClassName('userImg')[0];

  if (themeImg.src.includes('dark')) {
    themeImg.src = 'imgs/lightTheme.png';
  } else {
    themeImg.src = 'imgs/darkTheme.png';
  }

  if (userImg.src.includes('Dark')) {
    userImg.src = 'imgs/userLightTheme.svg';
  } else {
    userImg.src = 'imgs/userDarkTheme.svg';
  }
  const themeText = document.getElementsByClassName('themeText')[0];
  const input = document.querySelector('input');
  const inputNumber = document.querySelector('input[type="number"]');
  const button = document.querySelector('button');

  themeText.textContent = themeText.textContent === 'dark' ? 'light' : 'dark';
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
  if(headerTitle.textContent === "Расходы"){
    headerTitle.textContent = "Доходы";
    data.labels = incomeItems.map(item => item.name);
    data.datasets[0].data = incomeItems.map(item => eval(item.price));

  } else {
    headerTitle.textContent = "Расходы";
    data.labels = expensesItems.map(item => item.name);
    data.datasets[0].data = expensesItems.map(item => eval(item.price));

  }
  myChart.update();
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
    login.placeholder = 'Логин';
  
    const password = document.createElement('input');
    password.type = 'password';
    password.placeholder = 'Пароль';
  
    const confirmButton = document.createElement('button');
    confirmButton.classList.add('confirmButton');
    confirmButton.textContent = 'Войти';
    confirmButton.addEventListener('click', () => {
      if (!login.value || !password.value) {
        showWarning('Заполните все поля');
      }
      else {
        lock = 0;
        fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/users')
        .then(response => response.json())
        .then(data => {
          for (let i = 0; i < data.length; i++) {
            if (data[i].login === login.value && data[i].password === password.value) {
              lock = 1;
              authorized = 1;
              showSuccess(`С возвращением, ${data[i].login}!`);
              currentUserId = data[i].id;
              currentUserName = data[i].login;
              document.cookie = `currentUser=${data[i].login};`;
              logRegWindow.remove();
              backLogRegWindow.remove();
              break;
            }
          }
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
   exitButton.textContent = 'Выход';
   exitButton.addEventListener('click', () => {
     authorized = 0;
     currentUserId = 0;
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

    const confirmButton = document.createElement('button');
    confirmButton.classList.add('confirmButton');
    confirmButton.textContent = 'Зарегистрироваться';
    confirmButton.addEventListener('click', () => {
    lock = 0;
    if (!login.value || !password.value) {
      showWarning('Заполните все поля')
    } 
    else if (login.value.length < 4 || password.value.length < 4) {
      showWarning('Логин или пароль слишком короткие');
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
        if (lock === 0) {
          const newTask = {
            login: login.value, 
            password: password.value, 
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
          document.cookie = `currentUser=${data[i].login};`;
          logRegWindow.remove();
          backLogRegWindow.remove();
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
  logRegWindow.appendChild(close);
  logRegWindow.appendChild(confirmButton);
  logRegWindow.appendChild(alreadyReg);
}
