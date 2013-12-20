/**
 * Gaussian Blur
 *
 * A gaussian blur effect for images.
 *
 * Copyright (c) 2013 by Hsiaoming Yang.
 */

// Sepcial Thanks to https://github.com/finom/jQuery-Gaussian-Blur

var insane = /\bMSIE [678]\.0\b/.test(navigator.userAgent);

var ns = 'http://www.w3.org/2000/svg';

/**
 * Create a node of svg.
 */
function create(name, attrs) {
  var element = document.createElementNS(ns, name);
  if (attrs) {
    for (var key in attrs) {
      if (key === 'href') {
        element.setAttributeNS(
          'http://www.w3.org/1999/xlink', key, attrs[key]
        );
      } else {
        element.setAttribute(key, attrs[key]);
      }
    }
  }
  return element;
}

/**
 * Interface for developer.
 */
module.exports = function(img, deviation) {
  if (insane) {
    // wow, insane IE is awesome
    var func = function(num) {
      img.style.filter = 'progid:DXImageTransform.Microsoft.Blur(pixelradius=' + num*2 + ')';
    };
    func(deviation);
    img.svg = false;
    img.deviation = func;
    return img;
  }

  var blurId = Math.random();

  var svg = create('svg', {
    version: '1.1',
    width: img.width,
    height: img.height,
    id: 'svg-blur-' + blurId
  });
  var filter = create('filter', {id: 'svg-filter-' + blurId});
  var gaussian = create('feGaussianBlur', {
    'in': 'SourceGraphic',
    stdDeviation: deviation || 2
  });
  var image = create('image', {
    x: 0,
    y: 0,
    width: img.width,
    height: img.height,
    href: img.src,
    style: 'filter:url(#svg-filter-' + blurId + ')'
  });

  filter.appendChild(gaussian);
  svg.appendChild(filter);
  svg.appendChild(image);

  // a function for developer changing deviation
  svg.deviation = function(num) {
    gaussian.setAttribute('stdDeviation', num);
  };
  svg.svg = true;

  img.parentNode.replaceChild(svg, img);
  return svg;
};
