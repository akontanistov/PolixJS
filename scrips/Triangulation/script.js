var slider = document.getElementById("trianglesSlider");
var output = document.getElementById("trianglesValue");
output.innerHTML = slider.value; 


slider.oninput = function() {
  output.value = this.value;
}

var canvas = document.getElementById("viewport");
var context = canvas.getContext("2d");
var file;
var img = new Image();

//Запуск диалогового окна
function ChooseFile(){

  var input = document.createElement('input');
  input.type = 'file';

  input.onchange = e => { 
  
     file = e.target.files[0];
  
     var reader = new FileReader();
     reader.readAsDataURL(file);
  
     reader.onload = event => {
        img.addEventListener("load", () => {
          //Скрытие блока для загрузки изображения
          document.getElementById("chooseBox").className = 'center disable';
          document.getElementById("canvasBox").className = 'block__canvas';
          document.getElementById("mainBox").className = 'block active';

          //Установка размеров canvas по размеру изображения
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;

          //Запись изображения в canvas
          context.clearRect(0, 0, context.canvas.width, context.canvas.height);
          context.drawImage(img, 0, 0);
        });

        img.src = event.target.result;
     }
  
  }
  input.click();
}

function Run(){
  var points = [];
  points.push(new Vector2(0, 0));
  points.push(new Vector2(img.naturalWidth, 0));
  points.push(new Vector2(img.naturalWidth, img.naturalHeight));
  points.push(new Vector2(0, img.naturalHeight));

  var articlesCount = document.getElementById("trianglesValue").value;

  //Содание облака точек
  RndVectors(articlesCount, points);

  //Триангуляция облака точек
  var triangulation = new Triangulation(points);
  var triangles = triangulation.triangles.length;
  var triangle = null;

  //Отрисовка треугольников
  for (var j = 0; j < triangles; j++) {
    triangle = triangulation.triangles[j];
  
    //Определение координат центра треугольника
    var center = triangle.centroid;
    var centerX = Math.trunc(center.x);
    var centerY = Math.trunc(center.y);

    //Определение цвета в центре треугольника
    var color = context.getImageData(centerX, centerY, 1, 1).data;
    var colorRGB = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';

    context.beginPath();
    context.moveTo(triangle.points[0].x, triangle.points[0].y);
    context.lineTo(triangle.points[1].x, triangle.points[1].y);
    context.lineTo(triangle.points[2].x, triangle.points[2].y);
    context.closePath();
    context.fillStyle = colorRGB;
    context.fill();
  }
}

function RndVectors(_count, _points) {
  for (var i = 0; i < _count; i++) {
    _points.push(
      new Vector2(Helper.RndRange(0, img.naturalWidth), Helper.RndRange(0, img.naturalHeight))
    );
  }
}