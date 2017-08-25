var milo_index = {
  // aws: new AWS.Credentials("AKIAIL4E3BQSHHVSGIUA", "ASPA0OIcRJwKFqZ8+L+Fph6bFr9ciQameP5Lkhb0"),
  pusher_key: '8d3fc613b05497aba2f3',
  state: {
    audio: false,
    device: null,
  },
  status: {},
  log: [],
  views: milo_views,
  util: milo_util,
  data: milo_data,

  init: function() {
    milo.views.now()
    milo.ux()
  },

  ux: function() {
    if ($(window).width() < 600) {
    }
  },

  ready: function() {
    milo.locate()
    milo.data.stats()
    milo.data.health()
  },

  locate: function() {
    navigator.geolocation.getCurrentPosition(success, error);
    function success(position) {
      milo.state.latitude = position.coords.latitude
      milo.state.longitude = position.coords.longitude
      milo.util.logit('Latitude', position.coords.latitude)
      milo.util.logit('Longitude', position.coords.longitude)
      milo.data.weather()
    }
    function error() {}
  }
}

api_base = 'https://miloai.com:3000'
if (window.location.hostname == 'localhost') {
  api_base = 'http://localhost:3000'
}

var milo = Object.assign({}, milo_index);
// milo.util = milo_util;
// milo.data = milo_data;
// milo.events = milo_events;
// milo.views = milo_views;

$(document).ready(function() {
  milo.init();
})
