
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("gaussian-blur/index.js", function(exports, require, module){
/**
 * Gaussian Blur
 *
 * A gaussian blur effect for images.
 *
 * Copyright (c) 2013 by Hsiaoming Yang.
 */

// Sepcial Thanks to https://github.com/finom/jQuery-Gaussian-Blur

var ua = navigator.userAgent;
var insane = ~ua.indexOf('MSIE 6') || ~ua.indexOf('MSIE 7') || ~ua.indexOf('MSIE 8');

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

});