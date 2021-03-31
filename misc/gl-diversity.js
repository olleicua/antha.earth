// Content behind double slashes is a comment. Use it for plain English notes,
// or for code that you want to temporarily disable.
/* global createCanvas, background, colorMode, HSL, windowWidth, windowHeight,
   random, width, height, ellipse, text, fill, noStroke */

let dot1;
function setup() {
 
}

function rand(n) {
  return Math.floor(Math.random() * n);
}
function setup() {
   createCanvas(windowWidth-150,windowHeight-150);
  for (let i =0;i<30;i++) {
    fill(rand(255), rand(255), rand(255));
    noStroke();
    quad(rand(width), rand(height),rand(width), rand(height),rand(width), rand(height),rand(width), rand(height))
  }

}
