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
                }
                else {
                    // User is logged in with the localStorage set.
                    // Show welcome message.
                    MAIN.dialog({
                        message: `[h1 class="title size-h2 text-center"]Welcome 🤩[/h1][p class="context text-center"]We're so glad you've joined our launch![/p]
[p]We'll email you once your current jobs have been added to the website. There’s no need to add your Business to your account, we’ll do that for you.[/p]
[p]There's absolutely no fee for trying our service during our launch. However, you can see plan details on this page, should you wish to add additional businesses or jobs.[/p]
[p]Since our website is new, there's bound to be lots of features not yet included. We appreciate your patience while we make big improvements in the months to come.[/p]
[p]Thank you - [strong]team Find Phuket Jobs[/strong][/p]`,
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



