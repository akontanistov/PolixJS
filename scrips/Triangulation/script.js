var slider = document.getElementById("trianglesSlider");
var output = document.getElementById("trianglesValue");
output.innerHTML = slider.value; 


slider.oninput = function() {
  output.value = this.value;
}

const canvas = document.getElementById("viewport");
const contex = canvas.getContext("2d");

//Запуск диалогового окна
function ChooseFile(){

  var input = document.createElement('input');
  input.type = 'file';

  input.onchange = e => { 
  
     var file = e.target.files[0];
  
     var reader = new FileReader();
     reader.readAsDataURL(file);
  
     reader.onload = event => {
        const img = new Image();
        img.addEventListener("load", () => {
          //Скрытие блока для загрузки изображения
          document.getElementById("chooseBox").className = 'center disable';
          //Установка размеров canvas по размеру изображения
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;

          //Запись изображения в canvas
          console.log('Test');
          console.log(img.naturalHeight);

          contex.clearRect(0, 0, contex.canvas.width, contex.canvas.height);
          contex.drawImage(img, 0, 0);
        });

        img.src = event.target.result;
     }
  
  }
  input.click();
}

