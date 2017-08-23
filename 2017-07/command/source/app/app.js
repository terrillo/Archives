$(document).ready(function() {
  var elements = {
    maxwidth: $('.row').width(),
    map: $('#map')
  }

  // Disable Zoom
  var keyCodes = [61, 107, 173, 109, 187, 189];
  $(document).keydown(function(event) {
     if (event.ctrlKey==true && (keyCodes.indexOf(event.which) != -1)) {
      event.preventDefault();
    }
  });
  $(window).bind('mousewheel DOMMouseScroll', function (event) {
     if (event.ctrlKey == true) {
       event.preventDefault();
     }
  });

  $(window).bind('mousewheel DOMMouseScroll', function(event){
    if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
      // Zoom OUT
      if ($('.box').width() > 20) {
        $('.box').height($('.box').height() - 2)
        $('.box').width($('.box').height())
      }
    }
    else {
      // Zoom IN
      if ($('.box').width() < (($('.row').width()/25)+20)) {
        $('.box').height($('.box').height() + 3)
        $('.box').width($('.box').height())
      }
    }
    $('#map').css('margin-top', (($('body').height() - $('#map').height()) / 2))
  });


  // Scroll
  $('body').on('scroll', function (e) {
    console.log('')
  });

  // Init
  function init() {
    var map = ''
    var rows = '<div class="row">';
    for (var x = 0; x < 33; x++) {
      rows += '<div class="box"></div>';
    }
    rows += '</div>';

    for (var x = 0; x < 30; x++) {
      map += rows;
    }

    return map;
  }

  elements.map.html(init());
  One();

  $('.box').height(($('.row').width()/25)-40)
  $('.box').width($('.box').height())
  $('#map').css('margin-top', (($('body').height() - $('#map').height()) / 2))

  window.scrollTo(0, $('#map').height())


})


var curYPos, curXPos, curDown;

window.addEventListener('mousemove', function(e){
  if(curDown){
    window.scrollTo(document.body.scrollLeft + (curXPos - e.pageX), document.body.scrollTop + (curYPos - e.pageY));
  }
});

window.addEventListener('mousedown', function(e){
  curYPos = e.pageY;
  curXPos = e.pageX;
  curDown = true;
});

window.addEventListener('mouseup', function(e){
  curDown = false;
});


function build(level) {
  $(level).each(function(k, v) {
    var row = k;
    $(v).each(function(k, v) {
      $('.row').eq(row).find('.box').eq(k).addClass('box-'+v)
    });
  })
}
