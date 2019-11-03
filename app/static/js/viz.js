window.onload=function(){
  var left = document.getElementById('panel-left');
  var right = document.getElementById('panel-right');

  var mid_bar = document.getElementById('middle-dragbar');
  var left_bar = document.getElementById('left-dragbar');
  var right_bar = document.getElementById('right-dragbar');

  var top_left = document.getElementById('top-left');
  var top_right = document.getElementById('top-right');

  var bottom_left = document.getElementById('bottom-left');
  var bottom_right = document.getElementById('bottom-right');

  var boxes = [top_left, top_right, bottom_left, bottom_right];
  var total_space = 0;

  for (i = 0; i < boxes.length; i++) {
    total_space += boxes[i].clientWidth * boxes[i].clientHeight;
  }

  function updateProbs() {
    total_space = 0;
    for (i = 0; i < boxes.length; i++) {
      total_space += boxes[i].clientWidth * boxes[i].clientHeight;
    }
    for (i = 0; i < boxes.length; i++) {
      boxes[i].getElementsByClassName("prob")[0].innerHTML = (100 * (boxes[i].clientWidth * boxes[i].clientHeight) / total_space).toFixed(2) + "%";
    }
  }

  updateProbs()

  // middle dragbar
  mid_bar.addEventListener('mousedown', () => {
    document.addEventListener('mousemove', function _listener(e) {
      left.style.width = 100 * (e.pageX - mid_bar.offsetWidth / 2) / window.innerWidth + 'vw';
      updateProbs();

      mid_bar.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', _listener);
      });
    });
  });



  // left dragbar
  left_bar.addEventListener('mousedown', () => {
    document.addEventListener('mousemove', function _listener(e) {
      top_left.style.height = 100 * (e.pageY - left_bar.offsetHeight / 2) / window.innerHeight + 'vh';
      updateProbs();

      left_bar.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', _listener);
      });
    });
  });

  // right dragbar
  right_bar.addEventListener('mousedown', () => {
    document.addEventListener('mousemove', function _listener(e) {
      top_right.style.height = 100 * (e.pageY - right_bar.offsetHeight / 2) / window.innerHeight + 'vh';
      updateProbs();

      right_bar.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', _listener);
      });
    });
  });
}
