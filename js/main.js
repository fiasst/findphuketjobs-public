var MAIN = (function($, window, document, undefined){
    var pub = {};


    // Webhooks.
    const publishExistingJob = "https://hook.us1.make.com/dv56t4535h1sfag5g0693924h3sg5582";


    // Memberstack plan names.
    pub.planNames = {
        "pln_monthly-subscription-lqn04e7": "Monthly subscription",
        "pln_3-credits-jmv04pd": "3 Credits",
        "pln_6-credits-5cx04l8": "6 Credits",
        "pln_12-credits-72z04tc": "12 Credits"
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


    pub.handleAjaxResponse = function(data, form){
        if (HELP.checkKeyExists(data, "mode")){
            switch (data.mode){
                case 'alert':
                    alert(data.message);
                    break;

                case 'banner':
                    alert(data.message);//temp
                    break;

                case 'dialog':
                    var actions;
                    if (HELP.checkKeyExists(data, "options.actions")){
                        actions = $('<div class="actions justify-center" />');

                        $.each(data.options.actions, function(i, item){
                            item.attributes.class = item.attributes.class || '';
                            if (item.type == 'button'){
                                item.attributes.class += ' w-button small';
                            }
                            actions.append(
                                $('<a>', {
                                    text: item.text,
                                    attr: item.attributes
                                })
                            );
                        })
                    }
                    var defaults = {
                            bodyClasses: 'lbox-dialog',
                            html: [HELP.sanitizeHTML(data.message), actions],
                            css: {
                                xxs: {
                                    offset: 20,
                                    maxWidth: 650,
                                    contentInnerPadding: 20
                                }
                            }
                        },
                        options = $.extend(true, {}, defaults, data.options || {});
                    $.litbox(options);

                    $(document).on('click', '.trigger-lbox-close', function(e){
                        e.preventDefault();
                        $.litbox.close();
                    });
            }
            if (HELP.checkKeyExists(data, 'callback')){
                HELP.callNestedFunction(data.callback, data, form);
            }
        }
        if (form && HELP.checkKeyExists(data, "enableForm") && !!data.enableForm){
            pub.buttonThinking(form.find('.form-submit'), true);
        }
    };


    pub.thinking = (show, overlay = false) => {
        let classes = show ? (overlay ? 'thinking-overlay' : 'thinking') : 'thinking-overlay thinking';
        $('body').toggleClass(classes, show);
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


    // Alternative for displaying Metadata values via HTML data-attributes.
    pub.replaceTextWithMetadata = function(metadata) {
        $('[data-ms-member-meta]').each(function() {
            var data = $(this).attr('data-ms-member-meta');

            if (HELP.checkKeyExists(metadata, data)) {
                $(this).html(metadata[data]);
            }
        });
    };


    // Stop body from being scrollable.
    pub.bodyPreventScroll = function(scroll, bodyClass) {
        $('body').toggleClass(bodyClass || 'no-scroll', scroll);
    };

    
    // Calculate "X minutes/hours/days ago" text.
    pub.timePast = function($el) {
        $el.text( HELP.timePast( $el.text() ) +' ago').addClass('parsed');
    };


    // Show/hide existing file details and replace with file upload field.
    pub.uploadFields = function() {
        $('.upload-wrapper').each(function() {
            var filename = !!$(this).find('.file-existing .file-upload-text').text();
            $('.upload-field', this).toggle(!filename);
            $('.existing-file', this).toggle(filename);
        });
        
        $('.file-existing .file-upload-button').on('click', function() {
            var wrapper = $(this).parents('.upload-wrapper');
            wrapper.find('.file-existing').remove();
            wrapper.find('.upload-field').fadeIn(500);
        });
    };


    pub.jobItem = function() {
        $('.card.job').each(function() {
            // If not a numeric salary "amount".
            if (!(!!$(this).find('.js-salary-amount').text())) {
                $(this).find('.salary').hide();
            }
            // If salary is set to NOT display.
            if ($(this).find('.salary').length < 0) {
                $(this).find('.js-salary-hidden').show();
            }
            // Calculate the created "X ago" text.
            pub.timePast( $(this).find('.time-past:not(.parsed)') );
        });
    };


    // On DOM ready.
    $(function(){
        // Init.
        pub.jobItem();
        pub.uploadFields();


        // FS cmsFilters loaded/rendered new items.
        window.fsAttributes = window.fsAttributes || [];
        window.fsAttributes.push([
            'cmsfilter',
            (filterInstances) => {
                // The callback passes a `filterInstances` array with all the `CMSFilters` instances on the page.
                const [filterInstance] = filterInstances;
                //console.log(filterInstance);

                // The `renderitems` event runs whenever the list renders items after filtering.
                filterInstance.listInstance.on('renderitems', (renderedItems) => {
                    // Calculate published date "ago" meta text and other things.
                    pub.jobItem();
                });
            },
        ]);


        // Get current Member.
        USER.getCurrentMember(function(member){
            //if (!data) {
                //member is logged out
            //}

            //if (!!member.verified) {
                //member has verified email.
            //}
            console.log(member);

            // if (HELP.checkKeyExists(member, 'metaData')){
                // pub.replaceTextWithMetadata(member.metaData);
            // }

            if (HELP.checkKeyExists(member, 'id')){
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
                    display = (!!member && HELP.checkKeyExists(member, 'id') && (member.id == authorID || HELP.hasPermissions('can:moderate', member)));
                    //console.log(member.id+' == '+authorID+' || '+hasPermissions('can:moderate', member));
                    pub.controlHTML($(this).parents('.node').find('.author-access'), display);
                });
            }


            // Show content if User has permissions.
            $('[data-ms-perm]').each(function(){
                pub.controlHTML($(this), HELP.hasPermissions($(this).attr('data-ms-perm'), member));
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
              var fieldValues = HELP.getFormValues(clone);
              
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


        // Accordions.
        $('.accordion').on('click', '.accordion-header', function(){
            $(this).parent().toggleClass('active').find('.accordion-content').toggleClass('active');
        });


        // Delay forms.
        //$('.delay-submit').one('submit', function(){
        /*
        * Doesn't work well with .ajax-submit submit handler. Fires AJAX twice...
        *
        $('.delay-submit').on('click.delaySubmit', '.delay-button', function(e){
            console.log('delay-submit');
            e.preventDefault();

            let cookieFormValid = HELP.getCookie('form-valid'),
                form = $(this),
                button = $(e.target),
                d=20e3;

            cookieFormValid = !!cookieFormValid?Number(cookieFormValid):d;
            pub.buttonThinking(button);

            setTimeout(function(){
              form.off('.delaySubmit').submit();
            }, cookieFormValid);
            HELP.setCookie('form-valid',cookieFormValid+d);

            return false;
        });*/


        // Redirect user after form submit.
        const queryDest = HELP.getSetQuerystring('destination');
        if (queryDest) {
            $('form').find('.fp_redirect').attr('data-redirect', '/'+queryDest);// Relative URIs only.
        }
        $('form').on('submit', function(){
            var redir = $(this).find('.fp_redirect').attr('data-redirect');
            if (redir){
                localStorage.setItem('fp_redirect', redir);
            }
        });


        // format DOB and other date fields on key press.
        $('.format-ddmmyyyy').on('keyup', function(e) {
            if (e && !(e.key == 'Backspace' || e.key == 'Delete')) {
                $(this).val( HELP.formatDDMMYYYY($(this).val()) );
            }
        });


        // AJAX forms.
        $('.ajax-submit')
            .on('click', '.form-submit', function(e){
                $(e.target).addClass('clicked');
            })
            .on('submit', function(e){
                e.preventDefault();

                var form = $(this),
                    button = form.find('.form-submit.clicked'),
                    data = HELP.getFormValues(form),
                    formIncrement = HELP.getCookie('form-valid'),
                    i = 2;

                formIncrement = !!formIncrement?Number(formIncrement):0;
                data.increment = ++formIncrement;
                HELP.setCookie('form-valid',data.increment);

                pub.buttonThinking(button);
                console.log(data);

                HELP.sendAJAX({
                    url: form.attr('action'),
                    method: form.attr('method'),
                    data: data,
                    timeout: 120000,
                    callbackSuccess: function(data){
                        pub.handleAjaxResponse(data, form);
                    },
                    callbackError: function(data){
                        console.log('error');
                    }
                }, form);
            });


        // Form fields: Populate field's default values.
        $(':input[data-default-value]').each(function(){
            if (!$(this).val()) {
                $(this).val( $(this).attr('data-default-value') );
            }
        });
        // Form fields: Add maxlength attribute to fields.
        $(':input[data-maxlength]').each(function(){
            $(this).attr('maxlength', $(this).attr('data-maxlength') );
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


        // Trigger for newly introduced Dashboard links on the page (LitBox) to
        // imitate Memberstack.js functionality.
        $(document).on('click', '.link-dashboard', function(e){
            e.preventDefault();
            if (HELP.checkKeyExists(USER, "current.loginRedirect")){
                window.location.href = USER.current.loginRedirect;
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
                submitted: HELP.getISOdate()
            },
            formIncrement = HELP.getCookie('form-valid'),
            i = 2;

            formIncrement = !!formIncrement?Number(formIncrement):0;
            data.increment = ++formIncrement;
            HELP.setCookie('form-valid',data.increment);

            // Add thinking icon...

            HELP.sendAJAX({
                url: publishExistingJob,
                data: data,
                timeout: 120000,
                callbackSuccess: function(data){
                    //pub.handleAjaxResponse(data);
                },
                callbackError: function(data){
                    console.log('error');
                }
            });
        });


        // Must appear before the createSelect2() call.
        $('.select-list-options').createSelectOptions();


        // Translate select lists and rebuild any jQuery Select2 widgets.
        HELP.waitFor(window, "Weglot", 400, function(){
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


        // Select2 dropdowns.
        // Must be called after the .select-list-options select options have been built. 
        /*var select2Fields = $('.select2-field');
        if (!!select2Fields.length){
            HELP.waitFor(jQuery.fn, "select2", 100, function(){
                select2Fields.createSelect2();
            });
        }*/
        $('.select2-field:not(.collection-list)').createSelect2();


        // LitBox support.
        $(document)
            .on('lbox_open', function(){
                // Create any new Select2 fields.
                // Make sure it's not been initiated already (inline HTML from the same page) using :not().
                // $('#litbox .select2-field:not(.select2-hidden-accessible)').createSelect2();
            });
    });

    return pub;
}(jQuery, this, this.document));




/*
* Extend jQuery.
*/
// Form fields: Populate select with option elements built from Collection List data.
$.fn.createSelectOptions = function(options){
    options = options || {};

    $.each(this, function(i, el){
        var wrapper = $(this).parent('.select-list-wrapper'),
            select = wrapper.find('select'),
            defaultValue = wrapper.find('.select-list-default-value').attr('data-value') || '',
            values = [];

        $(this).find('.w-dyn-item').each(function(){
            var val = $(this).text();
            if ($.inArray(val, values) > -1) return;// Skip duplicate values.
            values.push(val);

            $(this).data('lang-en', val);// Store a non-translated string in .data().

            $('<option />', {
                value: val,
                selected: (val == defaultValue) ? 'selected' : false
            }).text(val).appendTo( $(select) );
        });
        if (select.hasClass('select2-field')){
            select.createSelect2();
        }
    });
};


// Create jQuery Select2 widget.
  // Use this instead of .select2() when first initializing a widget.
$.fn.createSelect2 = function(options){
    options = options || {};
    var items = this;

    if (!$(items).length) return false;

    HELP.waitFor(jQuery, "fn.select2", 100, function(){
        console.log("select2 found");
        var ops;
        $.each(items, function(i, el){
            ops = options;
            ops.placeholder = $(el).attr('placeholder') || "Select...";
            var selected = $(el).find('option[selected]');
            
            // If the select doesn't have a "multiple" attribute.
            if (!(!!$(el).attr('multiple'))){
                // For the placeholder to appear, you need a blank <option> as the first option.
                $(el).prepend('<option value="">'+ ops.placeholder +'</option>');
            }
            
            $(el).select2(ops)
                // Store options in .data() incase we need to destroy and rebuild the select2 widget.
                // This happens when the language is changed.
                .data('select2-options', ops)
                // Sets the default option:
                .val( selected.length ? $(el).val() : '' ).trigger('change');
        });
    });
};


// Not being used yet but is useful.
/*$.fn.nextprev = function(dir){
    return (dir === 'prev') ? this.prev() : this.next();
};*/


// Case-insensitive selector ":icontains()".
jQuery.expr[':'].icontains = function(el, i, m, array){
    return (el.textContent || el.innerText || "").toLowerCase().indexOf((m[3] || "").toLowerCase()) >= 0;
};


// Form element has value/is selected or is checked, selector ":selectedInput".
jQuery.expr[':'].selectedInput = function(el, i, m){
    return el.type == "checkbox" || el.type == "radio" ? el.checked : el.value != "";
};



