function addCategory() {
    // обновление данных на странице

   lock = 0;
   const nameInput = document.getElementById('nameInput');
   const priceInput = document.getElementById('priceInput');
   const sumAmountTitle = document.getElementsByClassName('sumAmountTitle')[0];

   if(!nameInput.value){
     showWarning("Вы не ввели название категории")
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
     if (isExpensesWindow) {
       addOperationsData(nameInput.value,'', -1, 'addendum');

       fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories')
       .then(response => response.json())
       const newTask = {
         userId: currentUserId,
         name: nameInput.value,
         price: 0, 
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
       
       addCategoryElement(nameInput.value, 0);
       showSuccess(`Категория "${nameInput.value}" добавлена`)
       addData(nameInput.value.replace(), 0);
       setTimeout(() => {renderOperationsData(), amountBalance(), updateFiterElements()}, 1000);
       
       expensesItems.push({ name: nameInput.value, price: 0, categoryType: 'expenses' });
     }
     else {
       addOperationsData(nameInput.value, '',  1, 'addendum');
       fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories')
       .then(response => response.json())
       const newTask = {
         userId: currentUserId,
         name: nameInput.value,
         price: 0, 
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
       addCategoryElement(nameInput.value, 0);
       showSuccess(`Категория "${nameInput.value}" добавлена`)
       addData(nameInput.value.replace(), 0);
       setTimeout(() => {renderOperationsData(), amountBalance(), updateFiterElements()}, 1000);

       incomeItems.push({ name: nameInput.value, price: 0, categoryType: 'income' });
     }
     amountScoreDB();
     nameInput.value = '';
     
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
              close.classList.add('close');
              close.src = 'imgs/close.png';
              close.addEventListener('click', () => {
                  div.remove();
                  div1.remove();
              })
              div.appendChild(close);
            
            const name = document.createElement('input');
            name.placeholder = nameInput;
            name.classList.add('nameInputHeaderTitle');
            div.appendChild(name);

            const confirm = document.createElement('button');
            confirm.textContent = '✓';
            confirm.classList.add('confirmButtonTitle');
            confirm.addEventListener('click', () => {
                if (name.value != '') {
                    fetch(`https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories/${changedElement}`, {
                        method: 'PUT',
                        headers: {'content-type':'application/json'},
                        body: JSON.stringify({
                          name: name.value
                        })
                      }).then(res => {
                        if (res.ok) {
                          return res.json();
                        }
                      })
                    if(!isExpensesWindow){
                      expensesItems.forEach(element => {
                        if (element.name === currentCategory) {
                          element.name = name.value
                          element.price = currentPrice
                        }
                      })
                    }
                    else {
                      incomeItems.forEach(element => {
                        if (element.name === currentCategory) {
                          element.name = name.value
                          element.price = currentPrice
                        }
                      })
                    }
                }
                else {
                    showWarning("Поле имя не может быть пустым");
                    // myChart.data.labels = expensesItems.map(item => item.name);
                }
                div1.remove();
                div.remove();
            })
            div.appendChild(confirm);

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
                if (price.value === '' || price.value === 'e') {
                  showWarning("Поле цена не может быть пустым");
  
                  const name = document.createElement('h3');
                  name.textContent = 'Заполните все поля';
                  div.appendChild(name);
                  div.appendChild(close);
                }
                else {                   
                  fetch(`https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories/${changedElement}`, {
                    method: 'PUT', // or PATCH
                    headers: {'content-type':'application/json'},
                    body: JSON.stringify({price: eval(currentPrice + eval(price.value))}), 
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
                  if (isExpensesWindow) {
                    for (let i = 0; i < expensesItems.length; i++) {
                        if (expensesItems[i].name === currentCategory) {
                          expensesItems[i].price = eval(currentPrice + eval(price.value));
                          expensesItems[i].name = name.value
                          break;
                        }
                      }
                      myChart.data.datasets[0].data = expensesItems.map(item => eval(item.price));
                      myChart.data.labels = expensesItems.map(item => item.name);
                      myChart.update();
                      addOperationsData(currentCategory, description.value, Number(price.value), 'expenses');
                  }
                  else {
                    for (let i = 0; i < incomeItems.length; i++) {
                        if (incomeItems[i].name === currentCategory) {
                            incomeItems[i].price = eval(currentPrice + eval(price.value));
                          break;
                        }
                      }
    
                      myChart.data.datasets[0].data = incomeItems.map(item => eval(item.price));
                      // myChart.data.labels = incomeItems.map(item => item.name);
                      myChart.update();

                      addOperationsData(currentCategory, description.value, Number(price.value), 'income');
                      renderOperationsData();
                  }

                  let changed = document.getElementsByClassName(currentCategory)[0];
                  changed.children[1].textContent = eval(currentPrice + eval(price.value)) + ' ₽';
                }

                div.remove();
                showSuccess(`Категория "${nameInput}" изменена`)
                amountBalance();
                renderOperationsData();

                if(isExpensesWindow) {
                  setTimeout(() => {
                  renderAmount('expenses');
                    
                  }, 700)
                }
                else{
                  setTimeout(() => {
                  renderAmount('income');
                  },700)
                }
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
                    price: price.value,
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
                  if (isExpensesWindow) {
                    for (let i = 0; i < expensesItems.length; i++) {
                      if (expensesItems[i].name === nameInput) {
                          expensesItems.splice(i, 1);
                          // chartData.labels.splice(i, 1);
                          chartData.datasets[0].data.splice(i, 1);
                          myChart.update();
                          break;
                  } 
                  }
                  }
                  else {
                    for (let i = 0; i < incomeItems.length; i++) {
                      if (incomeItems[i].name === nameInput) {
                          incomeItems.splice(i, 1);
                          // chartData.labels.splice(i, 1);
                          chartData.datasets[0].data.splice(i, 1);
                          myChart.update();
                          break;
                  } 
                  }
                  }
                    // do something with the new task
                    
                    // handle error
                }).then(task => {
                    // do something with the new task
                }).catch(error => {
                    // handle error 
                })

                showSuccess(`Категория "${nameInput}" успешно удалена!`);
                div.remove();
                const deletedElements = document.getElementsByClassName(nameInput)[0];
                deletedElements.remove();
                expensesScore -= eval(priceInput);
                setTimeout(() => {renderOperationsData(), updateFiterElements(), amountBalance();}, 1000);
                
            })
            div.appendChild(deleteCategory);
            container.appendChild(div);
    });

  }