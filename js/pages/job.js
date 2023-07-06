var JOB = (function($, window, document, undefined) {
    var pub = {};


    // On DOM ready.
    $(function() {
        // Show/Remove review section.
        var $reviewForm = $('form[data-name="Static job revision form"]'),
            status = "{{wf {&quot;path&quot;:&quot;published-status&quot;,&quot;type&quot;:&quot;Option&quot;\} }}";
        
        MAIN.controlHTML(
            $('#section-review'), 
            (status != "Published" || MAIN.itemState("review", status) && !!$reviewForm.length)
        );
        // Show/Remove edit section.
        MAIN.controlHTML($('#section-edit'), MAIN.itemState("edit", status));


        // Archive Job Trigger.
        $('#link-archive').on('click', function() {
            $('#form-edit-job button[value="archive"]').trigger('click');
        });


        // Show the rejection comments field.
        $('.comments-trigger').on('click', function(e) {
            e.preventDefault();
            var $wrapper = $(this).parents('form');
            
            $(this).hide();
            $wrapper.find('.comments-wrapper, .reject-button').removeClass('hide');
        });


        // Reject form submit.
        $('.reject-button').on('click', function() {
            if ($(this).hasClass('revision')) {
                // Move comments value across to the actual job review form.
                $('#compare-review').find('[name="comments"]').val(
                    $('#compare-existing').find('[name="comments"]').val()
                );
                // Submit form.
                $('#compare-review button[value="reject_revisions"]').trigger('click');
            }
        });


        // Revision rejection form submit listener.
        $('form[data-name="Review job form"]').on('submit', function() {
            // If "op" is to reject the revision...
            if ($('.form-action-op', this).val() == 'reject_revisions') {
                var $button = $('form[data-name="Static job revision form"] .reject-button');
                
                // Animate button.
                MAIN.buttonThinking($button);
            }
        });


        // Remove the Revision flag from Job Title form field values.
        $('input[name="job-title"]').each(function() {
            $(this).val( $(this).val().replace('[Revision] ', '') );
        });


        // Clone form values to the Review form.
        var $forms = $('#compare-existing').find('form');
        if ($forms.length > 1) {
            var formValues = HELP.getFormValues($forms.last());

            $.each(formValues, function(key, value) {
                if ($forms.length > 1) {
                    // Compare fields in both forms and highlight differences.
                    var $field1 = $($forms.get(0)).find('[name="'+ key +'"]'),
                        $field2 = $($forms.get(1)).find('[name="'+ key +'"]');
                    if (!!($field1.length && $field2.length) && ($field1.val() != $field2.val())) {
                        $field2.addClass('difference');
                    }
                }
                // Copy value from last existing form to the review form's fields.
                $('#compare-review').find('[name="'+ key +'"]').val(value).trigger('change');
            });
        }

        // Make the Current tab active if there's no Revisions.
        if (!!$('#compare-existing .w-tab-pane:last-child .w-dyn-empty').length) {
            // Empty element exists so there's no Revisions. Show Current tab content.
            $('#compare-existing .w-tab-menu .w-tab-link:first-child').trigger('click');
            $('#compare-review').removeClass('no-tabs');
        }
    });


    return pub;
}(jQuery, this, this.document));

