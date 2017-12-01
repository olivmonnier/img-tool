function Filters() {};

Filters.prototype.grayscale = function(pixels) {
  var d = pixels.data;

  for (var i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];
    var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    d[i] = d[i + 1] = d[i + 2] = v;
  }

  return pixels;
};

Filters.prototype.sepia = function(pixels) {
  var d = pixels.data;

  for (var i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];
    var avg = 0.3 * r + 0.59 * g + 0.11 * b;

    d[i] = avg + 100;
    d[i + 1] = avg + 50;
    d[i + 2] = avg;
  }

  return pixels;
}

Filters.prototype.invert = function(pixels) {
  var d = pixels.data;

  for (var i = 0; i < d.length; i += 4) {
    d[i] = 255 - d[i];
    d[i + 1] = 255 - d[i + 1];
    d[i + 2] = 255 - d[i + 2]
  }

  return pixels;
}

Filters.prototype.brightness = function(pixels, adjustement) {
  var d = pixels.data;

  for (var i = 0; i < d.length; i += 4) {
    d[i] += adjustement || 40;
    d[i + 1] += adjustement || 40;
    d[i + 2] += adjustement || 40;
  }

  return pixels;
};

Filters.prototype.noise = function(pixels, factor) {
  var d = pixels.data;

  for (var i = 0; i < d.length; i += 4) {
    var rand = (0.5 - Math.random()) * factor;
    d[i] = d[i] + rand;
    d[i + 1] = d[i + 1] + rand;
    d[i + 2] = d[i + 2] + rand;
  }

  return pixels;
}

Filters.prototype.blackAndWhite = function(pixels, threshold) {
  var d = pixels.data;

  for (var i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];
    var v =
      0.2126 * r + 0.7152 * g + 0.0722 * b >= (threshold || 128) ? 255 : 0;

    d[i] = d[i + 1] = d[i + 2] = v;
  }

  return pixels;
};

Filters.prototype.blur = function(pixels) {
  var m = [
    [1, 1, 1], 
    [1, 1, 1], 
    [1, 1, 1]
  ];

  return convolve(pixels, m);
};

Filters.prototype.sharpen = function(pixels) {
  var m = [
    [0, -2, 0], 
    [-2, 11, -2], 
    [0, -2, 0]
  ];

  return convolve(pixels, m);
}

Filters.prototype.emboss = function(pixels) {
  var m = [
    [2, 0, 0], 
    [0, -1, 0], 
    [0, 0, -1]
  ];

  return convolve(pixels, m, 127);
}

Filters.prototype.lighten = function(pixels) {
  var m = [
    [0, 0, 0], 
    [0, 12, 0], 
    [0, 0, 0]
  ];

  return convolve(pixels, m);
}

Filters.prototype.darken = function(pixels) {
  var m = [
    [0, 0, 0], 
    [0, 6, 0], 
    [0, 0, 0]
  ];

  return convolve(pixels, m);
}

Filters.prototype.edge = function(pixels) {
  var m = [
    [1, 1, 1], 
    [1, -7, 1], 
    [1, 1, 1]
  ]

  return convolve(pixels, m);
}

Filters.prototype.identity = function(pixels) {
  var m = [
    [0, 0, 0], 
    [0, 9, 0], 
    [0, 0, 0]
  ];

  return convolve(pixels, m);
}

function convolve(pixels, matrix, offset) {
  var d = pixels.data;
  var len = d.length;
  var m = [].concat(matrix[0], matrix[1], matrix[2]);
  var res = 0;
  var w = pixels.width;

  for (var i = 0; i < len; i++) {
    if((i + 1) % 4 === 0) {
      continue;
    }

    res = 0;
    var these = [
      d[i - w * 4 - 4] || d[i],
      d[i - w * 4]     || d[i],
      d[i - w * 4 + 4] || d[i],
      d[i - 4]         || d[i],
      d[i],
      d[i + 4]         || d[i],
      d[i + w * 4 - 4] || d[i],
      d[i + w * 4]     || d[i],
      d[i + w * 4 + 4] || d[i]
    ];

    for(var j = 0; j < 9; j++) {
      res += these[j] * m[j];
    }

    res /= 9;
    
    if (offset) {
      res += offset;
    }

    res = Math.min(Math.max(res, 0), 255);

    d[i] = res
  }

  return pixels;
};