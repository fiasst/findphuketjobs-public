USER = (function($, window, document, undefined) {
    const pub = {};
    
    
    var companiesMax,
        formActiveCompaniesID = 'wf-form-update-active-companies-form';


    pub.current = HELP.getCookie("MSmember") || {};


    pub.updateCurrentUser = function(obj) {
        USER.current = USER.current || pub.current;

        // Merge into current user var.
        $.extend(true, USER.current, obj);
    };


    // get the current Member then fire callback function.
    pub.getCurrentMember = function(callback) {
        USER.current = USER.current || pub.current;

        if (HELP.checkKeyExists(USER, 'current.id')) {
            return USER.current;
        }
        HELP.waitFor(window, "$memberstackDom", 50, function() {
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
        HELP.waitFor(window, "$memberstackDom", 50, function() {
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
        HELP.waitFor(window, "$memberstackDom", 50, function() {
            window.$memberstackDom.updateMemberJSON({ json: json }).then(({ data: memberJSON }) => {
                memberJSON = memberJSON || {};

                if (!!callback) {
                    callback(memberJSON);
                }
                return memberJSON;
            });
        });
    };


    pub.getMemberPlans = function(planType, member, activeOnly) {
        member = member || pub.getCurrentMember();

        if (HELP.checkKeyExists(member, 'planConnections') && !!member.planConnections.length) {
            // Get active plans.
            var plans = member.planConnections;

            if (activeOnly) {
                // Filter out plans with status NOT set to "ACTIVE".
                plans = HELP.filterArrayByObjectValue(plans, 'status', 'ACTIVE');
            }

            // Filter out plans with type NOT set to planType.
            if (planType) {
                plans = HELP.filterArrayByObjectValue(plans, 'type', planType);
            }
            return plans;
        }
        return [];
    };


    // Check if the user is exceeding the number of active companies allowed for the current subscription.
    // If so, launch a UI to select which companies they want to keep active within the limit.
    pub.checkCompanyLimits = function(companies, activeOnly) {
        var plans = pub.getMemberPlans(false, false, true),// Active plans only.
            planLimits = MAIN.planCompanyLimits;

        // Update global vars (to be used elsewhere).
        companiesMax = 1;

        if (activeOnly) {
            // Filter out companies with state NOT set to "active".
            companies = HELP.filterArrayByObjectValue(companies, 'state', 'active');
        }

        // Get the max company limit of a user for all active plans in their account.
        $.each(plans, function(i, plan) {
            if (planLimits[plan.planId] > companiesMax) {
                companiesMax = planLimits[plan.planId];
            }
        });

        // How much are they exceeding their company limit by.
            // Want to know if > (exceeding) when building company dropdown list.
            // Want to know when >= when trying to add a new company.
        return companies.length - companiesMax;
    };


    pub.updateActiveCompanies = function(companies) {
        // If company limit is exceeded.
        if (companies.length > companiesMax) {
            var companiesText = HELP.pluralize(companiesMax, 'business', 'businesses'),
                $form = $('#'+formActiveCompaniesID),
                $companyItem = $form.find('.js-company');

            // Replace token text with company limit.
            $form.find('.js-num-companies').text(companiesText);


            // Remove the Add Job and Add Company forms.
            $('.form-job-step-2, #company-form-wrapper').remove();

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
                    title: 'Update active businesses',
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
        }
    }


    // Form validation for active companies (limit) form.
    pub.formValidateActiveCompanies = function() {
        var $form = $('#'+formActiveCompaniesID),
            companiesText = HELP.pluralize(companiesMax, 'business', 'businesses'),
            checked = $form.find('[type="checkbox"]:checked');

        // None or too many companies selected.
        if (checked.length < 1 || checked.length > companiesMax) {
            alert(`Please${checked.length > companiesMax ? ' only' : ''} select ${companiesText} that you want to remain active.`);
            return false;
        }
        return true;
    };


    // init.
    pub.getCurrentMember();


    // On DOM ready.
    // $(function(){
        //
    // });


    return pub;
}(jQuery, this, this.document));





