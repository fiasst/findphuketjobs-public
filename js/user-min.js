USER=function($,e,t,n){const r={};var a,c="wf-form-update-active-companies-form";return r.current=HELP.getCookie("MSmember")||{},r.updateCurrentUser=function(e){USER.current=USER.current||r.current,$.extend(!0,USER.current,e)},r.getCurrentMember=function(t){if(USER.current=USER.current||r.current,HELP.checkKeyExists(USER,"current.id"))return USER.current;HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.getCurrentMember().then((({data:e})=>(e=e||{},r.updateCurrentUser(e),t&&t(USER.current),USER.current)))}))},r.getMemberJSON=function(t){HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.getMemberJSON().then((({data:e})=>(e=e||{},t&&t(e),e)))}))},r.updateMemberJSON=function(t,n){HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.updateMemberJSON({json:t}).then((({data:e})=>(e=e||{},n&&n(e),e)))}))},r.getMemberPlans=function(e,t,n){if(t=t||r.getCurrentMember(),HELP.checkKeyExists(t,"planConnections")&&t.planConnections.length){var a=t.planConnections;return n&&(a=HELP.filterArrayByObjectValue(a,"status","ACTIVE")),e&&(a=HELP.filterArrayByObjectValue(a,"type",e)),a}return[]},r.checkCompanyLimits=function(e,t){var n=r.getMemberPlans(!1,!1,!0),c=MAIN.planCompanyLimits;return a=1,t&&(e=HELP.filterArrayByObjectValue(e,"state","active")),$.each(n,(function(e,t){c[t.planId]>a&&(a=c[t.planId])})),e.length-a},r.updateActiveCompanies=function(t){if(t.length>a){var n=HELP.pluralize(a,"business","businesses"),r=$("#"+c),i=r.find(".js-company");r.find(".js-num-companies").text(n),$(".form-job-step-2, #company-form-wrapper").remove(),i.hide(),$.each(t,(function(e,t){var n=i.clone().show();$(".js-company-name",n).text(`${t.tradingName} (${t.registeredName})`),$('[type="checkbox"]',n).attr("name","company[]").val(t.itemId),r.find(".checkbox-list").append(n)})),HELP.waitFor(e.jQuery,"litbox",100,(function(){$.litbox({title:"Update active businesses",href:"#update-companies-form-wrapper",inline:!0,returnFocus:!1,trapFocus:!1,overlayClose:!1,escKey:!1,css:{xxs:{offset:20,maxWidth:700,width:"100%",opacity:.4},sm:{offset:"5% 20px"}}})}))}},r.formValidateActiveCompanies=function(){var e=$("#"+c),t=HELP.pluralize(a,"business","businesses"),n=e.find('[type="checkbox"]:checked');return!(n.length<1||n.length>a)||(alert(`Please${n.length>a?" only":""} select ${t} that you want to remain active.`),!1)},r.getCurrentMember(),r}(jQuery,this,this.document);