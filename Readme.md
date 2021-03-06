# gaussian-blur

Gaussian blur effect for images.

[![Build Status](https://travis-ci.org/lepture/gaussian-blur.png?branch=master)](https://travis-ci.org/lepture/gaussian-blur)
[![Coverage Status](https://coveralls.io/repos/lepture/gaussian-blur/badge.png)](https://coveralls.io/r/lepture/gaussian-blur)

## Installation

Install with [component(1)](http://component.io):

    $ component install lepture/gaussian-blur

## API

```js
var gaussian = require('gaussian-blur')
gaussian(document.getElementsByTagName('img')[0])
```

**NOTICE**: make sure that image is loaded. For example:

```js
img.onload = function() {
    gaussian(img)
}
```

This blur function accept two parameters: image and deviation.

```js
gaussian(img, 1)
```

The return value has a `deviation` method for you to change the deviation.

```js
var svg = gaussian(img)
svg.deviation(2)
```

## Thanks

This project is totally inspired by [jQuery Gaussian Blur](https://github.com/finom/jQuery-Gaussian-Blur).

## License

MIT
