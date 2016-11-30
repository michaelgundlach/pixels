function initTable(canvas, cols, rows, func) {
  for (var x=0; x<cols; x++) {
    var tr = $("<tr>");
    for (var y=0; y<rows; y++) {
      $("<td>").css("background-color", func(x, y)).appendTo(tr);
    }
    tr.appendTo(canvas);
  }
}

$(function() { 
  var canvas = document.querySelector("#canvas");
  var twochars = function(n) {
    if (n < 10) {
      return "0" + n;
    }
    else {
      return n;
    }
  };
  var func = function(x, y) {
    return "#" + twochars(x) + twochars(y) + "88";
  };
  initTable(canvas, 100, 100, func);
});
