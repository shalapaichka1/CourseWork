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
          else if (data[i].categoryType === 'expenses') {
            operationType.textContent = 'Расход: ';
          }
          else if (data[i].categoryType === 'removal') {
            operationType.textContent = 'Удаление: ';
          }
    
          const operationPrice = document.createElement('p');
          operationPrice.classList.add('operationPrice');
          operationPrice.textContent = data[i].price.toLocaleString()  + " ₽";
  
          if(data[i].categoryType === 'expenses' || (data[i].categoryType === 'addendum' && data[i].price < 0)) {
            operationPrice.classList.add('operationPriceNegative');
          }
          else if(data[i].categoryType === 'income' || (data[i].categoryType === 'addendum' && data[i].price > 0)) {
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
                      "description": data[i].description ? data[i].description : '',
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