categoriesLimit = 10;
sum = 0;
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

const ctx = document.getElementById('myChart').getContext('2d');
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
    borderRadius: 5,
    labelHover: true,
  }
});

// Функция для добавления данных в диаграмму
function addData(label, value) {
  data.labels.push(label);
  data.datasets[0].data.push(value);
  myChart.update();

}


const items = [
    { name: 'Еда', img: 'categories_logo/food.png', price: 0 },
    { name: 'Авто', img: 'categories_logo/car.png', price: 0 },
    { name: 'Путешествия', img: 'categories_logo/travel.png', price: 0 },
    { name: 'Дом', img: 'categories_logo/home.png', price: 0 },
    { name: 'Услуги', img: 'categories_logo/services.png', price: 0 },
  ];

// Загрузка данных

function loadData(labelText, priceText) {

    const sumAmount = document.getElementById('sumAmount');

    sumAmount.textContent = `Сумма: ${sum}`;
    
}
function showWarning(text){
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

function addCategory(category, pricee) {
  const container = document.getElementById('categoriesContainer');

  // Цикл для создания элементов
  const categoryElement = document.createElement('div');
  div.classList.add('categories');
  div.classList.add(category);

  const name = document.createElement('h3');
  name.textContent = category;
  div.appendChild(name);

  const image = document.createElement('img');
  image.src = 'imgs/food.png';
  div.appendChild(image);

  const price = document.createElement('p');
  price.textContent = pricee;
  price.classList.add('priceInfo');
  div.appendChild(price);

  container.appendChild(categoryElement);

  console.log(items)
}
// Добавление данных при загрузке страницы
function RenderData(){

  document.addEventListener('DOMContentLoaded', () => {

    const sumAmount = document.getElementById('sumAmount');
    items.forEach(item => {
        sum += eval(item.price);
    });
    sumAmount.textContent = `Сумма: ${sum}` + ' ₽';
      // Получение контейнера элементов
      const container = document.getElementById('categoriesContainer');
      
      // Цикл для создания элементов
      items.forEach(item => {
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
                    for (let i = 0; i < items.length; i++) {
                        if (items[i].name === item.name) {
                            items[i].price += eval(price.value);
                            data.datasets[0].data[i] = eval(items[i].price);
                            const removedElement = document.getElementsByClassName(item.name)[0];
                            removedElement.children[2].textContent = eval(items[i].price);
                            console.log(removedElement.children[2])
                            myChart.update();
                            
                            break;
                        }
                    }

                    showSuccess(`Категория "${item.name}" успешно обновлена`);
                }

                sum += eval(price.value);
                sumAmount.textContent = `Сумма: ${sum} \n` + ' ₽';
                div.remove();
            })
            div.appendChild(confirmButton);
          
            const deleteCategory = document.createElement('button');
            deleteCategory.textContent = 'Удалить категорию';
            deleteCategory.addEventListener('click', () => {
                div1.remove();
                for (let i = 0; i < items.length; i++) {
                    if (items[i].name === item.name) {
                        items.splice(i, 1);
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

}

function addItem() {
    lock = 0;
    const labelText = document.getElementById('nameInput').value;
    const priceText = document.getElementById('priceInput').value;

    sum += eval(priceText);

    if (!labelText || !priceText) {

      showWarning("Все поля должны быть заполнены");
    }
    else {
        items.forEach(item => {
            if(item.name.toLowerCase() === labelText.toLowerCase().replace(/\s/g, "")) {
                showWarning('Такой элемент уже существует')
                lock = 1;
            }
        })
        if(items.length === categoriesLimit) {
          showWarning("Вы достигли лимита категорий");
          lock = 1;
        }
        else{
          const container = document.getElementById('categoriesContainer');
          container.innerHTML = '';
          RenderData()
            // loadData(labelText, priceText);
            items.push({ name: labelText, price: eval(priceText) });
            // addData(labelText, priceText);
            container.innerHTML = '';

            items.forEach(item => {
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
      items.forEach(element => {
        if(element.name == nameInput.value){
          showWarning("Категория с таким именем уже существует")
          lock = 1;
        }
      });
    }
    if(lock === 0) {
      showSuccess(`Категория "${nameInput.value}" добавлена`)
      addData(nameInput.value.replace(), priceInput.value);
      items.push({ name: nameInput.value, price: eval(priceInput.value) });
      sum += eval(priceInput.value);
      sumAmount.textContent = `Сумма: ${sum} \n` + ' ₽';

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
                  else {
                      for (let i = 0; i < items.length; i++) {
                          if (items[i].name === nameInput.value) {
                              items[i].price += eval(priceInput.value);
                              data.datasets[0].data[i] = eval(items[i].price);
                              
                              myChart.update();
                              
                              break;
                          }
                          const changedElement = document.getElementsByClassName(nameInput.value)[0];
                          changedElement.querySelector('.priceInfo').textContent = eval(priceInput.value);
                      }
                      showSuccess(`${nameInput.value} + ${eval(priceInput.value)} ₽`);
                      console.log(eval(priceInput.value));

                  }

                  sum += eval(price.value);
                  sumAmount.textContent = `Сумма: ${sum} \n` + ' ₽';
                  div.remove();
              })
              div.appendChild(confirmButton);

              // Удаление категории
              const deleteCategory = document.createElement('button');
              deleteCategory.textContent = 'Удалить категорию';
              deleteCategory.addEventListener('click', () => {
                  div1.remove();
                  for (let i = 0; i < items.length; i++) {
                      if (items[i].name === nameInput.value) {
                          items.splice(i, 1);
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
                  sum -= eval(priceInput.value);
                  sumAmount.textContent = `Сумма: \"${sum}\" \n` + ' ₽';
              })
              div.appendChild(deleteCategory);
              container.appendChild(div);
                          });
                }
            }
            
function changeTheme() {
  const themeImg = document.getElementsByClassName('themeImg')[0];

  if (themeImg.src.includes('dark')) {
    themeImg.src = 'imgs/lightTheme.png';
  } else {
    themeImg.src = 'imgs/darkTheme.png';
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