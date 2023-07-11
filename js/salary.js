/*
* Used by the Add Job and Edit Job forms to calculate salary and control form fields.
*/

const SALARY = (function($, window, document, undefined) {
    const pub = {};


    // On DOM ready.
    $(function() {
        function salary() {
            var $salaryAmount = $('#job-salary'),
                $salaryType = $('#job-salary-type'),
                $salaryMonthly = $('#job-salary-monthly'),

                salaryType = function() {
                    return $($salaryType).val().toLowerCase();
                },
                isNumericType = function() {
                    return ($.inArray(salaryType(), [
                        'per hour', 'per day', 'per month', 'per year'
                    ]) > -1);
                }
                calculateSalary = function() {
                    var numericType = isNumericType(),
                        salary = $($salaryAmount).val(),
                        val = '';
                    

                    if (numericType && !!salary) {
                        if (salary < 1) {
                            alert("Salary amount must be a positive number");
                            $($salaryAmount).val('').focus();
                        }

                        switch (salaryType()) {
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
            $salaryType.on('change', function() {
                var numericType = isNumericType();

                $('#wrapper-salary-amount').toggle(numericType)
                    .find('.suffix').text(
                        $(this).find('option:selected').text()
                    );

                $salaryAmount.attr('required', function(i, attr) { return numericType });

                if (!numericType) {
                    $salaryAmount.val('');
                }
                calculateSalary();
            });

            $salaryAmount.on('focusout', calculateSalary);
        }();
    });

    return pub;
}(jQuery, this, this.document));



