// Number of tiles wide and high to draw.  Actual screen width and height are
// in .html file's <style> tag.
const WIDTH = 100;
const HEIGHT = 100;

function twochars(n) {
  if (n < 10) {
    return "0" + n;
  }
  else {
    return n;
  }
};

// Returns true if graphing the function f, mapping the given domain and range
// onto our canvas, would intersect the pixel at (x,y).
function intersects(f, x, y, domain, range) {
  // Map |n|, who used to live in the range [0..oldMax], to [newMin..newMax].
  var scale = (n, oldMax, newMin, newMax) => n / oldMax * (newMax - newMin) + newMin;

  var oldx = x, oldy = y;
  var x     = scale(oldx,   WIDTH, domain[0], domain[1]);
  var nextX = scale(oldx+1, WIDTH, domain[0], domain[1]);
  var y     = scale(oldy,   HEIGHT, range[0], range[1]);
  var nextY = scale(oldy+1, HEIGHT, range[0], range[1]);

  var leftVal = f(x);
  var rightVal = f(nextX);
  if (
    // Option 1: wave crosses left edge of pixel
    (y <= leftVal && leftVal <= nextY) ||
    // Option 2: wave crosses bottom of pixel
    (y > leftVal && y < rightVal) ||
    // Option 3: wave crosses top of pixel
    (y < leftVal && y > rightVal) ||
    // Option 4: wave crosses right edge of pixel
    (y <= rightVal && rightVal <= nextY)
    ) {
    return true;
  } else {
    return false;
  }
}

function grapher(func, domain, range) {
  return function(x, y) {
    if (intersects(func, x, y, domain, range)) {
      return "black";
    } else {
      return "white";
    }
  };
}

function distSquared(x1,y1, x2,y2) {
  var distX = Math.abs(x1-x2), distY = Math.abs(y1-y2);
  return distX*distX + distY*distY;
}
function dist(x1,y1, x2,y2) {
  return Math.sqrt(distSquared(x1,y1, x2,y2));
}

// a tester emits black pixels when f(x,y) is true, else white.
function tester(f) {
  return (x,y) => (f(x,y) ? "black" : "white");
}

// Each of these is displayed on the page as buttons
var painters = {
  whitenoise: (x,y) => `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
  boring: (x, y) => "#" + twochars(x) + twochars(y) + "00",

  checkerboard: tester((x, y) => (x+y) % 2),
  concentric: tester( (x,y) => Math.round( dist       (x,y, WIDTH/2,HEIGHT/2) ) % 10 ),
  // Wow: so different from concentric()!
  flora:      tester( (x,y) => Math.round( distSquared(x,y, WIDTH/2,HEIGHT/2) ) % 10 ),

  dotty_sin_x: tester( (x,y) => Math.round(Math.sin(x*1.0 / WIDTH*2 * Math.PI) * HEIGHT/2 + (HEIGHT/2)) == y),
  sin_x: grapher(Math.sin, [0, 2*Math.PI], [-1, 1]),
  cos_x: grapher(Math.cos, [0, 2*Math.PI], [-1, 1]),
  tan_x: grapher(Math.tan, [0, 2*Math.PI], [-100, 100]),
  polynomial: grapher((x) => 2*x*x*x-40*x*x-20*x-3, [-50,50], [-10000,10000]),


};

// Fill |canvas| calling |func(x,y)| to get the color value of each pixel.
// Create a stylesheet denoting each pixel's color.
function draw(canvas, func) {
  var css = [];
  for (var x=0; x<WIDTH; x++) {
    for (var y=0; y<HEIGHT; y++) {
      css.push(`#t${x}-${y} { background-color: ${func(x,y)}; }`);
    }
  }

  $("#the_style").remove();
  $("<style>", { id: "the_style" }).
    text(css.join('\n')).
    appendTo("head");
}

function initTable(canvas) {
  $(canvas).html("");
  for (var y=HEIGHT-1; y>=0; y--) {
    var tr = $("<tr>");
    for (var x=0; x<WIDTH; x++) {
      var td = $("<td>", {id: `t${x}-${y}`});
      td.appendTo(tr);
    }

    tr.appendTo(canvas);
  }
}

// Create a button for each function that can draw on the canvas.
function addOptionButtons(canvas, optionsDiv) {
  Object.keys(painters).forEach(function(key) {
    $("<button>").text(key).click(() => draw(canvas, painters[key])).appendTo(optionsDiv);
 });
}

$(function() { 
  initTable(document.querySelector("#canvas"));
  addOptionButtons(document.querySelector("#canvas"),
                   document.querySelector("#options"));
});
