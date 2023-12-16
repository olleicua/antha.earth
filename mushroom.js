const SIZE = 150;
let canvas;

function cameraTime() {
  var d = new Date();
  return ((d.getSeconds() + (d.getMilliseconds() / 1000)) % 3) / 3;
}

function showAxes() {
  console.log('showing axes');
  stroke(255, 0, 0);
  line(-SIZE, 0, SIZE, 0, 0, 0)
  stroke(0, 255, 0);
  line(0, -SIZE, 0, SIZE, 0, 0)
  stroke(0, 0, 255);
  line(0, 0, 0, 0, -SIZE, SIZE)
}

function placeCamera(theta) {
  camera(Math.cos(theta) * SIZE, 0, Math.sin(theta) * SIZE,
        0, 0, 0,
        0, 1, 0);
}

function setup() {
  canvas = createCanvas(SIZE, SIZE, WEBGL);
  canvas.parent('mushroom');
  placeCamera(0);
  background(color(0));
  //stroke(255);
  //line(0, 0, width, height);
  showAxes();
}