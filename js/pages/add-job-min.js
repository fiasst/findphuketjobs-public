var ADD_JOB=function($,e,a,t){var r={};return $((function(){function a(e,a){var t=e.companies||[];if(t.length<1)$("#trigger-add-company").trigger("click",(function(){alert("You need to add your business before you can post a job")}));else{var r=$("#job-company"),n=1===t.length;$(".form-job-step-2").addClass("active"),r.html("").append($("<option>",{value:"",text:"Select..."})),$.each(t,(function(e,t){var o=HELP.stripHTML(t.tradingName);a&&(n=a==o),r.append($("<option>",{value:"disabled"==t.state?"0":t.itemId,text:o+" ("+HELP.stripHTML(t.registeredName)+")",selected:n,disabled:"disabled"==t.state}))}))}}HELP.waitFor(USER,"current.id",100,(function(){MAIN.thinking(!0,!1),HELP.sendAJAX({url:"https://hook.us1.make.com/t828p6ci1t9qp2bef0d7or4ydj8ypljp",method:"GET",data:{id:USER.current.id},callbackSuccess:function(e,t){var r=$("#wf-form-Add-Job-Form");MAIN.thinking(!1),USER.updateCurrentUser(e),HELP.checkKeyExists(e,"companies")&&(USER.current.companies=e.companies,USER.checkCompanyLimits(e.companies)?$(".form-job-step-2, #company-form-wrapper").remove():(a(USER.current),MAIN.handleAjaxResponse(e,r)))},callbackError:function(e,a,t){MAIN.thinking(!1)}})})),r.companyAddedCallback=function(e,t){e=e||{},HELP.checkKeyExists(e,"company")&&(USER.current.companies=USER.current.companies||[],USER.current.companies.push(e.company),HELP.setCookie("MSmember",JSON.stringify({companies:USER.current.companies})),a(USER.current,e.company.tradingName))},$("#trigger-add-company").on("click",(function(a,t){a.preventDefault();var r=[];if(HELP.checkKeyExists(USER,"current.companies")&&(r=USER.current.companies),r.length&&USER.checkCompanyLimits(r))return!1;t=t||!1,HELP.waitFor(e.jQuery,"litbox",100,(function(){$.litbox({title:"Add a new company",href:"#company-form-wrapper",inline:!0,returnFocus:!1,trapFocus:!1,overlayClose:!1,escKey:!1,css:{xxs:{offset:20,maxWidth:900,width:"100%",opacity:.4},sm:{offset:"5% 20px"}},onComplete:t})}))}));t=$("#job-salary"),n=$("#job-salary-type"),o=$("#job-salary-monthly"),c=function(){return $(n).val().toLowerCase()},i=function(){return $.inArray(c(),["per hour","per day","per month","per year"])>-1},calculateSalary=function(){var e=i(),a=$(t).val(),r="";if(e&&a)switch(a<1&&(alert("Salary amount must be a positive number"),$(t).val("").focus()),c()){case"per year":r=a/12;break;case"per month":r=a;break;case"per day":r=20*a;break;case"per hour":r=160*a}o.val(r)},n.on("change",(function(){var e=i();$("#wrapper-salary-amount").toggle(e).find(".suffix").text($(this).find("option:selected").text()),t.attr("required",(function(a,t){return e})),e||t.val(""),calculateSalary()})),t.on("focusout",calculateSalary);var t,n,o,c,i})),r}(jQuery,this,this.document);