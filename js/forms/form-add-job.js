var FORM_ADD_JOB = (function($, window, document, undefined) {
    var pub = {};


    //
    // On DOM ready.
    //
    $(function() {
        $("#wf-form-Add-Job-Form").validate({
            rules: {
                job_description: {
                    required: true
                },
                job_requirements: {
                    // required: true
                },
                job_responsibilities: {
                    // maxlength: $('input[name="job_responsibilities]').attr('maxlength')
                }
            }
        });
    });

    return pub;
}(jQuery, this, this.document));
