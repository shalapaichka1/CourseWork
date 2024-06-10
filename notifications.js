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
    close.classList.add('close');
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