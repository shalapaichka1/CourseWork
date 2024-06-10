function renderAmount(categ){
    ams = 0;
    const sumAmount = document.getElementById('sumAmount');
    fetch('https://65d052c7ab7beba3d5e2f6fc.mockapi.io/v1/categories')
    .then(response => response.json())
    .then(data => {
      data.forEach(data => {
        if (data.userId === currentUserId && data.categoryType === categ) {
            ams += eval(data.price);
        }
      })

      sumAmount.textContent = ams + ' ₽';
    })
}