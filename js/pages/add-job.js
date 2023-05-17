var ADD_JOB = (function($, window, document, undefined){
    var pub = {};


    // On DOM ready.
    $(function(){
        // Build Company select list options from JSON.
        HELP.waitFor(USER, "current", 100, function(){
            if (HELP.checkKeyExists(USER, "current.companies")){
                // Use Company list from USER.current var.
                console.log(1, USER.current);
                buildCompanySelectField(USER.current);
            }
            else {
                HELP.waitFor(USER.current, "id", 100, function(){
                console.log(2, USER.current);
                    MAIN.thinking(true, false);

                    // Get list of Member's Companies via AJAX.
                    HELP.sendAJAX({
                        url: "https://hook.us1.make.com/t828p6ci1t9qp2bef0d7or4ydj8ypljp",
                        method: "GET",
                        data: {
                            id: USER.current.id
                        },
                        success: function(data, textStatus){
                            MAIN.thinking(false);
                            USER.updateCurrentUser(data);

                            if (HELP.checkKeyExists(data, "companies")){
                                USER.current.companies = data.companies;
                                HELP.setCookie("MSmember", JSON.stringify({"companies": data.companies}) );
                                buildCompanySelectField(USER.current);
                            }
                            MAIN.handleAjaxResponse(data, form);
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                            MAIN.thinking(false);
                        }
                    });
                });
            }
        });


        function maxCompanies(companies){
            var message,
                msg = false;

            if (companies > 2 && USER.getMemberPlans('subscription')){
                // Max 3 companies.
                msg = "You can add a maximum of 3 companies to your account. Please contact our team if you need assistance.";
            }
            else if (companies > 0 && USER.getMemberPlans('onetime')){
                msg = "You can add a maximum of 1 companies to your account for your current member plan. Subscribe to a monthly plan to increase this limit.";
            }
            if (msg){
                alert(msg);
                $('#company-form-wrapper').remove();
            }
            return !!msg;
        }


        function buildCompanySelectField(data, selectedCompany){
            // WARNING. data comes from AJAX or, from a cookie so sanatize it and use carefully.
            var list = data.companies || [];

            if (list.length < 1) {
                // No companies exist.
                // The second parameter is a callback function for the "onComplete" LitBox options.
                $('#trigger-add-company').trigger('click', function(){
                    alert("You need to add your company before you can post a job");
                });
            }
            else {
                var companySelect = $('#job-company'),
                    isSelected = list.length === 1;

                $('.form-job-step-2').addClass('active');
                // Clear any previous options.
                companySelect.html('').append( $('<option>', {
                    value: '',
                    text: 'Select...'
                }) );

                $.each(list, function(i, item){
                    var name = HELP.stripHTML(item['tradingName']);
                    
                    if (selectedCompany){
                        isSelected = (selectedCompany == name);
                    }
                    companySelect.append($('<option>', {
                        value: name,
                        text: name + ' ('+ HELP.stripHTML(item['registeredName']) +')',
                        selected: isSelected
                    }));
                });
            }
        }


        pub.companyAddedCallback = function(data, form){
            data = data || {};

            if (HELP.checkKeyExists(data, "company")){
                USER.current.companies = USER.current.companies || [];
                USER.current.companies.push(data.company);
                HELP.setCookie("MSmember", JSON.stringify({"companies": USER.current.companies}) );
                buildCompanySelectField(USER.current, data.company.tradingName);
            }
        };


        pub.jobAddedCallback = function(data, form){
            data = data || {};
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
                if (maxCompanies(companies.length)) return false;
            }

            onComplete = onComplete || false;
            
            HELP.waitFor(window.jQuery, 'litbox', 100, function(){
                // LitBox
                $.litbox({
                    title: 'Add a new company',
                    href: '#company-form-wrapper',
                    inline: true,
                    returnFocus: false,
                    trapFocus: false,
                    overlayClose: false,
                    escKey: false,
                    css: {
                        xs: {
                            offsetTop: 20,
                            offsetBottom: 20,
                            offsetLeft: 20,
                            offsetRight: 20,
                            maxWidth: 900,
                            width: '100%',
                            opacity: 0.4
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





