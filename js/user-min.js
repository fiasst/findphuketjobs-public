USER=function($,e,r,t){var n,a={},i="wf-form-update-active-companies-form";return a.current=HELP.getCookie("MSmember")||{},a.updateCurrentUser=function(e){USER.current=USER.current||a.current,$.extend(!0,USER.current,e)},a.getCurrentMember=function(r){if(USER.current=USER.current||a.current,HELP.checkKeyExists(USER,"current.id"))return USER.current;HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.getCurrentMember().then((({data:e})=>(e=e||{},a.updateCurrentUser(e),r&&r(USER.current),USER.current)))}))},a.getMemberJSON=function(r){HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.getMemberJSON().then((({data:e})=>(e=e||{},r&&r(e),e)))}))},a.updateMemberJSON=function(r,t){HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.updateMemberJSON({json:r}).then((({data:e})=>(e=e||{},t&&t(e),e)))}))},a.getMemberPlans=function(e,r,t){if(r=r||a.getCurrentMember(),HELP.checkKeyExists(r,"planConnections")&&r.planConnections.length){var n=r.planConnections;return t&&(n=HELP.filterArrayByObjectValue(n,"status",["ACTIVE","TRIALING"])),e&&(n=HELP.filterArrayByObjectValue(n,"type",e)),n}return[]},a.checkCompanyLimits=function(e,r){var t=a.getMemberPlans(!1,!1,!0),i=MAIN.planCompanyLimits;return n=1,r&&(e=HELP.filterArrayByObjectValue(e,"state","active")),$.each(t,(function(e,r){i[r.planId]>n&&(n=i[r.planId])})),e.length-n},a.updateActiveCompanies=function(e){var r=HELP.pluralize(n,"business","businesses"),t=$("#"+i),a=t.find(".js-company");t.find(".js-num-companies").text(r),$(".form-job-step-2, #company-form-wrapper").remove(),a.hide(),$.each(e,(function(e,r){var n=a.clone().show(),i=r.registeredName?` (${r.registeredName})`:"";$(".js-company-name",n).text(`${r.tradingName}${i}`),$('[type="checkbox"]',n).attr("name","company[]").val(r.itemId),t.find(".checkbox-list").append(n)})),MAIN.openLitbox({title:"Update active businesses",href:"#update-companies-form-wrapper",css:{xxs:{maxWidth:700}}})},a.formValidateActiveCompanies=function(){var e=$("#"+i),r=HELP.pluralize(n,"business","businesses"),t=e.find('[type="checkbox"]:checked');return!(t.length<1||t.length>n)||(alert(`Please${t.length>n?" only":""} select ${r} that you want to remain active.`),!1)},a.getCurrentMember(),$((function(){HELP.waitFor(e.jQuery.fn,"validate",400,(function(){var e={required:!0,email:!0},r={required:!0,minlength:8},t={required:"Email is required",email:"Must be a valid email address"},n={required:"Password is required",minlength:jQuery.validator.format("Password must be at least {0} characters")};$("#wf-form-Register-Business").validate({rules:{biz_email:e,biz_password:r},messages:{biz_email:t,biz_password:n}}),$("#wf-form-Register-User").validate({rules:{user_email:e,user_password:r},messages:{user_email:t,user_password:n}})}))})),a}(jQuery,this,this.document);