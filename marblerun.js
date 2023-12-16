var marble = document.getElementById('underlay').childNodes[0];
document.getElementById('underlay').append(marble);
var targets = [
  [1, 0, 80, 16],
  [2, 0, 416, 16],
  [-1, 4, 400, 80],
  [0, -2, 400, 60],
  [0, 2, 400, 80],
  [0, -2, 400, 70],
  [0, 2, 400, 80],
  [-1, 0, 336, 80],
  [-1, 4, 320, 144],
  [-1, -2, 315, 134],
  [-1, 2, 310, 144],
  [-1, 0, 144, 144],
  [-1, 2, 128, 176],
  [2, 4, 144, 208],
  [2, 0, 464, 208],
  [2, 4, 480, 240],
  [-4, 8, 464, 272],
  [-4, 0, 256, 272],
  [1, 0, 272, 272],
  [0, 1, 272, 304],
  [0, 2, 272, 336],
  [0, -2, 272, 320],
  [0, -1, 272, 304],
  [0, 1, 272, 320],
  [0, 2, 272, 336],
  [0, -2, 272, 328],
  [0, -1, 272, 320],
  [0, 1, 272, 328],
  [-1, 2, 268, 336],
  [-1, 0, 208, 336],
  [-2, 0, 144, 336],
  [-4, 0, 16, 336],
  [-4, 8, 0, 368],
  [4, 8, 16, 400],
  [4, 0, 208, 400],
  [0, 4, 208, 432],
  [4, 4, 240, 464],
  [4, 0, 400, 464],
  [2, 4, 416, 496],
  [-1, 2, 400, 528],
  [-1, 0, 0, 528],
  [1, 0, 16, 528],
];
var i = 0;
var roll = function() {
  var x = parseInt(marble.getAttribute('x'));
  var y = parseInt(marble.getAttribute('y'));
  var [dx, dy, targetX, targetY] = targets[i];
  if (x === targetX && y === targetY) {
    i++;
    if (!targets[i]) return;
    return roll();
  }
  marble.setAttribute('x', x + dx);
  marble.setAttribute('y', y + dy);
  setTimeout(roll, 5);
};
roll();
