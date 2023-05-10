var ADD_JOB = (function($, window, document, undefined){
    var pub = {};


    // On DOM ready.
    $(function(){
        // Build Company select list options from JSON.
        HELP.waitFor(USER, "current", 100, function(){
            if (HELP.checkKeyExists(USER.current, 'companies')){
                buildCompanySelectField(USER.current);
            }
            else {
                HELP.waitFor(USER.current, "id", 100, function(){
                    MAIN.thinking(true, false);

                    HELP.sendAJAX({
                        url: "https://hook.us1.make.com/t828p6ci1t9qp2bef0d7or4ydj8ypljp",
                        method: "GET",
                        data: {
                            id: USER.current.id
                        },
                        success: function(data, textStatus){
                            MAIN.thinking(false);
                            HELP.setCookie("MSmember", JSON.stringify(data));
                            USER.updateCurrentUser(data);
                            buildCompanySelectField(data);
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                            console.log(textStatus, errorThrown);
                            MAIN.thinking(false);
                        }
                    });
                });
            }
        });


        function maxCompanies(companies) {
            if (companies == 3 && USER.getMemberPlans('subscription')){
                // Max 3 companies.
                maxCompaniesReached("You can have a maximum of 3 companies in your account. Please contact our team if you need assistance.");
                return true;
            }
            else if (companies == 1 && USER.getMemberPlans('onetime')){
                maxCompaniesReached("You can have a maximum of 1 companies in your account for your current member plan. Subscribe to a monthly plan to increase this limit.");
                return true;
            }
            return false;
        }

        function maxCompaniesReached(message){
            $('#trigger-add-company, #company-form-wrapper').remove();
            alert(message);
        }


        function buildCompanySelectField(data){
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

                $.each(list, function(i, item){
                    companySelect.html('').append($('<option>', {
                        value: item['trading-name'],
                        text: item['trading-name'] + ' ('+ item['registered-name'] +')',
                        selected: isSelected
                    }));
                });
            }
        }

          
        // Add company form in Colorbox.
        $('#trigger-add-company').on('click', function(e, onComplete){
            e.preventDefault();

            // Don't add new companies if limit is reached.
            var companies = [];
            if (HELP.checkKeyExists(USER.current, 'companies')){
                companies = USER.current.companies;
            }
            if (!!companies.length){
                if (maxCompanies(companies)) return false;
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



        /*function addCompanyCallback(data){
            $.litbox({
                title: 'Add a new company',
                html: '<p></p>',
                css: {
                    xs: {
                        bodyClasses: 'lbox-dialog',
                        maxWidth: 700,
                        width: '100%',
                        opacity: 0.4
                    },
                }
            });
        }*/



        // Salary type and salary amount.
        $('#job-salary-type').on('change', function(){
            var salaryField = $('#job-salary'),
                numericType = ($.inArray($(this).val().toLowerCase(), [
                    'per hour', 'per day', 'per day', 'per month', 'per year'
                ]) > -1);

            $('#wrapper-salary-amount').toggle(numericType)
                .find('.suffix').text(
                    $(this).find('option:selected').text()
                );

            salaryField.attr('required', function(i, attr){ return numericType });

            if (!numericType){
                salaryField.val('');
            }
        });
    });

    return pub;
}(jQuery, this, this.document));





