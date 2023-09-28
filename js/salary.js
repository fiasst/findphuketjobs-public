//
// Used by the Add Job and Edit Job forms to calculate salary and control form fields.
//
var SALARY = (function($, window, document, undefined) {
    var pub = {};


    //
    // On DOM ready.
    //
    $(function() {
        //
        //
        //
        var salary = function() {
            // We use name attributes and not ID for these selectors because this
            // widget appears twice on the Job page (Edit and Review forms).
            var salaryAmount = '[name="job_salary"]',
                salaryAmountMax = '[name="job_salary_max"]',
                salaryType = '[name="job_salary_type"]',
                salaryMonthly = '[name="job_salary_monthly"]',

                // Get the value of "salaryType" field.
                typeVal = function(context) {
                    var val = $(salaryType, context).val();
                    return val ? val.toLowerCase() : false;
                },
                // Check if the "salaryType" value is a numeric option.
                isNumericType = function(context) {
                    return ($.inArray(typeVal(context), [
                        'per hour', 'per day', 'per month', 'per year'
                    ]) > -1);
                },
                // Calc the monthly salary.
                calculateSalary = function(element) {
                    var $form = $(element).parents('form'),
                        $salaryAmount = $(salaryAmount, $form),
                        numericType = isNumericType($form),
                        salary = $salaryAmount.val(),
                        val = '';
                    
                    if (numericType && !!salary) {
                        if (salary < 1) {
                            alert("Salary amount must be a positive number");
                            $salaryAmount.val('').focus();
                        }
                        switch (typeVal($form)) {
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
                    $(salaryMonthly, $form).val(val);
                };

            // Salary type and salary amount.
            $(salaryType).on('change', function() {
                // $form is used as context when there's multiple forms/widgets.
                var $form = $(this).parents('form'),
                    numericType = isNumericType($form),
                    $salaryAmount = $(salaryAmount, $form);

                $('.wrapper-salary-amount', $form).toggle(numericType)
                    .find('.suffix').text(
                        $(this).find('option:selected').text()
                    );

                $salaryAmount.attr('required', numericType);

                if (!numericType) {
                    $salaryAmount.val('');
                    $(salaryAmountMax, $form).val('');
                }
                calculateSalary(this);
            });

            $(salaryAmount).on('focusout', function(){
                calculateSalary(this);
            });

            // init.
            $(salaryType).each(function() {
                $(this).trigger('change');
            });
        }();
    });

    return pub;
}(jQuery, this, this.document));



