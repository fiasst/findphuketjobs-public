const MAIN = (function($, window, document, undefined){
    var pub = {},
        ua = navigator.userAgent;


    pub.isTouchDevice = ('ontouchstart' in document.documentElement);
    pub.isiPad = (ua.match(/iPad/i) !== null);
    pub.isiPhone = (navigator.platform.indexOf('iPhone') !== -1) || (navigator.platform.indexOf('iPod') !== -1);
    pub.isAndroid = (ua.indexOf('Android') !== -1);


    // Memberstack plan names.
    pub.planNames = {
        "pln_monthly-subscription-lqn04e7": "Monthly subscription",
        "pln_3-credits-jmv04pd": "3 Credits",
        "pln_6-credits-5cx04l8": "6 Credits",
        "pln_12-credits-72z04tc": "12 Credits"
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


    pub.getEnvType = function(){
        return (location.hostname.indexOf('webflow') > -1) ? 'dev' : 'live';
    };


    pub.getISOdate = function(){
        var date = new Date(),
            now = date.setDate(date.getDate());
        return new Date(now).toISOString();
    };


    // Function to pluralize the time past (eg. "minute/minutes ago", "day/days ago").
    pub.pluralize = (count, noun, suffix = 's') => `${count} ${noun}${count !== 1 ? suffix : ''}`;
    pub.timePast = (curr, prev) => {
        const msMin = 60 * 1000, msHr = msMin * 60, msDay = msHr * 24, msWeek = msDay * 7, msMonth = msDay * 30, msYr = msDay * 365;
        let elapsed = curr - prev;

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


    // get form values as a key-value Object
    pub.getFormValues = function(form) {
        var formData = new FormData(form[0]),
            values = Object.fromEntries(formData);

        // Re-build multi-select field values.
        $.each(values, function(key, value){
            var element = $(form).find(':input[name="'+key+'"]');

            if (element.is('select[multiple]')){
                values[key] = element.val();
            }
        });

        // Metadata:
        // Add Environment details.
        values.env = pub.getEnvType();

        // Add subbmitted date/time value.
        values.submitted = pub.getISOdate();

        return values;
    };


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


    pub.cleanLowerString = function(string){
        return $.trim(string.toLowerCase());
    };


    // Check whether Object key exists
    pub.checkKeyExists = function(obj, key) {
        return obj && typeof obj === "object" && key in obj;
    };


    // Check if member has permissions.
    pub.hasPermissions = function(permissions, member){
        return $.inArray(permissions, member.permissions) > -1;
    };


    // Show or remove content based on conditions.
    pub.controlHTML = function(element, display){
        if (display){
            element.removeClass('hide');
        }
        else {
            element.remove();
        }
    };


    pub.itemState = function(state, status){
        switch (state){
            case 'edit':
                // Can the item be edited.
                if ($.inArray(status, ['Rejected', 'Deleted']) > -1) return false;
            case 'review':
                // Can the item be reviwed.
                if ($.inArray(status, ['Draft', 'Rejected', 'Archived', 'Deleted']) > -1) return false;
        }
        return true;
    };


    pub.buttonThinking = function(btn, revert){
        if (!revert){
            btn.attr('disabled', true).addClass('thinking');
            if (btn.get(0).nodeName == 'BUTTON'){
                btn.data('dataValue', btn.text()).text(btn.attr('data-wait'));
            }
            else {
                btn.data('dataValue', btn.attr('value')).attr('value', btn.attr('data-wait'));
            }
        }
        else {
            // Revert the button back to initial state.
            btn.removeAttr('disabled').removeClass('thinking clicked');
            if (btn.get(0).nodeName == 'BUTTON'){
                btn.text(btn.data('dataValue'));
            }
            else {
                btn.attr('value', btn.data('dataValue'));
            }
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
            timeout: params.timeout,
            success: function(data, textStatus){
                console.log(textStatus, data);
                if ($.isFunction(params.success)) params.success(data);
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log(textStatus, errorThrown);
                if ($.isFunction(params.error)) params.error(data);
            }
        });
    };


    pub.handleResponse = function(data, form){
        if (pub.checkKeyExists(data, "mode")){
            if (data.mode == "alert"){
                alert(data.message);
            }
            if (data.mode == "banner"){
                alert(data.message);//temp
            }
        }
        if (pub.checkKeyExists(data, "enableForm") && !!data.enableForm){
            pub.buttonThinking(form.find('.form-submit'), true);
        }
    };


    // Alternative for displaying Metadata values via HTML data-attributes.
    pub.replaceTextWithMetadata = function(metadata){
        $('[data-ms-member-meta]').each(function(){
            var data = $(this).attr('data-ms-member-meta');

            if (pub.checkKeyExists(metadata, data)){
                $(this).html(metadata[data]);
            }
        });
    };


    // get Member's JSON then fire callback function.
    pub.getMemberJSON = function(callback) {
        window.$memberstackDom.getMemberJSON().then(({ data: memberJSON }) => {
            if (!!callback) {
                var output = memberJSON || {};
                callback(output);
            }
        });
    }


    // update Member's JSON.
    pub.updateMemberJSON = function(json, callback) {
        window.$memberstackDom.updateMemberJSON({ json: json }).then(({ data: memberJSON }) => {
            if (!!callback) {
                var output = memberJSON || {};
                callback(output);
            }
        });
    }


    // Stop body from being scrollable.
    pub.bodyPreventScroll = function(scroll, bodyClass){
        $('body').toggleClass(bodyClass || 'no-scroll', scroll);
    }


    // On DOM ready.
    Webflow.push(function(){
        // Get current Member.
        window.$memberstackDom.getCurrentMember().then(({ data: member }) => {
            window.MSmember = member || {};
            //if (!data) {
                //member is logged out
            //}

            //if (!!member.verified) {
                //member has verified email.
            //}
            console.log(member);

            if (pub.checkKeyExists(member, 'metaData')){
                pub.replaceTextWithMetadata(member.metaData);
            }

            if (pub.checkKeyExists(member, 'id')){
                // Add member ID to form field.
                var hiddenInput = $('.input-member-id');

                if (!!hiddenInput && !hiddenInput.val()){
                    hiddenInput.val(member.id);
                    hiddenInput.parents('form').find('.form-submit').removeAttr('disabled');
                }
            }

            // Show content author controls (edit link...).
            if (!!$('.node-author').length){
                $('.node-author').each(function(){
                    var authorID = $(this).attr('data-author'),
                    display = (!!member && pub.checkKeyExists(member, 'id') && (member.id == authorID || pub.hasPermissions('can:moderate', member)));
                    //console.log(member.id+' == '+authorID+' || '+hasPermissions('can:moderate', member));
                    pub.controlHTML($(this).parents('.node').find('.author-access'), display);
                });
            }


            // Show content if User has permissions.
            $('[data-ms-perm]').each(function(){
                pub.controlHTML($(this), pub.hasPermissions($(this).attr('data-ms-perm'), member));
            });


            /*
            * Removed this for now because Weglot can't translate Thai to English, only the other way around...
            * Could use Google Translate API for this feature instead.
            *
            $('.form-translate').on('click', function(){
              var form = $('#' + $(this).attr('data-form')),
                  clone = form.clone(),
                  fields = [],
                  strings = [];
              
              // Remove selects, buttons, passwords, tel/email fields and metadata from being translated.
              clone.find(':input:not(.translate)').remove();
              var fieldValues = getFormValues(clone);
              
              $.each(fieldValues, function(key, value){
                if (!!value){
                  strings.push({ 'w': value, 't': 2 });
                  fields.push(key);
                }
              });
              console.log(strings);
              console.log(fields);
              
              Weglot.translate(
                {
                  'words': strings,
                  'languageTo': 'th'
                }, function(data){
                  console.log('data', data);
                  $.each(data, function(i, value){
                    form.find('[name="'+ fields[i] +'"]').val(value);
                    console.log(fields[i], value);
                  });
                }
              );
            });*/
        });


        // Delay forms.
        //$('.delay-submit').one('submit', function(){
        /*
        * Doesn't work well with .ajax-submit submit handler. Fires AJAX twice...
        *
        $('.delay-submit').on('click.delaySubmit', '.delay-button', function(e){
            console.log('delay-submit');
            e.preventDefault();

            let cookieFormValid = pub.getCookie('form-valid'),
                form = $(this),
                button = $(e.target),
                d=20e3;

            cookieFormValid = !!cookieFormValid?Number(cookieFormValid):d;
            pub.buttonThinking(button);

            setTimeout(function(){
              form.off('.delaySubmit').submit();
            }, cookieFormValid);
            pub.setCookie('form-valid',cookieFormValid+d);

            return false;
        });*/

        // AJAX forms.
        $('.ajax-submit')
            .on('click', '.form-submit', function(e){
                $(e.target).addClass('clicked');
            })
            .on('submit', function(e){
                e.preventDefault();

                var form = $(this),
                    button = form.find('.form-submit.clicked'),
                    data = pub.getFormValues(form),
                    formIncrement = pub.getCookie('form-valid'),
                    i = 2;

                formIncrement = !!formIncrement?Number(formIncrement):0;
                data.increment = ++formIncrement;
                pub.setCookie('form-valid',data.increment);

                pub.buttonThinking(button);
                console.log(data);

                pub.sendAJAX({
                    url: form.attr('action'),
                    method: form.attr('method'),
                    data: data,
                    timeout: 120000,
                    success: function(data){
                        pub.handleResponse(data, form);
                    },
                    error: function(data){
                        console.log('error');
                    }
                });
            });


        // Form fields: Populate form field's default values.
        $('input[data-default-value]').each(function(){
            if (!$(this).val()) {
                $(this).val( $(this).attr('data-default-value') );
            }
        });


        // Launch "Confirm" alert dialogs on element click.
        $('.alert-confirm').on('click.alertConfirm', function(e){
            var msg = $(this).attr('data-confirm');
            if (msg){
                e.preventDefault();
              
                if (confirm(msg)){
                    $(this).off('click.alertConfirm').trigger('click');
                }
                else {
                    // Remove a class that's added in another listener.
                    $(this).removeClass('clicked');
                    return false;
                }
            }
        });


        // Toggle element visibility.
        $('.toggle-vis').on('click', function(e){
            var target = $(this).attr('data-target');

            if (target){
                e.preventDefault();
                $('#'+target).toggleClass('hide');
            }
        });


        // Update form "op" (operation) value on button click.
        // Because Webflow doesn't pass submit button values through to Make...
        $('.form-submit[name="op"]').on('click', function(){
            $(this).parents('form').find('.form-action-op').val( $(this).val() );
        });


        $('.node-job-row').each(function(){
            var row = $(this),
                actions = row.find('.table-links a'),
                status = row.find('.col-status').text().toLowerCase();

            if (!!status){
                row.addClass(status);
              
                switch (status){
                    case 'draft':
                        // Show all links.
                        actions.removeClass('hide');
                        break;
                    case 'expired':
                    case 'archived':
                        // Show all links.
                        actions.removeClass('hide').filter('[data-link="publish"]').text('Republish');
                        break;
                    case 'pending':
                    case 'published':
                        // Show Edit link only.
                        actions.filter('[data-link="edit"]').removeClass('hide');
                }
            }
        });

        // Publish Draft/Republish existing Job.
        $('.link-hook-publish').on('click', function(e){
            e.preventDefault();
            var link = $(this);

            if (link.hasClass('disabled')){
                return false;
            }
            link.addClass('disabled');

            var data = {
                member_id: $(this).attr('data-member-id'),
                item_id: $(this).attr('data-item-id'),
                submitted: pub.getISOdate()
            },
            formIncrement = pub.getCookie('form-valid'),
            i = 2;

            formIncrement = !!formIncrement?Number(formIncrement):0;
            data.increment = ++formIncrement;
            pub.setCookie('form-valid',data.increment);

            // Add thinking icon...

            pub.sendAJAX({
                url: "https://hook.us1.make.com/dv56t4535h1sfag5g0693924h3sg5582",
                data: data,
                timeout: 120000,
                success: function(data){
                    //pub.handleResponse(data);
                },
                error: function(data){
                    console.log('error');
                }
            });
        });


        // Form fields: Populate select lists with Collection options.
        $('.select-list-options').each(function(){
            var wrapper = $(this).parent('.select-list-wrapper'),
                select = wrapper.find('select'),
                defaultValue = wrapper.find('.select-list-default-value').attr('data-value') || '';

            $(this).find('.w-dyn-item').each(function(){
                $(this).data('lang-en', $(this).text());// Store a non-translated string in .data().

                $('<option />', {
                    value: $(this).text(),
                    selected: ($(this).text() == defaultValue) ? 'selected' : false
                }).text( $(this).text() ).appendTo( $(select) );
            });
        });

        // Translate select lists and rebuild any jQuery Select2 widgets.
        pub.waitFor(window, "Weglot", 400, function(){
            Weglot.on("languageChanged", function(){
                $('.select-list-options').each(function(){
                    var select = $(this).parent('.select-list-wrapper').find('select');

                    $(this).find('.w-dyn-item').each(function(i){
                        console.log(i, $(this).text());
                        select.find('option').eq(i).text( $(this).text() ).val( $(this).data('lang-en') );
                    });
                    if (select.hasClass('select2-hidden-accessible')){
                        select.select2('destroy');
                        select.select2( select.data('select2-options') );
                    }
                });
            });
        });
    });

    return pub;
}(jQuery, this, this.document));




/*
* Extend jQuery.
*/
// Create jQuery Select2 widget.
  // Use this instead of .select2() when first initializing a widget.
$.fn.createSelect2 = function(options){
    var ops;
    $.each(this, function(i, element){
        ops = options;
        ops.placeholder = $(element).attr('placeholder') || "Select...";
        
        if (ops.placeholder){
            // For the placeholder to appear, you must have a blank <option> as the first option in your Select.
            $(element).prepend('<option value=""></option>').val('');
        }

        // Store options in .data() incase we need to destroy and rebuild the select2 widget.
        // This happens when the language is changed.
        $(element).select2(ops).data('select2-options', ops);
    });
};


// Case-insensitive selector ":icontains()".
jQuery.expr[':'].icontains = function(el, i, m, array){
    return (el.textContent || el.innerText || "").toLowerCase().indexOf((m[3] || "").toLowerCase()) >= 0;
};


// Form element has value/is selected or is checked, selector ":selectedInput".
jQuery.expr[':'].selectedInput = function(el, i, m){
    return el.type == "checkbox" || el.type == "radio" ? el.checked : el.value != "";
};



