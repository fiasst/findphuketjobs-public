USER=function($,e,t,n){var r,a,i={},c="wf-form-update-active-companies-form";return i.current=HELP.getCookie("MSmember")||{},i.updateCurrentUser=function(e){USER.current=USER.current||i.current,$.extend(!0,USER.current,e)},i.getCurrentMember=function(t){if(USER.current=USER.current||i.current,HELP.checkKeyExists(USER,"current.id"))return USER.current;HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.getCurrentMember().then((({data:e})=>(e=e||{},i.updateCurrentUser(e),t&&t(USER.current),USER.current)))}))},i.getMemberJSON=function(t){HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.getMemberJSON().then((({data:e})=>(e=e||{},t&&t(e),e)))}))},i.updateMemberJSON=function(t,n){HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.updateMemberJSON({json:t}).then((({data:e})=>(e=e||{},n&&n(e),e)))}))},i.getMemberPlans=function(e,t){if(t=t||i.getCurrentMember(),HELP.checkKeyExists(t,"planConnections")&&t.planConnections.length){var n=$.map(t.planConnections,(function(e,t){if(e.active)return e.type.toLowerCase()}));return e?$.inArray(e,n)>-1:n}return!e&&[]},i.filterActiveCompanies=function(e){return $.map(e,(function(e,t){return"active"==e.state?e:null}))},i.checkCompanyLimits=function(t){var n=i.getMemberPlans(),o=MAIN.planCompanyLimits;if(r=1,a=i.filterActiveCompanies(t),$.each(n,(function(e,t){o[t.planId]>r&&(r=o[planId])})),a.length>r){var u=HELP.pluralize(r,"business","businesses"),s=$("#"+c),m=s.find(".js-company");return s.find(".js-num-companies").text(u),m.hide(),$.each(t,(function(e,t){var n=m.clone().show();$(".js-company-name",n).text(`${t.tradingName} (${t.registeredName})`),$('[type="checkbox"]',n).attr("name","company[]").val(t.itemId),s.find(".checkbox-list").append(n)})),HELP.waitFor(e.jQuery,"litbox",100,(function(){$.litbox({title:"Update active businesses",href:"#update-companies-form-wrapper",inline:!0,returnFocus:!1,trapFocus:!1,overlayClose:!1,escKey:!1,css:{xxs:{offset:20,maxWidth:700,width:"100%",opacity:.4},sm:{offset:"5% 20px"}}})})),$("#company-form-wrapper").remove(),!0}return!1},i.formValidateActiveCompanies=function(){var e=$("#"+c),t=HELP.pluralize(r,"business","businesses"),n=e.find('[type="checkbox"]:checked');return!(n.length<1||n.length>r)||(alert(`Please${n.length>r?" only":""} select ${t} that you want to remain active.`),!1)},i.getCurrentMember(),i}(jQuery,this,this.document);