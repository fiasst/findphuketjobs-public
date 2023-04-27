/*
* functions that help other functions to do their thing.
*/

const HELP = (function($, window, document, undefined){
    var pub = {};


    pub.breakpoints = {
        //mobileLandscapeBP: 478,
        tabletBP: 767,
        tabletLandscapeBP: 991,
        desktopBP: 1247
    };


    //wait for event to finish, example browser window to stop being resized
    pub.onEventFinish = (function(callback, ms, uniqueId){
        var timers = {};
        
        return function(callback, ms, uniqueId){
            if (!uniqueId){
                uniqueId = "Don't call this twice without a uniqueId";
            }
            if (timers[uniqueId]){
                clearTimeout(timers[uniqueId]);
            }
            timers[uniqueId] = setTimeout(callback, ms);
        };
    }());


    // Add breakpoint helper classes to body on init & window resize
    pub.bodyBreakpoints = function(){
        var windowWidth = $(window).width(),
            bodyClass = false;

        if (windowWidth < HELP.breakpoints.tabletBP){
            bodyClass = 'bp-mobile';
        }
        else {
            if (windowWidth >= HELP.breakpoints.desktopBP){
                bodyClass = 'bp-desktop';
            }
            else if (windowWidth >= HELP.breakpoints.tabletLandscapeBP){
                bodyClass = 'bp-tabletLandscape';
            }
            else if (windowWidth >= HELP.breakpoints.tabletBP){
                bodyClass = 'bp-tablet';
            }
        }
        if (bodyClass !== false){
            body.removeClass('bp-mobile bp-tablet bp-tabletLandscape bp-desktop').addClass(bodyClass);
        }
    };


    // Return a current breakpoint string based on body classes.
    pub.viewportWidth = function(){
        var classes = $('body').attr('class');

        if (classes.indexOf('mobile-bp') > -1){
            return 's';
        }
        else if (classes.indexOf('tablet-bp') > -1){
            return 'm';
        }
        else if (classes.indexOf('tabletLandscape-bp') > -1 || classes.indexOf('desktop-bp') > -1){
            return 'l';
        }
        else {
            return false;
        }
    };


    // Manage cookies.
    pub.setCookie = function(name, value, days){
        var expires = "";
        
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    };
    pub.getCookie = function(name){
        var nameEQ = name + "=",
            ca = document.cookie.split(';');
        
        for (var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    };
    pub.deleteCookie = function(name){
        document.cookie = name+'=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/';
    };
    
    
    return pub;
}(jQuery, this, this.document));

