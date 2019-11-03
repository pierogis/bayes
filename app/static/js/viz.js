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
  var panels = [left, right]
  var total_space = 0;

  for (i = 0; i < boxes.length; i++) {
    total_space += boxes[i].clientWidth * boxes[i].clientHeight;
  }

  function dragProbs(box1, box2) {
    total_space = 0;
    total_space += box1.clientWidth * box1.clientHeight + box2.clientWidth * box2.clientHeight;

    space_share = (100 * (box1.clientWidth * box1.clientHeight) / total_space).toFixed(2) + "%";
    box1.children[0].innerHTML = space_share;

    space_share = (100 * (box2.clientWidth * box2.clientHeight) / total_space).toFixed(2) + "%";
    box2.children[0].innerHTML = space_share;
  }

  function releaseProbs() {
    total_space = boxes[0].clientWidth * boxes[0].clientHeight + boxes[1].clientWidth * boxes[1].clientHeight;
    for (i = 0; i < 2; i++) {
      space_share = (100 * (boxes[i].clientWidth * boxes[i].clientHeight) / total_space).toFixed(2) + "%";
      boxes[i].children[0].innerHTML = space_share;
    }

    total_space = boxes[2].clientWidth * boxes[2].clientHeight + boxes[3].clientWidth * boxes[3].clientHeight;
    for (i = 2; i < 4; i++) {
      space_share = (100 * (boxes[i].clientWidth * boxes[i].clientHeight) / total_space).toFixed(2) + "%";
      boxes[i].children[0].innerHTML = space_share;
    }
  }

  function midListener(e) {
    left.style.width = 100 * (e.pageX - mid_bar.offsetWidth / 2) / window.innerWidth + 'vw';

    dragProbs(left, right)
  }

  function leftListener(e) {
    top_left.style.height = 100 * (e.pageY - left_bar.offsetHeight / 2) / window.innerHeight + 'vh';

    dragProbs(top_left, bottom_left)
  }

  function rightListener(e) {
    top_right.style.height = 100 * (e.pageY - right_bar.offsetHeight / 2) / window.innerHeight + 'vh';

    dragProbs(top_right, bottom_right)
  }

  function setOpacities(o) {
    for (i = 0; i < 4; i++) {
      boxes[i].style.opacity = o;
    }

    left_bar.style.opacity = o;
    right_bar.style.opacity = o;
  }

  releaseProbs()

  // middle dragbar
  mid_bar.addEventListener('mousedown', () => {
    setOpacities(0)
    dragProbs(left, right)
    document.addEventListener('mousemove', midListener);
  });

  mid_bar.addEventListener('mouseup', () => {
    left.children[0].innerHTML = "";
    right.children[0].innerHTML = "";

    releaseProbs();
    setOpacities(.7);
    document.removeEventListener('mousemove', midListener);
  });

  // left dragbar
  left_bar.addEventListener('mousedown', () => {
    dragProbs(top_left, bottom_left)
    right_bar.style.opacity = 0;
    top_right.style.opacity = 0;
    bottom_right.style.opacity = 0;
    document.addEventListener('mousemove', leftListener);
  });

  left_bar.addEventListener('mouseup', () => {
    releaseProbs();
    setOpacities(.7);
    document.removeEventListener('mousemove', leftListener);
  });

  // right dragbar
  right_bar.addEventListener('mousedown', () => {
    dragProbs(top_right, bottom_right)
    left_bar.style.opacity = 0;
    top_left.style.opacity = 0;
    bottom_left.style.opacity = 0;
    document.addEventListener('mousemove', rightListener);
  });

  right_bar.addEventListener('mouseup', () => {
    releaseProbs();
    setOpacities(.7);
    document.removeEventListener('mousemove', rightListener);
  });
}
