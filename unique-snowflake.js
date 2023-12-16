const $snowflake = document.querySelector('.snowflake');
let text = '';

function buildArm({rotation, flipped}) {
  const $arm = document.createElement('div');
  $arm.classList.add('arm');
  $arm.style.transform = `scaleY(${flipped ? -1 : 1}) rotate(${rotation}turn)`;
  $arm.textContent = text;
  return $arm
}

function draw() {
  $snowflake.replaceChildren();
  for (let i = 0; i < 6; i++) {
    $snowflake.append(buildArm({rotation: i / 6, flipped: false}));
    $snowflake.append(buildArm({rotation: i / 6, flipped: true}));
  }
}

const spaceCode = ' '.charCodeAt(0);
const tildeCode = '~'.charCodeAt(0);

function processInput(key) {
  if (key === 'Backspace') {
    text = text.slice(0, -1);
  } else {
    if (key.length !== 1) return;
    if (!key.match(/[ -~]/)) return;
    if (key.match(/\d/)) return;
    text += key;
  }

  draw();
}

const $mobileInput = document.querySelector('.mobile-input');

$mobileInput.addEventListener('input',  (event) => {
  processInput(event.data.substr(-1));
});
window.addEventListener('keydown', (event) => processInput(event.key));

function showVirtualKeyboard(event) {
  event.preventDefault();
  $mobileInput.focus();
}

document.body.addEventListener('touchstart', showVirtualKeyboard);
document.body.addEventListener('touchend', showVirtualKeyboard);


if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  const $mobileHelpText = document.querySelector('.mobile-help-text');
  $mobileHelpText.style.display = 'inline';
}