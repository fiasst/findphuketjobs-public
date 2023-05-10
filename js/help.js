/*
* functions that help other functions to do their thing.
*/

var HELP = (function($, window, document, undefined){
    var pub = {};
        // ua = navigator.userAgent;


    // pub.isTouchDevice = ('ontouchstart' in document.documentElement);
    // pub.isiPad = (ua.match(/iPad/i) !== null);
    // pub.isiPhone = (navigator.platform.indexOf('iPhone') !== -1) || (navigator.platform.indexOf('iPod') !== -1);
    // pub.isAndroid = (ua.indexOf('Android') !== -1);


    pub.breakpoints = {
        //mobileLandscapeBP: 478,
        tabletBP: 767,
        tabletLandscapeBP: 991,
        desktopBP: 1247
    };


    pub.cleanLowerString = function(string){
        return $.trim(string.toLowerCase());
    };


    pub.getEnvType = function(){
        return (location.hostname.indexOf('webflow') > -1) ? 'dev' : 'live';
    };


    pub.getCurrentLang = function(){
        return pub.checkKeyExists(window, "Weglot") ? Weglot.getCurrentLang() : 'en';
    };


    // Format money.
    pub.formatCurrency = function(amount){
        return parseFloat(amount, 10).toFixed(2).toString();
    };


    // Get $£€ etc symbols.
    pub.getCurrencySymbol = (locale, currency) => (0).toLocaleString(locale, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\d/g, '').trim();


    // Return human-friendly date.
    pub.formatTimestamp = function(timestamp){
        var date = new Date(timestamp),
            locale = pub.getCurrentLang(),
            options = {
            //weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        if (typeof timestamp == "string"){
            // Convert to a timestamp.
            timestamp = date.getTime();
        }
        if (timestamp.toString().length < 11){
            date.setTime(timestamp * 1000);
        }
        //return date.toDateString();
        return date.toLocaleDateString(locale, options);
    };


    pub.getTimestamp = function(dateString){
      if (dateString){
        return new Date(dateString).getTime();
      }
      var date = new Date();
      date = date.setDate(date.getDate());
      return new Date(date).getTime();
    };
    

    pub.getISOdate = function(dateString){
        var date = pub.getTimestamp(dateString);
        return new Date(date).toISOString();
    };



    // Check whether Object key exists
    pub.checkKeyExists = function(obj, key) {
        return obj != null && (obj.hasOwnProperty(key) || (typeof obj === "object" && key in obj));
    };


    pub.waitFor = function(key, value, timer, callback){
        var nTimer = setInterval(function(){
            // wait for something to load...
            if (pub.checkKeyExists(key, value)){
                callback();
                clearInterval(nTimer);
            }
        }, timer);
    };


    // Check if member has permissions.
    pub.hasPermissions = function(permissions, member){
        return $.inArray(permissions, member.permissions) > -1;
    };


    // get form values as a key-value Object
    pub.getFormValues = function(form) {
        var formData = new FormData(form[0]),
            values = Object.fromEntries(formData);
console.log([formData, values]);
        // Re-build multi-select field values.
        $.each(values, function(key, value){
            var element = $(form).find(':input[name="'+key+'"]');

            if (element.is('select[multiple]')){
                values[key] = element.val();
            }
        });

        // Metadata:
        //Member ID.
        values.member_id = window.MSmember.id || null;

        // Add Environment details.
        values.env = pub.getEnvType();

        // Add subbmitted date/time value.
        values.submitted = pub.getISOdate();

        return values;
    };


    pub.sendAJAX = function(obj){
        var params = $.extend({
            //url: "",
            method: "POST",
            //data: {},
            timeout: 60000,
            success: false,
            error: false
        }, obj);

        $.ajax({
            url: params.url,
            method: params.method,
            data: params.data,
            // processData: false,
            // contentType: false,
            timeout: params.timeout,
            success: function(data, textStatus){
                console.log(textStatus, data);
                if ($.isFunction(params.success)) params.success(data);
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log(textStatus, errorThrown);
                if ($.isFunction(params.error)) params.error([textStatus, errorThrown]);
            }
        });
    };


    // Function to pluralize the time past (eg. "minute/minutes ago", "day/days ago").
    pub.pluralize = (count, noun, suffix = 's') => `${count} ${noun}${count !== 1 ? suffix : ''}`;
    pub.timePast = (date) => {
        const msMin = 60 * 1000, msHr = msMin * 60, msDay = msHr * 24, msWeek = msDay * 7, msMonth = msDay * 30, msYr = msDay * 365;
        let curr = pub.getTimestamp();

        let elapsed = curr - pub.getTimestamp(date);

        if (elapsed < msMin) {
            return pub.pluralize(Math.round(elapsed/1000), 'second');
        }
        else if (elapsed < msHr) {
            elapsed = Math.round(elapsed/msMin);
            return pub.pluralize(elapsed, 'minute') 
        }
        else if (elapsed < msDay) {
            elapsed = Math.round(elapsed/msHr);
            return pub.pluralize(elapsed, 'hour')
        }
        else if (elapsed < msMonth) {
            elapsed = Math.round(elapsed/msDay);
            return pub.pluralize(elapsed, 'day') 
        }
        else if (elapsed < msWeek) {
            elapsed = Math.round(elapsed/msWeek);
            return pub.pluralize(elapsed, 'week') 
        }
        else if (elapsed < msYr) {
            elapsed = Math.round(elapsed/msMonth);
            return pub.pluralize(elapsed, 'month') 
        }
        else {
            elapsed = Math.round(elapsed/msYr);
            return pub.pluralize(elapsed, 'year') 
        }
    };


    // get the current Member then fire callback function.
    pub.getCurrentMember = function(callback) {
        if (pub.checkKeyExists(window, 'MSmember')){
            return window.MSmember;
        }
        pub.waitFor(window, "$memberstackDom", 100, function(){
            window.$memberstackDom.getCurrentMember().then(({ data: member }) => {
                if (!!callback) {
                    var output = member || {};
                    window.MSmember = output;
                    callback(output);
                }
                else {
                    return output;
                }
            });
        });
    };
    

    // get Member's JSON then fire callback function.
    pub.getMemberJSON = function(callback) {
        pub.waitFor(window, "$memberstackDom", 100, function(){
            window.$memberstackDom.getMemberJSON().then(({ data: memberJSON }) => {
                if (!!callback) {
                    var output = memberJSON || {};
                    callback(output);
                }
            });
        });
    };


    // update Member's JSON.
    pub.updateMemberJSON = function(json, callback) {
        pub.waitFor(window, "$memberstackDom", 100, function(){
            window.$memberstackDom.updateMemberJSON({ json: json }).then(({ data: memberJSON }) => {
                if (!!callback) {
                    var output = memberJSON || {};
                    callback(output);
                }
            });
        });
    };


    pub.getMemberPlans = function(planType, member) {
        member = member || pub.getCurrentMember();

        if (pub.checkKeyExists(member, 'planConnections') && !!member.planConnections.length){
            // Get active plans.
            var plans = $.map(member.planConnections, function(item, i){
                if (item.status == "ACTIVE"){
                    return item.type.toLowerCase();
                }
            });
            // Check if a plan type exists for member.
            if (planType){
                // Is planType in the user's plans.
                return $.inArray(planType, plans) > -1;
            }
            // Return all active user plans.
            return plans;
        }
        return planType ? false : [];
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
    

    // Init.
    // $(function(){});

    
    return pub;
}(jQuery, this, this.document));

