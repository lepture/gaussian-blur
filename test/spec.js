describe('gaussian blur', function() {
  var gaussian = require('gaussian-blur');

  function assert(condition, msg) {
    if (!condition) {
      throw new Error(msg || 'assert error');
    }
  }

  it('should render a svg replace img', function() {
    var img = document.getElementsByTagName('img');
    assert(img.length, 'no img is found');

    var svg = gaussian(img[0]);

    assert(!document.getElementsByTagName('img').length, 'img is not replaced');

    assert(document.body.innerHTML.indexOf('<svg') !== -1, 'svg is not found');

    assert(document.body.innerHTML.indexOf('1000') === -1);

    svg.deviation(1000);

    assert(document.body.innerHTML.indexOf('1000') !== -1);
  });
});
