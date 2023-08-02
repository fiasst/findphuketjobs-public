USER=function($,e,t,r){var n,a={},i="wf-form-update-active-companies-form";return a.current=HELP.getCookie("MSmember")||{},a.updateCurrentUser=function(e){USER.current=USER.current||a.current,$.extend(!0,USER.current,e)},a.getCurrentMember=function(t){if(USER.current=USER.current||a.current,HELP.checkKeyExists(USER,"current.id"))return USER.current;HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.getCurrentMember().then((({data:e})=>(e=e||{},a.updateCurrentUser(e),t&&t(USER.current),USER.current)))}))},a.logout=function(){$('#header a[data-ms-action="logout"]').trigger("click")},a.getMemberJSON=function(t){HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.getMemberJSON().then((({data:e})=>(e=e||{},t&&t(e),e)))}))},a.updateMemberJSON=function(t,r){HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.updateMemberJSON({json:t}).then((({data:e})=>(e=e||{},r&&r(e),e)))}))},a.getMemberPlans=function(e,t,r){if(t=t||a.getCurrentMember(),HELP.checkKeyExists(t,"planConnections")&&t.planConnections.length){var n=t.planConnections;return r&&(n=HELP.filterArrayByObjectValue(n,"status",["ACTIVE","TRIALING"])),e&&(n=HELP.filterArrayByObjectValue(n,"type",e)),n}return[]},a.checkCompanyLimits=function(e,t){var r=a.getMemberPlans(!1,!1,!0),i=MAIN.planCompanyLimits;return n=1,t&&(e=HELP.filterArrayByObjectValue(e,"state","active")),$.each(r,(function(e,t){i[t.planId]>n&&(n=i[t.planId])})),e.length-n},a.updateActiveCompanies=function(e){if(e.length>n){var t=HELP.pluralize(n,"business","businesses"),r=$("#"+i),a=r.find(".js-company");r.find(".js-num-companies").text(t),$(".form-job-step-2, #company-form-wrapper").remove(),a.hide(),$.each(e,(function(e,t){var n=a.clone().show();$(".js-company-name",n).text(`${t.tradingName} (${t.registeredName})`),$('[type="checkbox"]',n).attr("name","company[]").val(t.itemId),r.find(".checkbox-list").append(n)})),MAIN.openLitbox({title:"Update active businesses",href:"#update-companies-form-wrapper",css:{xxs:{maxWidth:700}}})}},a.formValidateActiveCompanies=function(){var e=$("#"+i),t=HELP.pluralize(n,"business","businesses"),r=e.find('[type="checkbox"]:checked');return!(r.length<1||r.length>n)||(alert(`Please${r.length>n?" only":""} select ${t} that you want to remain active.`),!1)},a.getCurrentMember(),$((function(){HELP.waitFor(e.jQuery.fn,"validate",400,(function(){var e={required:!0,email:!0},t={required:!0,minlength:8},r={required:"Email is required",email:"Must be a valid email address"},n={required:"Password is required",minlength:jQuery.validator.format("Password must be at least {0} characters")};$("#wf-form-Register-Business").validate({rules:{biz_email:e,biz_password:t},messages:{biz_email:r,biz_password:n}}),$("#wf-form-Register-User").validate({rules:{user_email:e,user_password:t},messages:{user_email:r,user_password:n}})}))})),a}(jQuery,this,this.document);