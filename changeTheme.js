function changeTheme() {
    const logoImg = document.getElementsByClassName('logoTitle')[0];
    const themeImg = document.getElementsByClassName('themeImg')[0];
    const userImg = document.getElementsByClassName('userImg')[0];
    const openOperations = document.getElementById('openOperations');
    const refresh = document.getElementsByClassName('refresh')[0];
    if (document.getElementsByClassName("userImg")[0]) {
      if (isDarkTheme) {
        userImg.src = 'imgs/userLightTheme.svg';
      } else {
        userImg.src = 'imgs/userDarkTheme.svg';
      }
    }
    if (isDarkTheme) {
      refresh.src = 'imgs/refreshLightTheme.svg';
      themeImg.src = 'imgs/darkTheme.png';
      logoImg.src = 'imgs/logoLightTheme.png';
      openOperations.src = 'imgs/openOperationsButtonLightTheme.png';
    } else {
      refresh.src = 'imgs/refresh.svg';
      refresh.style.color = 'black';
      themeImg.src = 'imgs/lightTheme.png';
      logoImg.src = 'imgs/logoDarkTheme.png';
      openOperations.src = 'imgs/openOperationsButtonDarkTheme.png';
    }
  
  
  
    const themeText = document.getElementsByClassName('themeText')[0];
    const input = document.querySelector('input');
    const button = document.querySelector('button');
    const operationsWindow = document.getElementsByClassName('operationsWindow')[0];
  
    themeText.textContent = themeText.textContent === 'dark' ? 'light' : 'dark';
    operationsWindow.classList.toggle('dark-theme')
    input.classList.toggle('dark-theme');
    button.classList.toggle('dark-theme');
  
    input.classList.toggle('light-theme');
    // inputNumber.classList.toggle('light-theme');
    button.classList.toggle('light-theme');
  
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
    isDarkTheme = !isDarkTheme;
  } 