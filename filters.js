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
  var m = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];

  return convolve(pixels, m);
};

Filters.prototype.sharpen = function(pixels) {
  var m = [[0, -3, 0], [-3, 21, -3], [0, -3, 0]];

  return convolve(pixels, m);
}

Filters.prototype.emboss = function(pixels) {
  var m = [[-18, -9, 0], [-9, 9, 9], [0, 9, 18]];

  return convolve(pixels, m);
}

Filters.prototype.lighten = function(pixels) {
  var m = [[0, 0, 0], [0, 12, 0], [0, 0, 0]];

  return convolve(pixels, m);
}

Filters.prototype.darken = function(pixels) {
  var m = [[0, 0, 0], [0, 6, 0], [0, 0, 0]];

  return convolve(pixels, m);
}

Filters.prototype.edge = function(pixels) {
  var m = [[0, 9, 0], [9, -36, 9], [0, 9, 0]];

  return convolve(pixels, m);
}

Filters.prototype.identity = function(pixels) {
  var m = [[0, 0, 0], [0, 9, 0], [0, 0, 0]];

  return convolve(pixels, m);
}

Filters.prototype.mikesfav = function(pixels) {
  var m = [[2, 22, 1], [22, 1, -22], [1, -22, -2]];

  return convolve(pixels, m);
};

function convolve(pixels, matrix) {
  var d = pixels.data;
  var sum = 0;
  var w = pixels.width;
  var h = pixels.height;
  var chanIndex;

  for (var r = 1; r < w - 1; r++) {
    var centerRedIndex = r * w * 4;

    centerRedIndex += 4;

    var upRedIndex = centerRedIndex - w * 4;
    var downRedIndex = centerRedIndex + w * 4;

    for (var c = 1; c < h - 1; c++) {
      for (var y = 0; y < 3; y++) {
        sum = 0;

        chanIndex = upRedIndex - 4 + y;
        sum += d[chanIndex] * matrix[0][0];

        chanIndex += 4;
        sum += d[chanIndex] * matrix[0][1];

        chanIndex += 4;
        sum += d[chanIndex] * matrix[0][2];

        chanIndex = centerRedIndex - 4 + y;
        sum += d[chanIndex] * matrix[1][0];

        chanIndex += 4;
        sum += d[chanIndex] * matrix[1][1];

        chanIndex += 4;
        sum += d[chanIndex] * matrix[1][2];

        chanIndex = downRedIndex - 4 + y;
        sum += d[chanIndex] * matrix[2][0];

        chanIndex += 4;
        sum += d[chanIndex] * matrix[2][1];

        chanIndex += 4;
        sum += d[chanIndex] * matrix[2][2];

        sum /= 9;
        sum = Math.min(Math.max(sum, 0), 255);

        d[centerRedIndex + y] = sum;
      }
      centerRedIndex += 4;
      upRedIndex += 4;
      downRedIndex += 4;
    }
  }

  return pixels;
};