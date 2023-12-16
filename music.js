const Music = {};
Music.tracks = {};
Music.breadcrumb = '/ music';
Music.displayTracks = Music.tracks;

(() => {
  let track = Music.tracks[location.hash.replace(/^#/, '')];
  if (track) {
    Music.breadcrumb = '/ <a href="/music.html">music</a> / ' + track.name;
    Music.displayTracks = [track];
  }
  window.addEventListener('hashchange', () => { location.reload() });
})();
