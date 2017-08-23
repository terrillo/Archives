var milo_util = {
  addZero: function(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  },

  dayofWeek: function() {
    var d = new Date();
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    return weekday[d.getDay()];
  },

  guid: function() {
    function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  },

  logit: function(key, value) {
    milo.log.push({a: key, b: value})
  },

  get_miles: function(meters) {
    return (meters*0.000621371192).toFixed(1);
  },

}
