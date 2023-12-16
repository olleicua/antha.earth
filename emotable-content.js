import { Picker, Database } from 'https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js';

const $emojiPicker = new Picker();
let $activeUnit;

$emojiPicker.addEventListener('emoji-click', createEmote);

document.addEventListener('click', (event) => {
  if (!$emojiPicker.contains(event.target) &&
      !event.target.classList.contains('add-emote')) {
    $emojiPicker.style.display = 'none';
    if ($activeUnit) {
      const $add = $activeUnit.querySelector('.add-emote');
      $add.style.display = 'inline-block';
      $activeUnit = null;
    }
  }
});

function prependEmoteToUnit({ $unit, emoteId, emoji }) {
  const $emote = document.createElement('div');
  $emote.classList.add('emote');
  $emote.setAttribute('data-emote-id', emoteId);
  $emote.setAttribute('data-emoji', emoji);
  $emote.setAttribute('tabindex', 0);
  addTitleToEmote($emote);
  $emote.textContent = emoji;
  $unit.prepend($emote);

  const $delete = document.createElement('div');
  $delete.classList.add('delete-emote');
  $delete.title = 'remove emoji';
  $delete.textContent = 'x';
  $delete.addEventListener('click', deleteEmote);
  $emote.append($delete);  
}

function addEmote(event) {
  const $add = event.target;
  const $unit = $add.parentElement;
  $activeUnit = $unit;

  $add.style.display = 'none';
  $emojiPicker.style.display = 'block';
  $unit.append($emojiPicker);
}

function createEmote(event) {
  $emojiPicker.style.display = 'none';
  if (!$activeUnit) return;

  const $add = $activeUnit.querySelector('.add-emote');

  const emoji = event.detail.unicode;

  if ($activeUnit.textContent.includes(emoji)) {
    $activeUnit = null;
    return;
  }
  
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", function() {
    const obj = JSON.parse(this.response);
    
    if (obj.success) {
      prependEmoteToUnit({
        $unit: $activeUnit,
        emoteId: obj.emoteId,
        emoji
      });
    }
    
    $add.style.display = 'inline-block';
    $activeUnit = null;
  });
  xhr.open("POST", 'https://anthalytics.glitch.me/emote');
  xhr.send(JSON.stringify({
    url: location.href,
    contentSlug: $activeUnit.getAttribute('data-slug'),
    emoji
  }));

}

function deleteEmote(event) {
  const $emote = event.target.parentElement;
  const emoteId = $emote.getAttribute('data-emote-id');

  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", function() {
    const obj = JSON.parse(this.response);
    if (obj.success) $emote.remove();
  });
  xhr.open("DELETE", `https://anthalytics.glitch.me/emote/${emoteId}`);
  xhr.send();
}

let emoteData;
export function loadEmotes(callback) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", function() {
    const obj = JSON.parse(this.response);
    emoteData = obj.contentUnits;
    callback();
  });
  const url = encodeURIComponent(location.href);
  xhr.open("GET", `https://anthalytics.glitch.me/emotes?page=${url}`);
  xhr.send();
}

const emojiDb = new Database();
async function addTitleToEmote($emote) {
  const emoji = await emojiDb.getEmojiByUnicodeOrName(
    $emote.getAttribute('data-emoji')
  );
  $emote.title = emoji.annotation;
}

export function makeEmotableContentUnit(slug) {
  const $unit = document.createElement('div');
  $unit.classList.add('emotable-content-unit');
  $unit.setAttribute('data-slug', slug);
  
  if (emoteData[slug]) {
    for (let i = 0; i < emoteData[slug].length; i++) {
      let { emoteId, emoji } = emoteData[slug][i];
      prependEmoteToUnit({ $unit, emoteId, emoji });
    }
  }
  
  const $add = document.createElement('div');
  $add.classList.add('add-emote');
  $add.title = 'add emoji';
  $add.textContent = '+';
  $add.addEventListener('click', addEmote);
  $unit.append($add);

  return $unit;
}