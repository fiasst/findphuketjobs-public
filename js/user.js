USER = (function($, window, document, undefined) {
    var pub = {};


    //
    //
    //
    pub.current = HELP.getCookie("MSmember") || {};


    //
    // Look for onboarding cookie.
    //
    var onboard = HELP.getCookie('fpj_onboarding');
    if (!!onboard) {
        // Load onboarding.js to display a welcome message on any page of site.
        $LAB
        .script("//cdn.jsdelivr.net/gh/fiasst/findphuketjobs-public@"+repoVersion+"/js/pages/onboard-min.js");
    }


    //
    // Useful for When a user deletes their account and clicks the final modal CTA.
    //
    pub.logout = () => {
        MAIN.thinking(true);
        USER.current = null;
        HELP.setCookie("MSmember", null);
        $memberstackDom.logout().then(() => {
            // Delay so MS can catch up and display login/register links on page change.
            setTimeout(function() {
                window.location.href = '/';
            }, 1500);
        });
    };


    //
    // Launch the Stripe portal for managing payments and subscriptions.
    // Useful when a link loads via AJAX and doesn't trigger the MS [data-ms-action="customer-portal"] event.
    //
    pub.launchStripeCustomerPortal = () => {
        MAIN.thinking(true, false);
        HELP.waitFor(window, "$memberstackDom", 50, function() {
            $memberstackDom.launchStripeCustomerPortal();
        });
    }


    //
    //
    //
    pub.updateCurrentUser = function(obj) {
        USER.current = USER.current || pub.current;

        // Merge into current user var.
        $.extend(true, USER.current, obj);
    };


    //
    // Get the current Member then fire callback function.
    //
    pub.getCurrentMember = function(callback) {
        USER.current = USER.current || pub.current;

        if (HELP.checkKeyExists(USER, 'current.id')) {
            // Fire callback.
            if (!!callback){
                callback(USER.current);
                return;
            }
            // Return member object.
            return USER.current;
        }
        HELP.waitFor(window, "$memberstackDom", 50, function() {
            $memberstackDom.getCurrentMember().then(({ data: member }) => {
                member = member || {};
                pub.updateCurrentUser(member);

                if (!!callback) callback(USER.current);
                return USER.current;
            });
        });
    };


    //
    // Update the current Member (only Custom Fields atm) then fire callback function.
    //
    pub.updateCurrentMember = function(obj, callback) {
        HELP.waitFor(window, "$memberstackDom", 50, function() {
            $memberstackDom.updateMember({'customFields': obj}).then(({ data: member }) => {
                member = member || {};
                pub.updateCurrentUser(member);

                if (!!callback) callback(USER.current);
                return USER.current;
            });
        });
    };
    

    //
    // Get Member's JSON then fire callback function.
    //
    pub.getMemberJSON = function(callback) {
        HELP.waitFor(window, "$memberstackDom", 50, function() {
            $memberstackDom.getMemberJSON().then(({ data: memberJSON }) => {
                memberJSON = memberJSON || {};

                if (!!callback) callback(memberJSON);
                return memberJSON;
            });
        });
    };


    //
    // Update Member's JSON.
    //
    pub.updateMemberJSON = function(json, callback) {
        HELP.waitFor(window, "$memberstackDom", 50, function() {
            $memberstackDom.updateMemberJSON({ json: json }).then(({ data: memberJSON }) => {
                memberJSON = memberJSON || {};

                if (!!callback) callback(memberJSON);
                return memberJSON;
            });
        });
    };


    //
    //
    //
    pub.getMemberPlans = function(planType, member, activeOnly) {
        member = member || pub.getCurrentMember();

        if (HELP.checkKeyExists(member, 'planConnections') && !!member.planConnections.length) {
            // Get active plans.
            var plans = member.planConnections;

            if (activeOnly) {
                // Filter plans by status set to "ACTIVE" or "TRIALING".
                plans = HELP.filterArrayByObjectValue(plans, 'status', ['ACTIVE', 'TRIALING']);
            }

            // Filter plans by type set to <planType>.
            if (planType) {
                plans = HELP.filterArrayByObjectValue(plans, 'type', planType);
            }
            return plans;
        }
        return [];
    };


    //
    // init.
    //
    pub.getCurrentMember();


    //
    // Deleted user account callback.
    //
    pub.ghostLogout = function() {
        // CTA button is in the dialog confirming your account was deleted.
        $(document).on('click', '#trigger-ghost-logout', pub.logout);
    };


    //
    // On DOM ready.
    //
    $(function() {
        //
        // Launch Stripe Customer Portal with custom trigger.
        //
        $(document).on('click', '.trigger-customer-portal', function(e) {
            e.preventDefault();
            pub.launchStripeCustomerPortal()
        });
    });
    


    return pub;
}(jQuery, this, this.document));





