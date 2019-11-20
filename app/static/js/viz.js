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

  var total_space = 0

  var hoverWait

  _C = 1.4
  _P = 10
  r = .001

  // calculate and show the relative sizes of two divs
  function dragProbs(box1, box2) {
    total_space = 0
    total_space += box1.clientWidth * box1.clientHeight + box2.clientWidth * box2.clientHeight

    space_share = (100 * (box1.clientWidth * box1.clientHeight) / total_space).toFixed(2) + "%"
    box1.children[0].innerHTML = space_share

    space_share = (100 * (box2.clientWidth * box2.clientHeight) / total_space).toFixed(2) + "%"
    box2.children[0].innerHTML = space_share
  }

  // calculate the bayes results for all 4 prob boxes
  function releaseProbs() {
    total_space = boxes[0].clientWidth * boxes[0].clientHeight + boxes[1].clientWidth * boxes[1].clientHeight
    for (i = 0; i < 2; i++) {
      space_share = (100 * (boxes[i].clientWidth * boxes[i].clientHeight) / total_space).toFixed(2) + "%"
      boxes[i].children[0].children[0].innerHTML = space_share
    }

    total_space = boxes[2].clientWidth * boxes[2].clientHeight + boxes[3].clientWidth * boxes[3].clientHeight
    for (i = 2; i < 4; i++) {
      space_share = (100 * (boxes[i].clientWidth * boxes[i].clientHeight) / total_space).toFixed(2) + "%"
      boxes[i].children[0].children[0].innerHTML = space_share
    }
  }

  // pointer movement tracker and box size updaters
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

    dragProbs(top_left.children[1], bottom_left.children[1])
  }

  function rightListener(e) {
    a = (e.pageY - right_bar.offsetHeight / 2)
    b = window.innerHeight - (e.pageY + right_bar.offsetHeight / 2)

    top_right.style.flex = a / (a+b)
    bottom_right.style.flex = b / (a+b)

    dragProbs(top_right.children[1], bottom_right.children[1])
  }

  function hovering(e) {
    cancelAnimationFrame(timerID);

    bar = e.target

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

    mid_bar.removeEventListener("pointerenter", hovering, false)
    left_bar.removeEventListener("pointerenter", hovering, false)
    right_bar.removeEventListener("pointerenter", hovering, false)

    bar.addEventListener("pointerdown", clicking)
    bar.addEventListener("pointerleave", notHovering)

    f = r

    e.preventDefault();

    hoverWait = setTimeout(function () {
      if (bar == mid_bar){
        left_side[0].children[0].style.display = "none"
        left_side[0].children[1].style.display = "inline"
        right_side[0].children[0].style.display = "none"
        right_side[0].children[1].style.display = "inline"
      }

      requestAnimationFrame(holdTimer);
    }, 100);
  }
  function notHovering(e) {
    cancelAnimationFrame(timerID);

    clearTimeout(hoverWait)

    bar.removeEventListener("pointerdown", clicking)
    bar.removeEventListener("pointerleave", notHovering)

    bar.addEventListener("pointerenter", hovering)

    r = f

    for (i = 1; i < left_side.length; i++) {
      if (bar == mid_bar) {
        left_side[i].style.opacity = 1
        right_side[i].style.opacity = 1
      }
      else {
        side_o[i].style.opacity = 1
      }
    }

    requestAnimationFrame(releaseTimer);
  }
  function clicking(e) {
    mid_bar.removeEventListener("pointerenter", hovering)
    left_bar.removeEventListener("pointerenter", hovering)
    right_bar.removeEventListener("pointerenter", hovering)

    bar.addEventListener("pointerup", notClicking)
    bar.removeEventListener("pointerdown", clicking)
    bar.removeEventListener("pointerleave", notHovering)

    if (bar == mid_bar) {
      // cross fade statement for prob
      left_side[0].children[0].style.display = "inline"
      left_side[0].children[1].style.display = "none"
      right_side[0].children[0].style.display = "inline"
      right_side[0].children[1].style.display = "none"
      dragProbs(left_side[0], right_side[0])
      document.addEventListener("pointermove", midListener)
    }
    else {
      dragProbs(top_s.children[1], bot_s.children[1])

      top_s.children[1].children[0].style.display = "inline"
      top_s.children[1].children[1].style.display = "none"
      bot_s.children[1].children[0].style.display = "inline"
      bot_s.children[1].children[1].style.display = "none"

      if (bar == left_bar) {
        document.addEventListener("pointermove", leftListener)
      }
      else if (bar == right_bar) {
        document.addEventListener("pointermove", rightListener)
      }
    }
  }

  function notClicking(e) {
    bar.addEventListener("pointerdown", clicking)

    if (bar == mid_bar) {
      left_side[0].children[0].style.display = "none"
      left_side[0].children[1].style.display = "inline"
      right_side[0].children[0].style.display = "none"
      right_side[0].children[1].style.display = "inline"

      document.removeEventListener("pointermove", midListener)
    }
    else {
      top_s.children[1].children[0].style.display = "none"
      top_s.children[1].children[1].style.display = "inline"
      bot_s.children[1].children[0].style.display = "none"
      bot_s.children[1].children[1].style.display = "inline"

      if (bar == left_bar) {
        document.removeEventListener("pointermove", leftListener)
      }
      else if (bar == right_bar) {
        document.removeEventListener("pointermove", rightListener)
      }
    }

    bar.addEventListener("pointerleave", notHovering)
    bar.removeEventListener("pointerup", notClicking)
  }

  function holdTimer() {
    other()
  }

  function other() {
    if (f < 300) {

      f = f*_C

      if (bar == mid_bar) {
        left_side[0].style.flex = f
        right_side[0].style.flex = f
        left_bar.style.padding = _P * (1 - f / 10) + "px"
        right_bar.style.padding = _P * (1 - f / 10) + "px"

        left_side[0].children[1].style.opacity = (1 - 1/f / 5)
        right_side[0].children[1].style.opacity = (1 - 1/f / 5)

        left_side[1].children[0].children[1].style.opacity = (1 - f / 5)
        left_side[3].children[0].children[1].style.opacity = (1 - f / 5)
        right_side[1].children[0].children[1].style.opacity = (1 - f / 5)
        right_side[3].children[0].children[1].style.opacity = (1 - f / 5)

        dragProbs(left_side[0], right_side[0])
      }
      else {
        // fling in oppposite panel
        panel_o.style.flex = f
        bar_o.style.padding = _P * (1 - f / 10) + "px"

        // fade in opposite panel statement
        side_o[0].children[1].style.opacity = (1 - 1/f / 5)

        // opposite side fade out statements
        top_o.children[0].children[1].style.opacity = (1 - f / 5)
        bot_o.children[0].children[1].style.opacity = (1 - f / 5)

        // same side fade in/out probs
        top_s.children[1].children[0].style.opacity = (1 - 10/f / 10)
        bot_s.children[1].children[0].style.opacity = (1 - 10/f / 10)

        top_s.children[0].children[0].style.opacity = (1 - f)
        bot_s.children[0].children[0].style.opacity = (1 - f)

        // same side fade in/out statements
        top_s.children[1].children[1].style.opacity = (1 - 10/f / 10)
        bot_s.children[1].children[1].style.opacity = (1 - 10/f / 10)

        top_s.children[0].children[1].style.opacity = (1 - f)
        bot_s.children[0].children[1].style.opacity = (1 - f)

        // fling in evidence boxes
        top_s.children[1].style.flex = f
        bot_s.children[1].style.flex = f

        dragProbs(top_s.children[1], bot_s.children[1])
      }
      timerID = requestAnimationFrame(holdTimer);
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

        dragProbs(left_side[0], right_side[0])
      }
      else {
        panel_o.style.flex = 10000
        bar_o.style.padding = 0

        top_s.children[1].style.flex = 10000
        bot_s.children[1].style.flex = 10000

        side_o[0].children[1].style.opacity = 1

        top_o.children[0].children[1].style.opacity = 0
        bot_o.children[0].children[1].style.opacity = 0

        top_s.children[1].children[1].style.opacity = 1
        bot_s.children[1].children[1].style.opacity = 1

        top_s.children[0].children[1].style.opacity = 0
        bot_s.children[0].children[1].style.opacity = 0

        dragProbs(top_s.children[1], bot_s.children[1])
      }
      f = 300
    }
  }

  function releaseTimer() {
    if (r > 0.001) {

      r = r/_C

      if (bar == mid_bar) {
        left_side[0].style.flex = r
        right_side[0].style.flex = r
        left_bar.style.padding = _P * (1 - r / 10) + "px"
        right_bar.style.padding = _P * (1 - r / 10) + "px"

        left_side[0].children[1].style.opacity = (1 - 1/r / 5)
        right_side[0].children[1].style.opacity = (1 - 1/r / 5)

        left_side[1].children[0].children[1].style.opacity = (1 - r / 5)
        left_side[3].children[0].children[1].style.opacity = (1 - r / 5)
        right_side[1].children[0].children[1].style.opacity = (1 - r / 5)
        right_side[3].children[0].children[1].style.opacity = (1 - r / 5)
      }
      else {
        panel_o.style.flex = r
        bar_o.style.padding = _P * (1 - r / 10) + "px"

        side_o[0].children[1].style.opacity = (1 - 1/r / 5)

        // opposite side fade in statements
        top_o.children[0].children[1].style.opacity = (1 - r / 5)
        bot_o.children[0].children[1].style.opacity = (1 - r / 5)

        // same side fade out/in probs
        top_s.children[1].children[0].style.opacity = (1 - 10/r / 10)
        bot_s.children[1].children[0].style.opacity = (1 - 10/r / 10)

        top_s.children[0].children[0].style.opacity = (1 - r)
        bot_s.children[0].children[0].style.opacity = (1 - r)

        // same side fade out/in statements
        top_s.children[1].children[1].style.opacity = (1 - 10/r / 10)
        bot_s.children[1].children[1].style.opacity = (1 - 10/r / 10)

        top_s.children[0].children[1].style.opacity = (1 - r)
        bot_s.children[0].children[1].style.opacity = (1 - r)

        // fling out evidence boxes
        top_s.children[1].style.flex = r
        bot_s.children[1].style.flex = r

        releaseProbs()
      }
      timerID = requestAnimationFrame(releaseTimer);
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
      if (bar == mid_bar) {
        left_side[0].style.flex = 0
        right_side[0].style.flex = 0
        left_bar.style.padding = _P + "px"
        right_bar.style.padding = _P + "px"

        left_bar.addEventListener("pointerenter", hovering)
        right_bar.addEventListener("pointerenter", hovering)
      }
      else {
        panel_o.style.flex = 0
        bar_o.style.padding = _P + "px"

        top_s.children[1].style.flex = 0
        bot_s.children[1].style.flex = 0

        side_o[0].children[1].style.opacity = 0

        top_o.children[0].children[1].style.opacity = 1
        bot_o.children[0].children[1].style.opacity = 1

        top_s.children[1].children[1].style.opacity = 0
        bot_s.children[1].children[1].style.opacity = 0

        top_s.children[0].children[1].style.opacity = 1
        bot_s.children[0].children[1].style.opacity = 1

        mid_bar.addEventListener("pointerenter", hovering)
        bar_o.addEventListener("pointerenter", hovering)
      }

      releaseProbs()
      r = .001
    }
  }

  for (i = 0; i < boxes.length; i++) {
    total_space += boxes[i].clientWidth * boxes[i].clientHeight
  }

  var timerID

  releaseProbs()

  mid_bar.addEventListener("pointerenter", hovering)
  left_bar.addEventListener("pointerenter", hovering)
  right_bar.addEventListener("pointerenter", hovering)

  // mid_bar.addEventListener("touchstart", touching)
  // left_bar.addEventListener("touchstart", touching)
  // right_bar.addEventListener("touchstart", touching)
}
