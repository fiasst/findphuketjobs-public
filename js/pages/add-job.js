var ADD_JOB = (function($, window, document, undefined){
    var pub = {};


    // On DOM ready.
    $(function(){
        // Build Company select list options from JSON.
        var MSmember = HELP.getCookie("MSmember");
        if (MSmember && HELP.checkKeyExists(MSmember, 'companies')){
            buildCompanySelectField(JSON.parse(MSmember));
        }
        else {
            HELP.waitFor(window, "MSmember", 200, function(){
                $.ajax({
                    url: "https://hook.us1.make.com/t828p6ci1t9qp2bef0d7or4ydj8ypljp",
                    method: "GET",
                    data: {
                        id: window.MSmember.id
                    },
                    timeout: 60000,
                    success: function(data, textStatus){
                        HELP.setCookie("MSmember", JSON.stringify(data) );
                        buildCompanySelectField(data);
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        console.log(textStatus, errorThrown);
                    }
                });
            });
        }


        function buildCompanySelectField(data){
            console.log('data', data);
            var list = data['companies'] || [];

            if (list.length < 1) {
                // No companies exist.
                alert("You need to add your company before you can post a job.");
            }
            else {
                var companySelect = $('#field-company'),
                    isSelected = list.length === 1;

                $.each(list, function(i, item){
                    companySelect.append($('<option>', {
                        value: item['trading-name'],
                        text: item['trading-name'] + ' ('+ item['registered-name'] +')',
                        selected: isSelected
                    }));
                });
            }
        }

          
        // Show Job form - step 2 once a company has been added and selected.
        $('#job-company').on('change', function(){
            // If company field has a value, progress.
            if ($(this).val()){
                $('.form-job-step-2').addClass('active');
            }
        });

          
        // Add company form in Colorbox.
        $('#trigger-add-company').on('click', function(e){
            e.preventDefault();
            
            HELP.waitFor(window.jQuery, 'litbox', 100, function(){
                // LitBox
                $.litbox({
                    title: 'Add a new company',
                    href: '#company-form-wrapper',
                    inline: true,
                    returnFocus: false,
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
                        },
                    }
                });
            });
        });
    });

    return pub;
}(jQuery, this, this.document));




