//
// Load this file on all pages that include a register form.
//
var ONBOARD = (function($, window, document, undefined) {
    var pub = {},
        onboardStorage = 'fpj_onboarding';


    //
    // Update onboarding localStorage if querystring values exist.
    //
    var onboardingData = function() {
        var signup = HELP.getSetQuerystring('signup'),
            business = HELP.getSetQuerystring('signup_biz'),
            language = HELP.getSetQuerystring('lang'),
            obj;

        if (signup || business) {
            obj = {
                'signup': signup || null,
                'business': !!business ? decodeURIComponent(business) : null,
                'language': language || null
            };
        }
        if (!!obj) {
            // Set campaign localStorage.
            HELP.setLocalStorage(onboardStorage, obj);
        }
    }();


    //
    // On DOM ready.
    //
    $(function() {
        //
        // Add onboarding values to register forms or member.
        //
        var onboard = HELP.getLocalStorage(onboardStorage);
        // Check localStorage exists.
        if (!!onboard) {
            // Get current Member.
            USER.getCurrentMember(function(member) {
                if (!HELP.checkKeyExists(member, 'id')) {
                    // User is NOT logged in.

                    // Add values to register form fields.
                    var $form = $('form.form-register');

                    if (HELP.checkKeyExists(onboard, 'signup')) {
                        $('input[name="signup"]', $form).val(HELP.sanitizeHTML(onboard.signup));
                    }
                    if (HELP.checkKeyExists(onboard, 'business')) {
                        $('input[name="signup_biz"]', $form).val(HELP.sanitizeHTML(onboard.business));
                    }
                    if (HELP.checkKeyExists(onboard, 'language')) {
                        $('input[name="language"]', $form).val(HELP.sanitizeHTML(onboard.language));
                    }

                    // Update language field if user switches language.
                    HELP.waitFor(window, "Weglot", 100, function() {
                        Weglot.on("languageChanged", function(newLang, prevLang) {
                            $('form.form-register input[name="language"]').val(newLang);
                        });
                    });
                }
                else {
                    // User is logged in with the localStorage set.
                    // Show welcome message.
                    MAIN.dialog({
                        message: `[h1 class="title size-h2 text-center"]Welcome 🤩[/h1][p class="context text-center"]We're so glad you joined![/p]
[p]You don't need to add your Business to your account or do anything else, we'll take care of everything for you. We will email you once your current jobs have been added to the website.[/p]
[p]There's absolutely no fee for trying our service. However, you can see plan details on this page, should you wish to add additional jobs.[/p]
[p]Thank you again and welcome! - Team [strong]Find Phuket Jobs[/strong][/p]`,
                        type: "success",
                        mode: "dialog",
                        options: {
                            title: false,
                            overlayClose: false,
                            closeButton: false,
                            actions: [{
                                type: "button",
                                text: "Close",
                                attributes: {
                                    class: "button-primary trigger-lbox-close",
                                    href: "#"
                                }
                            }]
                        }
                    });

                    // Delete the localStorage when Dialog button is clicked.
                    $(document).one('click', '.trigger-lbox-close', function(e) {
                        HELP.deleteLocalStorage(onboardStorage);
                    });
                }
            });
        }
    });


    return pub;
}(jQuery, this, this.document));



