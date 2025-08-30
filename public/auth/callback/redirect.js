(function () {
  try {
    var h = window.location.hash || '';
    window.location.replace('/' + (h ? (h[0] === '#' ? h : '#' + h) : ''));
  } catch (_) {
    window.location.replace('/');
  }
})();
