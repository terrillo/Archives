var milo_views = {
  now: function() {
    $('#now').hide();
    $('#now').load('templates/welcome.html', function() {
    	$('#now').fadeIn('slow', function() {
        var d = new Date();
        var h = milo.util.addZero(d.getHours());
        var m = milo.util.addZero(d.getMinutes());
        setTimeout(function() {
          $('.loading-date').html(h+':'+m);
          $('.loading-day').html(milo.util.dayofWeek)
        }, 500);
      });
    })

    setTimeout(function() {
      $('#now').fadeOut('slow', function() {
        $('#now').load('templates/dash.html');
        $('#now').fadeIn('slow',function() {
          milo.views.socket()
          milo.data.stats()
          milo.data.talk()
        })
      })
    }, 5000)
  },

  socket: function() {
    setInterval(function () {
      var html = ''
      for(var i = 0; i < milo.log.length; i++) {
        html += '<div class="well"><b>'+milo.log[i]['a']+'</b><p>'+milo.log[i]['b']+'</p></div>';
      }
      $('#view-logger').html(html)
    });

    Pusher.logToConsole = true;
    var pusher = new Pusher(milo.pusher_key, {
      encrypted: true
    });
    var channel = pusher.subscribe('milo');

    // Personal Channel
    channel.bind(milo.util.guid(), function(data) {
      // milo.render(data.message);
    });

    // Notifications
    channel.bind('notifications', function(data) {
      console.log(data.message);
    });

    channel.bind('pusher:subscription_succeeded', function() {
      milo.status.socket = true;
      milo.util.logit('Status Update', 'Socket Ready')
      clean()
      milo.ready()
    });

    function clean() {
      $('#view-logger').removeClass('section-loading').addClass('section-ready').html('')
    }
  },

}
