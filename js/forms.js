var FORMS = (function($, window, document, undefined) {
    var pub = {};


    //
    // Show/hide existing file details and replace with file upload field.
    //
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
    // Strip HTML and count remaining characters in WYSIWYG Editor.
    //
    /*pub.editorCharacterCount = function(editor) {
        var decodeHtml = function(html) {
                return $('<textarea>').html(html).val();
            },
            decoded = decodeHtml( editor.getContent({format: 'text'}) );// {format: 'raw'}

        // here we strip all HTML tags
        // return decoded.replace(/(<([^>]+)>)/ig, "").trim().length;
        return decoded;
    };*/


    //
    // WYSIWYG Editor.
    // 
    pub.initEditor = function() {
        // var url = "https://cdn.tiny.cloud/1/pxssr84xhkkrv98f96sukcuph48qknaw74tr513ccdtfxqm7/tinymce/6/tinymce.min.js";
        // $LAB.script(url).wait(function() {
            // $('textarea.editor').each(function() {
                //
                // TinyMCE custom character count plugin.
                //
                /*tinymce.PluginManager.add('pluginId', (editor, url) => {
                    // add plugin code here
                    var self = this,
                        update = function() {
                            $(editor).parent().find('.char-count span').text( pub.editorCharacterCount(editor) );
                        };

                    editor.on('init', function () {
                        if (editor.settings.char_count && editor.settings.maxlength) {
                            editor
                                .after('<div class="char-count"><span>0</span> / '+ editor.settings.maxlength +'</div>')
                                .parent().addClass('char-count-wrapper')

                                .on('setcontent beforeaddundo', update)
                                .on('keyup', function (e) {
                                    update();
                                });
                        }
                    });
                    return {
                        getMetadata: () => ({
                            name: 'charcount'
                        })
                    }
                });*/


                //
                // Init.
                //
                tinymce.init({
                    selector: 'textarea.editor',
                    // target: this,
                    toolbar: 'undo redo | bold | bullist numlist',
                    plugins: 'lists',
                    min_height: 200,
                    max_height: 400,
                    menubar: false,
                    branding: false,
                    statusbar: false,
                    // readonly: !!$(this).attr('disabled'),
                    custom_undo_redo_levels: 8,
                    setup: function (editor) {
                        const $textarea = $(editor.targetElm),
                            max = Number(HELP.sanitizeHTML($textarea.attr('maxlength'))),
                            update = (editor, count) => {
                                $(editor.getContainer()).parent().find('.char-count span')
                                    .toggleClass('danger', count >= max).text(count);
                            };

                        $textarea.addClass('editor-processed');

                        editor
                            .on('keydown keyup change', function(e) {
                                let editor = this,
                                    count = editor.getContent({format: 'text'}).length,
                                    $container = $(editor.getContainer());
                                
                                if (e.type == 'keydown') {
                                    if (count >= max) {
                                        let key = ('key' in e) ? e.key : e.keyCode;

                                        // Allow Backspace, Delete keys, etc.
                                        if (!HELP.allowCommonKeyPress(e, key)) {
                                            e.preventDefault();
                                        }
                                    }
                                }
                                else {
                                    console.log(1, editor)
                                    console.log(2, count)
                                    console.log(3, max)
                                    console.log(4, $container)

                                    update(editor, count);
                                    
                                    // Remove previous error message.
                                    $container.parent().find('.editor-valid').remove();
                                    
                                    if (count > max) {
                                        $(`<div class="editor-valid error">Enter a maximum of ${max} characters.</div>`).insertAfter($container);
                                    }
                                }
                            })
                            .on('submit', function(e) {
                                let editor = this;

                                if (editor.getContent({format: 'text'}).length > max) {
                                    // alert("Maximum " + max + " characters allowed.");
                                    e.preventDefault();
                                    return false;
                                }
                            });
                    },
                    init_instance_callback: function(editor) {
                        let $textarea = $(editor.targetElm),
                            max = HELP.sanitizeHTML($textarea.attr('maxlength')),
                            $container = $(editor.getContainer());
                        
                        if (max) {
                            $container
                                .after(`<div class="char-count"><span>0</span> / ${max}</div>`)
                                .parent().addClass('char-count-wrapper')
                        }
                    }
                });
            // });
        // });
    };


    //
    // On DOM ready.
    //
    $(function() {
        //
        // Get current Member.
        //
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
        //  General AJAX form submit handler.
        //
        $('.ajax-submit')
        .on('click', '.form-submit', function(e) {
            $(e.target).addClass('clicked');

            // Prepare TinyMCE values.
            if (HELP.checkKeyExists(window, 'tinymce')) {
                tinymce.triggerSave();
            }
        })
        .on('submit', function(e) {
            e.preventDefault();

            var $form = $(this),
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
                },
                callbackError: function(data) {
                    MAIN.thinking(false);
                    console.log('error');
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
        });


        //
        // Form fields: Populate field's default values with inline attribute's value.
        //
        $(':input[data-default-value]').each(function() {
            var $el = $(this),
                val = $el.attr('data-default-value');

            if (!$el.val()) {
                // Remove non-number characters from value so it can be set as a value.
                if ($el.attr('type') == 'number') val = HELP.removeNonNumeric(val);
                $el.val( HELP.sanitizeHTML(val) );
            }
        });


        //
        // Form fields: Populate field's default values with sibling DIV's content.
        //
        $('.input-default-value').each(function() {
            var $el = $(this),
                text = $el.text(),
                $input = $el.parent().find(':input'),
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
                    pub.toggleCustomInputField($customInput, $(this), bool);
                });
            }
            else if (!$input.val()) {
                $input.val( HELP.stripHTMLWithLinebreaks($el.html()) );
            }
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
        $('.format-numeric')
            .on('keydown', function(e) {
                let key = ('key' in e) ? e.key : e.keyCode;

                // Allow Backspace, Delete keys, etc.
                if (HELP.allowCommonKeyPress(e, key)) return;

                // Allow numeric digits (0-9).
                if (key >= 0 && key <= 9) {
                    return;
                }
                // Prevent all other keys from being entered.
                e.preventDefault();
            })
            .on('change', function() {
                // Cleanup autocompete values.
                $(this).val( HELP.removeNonNumeric( $(this).val() ));
            });


        // Format Email on keydown/change to:
            // Lowercase String.
            // Remove whitespace.
            // Remove certain special characters.
            // set "stripChars" to false to format but not remove characters.
        //
        $('.format-email')
            // "change" is to cleanup autocompete values.
            .on('keydown change', function(e, stripChars) {
                var val = $(this).val() || '',
                    key = ('key' in e) ? e.key : e.keyCode;

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
            })
            .each(function(i, field) {
                $(field).trigger('change', false);
            });


        //
        // Format URLs on keydown/change to:
            // Lowercase String.
            // Remove whitespace.
            // Add basic protocol if missing.
        // This stops Webflow from producing an field "type" error.
        //
        $('.format-url')
            // Add and remove protocol from empty field.
            // This is so we don't submit the protocol on its own.
            .on('focus blur', function(e) {
                var val = $(this).val();

                if (e.type == 'focus' && !val) {
                    $(this).val( HELP.addHttpProtocol(val) );
                }
                if (e.type == 'blur' && val.length < 9) {
                    $(this).val('');
                }
            })
            // "change" is to cleanup autocompete values.
            .on('keydown change', function(e) {
                var val = $(this).val() || '',
                    key = ('key' in e) ? e.key : e.keyCode;

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
            })
            .each(function(i, field) {
                $(field).trigger('change');
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


        //
        // Select dropdowns and Select2 widgets.
        //
        HELP.waitFor(USER, "current.id", 50, function() {
            //
            // Populate select fields with Collection List item values.
                // Must be called before the createSelect2() call (below).
            //
            $('.select-list-options').buildSelectOptions();


            //
            // Select2 dropdowns.
            //
            $('.select2-field').filter(function() {
                // Remove select fields with a certain parent. These get initialized in $.fn.buildSelectOptions().
                return !$(this).parents('.select-list-wrapper').length;
            }).createSelect2();
        });


        //
        // LitBox support.
        //
        $(document)
            .on('lbox_open', function() {
                // Create any new Select2 fields.
                // Make sure it's not been initiated already (inline HTML from the same page) using :not().
                // $('#litbox .select2-field:not(.select2-hidden-accessible)').createSelect2();
            });


        //
        // Init:
        //
        pub.uploadFields();
        // Textarea char count (not used with WYSIWYG editor).
        $('.char-count[maxlength]:not(.editor)').charCountTextareas();
    });

    return pub;
}(jQuery, this, this.document));



//
// Extend jQuery.
//
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

        defaultValue = $.trim(HELP.sanitizeHTML(defaultValue)) || '';

        if (isMultiSelect) {
            defaultValue = defaultValue.split('|');
        }

        $(this).find('.w-dyn-item').each(function() {
            var val = $.trim($(this).text()),
                selected = (val == defaultValue) ? 'selected' : false;

            if (isMultiSelect) {
                selected = ($.inArray(val, defaultValue) > -1);
            }

            if (!val || $.inArray(val, values) > -1) return;// Skip empty or duplicate values.
            values.push(val);

            $(this).data('lang-en', val);// Store a non-translated string in .data().

            $('<option />', {
                value: val,
                selected: selected
            }).text(val).appendTo( $select );
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
                .val( !!selected.length ? $(el).val() : '' ).trigger('change');
        });
    });
};


//
// Add a character count widget to textareas that have a class and maxlength attr.
//
$.fn.charCountTextareas = function() {
    $(this).each(function() {
        // Sanitize (XSS safe) attribute value to remove any HTML.
        var max = HELP.sanitizeHTML($(this).attr('maxlength'));
        
        $(this)
            .after(`<div class="char-count"><span>0</span> / ${max}</div>`)
            .parent().addClass('char-count-wrapper')
    });
    $(document).on('keyup', this, function(e) {
        let count = $(e.target).val().length;

        $(e.target).parent().find('.char-count span')
            .toggleClass('danger', count >= Number($(e.target).attr('maxlength'))).text(count);
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



