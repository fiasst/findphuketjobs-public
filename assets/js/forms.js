//
//
//
var FORMS = (function($, window, document, undefined) {
    var pub = {};


    //
    // Show/hide existing file details and replace with file upload field.
    //
    pub.uploadFields = function() {
        $('.upload-wrapper').each(function() {
            var filename = !!$('.file-existing .input-placeholder-text', this).text();
            $('.upload-field', this).toggle(!filename);
            $('.file-existing', this).toggle(filename);
        });
        
        $('.file-existing .file-upload-button').on('click', function() {
            var $wrapper = $(this).parents('.upload-wrapper');
            $('.file-existing', $wrapper).remove();
            $('.upload-field', $wrapper).fadeIn(500);
        });
    };


    // Check or uncheck the custom Input and the actual (hidden) radio/checkbox input.
        // "checked" is a Boolean (to check or uncheck the fields).
    pub.toggleCustomInputField = function($customInput, $input, checked) {
        if ($customInput && ($customInput.hasClass('w--redirected-checked') !== checked)) {
            $customInput.trigger('click');
        }
        // Make sure the checkbox/radio reflects the same state as the custom input field...
        $input.prop('checked', checked);
    };


    //
    // WYSIWYG Editor.
    //
    //
    // var editorKeyCallback = (e) => ;
    //
    // var editorChangeCallback = (e) => ;
    //
    pub.editorOptions = {
        // selector: selector,
        // selector: 'textarea.editor:not(.editor-processed)',
        // selector: 'div:not(.hide-live) textarea.editor',//:not(.editor-processed)
        // target: this,
        toolbar: 'undo redo | bullist numlist',
        plugins: 'lists',
        valid_elements: 'p,ul,ol,li,br',
        valid_styles: {
            '*': ''
        },
        pad_empty_with_br: true,
        min_height: 200,
        max_height: 400,
        menubar: false,
        branding: false,
        statusbar: false,
        custom_undo_redo_levels: 8,
        setup: function(editor) {
            editor
            .on('keydown keyup change', function(e) {
                let editor = this,
                    count = editor.getContent({format: 'text'}).length,
                    $container = $(editor.getContainer()),
                    max = Number($(editor).data('data-maxlength'));
                
                switch (e.type) {
                    case 'keydown':
                        if (count >= max) {
                            let key = HELP.getKey(e);

                            // Allow Backspace, Delete keys, etc.
                            if (!HELP.allowCommonKeyPress(e, key)) {
                                e.preventDefault();
                            }
                        }
                    case 'change':
                        // If maxlength is exceeded.
                        if (max && count > max) {
                            // Make form submit fail if value > maxlength.
                            $(editor.targetElm).val('');
                        }
                    case 'keyup':
                    case 'change':
                        pub.updateCharCount($container, count, max);
                }
            })
            .on('change', function(e) {
                let content = editor.getContent(),
                    $textarea = $(editor.targetElm);

                // Cleanup.
                content
                    .replace(/\t/g, '')// Remove tabs.
                    .replace(/( *&nbsp; *)+/g, ' ')// Replace multiple &nbsp; with (optional) whitespace.
                    .replace(/ {2,}/g, ' ');// Replace multiple whitespace.

                // Set raw HTML value.
                $textarea.val(content);
                // Trigger Bouncer field validation.
                $textarea.trigger('blur');
            });

            // let $textarea = $(editor.targetElm);
            // Add trimmed value.
            // $textarea.val( HELP.zeroTrim(editor.getContent({format: 'raw'})) );
            // editor.setContent( HELP.zeroTrim(editor.getContent()) );
        },
        init_instance_callback: function(editor) {
            let $textarea = $(editor.targetElm),
                contentHTML = HELP.zeroTrim(editor.getContent({format: 'raw'})),
                count = editor.getContent({format: 'text'}).length,
                max = Number($textarea.attr('data-valid-maxlength')),
                $container = $(editor.getContainer());
            
            // Add trimmed value and add class.
            // $textarea.val(contentHTML).addClass('editor-processed');
            $textarea.addClass('editor-processed');
            // editor.setContent(contentHTML);

            // Set easy access var on Container.
            $(editor).data('data-maxlength', max);
            
            if (max) {
                pub.setupCharCount($container, count, max);
            }
        }
    };
    //
    //
    //
    /*pub.initEditor = (selector) => {
        var editorOptions = pub.editorOptions;
        // The textarea element to target.
            // (excluding .editor-processed which has already been initialised).
        if (selector) {
            editorOptions.selector = selector;
        }
        // Init.
        if ($(editorOptions.selector).length < 1) return;

        tinymce.init(editorOptions);
    };*/


    //
    // Setup the character count widget on textareas and WYSIWYG Editors.
    //
    pub.setupCharCount = ($container, count, max) => {
        $container
            .after(`<div class="char-count"><span>${ Number(count) }</span> / ${ Number(max) }</div>`)
            .parent().addClass('char-count-wrapper');
    };


    //
    // Update the "<count> / <max>" widget on textareas and WYSIWYG Editors.
    //
    pub.updateCharCount = ($container, count, max) => {
        $container.parent().find('.char-count span')
            // Add the danger indicator at 20 characters until limit reached.
            .toggleClass('color-danger', count >= (Number(max) - 20)).text(count);
    };


    //
    // AJAX form submit logic.
        // Used by ".form-submit" and ".bouncer" forms.
    //
    pub.ajaxSubmitHandler = (form, handlerOptions) => {
        var $form = $(form),
            $button = $form.find('.form-submit.clicked'),
            validation = $form.attr('data-validation'),
            dataType = $form.attr('data-form-values-type');

        // Custom form validation.
        if (validation && !HELP.callNestedFunction(validation)) {
            // Validation function retured false.
            console.log('Validation failed');
            MAIN.buttonThinking($button, true);
            // Don't proceed.
            return false;
        }

        var data = HELP.getFormValues($form, dataType),
            formIncrement = HELP.getCookie('form-valid'),
            i = 2;

        formIncrement = !!formIncrement ? Number(formIncrement) : 0;
        formIncrement = ++formIncrement;

        if (dataType == 'formData') {
            data.set('increment', formIncrement);
        }
        else {
            data.increment = formIncrement;
        }
        HELP.setCookie('form-valid', formIncrement);

        var ajaxParams = {
            url: $form.attr('action'),
            method: $form.attr('method'),
            data: data,
            timeout: 120000,
            callbackSuccess: function(data) {
                MAIN.thinking(false);
                MAIN.handleAjaxResponse(data, $form);
                // Extra callback for this function, not passed through to sendAJAX().
                if (handlerOptions && typeof handlerOptions.callbackSuccess === "function") {
                    handlerOptions.callbackSuccess(data);
                }
            },
            callbackError: function(data) {
                MAIN.thinking(false);
                console.log('error');
                // Extra callback for this function, not passed through to sendAJAX().
                if (handlerOptions && typeof handlerOptions.callbackError === "function") {
                    handlerOptions.callbackError();
                }
            }
        };
        // File upload fields break the JS without these settings.
        if (dataType == 'formData') {
            ajaxParams.processData = false;
            ajaxParams.contentType = false;
            ajaxParams.cache = false;
        }

        MAIN.buttonThinking($button);
        MAIN.thinking(true, false);
        console.log('data: ', ajaxParams.data);

        HELP.sendAJAX(ajaxParams, $form);
    };


    //
    // On DOM ready.
    //
    $(function() {
        //
        // Redirect user after form submit.
        //
        const queryDest = HELP.getSetQuerystring('dest');
        if (queryDest) {
            $('form').find('.fp_redirect').attr('data-redirect', '/'+queryDest);// Relative URIs only.
        }
        $('form').on('submit', function() {
            var redir = $(this).find('.fp_redirect').attr('data-redirect');
            if (!!(redir)) {
                localStorage.setItem('fp_redirect', redir);
            }
        });


        //
        // Cleanup textareas.
            // This prevents character count widgets from showing 1 instead of zero because of &zwj;
            // characters which prevents FE validation from marking empty textareas as required.
        //
        // $('textarea').each(function() {
        //     $(this).val( HELP.zeroTrim($(this).val()) );
        // });


        //
        // Bouncer FE form validation.
        //
        // Add Bouncer form validation error placeholder for fields.
        //
        var bouncerFieldIndex = 0;
        $('.bouncer .input-wrapper').each(function(i, el) {
            var id = 'error-wrapper-'+ bouncerFieldIndex++;
            
            $(el).append( $('<div class="error-wrapper" id="'+ id +'" />') )
                .find(':input').attr('data-bouncer-target', '#'+ id)
        });

        //
        // Bouncer site-wide form validation.
            // Works for all forms with a ".bouncer" class.
        //
        pub.bouncer = new Bouncer('form.bouncer', {
            fieldClass: 'error',// Applied to fields with errors
            errorClass: 'error-text',// Applied to the error message for invalid fields
            fieldPrefix: 'bouncer-field_',
            errorPrefix: 'bouncer-error_',
            disableSubmit: true,
            customValidations: {
                editorMaxlength: function(field) {
                    // If the field isn't an .editor textarea, ignore it.
                    if (!$(field).hasClass('editor')) return false;
                    // Get the Editor iframe body.
                    var editor = $(field).parents('.input-wrapper').find('iframe').contents().find('body');
                    if (!editor) return false;
                    // Validate the iframe text() value is less than the maxlength attr.
                        // We use "data-valid-maxlength" and not "data-maxlength || maxlength" because
                        // the Editor adds HTML which increases the textarea character count so we
                        // validate the field's char count instead of setting a hard limit on it.
                    return editor.text().length > Number($(field).attr('data-valid-maxlength'));
                }
            },
            messages: {
                missingValue: {
                    checkbox: 'This field is required',
                    radio: 'Please select an option',
                    select: 'Please select an option',
                    'select-multiple': 'Please select one or more options',
                    default: 'This field is required'
                },
                patternMismatch: {
                    email: 'Please enter a valid email address',
                    url: 'Please enter a valid URL (Example: http://example.com)',
                    number: 'Please enter a number',
                    color: 'Please match the following format: #rrggbb',
                    date: 'Please use the YYYY-MM-DD format',
                    time: 'Please use the 24-hour time format (Example: 23:00)',
                    month: 'Please use the YYYY-MM format (Example: 2065-08)',
                    default: 'Please enter a value in the required format'
                },
                outOfRange: {
                    over: 'Value must not exceed {max} characters',
                    under: 'Value must not be lower than {min} characters'
                },
                // This uses the "maxlength" attr.
                wrongLength: {
                    over: 'Value must not exceed {maxLength} characters',
                    under: 'Value must not be lower than {minLength} characters'
                },
                // This uses the "data-valid-maxlength" attr.
                editorMaxlength: function(field) {
                    var max = Number($(field).attr('data-valid-maxlength'));
                    return 'Value must not exceed '+ max +' characters'
                },
                fallback: 'There was an error with this field'
            }
        });

        //
        // 1) Validate the .editor textarea.
            // This took hours to find a working solution...
            // This code relies on $textarea.trigger('blur');
            // in the tinymce.init() "setup" function.
        // 2) Validate the Select2 <select> field.
            // This codes relies on a .trigger('blur');
            // in the $.fn.createSelect2() function.
        //
        $('textarea.editor, .select2-field').on('blur', function(e) {
            pub.bouncer.validate(this);
        });

        $(document)
        // Event listener for when a field is invalid/valid.
        .on('bouncerShowError bouncerRemoveError', function(e) {
            // Add and remove an error class on the field wrapper.
            $(e.target).parents('.input-wrapper').toggleClass('error',
            (e.type == 'bouncerShowError'));
        })
        // Form is valid event listener.
        .on('bouncerFormValid', function(e) {
            // Form is valid so submit it.
            let form = event.target;

            if ($(form).hasClass('ajax')) {
                // AJAX Form is valid so submit it.
                pub.ajaxSubmitHandler(form);
            }
            else {
                // Native form submit.
                form.submit();
            }
        });

        //
        // AJAX Form submit listener.
            // If you want to AJAX submit a form without Bouncer.js
            // add this class to a form.
        // Otherwise, add ".bouncer" class and pub.ajaxSubmitHandler()
            // gets called when the form validates.
        //
        $('.ajax-submit')
            .on('click', '.form-submit', function(e) {
                $(e.target).addClass('clicked');
            })
            .on('submit', function(e) {
                e.preventDefault();
                // Submit form via AJAX.
                pub.ajaxSubmitHandler(event.target);
            });


        //
        // Set custom Radio/Checkbox states on page load.
        // Check custom Radio/Checkbox field's hidden <input> if the custom field is set the "checked".
            // IMPORTANT! Do this after the $('.input-default-value').each() (above) to check a value
            // if there's no .input-default-value set.
        //
        $('.w-form-formradioinput--inputType-custom').each(function() {
            var $customInput = $(this),
                $input = $customInput.siblings(':input'),
                checked = $customInput.hasClass('w--redirected-checked');

            // Update radio/checkbox state.
            if (checked) {
                pub.toggleCustomInputField($customInput, $input, checked);
            }
        });


        //
        // Form fields: Add maxlength attribute to fields.
        //
        $(':input[data-maxlength]').each(function() {
            $(this).attr('maxlength', HELP.sanitizeHTML( $(this).attr('data-maxlength') ));
        });


        //
        // Format DOB and other date fields on key press.
        //
        $('.format-ddmmyyyy').on('keyup', function(e) {
            if (e && !(e.key == 'Backspace' || e.key == 'Delete')) {
                $(this).val( HELP.formatDDMMYYYY($(this).val()) );
            }
        });


        //
        // Format Phone and other fields on keydown to remove non-numeric characters.
        //
        $(document)
            .on('keydown', '.format-numeric', function(e) {
                let key = HELP.getKey(e);

                // Allow Backspace, Delete, Tab, Arrow keys, etc.
                    // IMPORTANT: Keep this at the top of this function,
                    // otherwise the value can be cleared when you Tab
                    // to the next field.
                if (HELP.allowCommonKeyPress(e, key)) return;

                // Allow numeric digits (0-9).
                if (key >= 0 && key <= 9) return;

                // Prevent all other keys from being entered.
                e.preventDefault();
            })
            .on('change', '.format-numeric', function(e) {
                // Cleanup autocompete values.
                $(e.target).val( HELP.removeNonNumeric( $(e.target).val() ));
            });


        // Format Email on keydown/change to:
            // Lowercase String.
            // Remove whitespace.
            // Remove certain special characters.
            // set "stripChars" to false to format but not remove characters.
        //
        $(document)
            // "change" is to cleanup autocompete values.
            .on('keydown change', '.format-email', function(e, stripChars) {
                var val = $(this).val() || '',
                    key = HELP.getKey(e);

                val = val.toString().toLowerCase()
                    .replace(/\s+/g, ''); // Remove whitespace

                if (key == ' ') {
                    // Prevent adding whitespace.
                    e.preventDefault();
                    return;
                }
                if (stripChars !== false) {
                    // Remove illegal characters
                    val = val.replace(/[^a-z0-9+\-_.@]/gi, '');
                }
                else if (/[^a-z0-9+\-_.@!()]/gi.test(val)) {
                    // Unset val if it has illegal characters on page load.
                    val = '';
                }
                $(this).val(val.trim());
            });
        $('.format-email').each(function() {
            $(this).trigger('change', false);
        });


        //
        // Format URLs on keydown/change to:
            // Lowercase String.
            // Remove whitespace.
            // Add basic protocol if missing.
        // This stops Webflow from producing an field "type" error.
        //
        $(document)
            // Add and remove protocol from empty field.
            // This is so we don't submit the protocol on its own.
            .on('focus blur', '.format-url', function(e) {
                var val = $(this).val();

                if (e.type == 'focus' && !val) {
                    $(this).val( HELP.addHttpProtocol(val) );
                }
                if (e.type == 'blur' && val.length < 9) {
                    $(this).val('');
                }
            })
            // "change" is to cleanup autocompete values.
            .on('keydown change', '.format-url', function(e) {
                var val = $(this).val() || '',
                    key = HELP.getKey(e);

                val = val.toString().toLowerCase()
                    .replace(/\s+/g, ''); // Remove whitespace

                if (val) {
                    // Add protocol if a value is set.
                    val = HELP.addHttpProtocol(val);
                }
                // Prevent adding whitespace.
                if (key == ' ') {
                    e.preventDefault();
                    return;
                }
                $(this).val(val);
            });
        $('.format-url').each(function() {
            $(this).trigger('change');
        });


        //
        // Update form "op" (operation) value on button click.
            // Because Webflow doesn't pass submit button values through to Make...
        //
        $('.form-submit[name="op"]').on('click', function() {
            $(this).parents('form').find('.form-action-op').val( $(this).val() );
        });


        //
        // Translate select lists and rebuild any jQuery Select2 widgets.
        //
        $(document).on('languageChanged.weglot', function(e, newLang, prevLang) {
            $('.select-list-options').each(function() {
                var $select = $(this).parent('.select-list-wrapper').find('select'),
                    i = 0;// Don't use .each() index parameter, you can't advance it with i++.
                
                $('.w-dyn-item', this).each(function() {
                    var $option = $('option', $select).eq(i);
                    // Check if the first item is a placeholder option.
                    if (i == 0 && !$option.val()) {
                        // Skip the first option (has no value).
                        i++;
                        $option = $('option', $select).eq(i);
                    }
                    $option.text( $(this).text() ).val( $(this).data('lang-en') );
                    i++;
                });
                if ($select.hasClass('select2-hidden-accessible')) {
                    $select.select2('destroy');
                    $select.select2( $select.data('select2-options') );
                }
            });
        });


        //
        // Get current Member.
        //
        USER.getCurrentMember(function(member) {
            //
            // Enable any buttons for forms that require a member ID to be provided (if available).
                // Don't think this is used on any forms atm but it's a good FE validation option.
            //
            $('form .form-submit').removeAttr('disabled');
        

            //
            // Populate select fields with Collection List item values.
                // Must be called before the createSelect2() call (below).
                // Keep the following 4 functions in this order to prevent a bug
                // with the select2 fields and setting default values and saving values.
            //
            $('.select-list-options').buildSelectOptions();// #1


            //
            // Select2 dropdowns.// #2
            //
            $('.select2-field').filter(function() {
                // Remove select fields with a certain parent. These get initialized in $.fn.buildSelectOptions().
                return !$(this).parents('.select-list-wrapper').length;
            }).createSelect2();


            //
            // Form fields: Populate field's default values with inline attribute's value.
            //
            $(':input[data-default-value]').inputAttrDefaultValue();// #3
            

            //
            // Form fields: Populate field's default values with sibling DIV's content.
            //
            $('.input-default-value').inputDefaultValue();// #4


            //
            // File upload fields.
                // Wait for getMember() method to respond because the CV upload field
                // uses the [data-ms-member="cv-filename"] MS attribute to show the
                // CV filename, which JS uses to show the file details and hide the
                // upload file field.
            //
            pub.uploadFields();
        });


        //
        // LitBox support.
        //
        // $(document)
            // .on('lbox_open', function() {
                // Create any new Select2 fields.
                // Make sure it's not been initiated already (inline HTML from the same page) using :not().
                // $('#litbox .select2-field:not(.select2-hidden-accessible)').createSelect2();
            // });


        //
        // Init:
        //
        // Textarea char count (not used with WYSIWYG editor).
        $('.char-count[maxlength]:not(.editor)').charCountTextareas();
    });

    return pub;
}(jQuery, this, this.document));



//
// Extend jQuery.
//
$.fn.initEditor = function() {
    var $textareas = $(this).filter(function() {
        // Filter out any textareas that are within a .hide-live parent.
            // These will get initialised in JS when needed. This fixes a
            // Litbox bug where the Editors <body> was empty when loaded
            // into a Litbox...
        return $(this).parents('.hide-live').length < 1;
    });

    // Init.
    if ($textareas.length < 1) return;

    var editorOptions = FORMS.editorOptions;
    $textareas.each(function() {
        // Add element specific options.
        editorOptions.target = this;
        // Create.
        tinymce.init(editorOptions);
    });
};


//
// Form fields: Populate field's default values with inline attribute's value.
//
$.fn.inputAttrDefaultValue = function() {
    $(this).each(function() {
        var $el = $(this),
            val = $el.attr('data-default-value');

        if (!$el.val()) {
            // Remove non-number characters from value so it can be set as a value.
            if ($el.attr('type') == 'number') {
                val = HELP.removeNonNumeric(val);
            }
            $el.val(HELP.sanitizeHTML(val, false, false)).trigger('change');
        }
    })
};


//
// Form fields: Populate field's default values with sibling DIV's content.
//
$.fn.inputDefaultValue = function() {
    $(this).each(function() {
        var $el = $(this),
            text = $el.text(),
            $input = $el.parents('.input-wrapper').find(':input'),
            type = $input.eq(0).attr('type');

        if (type == 'checkbox' || type == 'radio') {
            $input.each(function() {
                var $customInput = $(this).siblings(`.w-${type}-input`),
                    // If text of the .input-default-value matches the radio's value.
                    bool = !!text && text == $(this).val();

                if (type == 'checkbox') {
                    // bool value can either be empty, for non-Switch WF fields
                    //or "true/false" (String), for Switch WF fields.
                    bool = !!text && text !== "false";
                }
                // Update radio/checkbox state.
                FORMS.toggleCustomInputField($customInput, $(this), bool);
            });
        }
        else if (!$input.val()) {
            if ($input.hasClass('editor')) {
                // Add raw HTML to input (textarea.editor).
                $input.val($el.html());
            }
            else {
                // Add basic text with newlines.
                $input.val( HELP.stripHTMLWithLinebreaks($el.html()) );
            }
            $input.trigger('change');
        }
    });
};


//
// Form fields: Populate select with option elements built from WF Collection List data.
//
$.fn.buildSelectOptions = function(options) {
    options = options || {};

    $.each(this, function(i, el) {
        var wrapper = $(this).parent('.select-list-wrapper'),
            $select = $('select', wrapper),
            $default = $('.input-default-value', wrapper),
            defaultValue = !!$default.text() ? $default.text() : $default.attr('data-value'),
            values = [],
            isMultiSelect = $select.is('select[multiple]');

        if (isMultiSelect) {
            defaultValue = $('.w-dyn-item', $default).map(function() { return $.trim($(this).text()) });
        }
        else {
            defaultValue = $.trim(HELP.sanitizeHTML(defaultValue)) || '';
        }
        $(this).find('.w-dyn-item').each(function() {
            var $enItem = $(this).find('.no-translate'),
                enVal = $enItem.text();

            $(this).data('lang-en', enVal);// Store a non-translated string in .data().
            $enItem.remove();// Remove the English text so it doesn't get added in the <option>.

            var val = $.trim($(this).text()),
                selected = (val == defaultValue) ? 'selected' : false;

            if (isMultiSelect) {
                selected = ($.inArray(val, defaultValue) > -1);
            }
            if (!val || $.inArray(val, values) > -1) return;// Skip empty or duplicate values.
            values.push(val);

            $('<option />', {
                value: enVal,
                selected: selected
            }).text(val).appendTo($select);
        });
        $select.trigger('change');

        if ($select.hasClass('select2-field')) {
            $select.createSelect2();
        }
    });
};


//
// Create jQuery Select2 widget.
  // Use this instead of .select2() when first initializing a widget.
//
$.fn.createSelect2 = function(options) {
    options = options || {};
    var items = this;

    if (!$(items).length) return false;

    HELP.waitFor(jQuery, "fn.select2", 100, function() {
        var ops;
        $.each(items, function(i, el) {
            ops = options;
            ops.placeholder = $(el).attr('placeholder') || "Select...";
            ops.minimumResultsForSearch = options.minimumResultsForSearch || 19;
            ops.dropdownParent = $(el).parents('form') || $('body');
            var selected = $(el).find('option[selected]');
            
            // If the select doesn't have a "multiple" attribute.
            if (!$(el).attr('multiple')) {
                // For the placeholder to appear, you need a blank <option> as the first option.
                $(el).prepend('<option value="">'+ HELP.sanitizeHTML(ops.placeholder) +'</option>');
            }
            
            $(el).select2(ops)
                // Store options in .data() incase we need to destroy and rebuild the select2 widget.
                // This happens when the language is changed.
                .data('select2-options', ops)
                // Sets the default option:
                .val(!!selected.length ? $(el).val() : '').trigger('change')
                .on('change', function() {
                    // Trigger Bouncer form validation.
                    $(this).trigger('blur');
                });
        });
    });
};


//
// Add a character count widget to textareas that have a class and maxlength attr.
//
$.fn.charCountTextareas = function() {
    $(this).each(function() {
        FORMS.setupCharCount($(this), $(this).val().length, $(this).attr('data-valid-maxlength'));
    });
    $(document).on('keyup', this, function(e) {
        FORMS.updateCharCount($(e.target), $(e.target).val().length, $(e.target).attr('data-valid-maxlength'))
    });
};


//
// Form element has value/is selected or is checked, selector ":selectedInput".
//
jQuery.expr[':'].selectedInput = (el, i, m) => {
    var exclude = ['submit', 'button', 'reset', 'hidden'];

    if (el.type == 'checkbox' || el.type == 'radio') {
        return el.checked;
    }
    else if (exclude.indexOf(el.type) < 0) {
        return el.value;
    }
    return false;
};



