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

/*! ChattyKathy 1.0.1
 * ©2016 Elliott Beaty
 */

/**
 * @summary     ChattyKathy
 * @description Wrapper for Amazon's AWS Polly Javascript SDK
 * @version     1.0.1
 * @file        ChattyKathy.js
 * @author      Elliott Beaty
 * @contact     elliott@elliottbeaty.com
 * @copyright   Copyright 2016 Elliott Beaty
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 */

function ChattyKathy(settings) {

    settings = getValidatedSettings(settings);

    // Add audio node to html
    var elementId = "audioElement" + new Date().valueOf().toString();
    var audioElement = document.createElement('audio');
    audioElement.setAttribute("id", elementId);
    document.body.appendChild(audioElement);

    var isSpeaking = false;

    AWS.config.credentials = settings.awsCredentials;
    AWS.config.region = settings.awsRegion;

    var kathy = {
        self: this,
        playlist:[],
        // Speak
        Speak: function (msg) {
            if (isSpeaking) {
                this.playlist.push(msg);
            } else {
                say(msg).then(sayNext)
            }
        },

        // Quit speaking, clear playlist
        ShutUp: function(){
            shutUp();
        },
        // Speak & return promise
        SpeakWithPromise: function (msg) {
            return say(msg);
        },

        IsSpeaking: function () {
            return isSpeaking;
        },

        ForgetCachedSpeech: function () {
            localStorage.removeItem("chattyKathyDictionary");
        }

    }

    // Quit talking
    function shutUp() {
        audioElement.pause();
        playlist = [];
    }

    // Speak the message
    function say(message) {
        return new Promise(function (successCallback, errorCallback) {
            isSpeaking = true;
            getAudio(message)
                .then(playAudio)
                .then(successCallback);
        });
    }

    // Say next
    function sayNext() {
        var list = kathy.playlist;
        if (list.length > 0) {
            var msg = list[0];
            list.splice(0, 1);
            say(msg).then(sayNext);
        }
    }

    // Get Audio
    function getAudio(message) {
        if (settings.cacheSpeech === false || requestSpeechFromLocalCache(message) === null) {
            return requestSpeechFromAWS(message);
        } else {
            return requestSpeechFromLocalCache(message);
        }
    }

    // Make request to Amazon polly
    function requestSpeechFromAWS(message) {
        return new Promise(function (successCallback, errorCallback) {
            var polly = new AWS.Polly();
            var params = {
                OutputFormat: 'mp3',
                Text: message,
                VoiceId: settings.pollyVoiceId
            }
            polly.synthesizeSpeech(params, function (error, data) {
                if (error) {
                    errorCallback(error)
                } else {
                    saveSpeechToLocalCache(message, data.AudioStream);
                    successCallback(data.AudioStream);
                }
            });
        });
    }

    // Save to local cache
    function saveSpeechToLocalCache(message, audioStream) {
        var record = {
            Message: message,
            AudioStream: JSON.stringify(audioStream)
        };
        var localPlaylist = JSON.parse(localStorage.getItem("chattyKathyDictionary"));

        if (localPlaylist === null) {
            localPlaylist = [];
            localPlaylist.push(record);
        }else{
            localPlaylist.push(record);

        }
        localStorage.setItem("chattyKathyDictionary", JSON.stringify(localPlaylist));
    }

    // Check local cache for audio clip
    function requestSpeechFromLocalCache(message) {
        
        var audioDictionary = localStorage.getItem("chattyKathyDictionary");
        if (audioDictionary === null) {
            return null;
        }
        var audioStreamArray = JSON.parse(audioDictionary);
        var audioStream = audioStreamArray.filter(function (record) {
            
            return record.Message === message;
        })[0];;
       
        if (audioStream === null || typeof audioStream === 'undefined') {
            return null;
        } else {
            return new Promise(function (successCallback, errorCallback) {
                successCallback(JSON.parse(audioStream.AudioStream).data);
            });
        }
    }

    // Play audio
    function playAudio(audioStream) {
        return new Promise(function (success, error) {
            var uInt8Array = new Uint8Array(audioStream);
            var arrayBuffer = uInt8Array.buffer;
            var blob = new Blob([arrayBuffer]);

            var url = URL.createObjectURL(blob);
            audioElement.src = url;
            audioElement.addEventListener("ended", function () {
                isSpeaking = false;
                success();
            });
            audioElement.play();
        });
    }

    // Validate settings
    function getValidatedSettings(settings) {
        if (typeof settings === 'undefined') {
            throw "Settings must be provided to ChattyKathy's constructor";
        }
        if (typeof settings.awsCredentials === 'undefined') {
            throw "A valid AWS Credentials object must be provided";
        }
        if (typeof settings.awsRegion === 'undefined' || settings.awsRegion.length < 1) {
            throw "A valid AWS Region must be provided";
        }
        if (typeof settings.pollyVoiceId === 'undefined') {
            settings.pollyVoiceId = "Amy";
        }
        if (typeof settings.cacheSpeech === 'undefined') {
            settings.cacheSpeech === true;
        }
        return settings;
    }

    return kathy;
}







(function defineMustache(global,factory){if(typeof exports==="object"&&exports&&typeof exports.nodeName!=="string"){factory(exports)}else if(typeof define==="function"&&define.amd){define(["exports"],factory)}else{global.Mustache={};factory(global.Mustache)}})(this,function mustacheFactory(mustache){var objectToString=Object.prototype.toString;var isArray=Array.isArray||function isArrayPolyfill(object){return objectToString.call(object)==="[object Array]"};function isFunction(object){return typeof object==="function"}function typeStr(obj){return isArray(obj)?"array":typeof obj}function escapeRegExp(string){return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function hasProperty(obj,propName){return obj!=null&&typeof obj==="object"&&propName in obj}var regExpTest=RegExp.prototype.test;function testRegExp(re,string){return regExpTest.call(re,string)}var nonSpaceRe=/\S/;function isWhitespace(string){return!testRegExp(nonSpaceRe,string)}var entityMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};function escapeHtml(string){return String(string).replace(/[&<>"'`=\/]/g,function fromEntityMap(s){return entityMap[s]})}var whiteRe=/\s*/;var spaceRe=/\s+/;var equalsRe=/\s*=/;var curlyRe=/\s*\}/;var tagRe=/#|\^|\/|>|\{|&|=|!/;function parseTemplate(template,tags){if(!template)return[];var sections=[];var tokens=[];var spaces=[];var hasTag=false;var nonSpace=false;function stripSpace(){if(hasTag&&!nonSpace){while(spaces.length)delete tokens[spaces.pop()]}else{spaces=[]}hasTag=false;nonSpace=false}var openingTagRe,closingTagRe,closingCurlyRe;function compileTags(tagsToCompile){if(typeof tagsToCompile==="string")tagsToCompile=tagsToCompile.split(spaceRe,2);if(!isArray(tagsToCompile)||tagsToCompile.length!==2)throw new Error("Invalid tags: "+tagsToCompile);openingTagRe=new RegExp(escapeRegExp(tagsToCompile[0])+"\\s*");closingTagRe=new RegExp("\\s*"+escapeRegExp(tagsToCompile[1]));closingCurlyRe=new RegExp("\\s*"+escapeRegExp("}"+tagsToCompile[1]))}compileTags(tags||mustache.tags);var scanner=new Scanner(template);var start,type,value,chr,token,openSection;while(!scanner.eos()){start=scanner.pos;value=scanner.scanUntil(openingTagRe);if(value){for(var i=0,valueLength=value.length;i<valueLength;++i){chr=value.charAt(i);if(isWhitespace(chr)){spaces.push(tokens.length)}else{nonSpace=true}tokens.push(["text",chr,start,start+1]);start+=1;if(chr==="\n")stripSpace()}}if(!scanner.scan(openingTagRe))break;hasTag=true;type=scanner.scan(tagRe)||"name";scanner.scan(whiteRe);if(type==="="){value=scanner.scanUntil(equalsRe);scanner.scan(equalsRe);scanner.scanUntil(closingTagRe)}else if(type==="{"){value=scanner.scanUntil(closingCurlyRe);scanner.scan(curlyRe);scanner.scanUntil(closingTagRe);type="&"}else{value=scanner.scanUntil(closingTagRe)}if(!scanner.scan(closingTagRe))throw new Error("Unclosed tag at "+scanner.pos);token=[type,value,start,scanner.pos];tokens.push(token);if(type==="#"||type==="^"){sections.push(token)}else if(type==="/"){openSection=sections.pop();if(!openSection)throw new Error('Unopened section "'+value+'" at '+start);if(openSection[1]!==value)throw new Error('Unclosed section "'+openSection[1]+'" at '+start)}else if(type==="name"||type==="{"||type==="&"){nonSpace=true}else if(type==="="){compileTags(value)}}openSection=sections.pop();if(openSection)throw new Error('Unclosed section "'+openSection[1]+'" at '+scanner.pos);return nestTokens(squashTokens(tokens))}function squashTokens(tokens){var squashedTokens=[];var token,lastToken;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];if(token){if(token[0]==="text"&&lastToken&&lastToken[0]==="text"){lastToken[1]+=token[1];lastToken[3]=token[3]}else{squashedTokens.push(token);lastToken=token}}}return squashedTokens}function nestTokens(tokens){var nestedTokens=[];var collector=nestedTokens;var sections=[];var token,section;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];switch(token[0]){case"#":case"^":collector.push(token);sections.push(token);collector=token[4]=[];break;case"/":section=sections.pop();section[5]=token[2];collector=sections.length>0?sections[sections.length-1][4]:nestedTokens;break;default:collector.push(token)}}return nestedTokens}function Scanner(string){this.string=string;this.tail=string;this.pos=0}Scanner.prototype.eos=function eos(){return this.tail===""};Scanner.prototype.scan=function scan(re){var match=this.tail.match(re);if(!match||match.index!==0)return"";var string=match[0];this.tail=this.tail.substring(string.length);this.pos+=string.length;return string};Scanner.prototype.scanUntil=function scanUntil(re){var index=this.tail.search(re),match;switch(index){case-1:match=this.tail;this.tail="";break;case 0:match="";break;default:match=this.tail.substring(0,index);this.tail=this.tail.substring(index)}this.pos+=match.length;return match};function Context(view,parentContext){this.view=view;this.cache={".":this.view};this.parent=parentContext}Context.prototype.push=function push(view){return new Context(view,this)};Context.prototype.lookup=function lookup(name){var cache=this.cache;var value;if(cache.hasOwnProperty(name)){value=cache[name]}else{var context=this,names,index,lookupHit=false;while(context){if(name.indexOf(".")>0){value=context.view;names=name.split(".");index=0;while(value!=null&&index<names.length){if(index===names.length-1)lookupHit=hasProperty(value,names[index]);value=value[names[index++]]}}else{value=context.view[name];lookupHit=hasProperty(context.view,name)}if(lookupHit)break;context=context.parent}cache[name]=value}if(isFunction(value))value=value.call(this.view);return value};function Writer(){this.cache={}}Writer.prototype.clearCache=function clearCache(){this.cache={}};Writer.prototype.parse=function parse(template,tags){var cache=this.cache;var tokens=cache[template];if(tokens==null)tokens=cache[template]=parseTemplate(template,tags);return tokens};Writer.prototype.render=function render(template,view,partials){var tokens=this.parse(template);var context=view instanceof Context?view:new Context(view);return this.renderTokens(tokens,context,partials,template)};Writer.prototype.renderTokens=function renderTokens(tokens,context,partials,originalTemplate){var buffer="";var token,symbol,value;for(var i=0,numTokens=tokens.length;i<numTokens;++i){value=undefined;token=tokens[i];symbol=token[0];if(symbol==="#")value=this.renderSection(token,context,partials,originalTemplate);else if(symbol==="^")value=this.renderInverted(token,context,partials,originalTemplate);else if(symbol===">")value=this.renderPartial(token,context,partials,originalTemplate);else if(symbol==="&")value=this.unescapedValue(token,context);else if(symbol==="name")value=this.escapedValue(token,context);else if(symbol==="text")value=this.rawValue(token);if(value!==undefined)buffer+=value}return buffer};Writer.prototype.renderSection=function renderSection(token,context,partials,originalTemplate){var self=this;var buffer="";var value=context.lookup(token[1]);function subRender(template){return self.render(template,context,partials)}if(!value)return;if(isArray(value)){for(var j=0,valueLength=value.length;j<valueLength;++j){buffer+=this.renderTokens(token[4],context.push(value[j]),partials,originalTemplate)}}else if(typeof value==="object"||typeof value==="string"||typeof value==="number"){buffer+=this.renderTokens(token[4],context.push(value),partials,originalTemplate)}else if(isFunction(value)){if(typeof originalTemplate!=="string")throw new Error("Cannot use higher-order sections without the original template");value=value.call(context.view,originalTemplate.slice(token[3],token[5]),subRender);if(value!=null)buffer+=value}else{buffer+=this.renderTokens(token[4],context,partials,originalTemplate)}return buffer};Writer.prototype.renderInverted=function renderInverted(token,context,partials,originalTemplate){var value=context.lookup(token[1]);if(!value||isArray(value)&&value.length===0)return this.renderTokens(token[4],context,partials,originalTemplate)};Writer.prototype.renderPartial=function renderPartial(token,context,partials){if(!partials)return;var value=isFunction(partials)?partials(token[1]):partials[token[1]];if(value!=null)return this.renderTokens(this.parse(value),context,partials,value)};Writer.prototype.unescapedValue=function unescapedValue(token,context){var value=context.lookup(token[1]);if(value!=null)return value};Writer.prototype.escapedValue=function escapedValue(token,context){var value=context.lookup(token[1]);if(value!=null)return mustache.escape(value)};Writer.prototype.rawValue=function rawValue(token){return token[1]};mustache.name="mustache.js";mustache.version="2.3.0";mustache.tags=["{{","}}"];var defaultWriter=new Writer;mustache.clearCache=function clearCache(){return defaultWriter.clearCache()};mustache.parse=function parse(template,tags){return defaultWriter.parse(template,tags)};mustache.render=function render(template,view,partials){if(typeof template!=="string"){throw new TypeError('Invalid template! Template should be a "string" '+'but "'+typeStr(template)+'" was given as the first '+"argument for mustache#render(template, view, partials)")}return defaultWriter.render(template,view,partials)};mustache.to_html=function to_html(template,view,partials,send){var result=mustache.render(template,view,partials);if(isFunction(send)){send(result)}else{return result}};mustache.escape=escapeHtml;mustache.Scanner=Scanner;mustache.Context=Context;mustache.Writer=Writer;return mustache});
