USER=function($,e,t,n){var r,i,a={},c="wf-form-update-active-companies-form";return a.current=HELP.getCookie("MSmember")||{},a.updateCurrentUser=function(e){USER.current=USER.current||a.current,$.extend(!0,USER.current,e)},a.getCurrentMember=function(t){if(USER.current=USER.current||a.current,HELP.checkKeyExists(USER,"current.id"))return USER.current;HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.getCurrentMember().then((({data:e})=>(e=e||{},a.updateCurrentUser(e),t&&t(USER.current),USER.current)))}))},a.getMemberJSON=function(t){HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.getMemberJSON().then((({data:e})=>(e=e||{},t&&t(e),e)))}))},a.updateMemberJSON=function(t,n){HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.updateMemberJSON({json:t}).then((({data:e})=>(e=e||{},n&&n(e),e)))}))},a.getMemberPlans=function(e,t){if(t=t||a.getCurrentMember(),HELP.checkKeyExists(t,"planConnections")&&t.planConnections.length){var n=$.map(t.planConnections,(function(e,t){if(e.active)return e.type.toLowerCase()}));return e?$.inArray(e,n)>-1:n}return!e&&[]},a.checkCompanyLimits=function(t){var n=a.getMemberPlans(),o=MAIN.planCompanyLimits;if(r=1,i=t.length,$.each(n,(function(e,t){o[t.planId]>r&&(r=o[planId])})),i>r){var s=HELP.pluralize(r,"business","businesses"),u=$("#"+c),m=u.find(".js-company");return m.hide(),$.each(t,(function(e,t){var n=m.clone().show();$(".js-company-name",n).text(`${t.tradingName} (${t.registeredName})`),$('[type="checkbox"]',n).attr("id",`company-checkbox-${e}`).val(t.itemId),u.find(".checkbox-list").append(n)})),u.find(".js-num-companies").text(s),HELP.waitFor(e.jQuery,"litbox",100,(function(){$.litbox({title:"Active businesses limit exceeded",href:"#update-companies-form-wrapper",inline:!0,returnFocus:!1,trapFocus:!1,overlayClose:!1,escKey:!1,css:{xxs:{offset:20,maxWidth:700,width:"100%",opacity:.4},sm:{offset:"5% 20px"}}})})),$("#company-form-wrapper").remove(),!0}return!1},a.formValidateActiveCompanies=function(){var e=$("#"+c),t=HELP.pluralize(r,"business","businesses"),n=e.find('[type="checkbox"]:checked');if(n.length>r)alert(`Please only select ${t} that you want to remain active.`);else if(n.length>0)return!0;return!1},a.getCurrentMember(),a}(jQuery,this,this.document);