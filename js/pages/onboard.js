//
// Load this file on all pages that include a register form.
//
var ONBOARD = (function($, window, document, undefined) {
    var pub = {},
        onboardCookieName = 'fpj_onboarding';


    //
    // Update onboarding cookie if querystring values exist.
    //
    var onboardingCookie = function() {
        var stype = HELP.getSetQuerystring('signup'),
            sbusiness = HELP.getSetQuerystring('signup_biz'),
            obj;

        if (stype || sbusiness) {
            obj = {
                'type': stype || null,
                'business': !!sbusiness ? decodeURIComponent(window.atob(sbusiness)) : null
            };
        }
        if (!!obj) {
            // Set campaign cookie.
            HELP.setCookie(onboardCookieName, JSON.stringify(obj) );
        }
    }();


    //
    // On DOM ready.
    //
    $(function() {
        //
        // Add onboarding values to register forms or member.
        //
        var signup = HELP.getCookie(onboardCookieName);
        // Check cookie exists.
        if (!!signup) {
            // Get current Member.
            USER.getCurrentMember(function(member) {
                if (!HELP.checkKeyExists(member, 'id')) {
                    // User is NOT logged in.

                    // Add values to register form fields.
                    var $form = $('form.form-register');

                    if (HELP.checkKeyExists(signup, 'type')) {
                        $('input[name="campaign"]', $form).val(signup.type);
                    }
                    if (HELP.checkKeyExists(signup, 'business')) {
                        $('input[name="signup_biz"]', $form).val(signup.business);
                    }
                }
                else {
                    // User is logged in with the cookie set.
                    // Show welcome message.
                    MAIN.dialog({
                        message: `[p][strong]Thank you for creating an account and joining our Soft-launch![/strong] We're so glad you decided to give our service a try.[/p]
[p]We'll send you an email once your current job vacancies have been posted. There’s no need to add your Business to your account, we’ll do that for you.[/p]
[p]Since our website is new, there's bound to be some technical faults and lots of features not yet included. We appreciate your patience while we make big improvements in the months to come.[/p]
[p]Thanks again and welcome - team Find Phuket Jobs[/p]`,
                        type: "success",
                        mode: "dialog",
                        options: {
                            title: "Welcome!",
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

                    // Delete the cookie when Dialog button is clicked.
                    $(document).one('click', '.trigger-lbox-close', function(e) {
                        HELP.deleteCookie(onboardCookieName);
                    });
                }
            });
        }
    });


    return pub;
}(jQuery, this, this.document));



