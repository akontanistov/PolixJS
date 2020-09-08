const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

var points = [];
points.push(new Vector2(0, 0));
points.push(new Vector2(1920, 0));
points.push(new Vector2(1920, 1080));
points.push(new Vector2(0, 1080));

RndVectors(50000);
var start = new Date().getTime();
var triang = new Triangulation(points);
var end = new Date().getTime();
console.log(end - start);

start = new Date().getTime();
var triangles = triang.triangles.length;
var _triangle = null;
for (var j = 0; j < triangles; j++) {
  _triangle = triang.triangles[j];

  ctx.beginPath();
  if (_triangle.arcs[0].isBorder) ctx.strokeStyle = "red";
  else ctx.strokeStyle = "white";
  ctx.moveTo(_triangle.arcs[0].A.x, _triangle.arcs[0].A.y);
  ctx.lineTo(_triangle.arcs[0].B.x, _triangle.arcs[0].B.y);
  ctx.stroke();

  ctx.beginPath();
  if (_triangle.arcs[1].isBorder) ctx.strokeStyle = "red";
  else ctx.strokeStyle = "white";
  ctx.moveTo(_triangle.arcs[1].A.x, _triangle.arcs[1].A.y);
  ctx.lineTo(_triangle.arcs[1].B.x, _triangle.arcs[1].B.y);
  ctx.stroke();

  ctx.beginPath();
  if (_triangle.arcs[2].isBorder) ctx.strokeStyle = "red";
  else ctx.strokeStyle = "white";
  ctx.moveTo(_triangle.arcs[2].A.x, _triangle.arcs[2].A.y);
  ctx.lineTo(_triangle.arcs[2].B.x, _triangle.arcs[2].B.y);
  ctx.stroke();

  //ctx.beginPath();
  //ctx.strokeStyle = "white";
  //ctx.moveTo(_triangle.points[0].x, _triangle.points[0].y);
  //ctx.lineTo(_triangle.points[1].x, _triangle.points[1].y);
  //ctx.lineTo(_triangle.points[2].x, _triangle.points[2].y);
  //ctx.closePath();
  //ctx.stroke();
}
end = new Date().getTime();
console.log(end - start);

function RndVectors(_count, _points) {
  for (var i = 0; i < _count; i++) {
    _points.push(
      new Vector2(Helper.RndRange(0, 1920), Helper.RndRange(0, 1080))
    );
  }
}
