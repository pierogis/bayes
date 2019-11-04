window.onload = function() {
  var left = document.getElementById('panel-left')
  var right = document.getElementById('panel-right')

  var mid_bar = document.getElementById('middle-dragbar')
  var left_bar = document.getElementById('left-dragbar')
  var right_bar = document.getElementById('right-dragbar')

  var top_left = document.getElementById('top-left')
  var top_right = document.getElementById('top-right')

  var bottom_left = document.getElementById('bottom-left')
  var bottom_right = document.getElementById('bottom-right')

  var boxes = [top_left, top_right, bottom_left, bottom_right]
  var left_side = [left.children[0], top_left, left_bar, bottom_left]
  var right_side = [right.children[3], top_right, right_bar, bottom_right]
  var side_bars = [left_bar, right_bar]
  var panels = [left, right]
  var total_space = 0

  r = .001

  function dragProbs(box1, box2) {
    total_space = 0
    total_space += box1.clientWidth * box1.clientHeight + box2.clientWidth * box2.clientHeight

    space_share = (100 * (box1.clientWidth * box1.clientHeight) / total_space).toFixed(2) + "%"
    box1.children[0].innerHTML = space_share

    space_share = (100 * (box2.clientWidth * box2.clientHeight) / total_space).toFixed(2) + "%"
    box2.children[0].innerHTML = space_share
  }

  function releaseProbs() {
    total_space = boxes[0].clientWidth * boxes[0].clientHeight + boxes[1].clientWidth * boxes[1].clientHeight
    for (i = 0; i < 2; i++) {
      space_share = (100 * (boxes[i].clientWidth * boxes[i].clientHeight) / total_space).toFixed(2) + "%"
      boxes[i].children[0].innerHTML = space_share
    }

    total_space = boxes[2].clientWidth * boxes[2].clientHeight + boxes[3].clientWidth * boxes[3].clientHeight
    for (i = 2; i < 4; i++) {
      space_share = (100 * (boxes[i].clientWidth * boxes[i].clientHeight) / total_space).toFixed(2) + "%"
      boxes[i].children[0].innerHTML = space_share
    }
  }

  function midListener(e) {
    a = (e.pageX - mid_bar.offsetWidth / 2)
    b = window.innerWidth - (e.pageX + mid_bar.offsetWidth / 2)

    left.style.flex = a / (a+b)
    right.style.flex = b / (a+b)

    dragProbs(left.children[0], right.children[3])
  }

  function leftListener(e) {
    a = (e.pageY - left_bar.offsetHeight / 2)
    b = window.innerHeight - (e.pageY + left_bar.offsetHeight / 2)

    top_left.style.flex = a / (a+b)
    bottom_left.style.flex = b / (a+b)

    dragProbs(top_left, bottom_left)
  }

  function rightListener(e) {
    a = (e.pageY - right_bar.offsetHeight / 2)
    b = window.innerHeight - (e.pageY + right_bar.offsetHeight / 2)

    top_right.style.flex = a / (a+b)
    bottom_right.style.flex = b / (a+b)

    dragProbs(top_right, bottom_right)
  }

  for (i = 0; i < boxes.length; i++) {
    total_space += boxes[i].clientWidth * boxes[i].clientHeight
  }

  releaseProbs()

  mid_bar.addEventListener('mousedown', (e) => {
    barHold(mid_bar, e)
  })

  left_bar.addEventListener('mousedown', (e) => {
    barHold(left_bar, e)
  })

  right_bar.addEventListener('mousedown', (e) => {
    barHold(right_bar, e)
  })

  function barHold(bar, e) {
    function pressingDown(e) {
      cancelAnimationFrame(timerID);

      f = r

      if (bar == mid_bar) {
        dragProbs(left_side[0], right_side[0])
        left_side[0].children[0].style.display = "inline"
        right_side[0].children[0].style.display = "inline"
        left_side[0].children[1].style.display = "none"
        right_side[0].children[1].style.display = "none"

        document.addEventListener("mousemove", midListener, false)
      }
      else {
        top_s.children[0].style.display = "inline"
        top_s.children[1].style.display = "none"

        bot_s.children[0].style.display = "inline"
        bot_s.children[1].style.display = "none"

        side_o[0].children[1].style.display = "inline"

        dragProbs(top_s, bot_s)
        if (bar == left_bar) {
          document.addEventListener("mousemove", leftListener, false)
        }
        else if (bar == right_bar) {
          document.addEventListener("mousemove", rightListener, false)
        }
      }

      e.preventDefault();

      requestAnimationFrame(holdTimer);
    }

    function notPressingDown(e) {
      cancelAnimationFrame(timerID);

      r = f

      if (bar == mid_bar) {
        document.removeEventListener("mousemove", midListener, false)
      }
      else {
        top_s.children[0].style.display = null
        top_s.children[1].style.display = null

        bot_s.children[0].style.display = null
        bot_s.children[1].style.display = null
        if (bar == left_bar) {
          document.removeEventListener("mousemove", leftListener, false)
        }
        else if (bar == right_bar) {
          document.removeEventListener("mousemove", rightListener, false)
        }
      }

      for (i = 1; i < left_side.length; i++) {
        if (bar == mid_bar) {
          left_side[i].style.opacity = 1
          right_side[i].style.opacity = 1
        }
        else {
          side_o[i].style.opacity = 1
        }
      }

      bar.removeEventListener("mouseup", notPressingDown, false)

      requestAnimationFrame(releaseTimer);

      releaseProbs()
    }

    function holdTimer() {
      if (f < 300) {
        timerID = requestAnimationFrame(holdTimer);
        f = f*1.55
        console.log(f)

        if (bar == mid_bar) {
          left_side[0].style.flex = f
          right_side[0].style.flex = f
          left_bar.style.padding = 8 * (1 - f / 10) + "px"
          right_bar.style.padding = 8 * (1 - f / 10) + "px"

          left_side[0].children[0].style.opacity = (1 - 1/f / 5)
          right_side[0].children[0].style.opacity = (1 - 1/f / 5)

          left_side[1].children[1].style.opacity = (1 - f / 5)
          left_side[3].children[1].style.opacity = (1 - f / 5)
          right_side[1].children[1].style.opacity = (1 - f / 5)
          right_side[3].children[1].style.opacity = (1 - f / 5)

          dragProbs(left_side[0], right_side[0])
        }
        else {
          panel_o.style.flex = f
          bar_o.style.padding = 8 * (1 - f / 10) + "px"

          side_o[0].children[1].style.opacity = (1 - 1/f / 5)

          top_o.children[1].style.opacity = (1 - f / 5)
          bot_o.children[1].style.opacity = (1 - f / 5)
          dragProbs(top_s, bot_s)
        }
      }
      else {
        for (i = 1; i < left_side.length; i++) {
          if (bar == mid_bar) {
            left_side[i].style.opacity = 0
            right_side[i].style.opacity = 0
          }
          else {
            side_o[i].style.opacity = 0
          }
        }
        if (bar == mid_bar) {
          left_side[0].style.flex = 10000
          right_side[0].style.flex = 10000
          left_bar.style.padding = 0
          right_bar.style.padding = 0

          left_side[0].children[0].style.display = null
          right_side[0].children[0].style.display = null

          dragProbs(left_side[0], right_side[0])
        }
        else {
          panel_o.style.flex = 10000
          bar_o.style.padding = 0

          left_side[0].children[0].style.display = "none"
          right_side[0].children[0].style.display = "none"

          dragProbs(top_s, bot_s)
        }
        f = 300
      }
    }

    function releaseTimer() {
      if (r > 0.001) {
        timerID = requestAnimationFrame(releaseTimer);
        r = r/1.55

        if (bar == mid_bar) {
          left_side[0].style.flex = r
          right_side[0].style.flex = r
          left_bar.style.padding = 8 * (1 - r / 10) + "px"
          right_bar.style.padding = 8 * (1 - r / 10) + "px"

          left_side[0].children[0].style.opacity = (1 - 1/r / 5)
          right_side[0].children[0].style.opacity = (1 - 1/r / 5)

          left_side[1].children[1].style.opacity = (1 - r / 5)
          left_side[3].children[1].style.opacity = (1 - r / 5)
          right_side[1].children[1].style.opacity = (1 - r / 5)
          right_side[3].children[1].style.opacity = (1 - r / 5)
        }
        else {
          for (i = 1; i < left_side.length; i++) {
            if (bar == mid_bar) {
              left_side[i].style.opacity = 1
              right_side[i].style.opacity = 1
            }
            else {
              side_o[i].style.opacity = 1
            }
          }
          panel_o.style.flex = r
          bar_o.style.padding = 8 * (1 - r / 10) + "px"

          side_o[0].children[1].style.opacity = (1 - 1/r / 5)

          top_o.children[1].style.opacity = (1 - r / 5)
          bot_o.children[1].style.opacity = (1 - r / 5)

          releaseProbs()
        }
      }
      else {
        if (bar == mid_bar) {
          left_side[0].style.flex = 0
          right_side[0].style.flex = 0
          left_bar.style.padding = "8px"
          right_bar.style.padding = "8px"

          left_side[0].children[0].style.display = "none"
          right_side[0].children[0].style.display = "none"
        }
        else {
          panel_o.style.flex = 0
          bar_o.style.padding = "8px"
        }
        releaseProbs()
        r = .001
      }
    }

    // https://www.kirupa.com/html5/press_and_hold.htm
    var timerID

    f = r

    if (bar == left_bar) {
      panel_s = left_side[0]
      top_s = left_side[1]
      bar_s = left_side[2]
      bot_s = left_side[3]

      side_s = left_side

      panel_o = right_side[0]
      top_o = right_side[1]
      bar_o = right_side[2]
      bot_o = right_side[3]

      side_o = right_side
    }
    else if (bar == right_bar) {
      panel_s = right_side[0]
      top_s = right_side[1]
      bar_s = right_side[2]
      bot_s = right_side[3]

      side_s = right_side

      panel_o = left_side[0]
      top_o = left_side[1]
      bar_o = left_side[2]
      bot_o = left_side[3]

      side_o = left_side
    }

    bar.addEventListener("mouseup", notPressingDown, false)
    // item.addEventListener("touchstart", pressingDown, false);
    // item.addEventListener("touchend", notPressingDown, false);
    pressingDown(e)
  }
}
