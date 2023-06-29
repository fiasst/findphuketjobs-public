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
    pub.sanitizeHTML = (html) => {
            // Remove <script> tags and content.
        return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            // Remove attributes that start with "on" or "onclick".
            .replace(/(\s*<[^>]*)(\s+(on\w+|onclick)="[^"]*")/gi, '$1')
            // Remove instances of "javascript:".
            .replace(/javascript:/gi, '');
    }


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


    // Get/set querystring.
    pub.getSetQuerystring = (params = '', includePath) => {
        const urlObj = new URL(window.location.href);

        // Set params it's an Object.
        if (typeof(params) === "object") {
            $.each(params, function(key, value) {
                urlObj.searchParams.set(pub.stripHTML(key), pub.stripHTML(value));
            });
            // Return path and querystring or just the string.
            return includePath ? urlObj.pathname + urlObj.search : urlObj.search;
        }

        // Get value.
        return pub.stripHTML(urlObj.searchParams.get(params));
    };


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


    // Pluralize words based on provided Integer value (eg. "minute/minutes", "day/days").
    pub.pluralize = (count, single, plural) => `${count} ${count !== 1 ? plural || single+'s' : single}`;


    // Output a String describing how much time has past (eg. "minute/minutes ago", "day/days ago").
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
            return pub.pluralize(elapsed, 'minute');
        }
        else if (elapsed < msDay) {
            elapsed = Math.round(elapsed/msHr);
            return pub.pluralize(elapsed, 'hour');
        }
        else if (elapsed < msMonth) {
            elapsed = Math.round(elapsed/msDay);
            return pub.pluralize(elapsed, 'day');
        }
        else if (elapsed < msWeek) {
            elapsed = Math.round(elapsed/msWeek);
            return pub.pluralize(elapsed, 'week');
        }
        else if (elapsed < msYr) {
            elapsed = Math.round(elapsed/msMonth);
            return pub.pluralize(elapsed, 'month');
        }
        else {
            elapsed = Math.round(elapsed/msYr);
            return pub.pluralize(elapsed, 'year');
        }
    };


    // Check whether Object key exists
    pub.checkKeyExists = function(obj, keys){
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
            return nestedObject[functionName](...args);
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
    pub.getFormValues = function($form, type) {
        var formData = new FormData($form[0]),
            groupedArrays = {};
        
        // Re-build certain field's values.
        $($form).find(':input').each(function() {
            var $element = $(this),
                key = $element.attr('name'),
                value = $element.val();
            
            // Re-build multi-select values.
            if ($element.is('select[multiple]')){
                formData.set(key, $element.val());
            }
            // Re-build checkbox values for grouped elements.
            else if ($element.is(':checkbox:checked') && key.endsWith('[]')) {// Check if checkbox name ends with [].
                var elementName = key.slice(0, -2);// Remove [].
                if (!groupedArrays[elementName]) {
                    groupedArrays[elementName] = [];// Create array if not present.
                }
                groupedArrays[elementName].push(value);
                formData.delete(key);// Remove the individual entry.
            }
        });
        // Merge rebuilt groupedArrays into formData.
        for (elementName in groupedArrays) {
          formData.set(elementName, groupedArrays[elementName]);
        }

        // Metadata:
        //Member ID.
        // values.member_id = USER.current.id || null;
        formData.append("member_id", USER.current.id || null);

        // Add Environment details.
        // values.env = pub.getEnvType();
        formData.append("env", pub.getEnvType());
        // values.url = pub.getCurrentDomain();
        formData.append("url", pub.getCurrentDomain());

        // Add subbmitted date/time value.
        // values.submitted = pub.getISOdate();
        formData.append("submitted", pub.getISOdate());
        // values.submittedTimestamp = pub.getTimestamp();
        formData.append("submittedTimestamp", pub.getTimestamp());

console.log('formData', formData);

        // return values;
        if (type == 'formData') {
            return formData;
        }
        if (type == 'json') {
            return JSON.stringify(Object.fromEntries(formData));
        }
        return Object.fromEntries(formData);// JS Object.
    };


    pub.sendAJAX = function(options, form){
        params = $.extend({
            //url: "",// Required and must be provided.
            //data: {},// Required and must be provided.
            method: "POST",
            timeout: 60000,
            success: function(data, textStatus){
                console.log(textStatus, data);
                if (typeof params.callbackSuccess === "function") params.callbackSuccess(data);
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log(textStatus, errorThrown);
                if (typeof params.callbackError === "function") params.callbackError(textStatus, errorThrown);
                
                // Generic error message.
                var data = {
                    "mode": "dialog",
                    "message": "Sorry, something went wrong, please try again. if the problem continues, contact our team for help.",
                    "type": "error",
                    "enableForm": true,
                    "options": {
                        "title": "There was a problem...",
                        "overlayClose": false,
                        "actions": [
                            {
                                "type": "button",
                                "text": "OK",
                                "attributes": {
                                    "class": "button-primary trigger-lbox-close",
                                    "href": "#"
                                }
                            }
                        ]
                    }
                };
                if (pub.checkKeyExists(window.jQuery, "litbox")) {
                    MAIN.handleAjaxResponse(data, form || false);
                }
                else {
                    alert(data.message);
                }
            }
        }, options);
        $.ajax(params);
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


    pub.formatDDMMYYYY = (value, divider = ' / ') => {
        var val = value.replace(/[^\d]/g, ''),// Remove non-digit characters
            format = '',
            day = val.slice(0, 2),
            month = val.slice(2, 4),
            year = val.slice(4, 8);

        if (day) {
            format += day;
            if (day.length === 2) format += divider;
        }
        if (month) {
            format += month;
            if (month.length === 2) format += divider;
        }
        if (year) format += year;
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

