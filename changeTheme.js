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