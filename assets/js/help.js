///
// functions that help other functions to do their thing.
//
var USER = {},
    MAIN = {},
    ADD_JOB = {},

HELP = (function($, window, document, undefined) {
    var pub = {
        breakpoints: {
            mobile: 479,
            mobileWide: 767,
            tablet: 991,
            desktop: 1439
            // desktopWide: 1919
        }
    };

    
    //
    //
    //
    pub.timezone = "Asia/Bangkok";


    //
    //
    //
    pub.cleanLowerString = (str = '') => $.trim(str.toLowerCase());


    //
    // Remove zero-width characters and then trim.
        // Useful for textarea values that can add &zwj; to their value.
    //
    pub.zeroTrim = (str = '') => str.replace(/&zwj;/gi, '').replace('<p><br></p>', '').trim();


    //
    //
    //
    pub.removeNonNumeric = (str = '') => str.toString().replace(/\D/g, '');


    //
    // Get keyboard key from event Object.
    //
    pub.getKey = (e) => {
        if (e.key) return e.key;
        return String.fromCharCode(e.which || e.keyCode);
    };


    //
    // Check keyboard key events for common acceptable inputs.
      // Useful when you're preventing all characters except numerics
      // in a form field, for example.
    //
    pub.allowCommonKeyPress = (e, key) => {
        if (!key) return false;
        let allowedKeys = ['Backspace', 'Delete', 'Tab'];
        // Allow formatting/navigation keys.
        if (allowedKeys.indexOf(key) > -1 || key.indexOf('Arrow') === 0) {
            return true;
        }
        // Allow Copy+Paste/Select All combos.
        return (e.metaKey || e.ctrlKey) && ['c', 'v', 'a', 'x'].indexOf(key) > -1;
    };


    //
    // Add a HTTP protocol to a URL String, if it's missing.
    //
    pub.addHttpProtocol = (url = '', protocol = 'http://') => {
        // If the URL doesn't start with a protocol, add one.
        return (!/^https?:\/\//i.test(url)) ? protocol + url.replace(/^.*?\/\/|^.+?\//, '') : url;
    };


    //
    // Remove <script> tags and any attributes that start with 'on' (onclick, etc).
        // This helps to guards against XSS attack.
    // @Params:
    // escapeChars: Won't escape certain HTML such as & (to &amp;) when set to false.
        // This is less secure but useful and necessary for certain cases.
    //
    pub.sanitizeHTML = (str, allowedTags, escapeChars = true) => {
        if (!str) return;

        const escapeCharacters = {
            '&': '&amp;', '<': '&lt;', '>': '&gt;'
        };
        if (allowedTags) {
            var regex = new RegExp(`<((?!\/?(${allowedTags})\\b)[^>]+)>`, 'gi');
            // Remove all HTML except a few allowed tags.
            str = str.replace(regex, '')
                // Remove "src" from any allowed HTML.
                .replace(/src/gi, '');
        }
        else {
            if (escapeChars) {
                // Escape certain HTML characters.
                // (Match & if not followed by (apos|quot|gt/lt|amp);)
                str = str.replace(/[<>]|&(?!(?:apos|quot|[gl]t|amp);)/gi, match => escapeCharacters[match]);
                // All combinations of the character "<" in HTML/JS (semicolon optional):
            }
            str = str.replace(/(\x3c:?|\u003c:?)|(?:&(amp;)?#0*60;?|&(amp;)?#x0*3c;?):?/gi, '');
        }
        str = str.toString()
            // Remove <script> tags and content.
            // Remove ".constructor" to prevent ES6 Set.constructor() from eval() things.
            // Remove "document.cookie" to prevent session hijacking.
            .replace(/<.*?script.*?>|.constructor|document.cookie|document.domain/gi, '')
            // Remove substrings that start with "on" (event attributes. ex: "onclick").
            .replace(/<[^>]*\s+[^>]*on\w+[^>]*>/gi, '')
            // Remove instances of "javascript:", "script:" (for "ascript:") or &{ (for "& JS includes").
            .replace(/javascript.*?:|script.*?:|&{/gi, '')
            // Remove "script:" decimal HTML Characters (&#0000099 or &#99. semicolon optional).
            .replace(/&#0*115;?|&#0*99;?|&#0*114;?|&#0*105;?|&#0*112;?|&#0*116;?|&#0*58;?/g, '')
            // Remove "script:" Hexadecimal HTML Characters (&#x0000073 or &#x73. semicolon optional).
            .replace(/&#x0*73;?|&#x0*63;?|&#x0*72;?|&#x0*69;?|&#x0*70;?|&#x0*74;?|&#x0*3A;?/gi, '');
        
        return str;
    };


    //
    // Remove unnecessary/unsafe HTML attributes from Object of key|value pairs.
    //
    pub.sanitizeAttrs = (attrs = {}) => {
        const allowedAttrs = ['id', 'class', 'href', 'data-ms-action'];

        for (var key in attrs) {
            if (!allowedAttrs.includes(key)) delete attrs[key];
        }
        return attrs;
    };


    //
    // Convert basic token tags such as [p class="foo"]bar[/p] to HTML.
    //
    pub.tokenHTML = (str) => {
        if (!str) return;
        str = pub.sanitizeHTML(str);

        // Allowed tags: p, strong, em, a, div, h[1-6], span
        return str
            // replace [] tags with <>.
            .replace(/\[(\/?(?:p|strong|em|a|div|h[1-6]|span)(?:\s+[^[\]]+)?)]/gi, (match, tag) => {
                var tag = tag.toLowerCase(),
                    openTag = tag.startsWith('/') ? `</${tag.slice(1)}` : '<'+ tag;
                return openTag.endsWith(']') ? openTag.slice(0, -1) +'>' : openTag +'>';
            })
            // Remove substrings that start with "on" (event attributes. ex: "onclick").
            .replace(/on\w{2,}=/gi, '');
    };


    //
    //
    //
    pub.stripHTML = function(str) {
        if (!str) return;

        return str
            // Try to strip any broken HTML.
            .replace(/<\s*\/?\s*([a-zA-Z0-9]+)\s*>/g, '')
            // Strip HTML.
            .replace(/<[^>]*>/g, '');
    };


    //
    // Strip HTML but include line-breaks for block-level elements and <BR> tags.
        // This is useful for textarea formatting.
    //
    pub.stripHTMLWithLinebreaks = function(str) {
        // Replace <br> tags with newline characters.
        str = str.replace(/<br\s*\/?>/gi, '\n');
        // Replace block-level tags with newline characters.
        str = str.replace(/<(?:div|p|blockquote|h[1-6]|table|ul|ol)[^>]*>/gi, '\n');
        // Sanitize a remove remaining HTML tags and trim whitespace.
        return $('<div>').html(str).text().trim();
    };


    //
    //
    //
    pub.getEnvType = function() {
        return location.hostname.indexOf('webflow') > -1 ? 'test' : 'live';
    };


    //
    //
    //
    pub.getCurrentDomain = function() {
        return window.location.origin;
    };


    //
    // Format money.
    //
    pub.formatCurrency = function(amount) {
        return parseFloat(amount, 10).toFixed(2).toString();
    };


    //
    // Get $£€ etc symbols.
    //
    pub.getCurrencySymbol = (locale, currency) => {
        return (0).toLocaleString(locale, {
            style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0
        }).replace(/\d/g, '').trim();
    };


    //
    // Get/set querystring.
    //
    // "url": Provide the current URL or link href to update an existing querystring.
    pub.getSetQuerystring = (params = '', type = 'relative', url = window.location.href) => {
        // "url" param must be absolute or it will error.
        url = url.indexOf('://') < 0 ? window.location.origin + url : url;
        let urlObj = new URL(url);

        // Set params.
        if (typeof params === "object") {
            // Iterate through new parameters and append them to the existing ones.
            for (let [key, value] of Object.entries(params)) {
                let sanitizedKey = pub.sanitizeHTML(key),
                    sanitizedValue = pub.sanitizeHTML(value);
                
                // Append the new key-value pair to the existing query parameters.
                urlObj.searchParams.append(sanitizedKey, sanitizedValue);
            }
            // Return an absolute URL, relative URI + querystring or just qstring.
            switch (type) {
                case 'absolute':
                    return urlObj.origin + urlObj.pathname + urlObj.search;
                case 'relative':
                    return urlObj.pathname + urlObj.search;
                case 'query':
                    return urlObj.search;
            }
        }
        // Get value.
        return pub.sanitizeHTML(urlObj.searchParams.get(params.toString()));
    };


    //
    // Return human-friendly date.
    //
    pub.formatTimestamp = function(timestamp, showTime, localTimezone) {
        if (!timestamp) return;

        var date = new Date(timestamp),
            locale = LANG.currentLang(),
            options = {
                //weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
        if (localTimezone) {
            // Convert to localtime if it's not already converted.
            options.timeZone = pub.timezone;
        }
        if (showTime) {
            $.extend(options, {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        if (typeof timestamp == "string") {
            // Convert to a timestamp.
            timestamp = date.getTime();
        }
        if (timestamp.toString().length < 11) {
            date.setTime(timestamp * 1000);
        }
        return date.toLocaleDateString(locale, options);
    };


    //
    // Convert a date-time String into a Timestamp.
    //
    // Expected dateString parts order to be: "DD-MM-YYYY HH:MM:SS".
        // Unless "usaFormat" is TRUE, then it's: "MM-DD-YYYY HH:MM:SS".
    // Date can be separated by / - or spaces.
    // Ex: dateString = "23/08/2023, 04:53:34";
    //
    pub.getTimestamp = (dateString, localTimezone, usaFormat) => {
        let date = new Date(),
            lang = localTimezone ? LANG.currentLang() : LANG.defaultLang,
            options = {};

        if (localTimezone) {
            options.timeZone = pub.timezone;
        }

        if (dateString) {
            let lastSpaceIndex = dateString.lastIndexOf(" "),
                dateStr = dateString.substring(0, lastSpaceIndex),
                timeStr = dateString.substring(lastSpaceIndex + 1),
                dateParts = dateStr.replace(/[-\/\s]/g, "||").split('||'),
                monthIndex = usaFormat ? 0 : 1;

            // Convert month. Ex: from 08 to "Aug" (short names).
            date.setMonth(dateParts[monthIndex] - 1);
            options.month = 'short';
            dateParts[monthIndex] = date.toLocaleString(lang, options);

            // Rebuild as: 23 Aug 2023 04:53:34.
            // May still contain a comma but thats ok.
            dateString = dateParts.join(' ') +` ${timeStr} GMT`;
        }
        else {
            // Use the current date/time.
            dateString = new Date().toLocaleString(lang);
        }

        // Replace options but keep (optional) "timeZone".
        $.extend(options, {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true
        });
        // date = new Date(Date.parse(dateString)).toLocaleString(lang, options);
        let daylightSaving = localTimezone ? 0 : date.getTimezoneOffset()*60*1000;
        date = new Date(Date.parse(dateString) + daylightSaving).toLocaleString(lang, options);
        return Date.parse(date);
    };
    

    //
    // Convert a timestamp into an ISO date format (ex: 2023-08-23T04:53:34.000Z)
    //
    pub.getISOdate = (dateString, localTimezone) => {
        var date = pub.getTimestamp(dateString, localTimezone);
        return new Date(date).toISOString();
    };


    //
    // Pluralize words based on provided Integer value (eg. "minute/minutes", "day/days").
    //
    pub.pluralize = (count, single, plural) => `${count} ${count !== 1 ? plural || single+'s' : single}`;


    //
    // Output a String describing how much time has past (eg. "minute/minutes ago", "day/days ago").
    //
    pub.timePast = (date, suffix = 'ago') => {
        const msMin = 60 * 1000, msHr = msMin * 60, msDay = msHr * 24, msWeek = msDay * 7, msMonth = msDay * 30, msYr = msDay * 365;
        var curr = pub.getTimestamp(false, true),// Converted to local timezone.
            date = pub.getTimestamp(date, false, true),// Supplied HTML dateString (in US format so Finsweet date sorting works correctly).
            elapsed = curr - date,
            output;

        if (elapsed < msMin) {
            // output = pub.pluralize(Math.round(elapsed/1000), 'second');
            output = {elapsed: 0, string: 'minutes'};
        }
        else if (elapsed < msHr) {
            // output = pub.pluralize(Math.round(elapsed/msMin), 'minute');
            output = {elapsed: Math.round(elapsed/msMin), string: 'minute'};
        }
        else if (elapsed < msDay) {
            // output = pub.pluralize(Math.round(elapsed/msHr), 'hour');
            output = {elapsed: Math.round(elapsed/msHr), string: 'hour'};
        }
        else if (elapsed < msMonth) {
            // output = pub.pluralize(Math.round(elapsed/msDay), 'day');
            output = {elapsed: Math.round(elapsed/msDay), string: 'day'};
        }
        else if (elapsed < msWeek) {
            // output = pub.pluralize(Math.round(elapsed/msWeek), 'week');
            output = {elapsed: Math.round(elapsed/msWeek), string: 'week'};
        }
        else if (elapsed < msYr) {
            // output = pub.pluralize(Math.round(elapsed/msMonth), 'month');
            output = {elapsed: Math.round(elapsed/msMonth), string: 'month'};
        }
        else {
            // output = pub.pluralize(Math.round(elapsed/msYr), 'year');
            output = {elapsed: Math.round(elapsed/msYr), string: 'year'};
        }
        if (output.elapsed) {
            let period = pub.pluralize(output.elapsed, output.string);
            return `${period} ${suffix}`;
        }
        return '';
    };


    //
    // Check whether Object key exists
    //
    pub.checkKeyExists = function(obj, keys) {
        // If obj is falsy.
        if (!(!!obj)) return false;
        keys = typeof keys === 'string' ? keys.split('.') : keys;
        if (keys.length === 0) return true;
        return pub.checkKeyExists(obj[ keys.shift() ], keys);
    };

    
    //
    // Get a value from a flat or deep (nested) Object.
    //
    pub.getProperty = function(obj, key) {
        let keys = key.split('.'),
            value = obj;

        for (let i = 0; i < keys.length; i++) {
            value = value[keys[i]];

            if (value === undefined || value === null) return null;
        }
        return value;
    };


    //
    //
    //
    pub.callNestedFunction = function(string, ...args) {
        var path = string.split("."),
            functionName = path.pop(),// Extracting the function name from the string.
            nestedObject = pub.getProperty(window, path.join("."));// Assuming the top-level object is the global scope.

        if (nestedObject && typeof nestedObject[functionName] === 'function') {
            // Calling the function dynamically.
            return nestedObject[functionName](...args);
        }
        else {
            console.error('Function not found:', string);
        }
    };


    //
    //
    //
    pub.waitFor = function(key, value, timer, callback) {
        var nTimer = setInterval(function() {
            // wait for something to load...
            if (pub.checkKeyExists(key, value)) {
                callback();
                clearInterval(nTimer);
            }
        }, timer);
    };


    //
    // Useful for filtering an Array of businesses Objects to only state.active ones.
        // or, for filtering out member plans without a status of ACTIVE or TRIALING.
    //
    pub.filterArrayByObjectValue = function(array, key, values) {
        // Check if the 'values' parameter is an array.
        if (Array.isArray(values)) {
            return $.map(array, function(obj, i) {
                // Check if the object's 'key' matches any value in the 'values' array.
                return values.includes(obj[key]) ? obj : null;
            });
        }
        else {
            // 'values' is a single value, not an array.
            return $.map(array, function(obj, i) {
                return obj[key] == values ? obj : null;
            });
        }
    };


    //
    // Sort 2 values by order ASC/DESC and handle null values.
    //
    function sort(a, b, order) {
        if (a === null) return order === 'desc' ? 1 : -1;
        if (b === null) return order === 'desc' ? -1 : 1;
        return order === 'desc' ? b - a : a - b;
    }


    //
    // Useful for sorting an Array of businesses Objects by state.active appearing first.
    //
    pub.sortArrayByObjectValue = function(array, key, val, order = 'desc') {
        return array.sort((a, b) => {
            // For deep (nested) values.
            a = pub.getProperty(a, key);
            b = pub.getProperty(b, key);

            if (val) {
                // Sort by key's value matching the supplied value.
                return order==='desc' ? (b===val)-(a===val) : (a===val)-(b===val);
            }
            else {
                // Sort by value.
                return sort(a, b, order);
            }
        });
    };


    //
    // Check if member has permissions.
    //
    pub.hasPermissions = function(permission, member) {
        var negative = permission.indexOf("!") === 0,
            perm = permission.replace("!", ""),// Remove the ! so we can check array for permission String.
            hasPerm  = $.inArray(perm, member.permissions);
        
        // Check if the permission exists or that it doesn't (negative).
        return negative ? hasPerm < 0 : hasPerm > -1;
    };


    //
    // Add useful metadata to an AJAX request.
    //
    pub.ajaxMetaValues = function(data, type) {
        var obj = {};

        //Member ID.
        obj.member_id = USER.current.id || null;

        // Add Environment details.
        obj.env = pub.getEnvType();
        obj.url = pub.getCurrentDomain();

        // Language.
        obj.language = LANG.currentLang();

        // Add submitted date/time value.
        obj.submitted = pub.getISOdate();
        obj.submittedTimestamp = pub.getTimestamp();

        if (type != 'formData') return obj;
        
        // Convert JS Object to FormData.
        return $.each(obj, function(key, value) {
            data.set(key, value);
        });
    };


    //
    // get form values as a key-value Object
    //
    pub.getFormValues = function($form, type) {
        var formData = new FormData($form[0]),
            groupedArrays = {};
        
        // Re-build certain field's values.
        $($form).find(':input').each(function() {
            var $element = $(this),
                key = $element.attr('name'),
                value = $element.val();
            
            // Re-build multi-select values.
            if ($element.is('select[multiple]')) {
                formData.set(key, value);
            }
            // Check if checkbox name ends with [].
            else if ($element.is(':checkbox:checked') && key.endsWith('[]')) {
                // Re-build checkbox values for grouped elements.
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

        // Add metadata to formData:
        pub.ajaxMetaValues(formData, 'formData');

        // Debug:
        console.log(Object.fromEntries(formData));

        if (type == 'formData') {
            return formData;
        }
        if (type == 'json') {
            // Convert to JSON.
            return JSON.stringify(Object.fromEntries(formData));
        }
        // JS Object.
        return Object.fromEntries(formData);
    };


    //
    //
    //
    pub.sendAJAX = function(options, form) {
        var params = $.extend({
            //url: "",// Required and must be provided.
            //data: {},// Required and must be provided.
            method: "POST",
            timeout: 60000,
            success: function(data, textStatus) {
                console.log(textStatus, data);
                if (typeof params.callbackSuccess === "function") params.callbackSuccess(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                if (typeof params.callbackError === "function") params.callbackError(textStatus, errorThrown);
                
                // Generic error message.
                var data = {
                    "mode": "dialog",
                    "message": "[p]Sorry, something went wrong, please try again. if the problem continues, contact our team for help.[/p]",
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


    //
    //
    //
    pub.parseIfStringJSON = function(str) {
        if (typeof str === 'string') {
            str = str.trim();
            if (str[0] == '{' && str[str.length - 1] == '}') {
                return JSON.parse(str);
            }
        }
        return str;
    };


    //
    //
    //
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


    //
    // Manage cookies.
    //
    pub.setCookie = function(name, value, days) {
        var expires = "";
        
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    };
    pub.getCookie = function(name) {
        var nameEQ = name + "=",
            cookies = document.cookie.split(';');
        
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return pub.parseIfStringJSON(cookie.substring(nameEQ.length));
            }
        }
        return null;
    };
    pub.deleteCookie = function(name) {
        document.cookie = name+'=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/';
    };


    //
    // Manage localStorage.
    //
    pub.setLocalStorage = function(key, value) {
        if (typeof value !== 'string') {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    }
    pub.getLocalStorage = function(key) {
        return pub.parseIfStringJSON(localStorage.getItem(key));
    }
    pub.deleteLocalStorage = function(key) {
        localStorage.removeItem(key);
    }
    

    //
    // On DOM ready.
    //
    // $(function() {});

    
    return pub;
}(jQuery, this, this.document));

