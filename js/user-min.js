USER=function($,e,r,t){var n={};return n.current=HELP.getCookie("MSmember")||{},n.logout=()=>{MAIN.thinking(!0),USER.current=null,HELP.setCookie("MSmember",null),$memberstackDom.logout().then((()=>{setTimeout((function(){e.location.href="/"}),1500)}))},n.updateCurrentUser=function(e){USER.current=USER.current||n.current,$.extend(!0,USER.current,e)},n.getCurrentMember=function(r){if(USER.current=USER.current||n.current,HELP.checkKeyExists(USER,"current.id"))return USER.current;HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.getCurrentMember().then((({data:e})=>(e=e||{},n.updateCurrentUser(e),r&&r(USER.current),USER.current)))}))},n.getMemberJSON=function(r){HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.getMemberJSON().then((({data:e})=>(e=e||{},r&&r(e),e)))}))},n.updateMemberJSON=function(r,t){HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.updateMemberJSON({json:r}).then((({data:e})=>(e=e||{},t&&t(e),e)))}))},n.getMemberPlans=function(e,r,t){if(r=r||n.getCurrentMember(),HELP.checkKeyExists(r,"planConnections")&&r.planConnections.length){var u=r.planConnections;return t&&(u=HELP.filterArrayByObjectValue(u,"status",["ACTIVE","TRIALING"])),e&&(u=HELP.filterArrayByObjectValue(u,"type",e)),u}return[]},n.getCurrentMember(),$((function(){HELP.waitFor(e.jQuery.fn,"validate",400,(function(){var e={required:!0,email:!0},r={required:!0,minlength:8},t={required:"Email is required",email:"Must be a valid email address"},n={required:"Password is required",minlength:jQuery.validator.format("Password must be at least {0} characters")};$("#wf-form-Register-Business").validate({rules:{biz_email:e,biz_password:r},messages:{biz_email:t,biz_password:n}}),$("#wf-form-Register-User").validate({rules:{user_email:e,user_password:r},messages:{user_email:t,user_password:n}})}))})),n.ghostLogout=function(){$(r).on("click","#trigger-ghost-logout",n.logout)},n}(jQuery,this,this.document);