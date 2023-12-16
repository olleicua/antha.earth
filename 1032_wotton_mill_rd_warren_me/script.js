/* global createCanvas, color, windowWidth, windowHeight,
   width, height, ellipse, text, fill, noStroke, millis,
   createVector, lerpColor, map, rect, strokeWeight, stroke,
   triangle, p5, ROUND, strokeJoin, frameRate, frameCount,
   background, WEBGL, box, keyCode, LEFT_ARROW, RIGHT_ARROW,
   rotateX, rotateZ, keyIsPressed, plane, translate, camera,
   ortho, push, pop, cylinder, createGraphics, mouseX, mouseY,
   pixelDensity, pointLight, directionalLight, ambientMaterial,
   ambientLight, _ */

// X increases north
// Z increases west
// Y increases up

const { isNumber } = _;

const TAU = 2 * Math.PI;
const cameraParameters = {};
let canvasSide;

function feet(n) {
  return n * canvasSide / 128;
}

function euclideanDistance(a, b, c) {
  if (isNumber(c)) return Math.sqrt((a * a) + (b * b) + (c * c));
  
  return Math.sqrt((a * a) + (b * b));
}

function setup() {
  canvasSide = Math.min(windowWidth, windowHeight);
  console.log(canvasSide - 20);
  createCanvas(canvasSide - 20, canvasSide - 20, WEBGL);
  pixelDensity(1);
  ortho(- 3 * width / 7, 3 * width / 7, - height / 2, height / 2, - 2 * width, 2 * width);
  
  cameraParameters.radius = feet(24);
  cameraParameters.panAngle = 0;
  cameraParameters.tiltAngle = TAU / 12;
}

function adjustCamera() {
  //   if (keyIsPressed) {
  //   if (keyCode === LEFT_ARROW) {
  //     cameraAngle -= 0.01;
  //   } else if (keyCode === RIGHT_ARROW) {
  //     cameraAngle += 0.01;
  //   }
  // }
  
}

function placeCamera() {
  adjustCamera();

  directionalLight(255, 255, 255, -1, -1, 1);  
  
  // camera(0, feet(-5.5), feet(-24), 
  //        0,0,0,
  //        0,1,0);
  camera(0, feet(1), feet(24), 
         0,0,0,
         0,1,0);
}

function drawGround() {
  ambientMaterial(color(90, 255, 0));

  // top of hill
  push();
  translate(-feet(8), 0, 0);
  rotateX(TAU / 4);
  plane(feet(32), feet(48));
  pop();

  // slope
  const alongSlope = feet(euclideanDistance(20, 3));
  push();
  translate(feet(10), 1.5, 0);
  rotateX(TAU / 4);
  rotateZ(Math.asin(3 / alongSlope));
  plane(alongSlope, feet(48));
  pop();

  // bottom of hill
  push();
  translate(feet(26), 3, 0);
  rotateX(TAU / 4);
  plane(feet(12), feet(48));
  pop();
}

function draw() {
  ambientLight(127, 127, 127);
  placeCamera();
  
  background(210);
  
  noStroke();
  drawGround();  
}

