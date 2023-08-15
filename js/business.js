var BUSINESS = (function($, window, document, undefined) {
    var pub = {},
        businessesMax,
        formActivebusinessesID = '#wf-form-Update-Active-Businesses-Form';


    // Memberstack user business limits by planId.
    pub.businessLimit = {
        "pln_credit-package-1-p63bl01ya": 1,
        "pln_credit-package-2-pg3bd0zgw": 1,
        "pln_credit-package-3-la3be0z5o": 1,
        "pln_subscription-package-1-p73bj0zxa": 1,
        "pln_subscription-package-2-il3bk0zto": 3,
        "pln_subscription-package-3-9x3bl0z6j": 5
    };


    // Check if the user is exceeding the number of active businesses allowed for the current subscription.
    // If so, launch a UI to select which businesses they want to keep active within the limit.
    pub.checkBusinessLimits = function(businesses, activeOnly) {
        var plans = USER.getMemberPlans(false, false, true),// Active plans only.
            planLimits = BUSINESS.businessLimit;

        // Update global vars (to be used elsewhere).
        businessesMax = 1;

        if (activeOnly) {
            // Filter out businesses with state NOT set to "active".
            businesses = HELP.filterArrayByObjectValue(businesses, 'state', 'active');
        }

        // Get the max business limit of a user for all active plans in their account.
        $.each(plans, function(i, plan) {
            if (planLimits[plan.planId] > businessesMax) {
                businessesMax = planLimits[plan.planId];
            }
        });

        // How much are they exceeding their business limit by.
            // Want to know if > (exceeding) when building business dropdown list.
            // Want to know when >= when trying to add a new business.
        return businesses.length - businessesMax;
    };


    pub.updateActiveBusinesses = function(businesses) {
        var businessesText = HELP.pluralize(businessesMax, 'business', 'businesses'),
            $form = $(formActivebusinessesID),
            $businessItem = $form.find('.js-business');

        // Replace token text with business limit.
        $form.find('.js-num-businesses').text(businessesText);


        // Remove the Add Job and Add Business forms.
        $('.form-job-step-2, #business-form-wrapper').remove();

        // Remove the template item.
        $businessItem.hide();

        // Build a checkbox list of user's businesses.
        $.each(businesses, function(i, business) {
            // Clone template item.
            var $newItem = $businessItem.clone().show(),
                registeredName = !!business.registeredName ? ` (${business.registeredName})`: '';
            // Add business using template.
            $('.js-business-name', $newItem).text(`${business.tradingName}${registeredName}`);
            $('[type="checkbox"]', $newItem).attr('name', 'company[]').val(business.itemId);
            $form.find('.checkbox-list').append($newItem)
        });

        // Explain problem and open UI to update active businesses.
        MAIN.openLitbox({
            title: 'Update active businesses',
            href: '#update-businesses-form-wrapper',
            css: {
                xxs: {
                    maxWidth: 700
                }
            }
        });
    }


    // Form validation for active businesses (limit) form.
        // This gets set on the form element as an attribute in Webflow. Shit, I know...
    pub.formValidateActiveBusinesses = function() {
        var $form = $(formActivebusinessesID),
            businessesText = HELP.pluralize(businessesMax, 'business', 'businesses'),
            checked = $form.find('[type="checkbox"]:checked');

        // None or too many businesses selected.
        if (checked.length < 1 || checked.length > businessesMax) {
            alert(`Please${checked.length > businessesMax ? ' only' : ''} select ${businessesText} that you want to remain active.`);
            return false;
        }
        return true;
    };



    return pub;
}(jQuery, this, this.document));



