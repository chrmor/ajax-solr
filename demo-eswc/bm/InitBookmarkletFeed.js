(function() {
    
    var f = 'http://feed.thepund.it/?b=',
        u = '';

    if (u !== ''){
        window.open(f + location.href + '&conf=' + u);
    } else{
        window.open(f+location.href);
    }

})();