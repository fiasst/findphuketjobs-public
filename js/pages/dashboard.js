var DASHBOARD = (function($, window, document, undefined) {
    var pub = {};


    // On DOM ready.
    $(function() {
        // Make tab active if there's only 1 tab pane (a Jobseeker's Applications).
        var $tabPanes = $('#my-content .w-tab-pane');
        if ($tabPanes.length === 1) {
            // Show the only remaining pane.
            $tabPanes.addClass('w--tab-active');
        }


        $('#wf-form-Delete-Account-Form').on('submit', function(e) {
            e.preventDefault();

            var data = {
                "message": "Confirm you want to cancel any subscriptions, delete you account, and erase your personal data.",
                "type": "warning",
                "options": {
                    "title": "One final check...",
                    "actions": [
                        {
                            "type": "button",
                            "text": "No, take me to safety",
                            "attributes": {
                                "class": "button-secondary link-dashboard trigger-lbox-close",
                                "href": "#"
                            }
                        },
                        {
                            "type": "button",
                            "text": "Yes, Delete my account",
                            "attributes": {
                                "class": "button-primary danger trigger-lbox-close",
                                "href": "#",
                                "id": "trigger-delete-account"
                            }
                        }
                    ]
                }
            };

            if ($('#field-confirm').val().toLowerCase() != "delete") {
                data.message = "You must type \"DELETE\" in the required field to confirm that you want to delete your account.";
                data.type = "info";
                data.title = "Field required";
                data.actions = [
                    {
                        "type": "button",
                        "text": "OK",
                        "attributes": {
                            "class": "button-secondary trigger-lbox-close",
                            "href": "#"
                        }
                    }
                ];
            }
            
            MAIN.openDialog(data);

            $(document).on('click', '#trigger-delete-account', function() {
                MAIN.thinking(true, true);
                alert('deleting account...');
            });
        });
    });


    return pub;
}(jQuery, this, this.document));

