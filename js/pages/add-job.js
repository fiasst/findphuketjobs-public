var ADD_JOB = (function($, window, document, undefined){
    var pub = {}

    // Webhooks.
    const listMembersCompanies = "https://hook.us1.make.com/t828p6ci1t9qp2bef0d7or4ydj8ypljp";


    // On DOM ready.
    $(function() {
        // Build Company select list options from JSON.
        HELP.waitFor(USER, "current.id", 100, function() {
            MAIN.thinking(true, false);

            // Get list of Member's Companies via AJAX.
            HELP.sendAJAX({
                url: listMembersCompanies,
                method: "GET",
                data: {
                    id: USER.current.id
                },
                callbackSuccess: function(data, textStatus) {
                    var form = $('#wf-form-Add-Job-Form');
                    MAIN.thinking(false);
                    USER.updateCurrentUser(data);

                    if (HELP.checkKeyExists(data, "companies")) {
                        USER.current.companies = data.companies;

                        // Check "active" companies against limit.
                        var companiesExceeding = USER.checkCompanyLimits(data.companies, true);

                        // If user IS exceeding the max "active" companies limit.
                        if (companiesExceeding > 0) {
                            // Update which companies are active to not exceed plan limit.
                            USER.updateActiveCompanies(data.companies);
                        }
                        else {
                            buildCompanySelectField(USER.current);
                            MAIN.handleAjaxResponse(data, form);
                        }
                    }
                },
                callbackError: function(jqXHR, textStatus, errorThrown) {
                    MAIN.thinking(false);
                }
            });
        });


        function buildCompanySelectField(data, selectedCompany) {
            // WARNING. data comes from AJAX or, from a cookie so sanatize it and use carefully.
            var list = data.companies || [];

            if (list.length < 1) {
                // No companies exist.
                // The second parameter is a callback function for the "onComplete" LitBox options.
                $('#trigger-add-company').trigger('click', function() {
                    alert("You need to add your business before you can post a job");
                });
            }
            else {
                var companySelect = $('#job-company'),
                    isSelected = list.length === 1;

                // Show step 2 of Add Job form.
                $('.form-job-step-2').addClass('active');

                // Sort by "active" comapnies appearing first.
                list = HELP.sortArrayByObjectValue(list, 'state', 'active');

                // Clear any previous options.
                companySelect.html('').append( $('<option>', {
                    value: '',
                    text: 'Select...'
                }) );

                $.each(list, function(i, item) {
                    var name = HELP.stripHTML(item.tradingName);// Sanatize values.
                    
                    if (selectedCompany) {
                        isSelected = (selectedCompany == name);
                    }
                    
                    companySelect.append($('<option>', {
                        value: (item.state == 'disabled') ? '0' : item.itemId,
                        text: name + ' ('+ HELP.stripHTML(item.registeredName) +')',// Sanatize values.
                        selected: isSelected,
                        disabled: (item.state == 'disabled')
                    }));
                });
            }
        }


        // Callback that is set in Make.com Scenario's AJAX response.
        pub.companyAddedCallback = function(data, form){
            data = data || {};

            if (HELP.checkKeyExists(data, "company")){
                USER.current.companies = USER.current.companies || [];
                USER.current.companies.push(data.company);
                HELP.setCookie("MSmember", JSON.stringify({"companies": USER.current.companies}) );
                buildCompanySelectField(USER.current, data.company.tradingName);
            }
        };

          
        // Add company form in Colorbox.
        $('#trigger-add-company').on('click', function(e, onComplete){
            e.preventDefault();

            // Don't add new companies if limit is reached.
            var companies = [];
            if (HELP.checkKeyExists(USER, "current.companies")){
                companies = USER.current.companies;
            }
            if (!!companies.length){
                // Check all companies against limit, not just active companies.
                var companiesExceeding = USER.checkCompanyLimits(companies, false);

                // Don't add new companies if the limit is already reached.
                if (companiesExceeding >= 0) {
                    MAIN.dialog({
                        message: "<p>You have reached the active businesses limit for your current member plan. <a href=\"/plans\">Upgrade your plan</a> to post jobs for more businesses.</p>",
                        type: "success",
                        mode: "dialog",
                        options: {
                            title: "Business limit reached",
                            actions: [{
                                type: "button",
                                text: "OK",
                                attributes: {
                                    class: "button-primary trigger-lbox-close",
                                    href: "#"
                                }
                            }]
                        }
                    });
                    $('#trigger-add-company').remove();
                    return false;
                }
            }

            onComplete = onComplete || false;
            
            HELP.waitFor(window.jQuery, 'litbox', 100, function(){
                // Litbox.
                $.litbox({
                    title: 'Add a new company',
                    href: '#company-form-wrapper',
                    inline: true,
                    returnFocus: false,
                    trapFocus: false,
                    overlayClose: false,
                    escKey: false,
                    css: {
                        xxs: {
                            offset: 20,
                            maxWidth: 900,
                            width: '100%',
                            opacity: 0.4
                        },
                        sm: {
                            offset: '5% 20px'
                        }
                    },
                    onComplete: onComplete
                });
            });
        });


        
        let salary = function(){
            var $salaryAmount = $('#job-salary'),
                $salaryType = $('#job-salary-type'),
                $salaryMonthly = $('#job-salary-monthly'),

                salaryType = function(){
                    return $($salaryType).val().toLowerCase();
                },
                isNumericType = function(){
                    return ($.inArray(salaryType(), [
                        'per hour', 'per day', 'per month', 'per year'
                    ]) > -1);
                }
                calculateSalary = function(){
                    var numericType = isNumericType(),
                        salary = $($salaryAmount).val(),
                        val = '';
                    

                    if (numericType && !!salary){
                        if (salary < 1){
                            alert("Salary amount must be a positive number");
                            $($salaryAmount).val('').focus();
                        }

                        switch (salaryType()){
                            case 'per year':
                                val = salary / 12;
                                break;
                            case 'per month':
                                val = salary;
                                break;
                            case 'per day':
                                val = salary * 20;
                                break;
                            case 'per hour':
                                val = salary * 160;
                                break;
                        }
                    }
                    $salaryMonthly.val(val);
                };


            // Salary type and salary amount.
            $salaryType.on('change', function(){
                var numericType = isNumericType();

                $('#wrapper-salary-amount').toggle(numericType)
                    .find('.suffix').text(
                        $(this).find('option:selected').text()
                    );

                $salaryAmount.attr('required', function(i, attr){ return numericType });

                if (!numericType){
                    $salaryAmount.val('');
                }
                calculateSalary();
            });

            $salaryAmount.on('focusout', calculateSalary);
        }();
    });

    return pub;
}(jQuery, this, this.document));





