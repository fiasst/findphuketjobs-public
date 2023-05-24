/*
* functions that help other functions to do their thing.
*/

var USER = {},
    MAIN = {},
    ADD_JOB = {},

HELP = (function($, window, document, undefined){
    var pub = {};

    pub.timezone = "Asia/Bangkok";

    pub.breakpoints = {
        //mobileLandscapeBP: 478,
        tabletBP: 767,
        tabletLandscapeBP: 991,
        desktopBP: 1247
    };


    pub.cleanLowerString = function(string){
        return $.trim(string.toLowerCase());
    };


    pub.stripHTML = function(str){
        return $("<div/>").html(str).text();
    }


    // Remove <script> tags and any attributes that start with 'on' (onclick, etc).
    // This helps to guards against XSS attack.
    pub.sanitizeHTML = html => {
      return $.each($($.parseHTML(html, document)), function(i, el) {
        $.each(this.attributes, function(i, attrib) {
          if (attrib.name.indexOf('on') === 0) $(el).removeAttr(attrib.name);
        });
      });
    };


    pub.getEnvType = function(){
        return location.hostname.indexOf('webflow') > -1 ? 'dev' : 'live';
    };


    pub.getCurrentDomain = function(){
        return window.location.origin;
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
    pub.formatTimestamp = function(timestamp, showTime, localTimezone){
        var date = new Date(timestamp),
            locale = pub.getCurrentLang(),
            options = {
                //weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
        if (localTimezone){
            // Convert to localtime if it's not already converted.
            options.timeZone = pub.timezone;
        }
        if (showTime){
            $.extend(options, {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        if (typeof timestamp == "string"){
            // Convert to a timestamp.
            timestamp = date.getTime();
        }
        if (timestamp.toString().length < 11){
            date.setTime(timestamp * 1000);
        }
        return date.toLocaleDateString(locale, options);
    };


    pub.getTimestamp = function(dateString, localTimezone){
        if (dateString){
            return new Date(dateString).getTime();
        }
        var date = new Date(),
            options = {};

        if (localTimezone){
            options.timeZone = pub.timezone;
        }
        date = date.toLocaleString(pub.getCurrentLang(), options);

        return new Date(date).getTime();
    };
    

    pub.getISOdate = function(dateString, localTimezone){
        var date = pub.getTimestamp(dateString, localTimezone);
        return new Date(date).toISOString();
    };


    // Function to pluralize the time past (eg. "minute/minutes ago", "day/days ago").
    pub.pluralize = (count, noun, suffix = 's') => `${count} ${noun}${ count !== 1 ? suffix : ''}`;
    pub.timePast = (date) => {
        const msMin = 60 * 1000, msHr = msMin * 60, msDay = msHr * 24, msWeek = msDay * 7, msMonth = msDay * 30, msYr = msDay * 365;
        var curr = pub.getTimestamp(false, true),// Converted to local timezone.
            date = pub.getTimestamp(date),
            elapsed = curr - date;

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


    // Check whether Object key exists
    /*pub.checkKeyExists = function(obj, key) {
        // return typeof obj === "object" && (obj.hasOwnProperty(key) || key in obj);
        return typeof obj === "object" && key in obj;
    };*/

    /*pub.checkKeyExists = function(obj, keys) {
      // if (!obj || typeof obj !== 'object') || !keys) return false;
      if (!obj || typeof obj !== 'object') return false;
      keys = typeof keys === 'string' ? keys.split('.') : keys;
      if (keys.length === 0) return true;
      var currentKey = keys.shift();
      // return obj.hasOwnProperty(currentKey) && pub.checkKeyExists(obj[currentKey], keys);
      return currentKey in obj && pub.checkKeyExists(obj[currentKey], keys);
    };*/

    /*pub.checkKeyExists = function(obj, keys){
        if (!obj || typeof obj !== 'object') return false;
        keys = typeof keys === 'string' ? keys.split('.') : keys;
        return keys.length === 0 || (obj.hasOwnProperty(keys[0]) && pub.checkKeyExists(obj[keys.shift()], keys));
    };*/

    /*pub.checkKeyExists = function(obj, keys){
        if (!obj || typeof obj !== 'object') return false;
        keys = typeof keys === 'string' ? keys.split('.') : keys;
        return keys.length === 0 || (keys[0] in obj && pub.checkKeyExists(obj[keys.shift()], keys));
    };*/
    /*pub.checkKeyExists = function(obj, keys){
        if (!obj || typeof obj !== 'object' && typeof obj !== 'function') return false;
        keys = typeof keys === 'string' ? keys.split('.') : keys;
        if (keys.length === 0) return true;
        return pub.checkKeyExists(obj[ keys.shift() ], keys);
    };*/
    pub.checkKeyExists = function(obj, keys){
        // if (typeof obj !== 'object' && typeof obj !== 'function' && typeof obj !== 'string') return false;
        // If  obj is falsy.
        if (!(!!obj)) return false;
        keys = typeof keys === 'string' ? keys.split('.') : keys;
        if (keys.length === 0) return true;
        return pub.checkKeyExists(obj[ keys.shift() ], keys);
    };


    pub.callNestedFunction = function(string, ...args){
        // Extracting the function name from the string.
        var path = string.split("."),
            functionName = path.pop(),
            nestedObject = window;// Assuming the top-level object is the global scope.
        
        // Traversing the object hierarchy to access the function.
        for (var i = 0; i < path.length; i++){
            nestedObject = nestedObject[path[i]];
        }
        if (typeof nestedObject[functionName] === 'function'){
            // Calling the function dynamically.
            nestedObject[functionName](...args);
        }
        else {
            console.error('Function not found:', string);
        }
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
        values.member_id = USER.current.id || null;

        // Add Environment details.
        values.env = pub.getEnvType();
        values.url = pub.getCurrentDomain();

        // Add subbmitted date/time value.
        values.submitted = pub.getISOdate();
        values.submittedTimestamp = pub.getTimestamp();

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
                if (typeof params.success === "function") params.success(data);
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log(textStatus, errorThrown);
                if (typeof params.error === "function") params.error([textStatus, errorThrown]);
            }
        });
    };


    pub.parseIfStringJSON = function(str) {
        if (typeof str === 'string') {
            str = str.trim();
            if (str[0] == '{' && str[str.length - 1] == '}') {
                return JSON.parse(str);
            }
        }
        return str;
    };


    pub.formatDDMMYYYY = (inputValue, divider = ' / ') => {
        var val = inputValue.replace(/[^\d]/g, ''),// Remove non-digit characters
            format = '',
            day = val.slice(0, 2),
            month = val.slice(2, 4),
            year = val.slice(4, 8);

        if (day) {
            format += day;
            
            if (day.length === 2) {
                format += divider;
            }
        }
        if (month) {
            format += month;
            
            if (month.length === 2) {
                format += divider;
            }
        }
        if (year) {
            format += year;
        }
        return format;
    }


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
            cookies = document.cookie.split(';');
        
        for (var i = 0; i < cookies.length; i++){
            var cookie = cookies[i].trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return pub.parseIfStringJSON(cookie.substring(nameEQ.length));
            }
        }
        return null;
    };
    pub.deleteCookie = function(name){
        document.cookie = name+'=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/';
    };
    

    // On DOM ready.
    // $(function(){});

    
    return pub;
}(jQuery, this, this.document));

