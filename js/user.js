USER = (function($, window, document, undefined){
    var pub = {},
        maxCompanies,
        numCompanies,
        formActiveCompaniesID = 'wf-form-update-active-companies-form';


    pub.current = HELP.getCookie("MSmember") || {};


    pub.updateCurrentUser = function(obj){
        USER.current = USER.current || pub.current;

        // Merge into current user var.
        $.extend(true, USER.current, obj);
    };


    // get the current Member then fire callback function.
    pub.getCurrentMember = function(callback) {
        USER.current = USER.current || pub.current;

        if (HELP.checkKeyExists(USER, 'current.id')){
            return USER.current;
        }
        HELP.waitFor(window, "$memberstackDom", 50, function(){
            window.$memberstackDom.getCurrentMember().then(({ data: member }) => {
                member = member || {};
                pub.updateCurrentUser(member);

                if (!!callback) {
                    callback(USER.current);
                }
                return USER.current;
            });
        });
    };
    

    // get Member's JSON then fire callback function.
    pub.getMemberJSON = function(callback) {
        HELP.waitFor(window, "$memberstackDom", 50, function(){
            window.$memberstackDom.getMemberJSON().then(({ data: memberJSON }) => {
                memberJSON = memberJSON || {};

                if (!!callback) {
                    callback(memberJSON);
                }
                return memberJSON;
            });
        });
    };


    // update Member's JSON.
    pub.updateMemberJSON = function(json, callback) {
        HELP.waitFor(window, "$memberstackDom", 50, function(){
            window.$memberstackDom.updateMemberJSON({ json: json }).then(({ data: memberJSON }) => {
                memberJSON = memberJSON || {};

                if (!!callback) {
                    callback(memberJSON);
                }
                return memberJSON;
            });
        });
    };


    pub.getMemberPlans = function(planType, member) {
        member = member || pub.getCurrentMember();

        if (HELP.checkKeyExists(member, 'planConnections') && !!member.planConnections.length) {
            // Get active plans.
            var plans = $.map(member.planConnections, function(item, i) {
                if (item.active){
                    return item.type.toLowerCase();
                }
            });
            // Check if a plan type exists for member.
            if (planType) {
                // Is planType in the user's plans.
                return $.inArray(planType, plans) > -1;
            }
            // Return all active user plans.
            return plans;
        }
        return planType ? false : [];
    };


    // Check if the user is exceeding the number of active companies allowed for the current subscription.
    // If so, launch a UI to select which companies they want to keep active within the limit.
    pub.checkCompanyLimits = function(companies) {
        var plans = pub.getMemberPlans(),
            planLimits = MAIN.planCompanyLimits;

        // Update global vars (to be used elsewhere).
        maxCompanies = 1;
        numCompanies = companies.length;


        // Get the max company limit of a user for all active plans in their account.
        $.each(plans, function(i, plan) {
            if (planLimits[plan.planId] > maxCompanies) {
                maxCompanies = planLimits[planId];
            }
        });

        // If company limit is exceeded.
        if (numCompanies > maxCompanies) {
            var companiesText = HELP.pluralize(maxCompanies, 'business', 'businesses'),
                $form = $('#'+formActiveCompaniesID),
                $companyItem = $form.find('.js-company');

            // Replace token text with company limit.
            $form.find('.js-num-companies').text(companiesText);

            // Remove the template item.
            $companyItem.hide();

            // Build a checkbox list of user's companies.
            $.each(companies, function(i, company) {
                // Clone template item.
                var $newItem = $companyItem.clone().show();
                // Add company using template.
                $('.js-company-name', $newItem).text(`${company.tradingName} (${company.registeredName})`);
                $('[type="checkbox"]', $newItem).attr('name', `company[]`).val(company.itemId);
                $form.find('.checkbox-list').append($newItem)
            });

            // Explain problem and open UI to update active companies.
            HELP.waitFor(window.jQuery, 'litbox', 100, function() {
                // Litbox.
                $.litbox({
                    title: 'Active businesses limit exceeded',
                    href: '#update-companies-form-wrapper',
                    inline: true,
                    returnFocus: false,
                    trapFocus: false,
                    overlayClose: false,
                    escKey: false,
                    css: {
                        xxs: {
                            offset: 20,
                            maxWidth: 700,
                            width: '100%',
                            opacity: 0.4
                        },
                        sm: {
                            offset: '5% 20px'
                        }
                    }
                });
            });

            $('#company-form-wrapper').remove();
            return true
        }
        return false;
    };


    // Form validation for active companies (limit) form.
    pub.formValidateActiveCompanies = function() {
        var $form = $('#'+formActiveCompaniesID),
            companiesText = HELP.pluralize(maxCompanies, 'business', 'businesses'),
            checked = $form.find('[type="checkbox"]:checked');

        if (checked.length > maxCompanies) {
            alert(`Please only select ${companiesText} that you want to remain active.`);
        }
        else if (checked.length > 0) {
            return true
        }
        return false;
    };


    // init.
    pub.getCurrentMember();


    // On DOM ready.
    // $(function(){
        //
    // });


    return pub;
}(jQuery, this, this.document));





