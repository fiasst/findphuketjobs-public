var ADD_JOB=function($,e,t,n){var r={};return $((function(){function t(e,t){var n=e.companies||[];if(n.length<1)$("#trigger-add-company").trigger("click",(function(){alert("You need to add your company before you can post a job")}));else{var r=$("#job-company"),o=1===n.length;$(".form-job-step-2").addClass("active"),r.html("").append($("<option>",{value:"",text:"Select..."})),$.each(n,(function(e,n){var a=HELP.stripHTML(n.tradingName);t&&(o=t==a),r.append($("<option>",{value:a,text:a+" ("+HELP.stripHTML(n.registeredName)+")",selected:o}))}))}}HELP.waitFor(USER,"current",100,(function(){HELP.checkKeyExists(USER,"current.companies")?(console.log(1,USER.current),t(USER.current)):HELP.waitFor(USER.current,"id",100,(function(){console.log(2,USER.current),MAIN.thinking(!0,!1),HELP.sendAJAX({url:"https://hook.us1.make.com/t828p6ci1t9qp2bef0d7or4ydj8ypljp",method:"GET",data:{id:USER.current.id},success:function(e,n){MAIN.thinking(!1),USER.updateCurrentUser(e),HELP.checkKeyExists(e,"companies")&&(USER.current.companies=e.companies,HELP.setCookie("MSmember",JSON.stringify({companies:e.companies})),t(USER.current)),MAIN.handleAjaxResponse(e,form)},error:function(e,t,n){MAIN.thinking(!1)}})}))})),r.companyAddedCallback=function(e,n){e=e||{},HELP.checkKeyExists(e,"company")&&(USER.current.companies=USER.current.companies||[],USER.current.companies.push(e.company),HELP.setCookie("MSmember",JSON.stringify({companies:USER.current.companies})),t(USER.current,e.company.tradingName))},$("#trigger-add-company").on("click",(function(t,n){t.preventDefault();var r=[];if(HELP.checkKeyExists(USER,"current.companies")&&(r=USER.current.companies),r.length&&function(e){var t=!1;return 3==e&&USER.getMemberPlans("subscription")?(alert("You can have a maximum of 3 companies in your account. Please contact our team if you need assistance."),t=!0):1==e&&USER.getMemberPlans("onetime")&&(alert("You can have a maximum of 1 companies in your account for your current member plan. Subscribe to a monthly plan to increase this limit."),t=!0),t&&$("#company-form-wrapper").remove(),t}(r.length))return!1;n=n||!1,HELP.waitFor(e.jQuery,"litbox",100,(function(){$.litbox({title:"Add a new company",href:"#company-form-wrapper",inline:!0,returnFocus:!1,trapFocus:!1,overlayClose:!1,escKey:!1,css:{xs:{offsetTop:20,offsetBottom:20,offsetLeft:20,offsetRight:20,maxWidth:900,width:"100%",opacity:.4}},onComplete:n})}))})),$("#job-salary-type").on("change",(function(){var e=$("#job-salary"),t=$.inArray($(this).val().toLowerCase(),["per hour","per day","per day","per month","per year"])>-1;$("#wrapper-salary-amount").toggle(t).find(".suffix").text($(this).find("option:selected").text()),e.attr("required",(function(e,n){return t})),t||e.val("")}))})),r}(jQuery,this,this.document);