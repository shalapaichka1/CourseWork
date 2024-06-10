months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

const currentMonth = document.getElementsByClassName('currentMonth')[0];
    const currentDate = new Date();
    currentMonthNumber = currentDate.getMonth() + 1;

months.forEach((month, index) => {
    if (currentMonthNumber === index + 1) {
        currentMonth.textContent = month;
    }
})

const prewMonth = document.getElementsByClassName('prewMonth')[0];
const nextMonth = document.getElementsByClassName('nextMonth')[0];

prewMonth.addEventListener('click', () => {
    currentMonthNumber -= 1;
    if (currentMonthNumber < 1) {
        currentMonthNumber = 12;
    }
    currentMonth.textContent = months[currentMonthNumber - 1];
    if (currentMonthNumber == months.indexOf('Июнь') + 1) {
        currentMonth.style.textDecoration = 'underline';
    }
    else {
        currentMonth.style.textDecoration = 'none';
    }
})

nextMonth.addEventListener('click', () => {
    currentMonthNumber += 1;
    if (currentMonthNumber > 12) {
        currentMonthNumber = 1;
    }
    currentMonth.textContent = months[currentMonthNumber - 1];
    if (currentMonthNumber === months.indexOf('Июнь') + 1) {
        currentMonth.style.textDecoration = 'underline';
    }
    else {
        currentMonth.style.textDecoration = 'none';
    }
})