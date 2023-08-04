var FORMS = (function($, window, document, undefined) {
    var pub = {};


    // Show/hide existing file details and replace with file upload field.
    pub.uploadFields = function() {
        $('.upload-wrapper').each(function() {
            var filename = !!$(this).find('.file-existing .file-upload-text').text();
            $('.upload-field', this).toggle(!filename);
            $('.file-existing', this).toggle(filename);
        });
        
        $('.file-existing .file-upload-button').on('click', function() {
            var wrapper = $(this).parents('.upload-wrapper');
            wrapper.find('.file-existing').remove();
            wrapper.find('.upload-field').fadeIn(500);
        });
    };


    // On DOM ready.
    $(function() {
        // Init.
        pub.uploadFields();


        // Get current Member.
        USER.getCurrentMember(function(member) {
            if (HELP.checkKeyExists(member, 'id')) {
                // Add member ID to form field.
                var hiddenInput = $('.input-member-id');

                if (!!hiddenInput && !hiddenInput.val()) {
                    hiddenInput.val(member.id);
                    hiddenInput.parents('form').find('.form-submit').removeAttr('disabled');
                }
            }
        });


        // Redirect user after form submit.
        const queryDest = HELP.getSetQuerystring('dest');
        if (queryDest) {
            $('form').find('.fp_redirect').attr('data-redirect', '/'+queryDest);// Relative URIs only.
        }
        $('form').on('submit', function() {
            var redir = $(this).find('.fp_redirect').attr('data-redirect');
            if (redir) {
                localStorage.setItem('fp_redirect', redir);
            }
        });


        //  General AJAX form submit handler.
        $('.ajax-submit')
            .on('click', '.form-submit', function(e) {
                $(e.target).addClass('clicked');
            })
            .on('submit', function(e) {
                e.preventDefault();
                var $form = $(this),
                    $button = $form.find('.form-submit.clicked'),
                    validation = $form.attr('data-validation');

                // Custom form validation.
                if (validation && !HELP.callNestedFunction(validation)) {
                    // Validation function retured false.
                    console.log('Validation failed');
                    MAIN.buttonThinking($button, true);
                    // Don't proceed.
                    return false;
                }

                var data = HELP.getFormValues($form),
                    formIncrement = HELP.getCookie('form-valid'),
                    i = 2;

                formIncrement = !!formIncrement ? Number(formIncrement) : 0;
                data.increment = ++formIncrement;
                HELP.setCookie('form-valid', data.increment);

                MAIN.buttonThinking($button);
                MAIN.thinking(true, false);
                console.log(data);

                HELP.sendAJAX({
                    url: $form.attr('action'),
                    method: $form.attr('method'),
                    data: data,
                    timeout: 120000,
                    callbackSuccess: function(data) {
                        MAIN.thinking(false);
                        MAIN.handleAjaxResponse(data, $form);
                    },
                    callbackError: function(data) {
                        MAIN.thinking(false);
                        console.log('error');
                    }
                }, $form);
            });


        // Form fields: Populate field's default values with inline attribute's value.
        $(':input[data-default-value]').each(function() {
            var $el = $(this),
                val = $el.attr('data-default-value');

            if (!$el.val()) {
                // Remove non-number characters from value so it can be set as a value.
                if ($el.attr('type') == 'number') val = HELP.removeNonNumeric(val);

                $el.val(val);
            }
        });


        // Form fields: Populate field's default values with sibling DIV's content.
        $('.input-default-value').each(function() {
            var $el = $(this),
                $input = $el.parent().find(':input'),
                $customInput = $input.siblings('.w-checkbox-input'),
                    // hasText value can either be empty, for non-Switch WF fields
                    //or "true/false" (String), for Switch WF fields.
                    hasText = !!$el.text() && $el.text() !== "false";
            
            if ($input.attr('type') == 'checkbox') {
                if ($customInput && ($customInput.hasClass('w--redirected-checked') !== hasText)) {
                    $customInput.trigger('click');
                }
                // Make sure the checkbox reflects the same state as the custom faux checkbox...
                $input.prop('checked', hasText);
            }
            else if (!$input.val()) {
                $input.val( HELP.stripHTMLWithLinebreaks($el.html()) );
            }
        });


        // Form fields: Add maxlength attribute to fields.
        $(':input[data-maxlength]').each(function() {
            $(this).attr('maxlength', $(this).attr('data-maxlength') );
        });


        // Update form "op" (operation) value on button click.
        // Because Webflow doesn't pass submit button values through to Make...
        $('.form-submit[name="op"]').on('click', function() {
            $(this).parents('form').find('.form-action-op').val( $(this).val() );
        });


        // Must appear before the createSelect2() call.
        $('.select-list-options').buildSelectOptions();


        // Translate select lists and rebuild any jQuery Select2 widgets.
        HELP.waitFor(window, "Weglot", 400, function() {
            Weglot.on("languageChanged", function() {
                $('.select-list-options').each(function() {
                    var select = $(this).parent('.select-list-wrapper').find('select');

                    $(this).find('.w-dyn-item').each(function(i) {
                        console.log(i, $(this).text());
                        select.find('option').eq(i).text( $(this).text() ).val( $(this).data('lang-en') );
                    });
                    if (select.hasClass('select2-hidden-accessible')) {
                        select.select2('destroy');
                        select.select2( select.data('select2-options') );
                    }
                });
            });
        });


        // Select2 dropdowns.
        // Must be called after the .select-list-options select options have been built. 
        /*var select2Fields = $('.select2-field');
        if (!!select2Fields.length) {
            HELP.waitFor(jQuery.fn, "select2", 100, function() {
                select2Fields.createSelect2();
            });
        }*/
        $('.select2-field:not(.collection-list)').createSelect2();


        // LitBox support.
        $(document)
            .on('lbox_open', function() {
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
$.fn.buildSelectOptions = function(options) {
    options = options || {};

    $.each(this, function(i, el) {
        var wrapper = $(this).parent('.select-list-wrapper'),
            select = wrapper.find('select'),
            defaultValue = wrapper.find('.input-default-value').attr('data-value') || '',
            values = [];

        $(this).find('.w-dyn-item').each(function() {
            var val = $(this).text();
            if (!val || $.inArray(val, values) > -1) return;// Skip empty or duplicate values.
            values.push(val);

            $(this).data('lang-en', val);// Store a non-translated string in .data().

            $('<option />', {
                value: val,
                selected: (val == defaultValue) ? 'selected' : false
            }).text(val).appendTo( $(select) );
        });
        if (select.hasClass('select2-field')) {
            select.createSelect2();
        }
    });
};


// Create jQuery Select2 widget.
  // Use this instead of .select2() when first initializing a widget.
$.fn.createSelect2 = function(options) {
    options = options || {};
    var items = this;

    if (!$(items).length) return false;

    HELP.waitFor(jQuery, "fn.select2", 100, function() {
        var ops;
        $.each(items, function(i, el) {
            ops = options;
            ops.placeholder = $(el).attr('placeholder') || "Select...";
            var selected = $(el).find('option[selected]');
            
            // If the select doesn't have a "multiple" attribute.
            if (!$(el).attr('multiple')) {
                // For the placeholder to appear, you need a blank <option> as the first option.
                $(el).prepend('<option value="">'+ ops.placeholder +'</option>');
            }
            
            $(el).select2(ops)
                // Store options in .data() incase we need to destroy and rebuild the select2 widget.
                // This happens when the language is changed.
                .data('select2-options', ops)
                // Sets the default option:
                .val( !!selected.length ? $(el).val() : '' ).trigger('change');
        });
    });
};


// Form element has value/is selected or is checked, selector ":selectedInput".
jQuery.expr[':'].selectedInput = function(el, i, m) {
    return el.type == "checkbox" || el.type == "radio" ? el.checked : el.value != "";
};



