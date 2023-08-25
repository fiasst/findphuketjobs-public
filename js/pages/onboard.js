var ONBOARD = (function($, window, document, undefined) {
    var pub = {},
        onboardCookieName = 'fpj_onboarding';


    //
    // Update onboarding cookie if querystring values exist.
    //
    var onboardingCookie = function() {
        var stype = HELP.getSetQuerystring('signup_type'),
            sbusiness = HELP.getSetQuerystring('signup_biz'),
            obj;

        if (stype || sbusiness) {
            obj = {
                'type': stype || null,
                'business': !!sbusiness ? decodeURIComponent(window.atob(sbusiness)) : null
            };
        }
        if (!!obj) {
            HELP.setCookie(onboardCookieName, JSON.stringify(obj) );
        }
    }();


    //
    // On DOM ready.
    //
    $(function() {
        //
        // Add onboarding values to register forms.
        //
        var onboard = HELP.getCookie(onboardCookieName);

        if (!!onboard) {
            var $form = $('form.form-register');

            if (HELP.checkKeyExists(onboard, 'type')) {
                $('input[name="signup_type"]', $form).val(onboard.type);
            }
            if (HELP.checkKeyExists(onboard, 'business')) {
                $('input[name="signup_biz"]', $form).val(onboard.business);
            }
        }
    });


    return pub;
}(jQuery, this, this.document));



