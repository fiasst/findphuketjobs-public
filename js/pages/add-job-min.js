var ADD_JOB=function($,e,t,n){return $((function(){function t(e){$("#trigger-add-company, #company-form-wrapper").remove(),alert(e)}function n(e){var t=e.companies||[];if(t.length<1)$("#trigger-add-company").trigger("click",(function(){alert("You need to add your company before you can post a job")}));else{var n=$("#job-company"),o=1===t.length;$(".form-job-step-2").addClass("active"),$.each(t,(function(e,t){n.html("").append($("<option>",{value:t["trading-name"],text:t["trading-name"]+" ("+t["registered-name"]+")",selected:o}))}))}}HELP.waitFor(USER,"current",100,(function(){HELP.checkKeyExists(USER.current,"companies")?n(USER.current):HELP.waitFor(USER.current,"id",100,(function(){MAIN.thinking(!0,!1),HELP.sendAJAX({url:"https://hook.us1.make.com/t828p6ci1t9qp2bef0d7or4ydj8ypljp",method:"GET",data:{id:USER.current.id},success:function(e,t){MAIN.thinking(!1),HELP.setCookie("MSmember",JSON.stringify(e)),USER.updateCurrentUser(e),n(e)},error:function(e,t,n){console.log(t,n),MAIN.thinking(!1)}})}))})),$("#trigger-add-company").on("click",(function(n,o){n.preventDefault();var r=[];if(HELP.checkKeyExists(USER.current,"companies")&&(r=USER.current.companies),r.length&&function(e){return 3==e&&USER.getMemberPlans("subscription")?(t("You can have a maximum of 3 companies in your account. Please contact our team if you need assistance."),!0):!(1!=e||!USER.getMemberPlans("onetime")||(t("You can have a maximum of 1 companies in your account for your current member plan. Subscribe to a monthly plan to increase this limit."),0))}(r.length))return!1;o=o||!1,HELP.waitFor(e.jQuery,"litbox",100,(function(){$.litbox({title:"Add a new company",href:"#company-form-wrapper",inline:!0,returnFocus:!1,trapFocus:!1,overlayClose:!1,escKey:!1,css:{xs:{offsetTop:20,offsetBottom:20,offsetLeft:20,offsetRight:20,maxWidth:900,width:"100%",opacity:.4}},onComplete:o})}))})),$("#job-salary-type").on("change",(function(){var e=$("#job-salary"),t=$.inArray($(this).val().toLowerCase(),["per hour","per day","per day","per month","per year"])>-1;$("#wrapper-salary-amount").toggle(t).find(".suffix").text($(this).find("option:selected").text()),e.attr("required",(function(e,n){return t})),t||e.val("")}))})),{}}(jQuery,this,this.document);