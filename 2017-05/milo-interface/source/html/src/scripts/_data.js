var milo_data = {
  stats: function() {
    $.getJSON(`${api_base}/status`, function( data ) {
      clean()
      $('#view-stats').append('<div class="well"><i class="ion-up ion-ios-play-outline color-neon-one"></i> Rest API Server</div>');
      if (milo.status.socket) {
        $('#view-stats').append('<div class="well"><i class="ion-up ion-ios-play-outline color-neon-one"></i> Socket Connection</div>');
      }
      else {
        $('#view-stats').append('<div class="well"><i class="ion-down ion-ios-play-outline color-neon-one"></i> Socket Connection</div>');
      }
    });

    function clean() {
      $('#view-stats').removeClass('section-loading').addClass('section-ready').html('')
    }
  },

  talk: function() {
    $('#view-prompt').removeClass('section-loading').addClass('section-ready').html('')
    $('#view-prompt').parent().addClass('outline-input')
    $('#view-prompt').load('templates/prompt.html', function() {
      $('#talk').height($('.outline-input').height())
      $(window).on('resize', function() {
        $('#talk').height($('.outline-input').height())
      })
      $("#talk").keypress(function (e) {
        if(e.which == 13) {
          var r = confirm("Are you sure?");
          if (r == true) {
            $.post(`${api_base}/post/day-log`, { data: $("#talk").val() })
            $("#talk").val('')
          }
        }
      });
    });
  },

  weather: function() {
    function init() {
      $.getJSON(`${api_base}/get/weather/${milo.state.latitude}/${milo.state.longitude}`, function(data) {
        $('#view-weather').removeClass('section-loading').addClass('section-ready').html('')
        $('#view-weather').load('templates/weather.html', function() {
          $('.weather-title').html(data.main.temp+'&deg')
          $('.weather-min').html('Min: '+data.main.temp_min+'&deg')
          $('.weather-max').html('Max: '+data.main.temp_max+'&deg')
          $('.weather-sub-title').html(data.weather[0].description)
        });
      });
    }
    setInterval(function() {
      init()
    },60000)
    init();
  },

  health: function() {
    function init() {
      var d = new Date();
      var year = d.getFullYear();
      var month = milo.util.addZero(d.getMonth() + 1);
      var day = milo.util.addZero(d.getUTCDate());
      $.getJSON(`${api_base}/get/health/${year}${month}${day}`, function(data) {
        var html = ''
        for(var i = 0; i < data[0]['summary'].length; i++) {
          if (data[0]['summary'][i]['activity'] == 'walking') {
            html += '<div class="well"><b>Steps Today</b><p>'+data[0]['summary'][i]['steps']+'</p></div>';
          }
          if (data[0]['summary'][i]['activity'] == 'transport') {
            html += '<div class="well"><b>Miles Driven</b><p>'+milo.util.get_miles(data[0]['summary'][i]['distance'])+'</p></div>';
          }
        }
        $('#view-health').removeClass('section-loading').addClass('section-ready').html('')
        $('#view-health').html(html)
      });
    }
    setInterval(function() {
      init()
    },60000)
    init();
  },

}
