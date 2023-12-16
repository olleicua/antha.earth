document.getElementById('set-background__button').addEventListener('click', () => {
  const url = document.getElementById('image-url__input').value;
  document.body.style.backgroundImage = `url(${url})`;
});

const buildCharSpan = (char) => {
  const $span = document.createElement('span');
  $span.classList.add('char');
  $span.textContent = char;
  return $span;
};

const isolateCharacters = ($container) => {
  $container.childNodes.forEach(($node) => {
    if ($node instanceof Text) {
      $node.replaceWith.apply(
        $node,
        $node.textContent.split('').map((char) => buildCharSpan(char))
      );
    } else if ($node instanceof HTMLElement &&
               $node.className.indexOf('char') === -1) {
      isolateCharacters($node);
    }
  });
};

document.getElementById('make-text-readable__button').addEventListener('click', () => {
  const $content = document.getElementById('content');
  isolateCharacters($content);
});