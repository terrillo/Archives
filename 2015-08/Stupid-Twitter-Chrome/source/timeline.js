//document.getElementById('doc').style.display = 'none';

setInterval(function(e){
    // var showmore = document.querySelectorAll('.expand-stream-item')[0];
    var newtweets = document.querySelectorAll('.js-new-tweets-bar')[0];
    // if(showmore) {
    //     showmore.click();
    //     return false;
    // }
    if(newtweets && window.pageYOffset < 150) {
        newtweets.click();
        return false;
    }
}, 200);
