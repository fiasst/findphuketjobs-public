var APPLY = (function($, window, document, undefined){
    var pub = {};


    // On DOM ready.
    $(function(){
    
        // AJAX forms.
        $('#wf-form-Apply-Form')
        .on('click', '.form-submit', function(e){
            $(e.target).addClass('clicked');
        })
        .on('submit', function(e){
            e.preventDefault();

            var form = $(this),
                button = form.find('.form-submit.clicked'),
                data = HELP.getFormValues(form, 'formData');

            MAIN.buttonThinking(button);

            HELP.sendAJAX({
                url: form.attr('action'),
                method: form.attr('method'),
                data: data,
                processData: false,
                contentType: false,
                cache: false,
                timeout: 120000,
                callbackSuccess: function(data, textStatus){
                    MAIN.handleAjaxResponse(data, form);
                }
            }, form);
        });


        // Add company form in Colorbox.
        $('.trigger-apply').on('click', function(e, onComplete){
            e.preventDefault();

            HELP.waitFor(window.jQuery, 'litbox', 100, function(){
                // LitBox
                $.litbox({
                    title: 'Apply for this job',
                    href: '#apply',
                    inline: true,
                    returnFocus: false,
                    trapFocus: false,
                    overlayClose: false,
                    escKey: false,
                    css: {
                        xs: {
                            offset: 20,
                            maxWidth: 900,
                            width: '100%',
                            opacity: 0.4
                        }
                    }
                });
            });
        });
    });

    return pub;
}(jQuery, this, this.document));

