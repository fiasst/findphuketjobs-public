var DASHBOARD=function($,e,t,a){return $((function(){$(".js-job-actions").each((function(){var e=$(this),t=$(".dropdown-nav-item",e),a=$(".job-status",e).text().toLowerCase();if(a)switch(e.addClass(a),t.addClass("hide"),a){case"draft":t.filter('[data-link="edit"], [data-link="publish"]').removeClass("hide");break;case"expired":case"archived":t.removeClass("hide").filter('[data-link="publish"]').find("a").text("Republish");break;case"pending":t.filter('[data-link="edit"]').removeClass("hide");break;case"published":t.filter('[data-link="edit"], [data-link="archive"]').removeClass("hide")}}));var e=$("#my-content .w-tab-pane");1===e.length&&e.addClass("w--tab-active");var a=$("#wf-form-Delete-Account-Form");a.on("submit",(function(e){var o,n;return e.preventDefault(),o=$("#field-confirm"),n={message:"[p]Confirm one last time that you want to cancel any subscriptions, delete you account, and erase your personal data. [strong]This cannot be undone.[/strong][/p]",type:"warning",options:{title:"One final check...",actions:[{type:"button",text:"No, take me to safety",attributes:{class:"button-secondary link-dashboard trigger-lbox-close",href:"#"}},{type:"button",text:"Yes, Delete my account",attributes:{class:"button-primary danger trigger-lbox-close",href:"#",id:"trigger-delete-account"}}]}},o.val()&&"delete"==o.val().toLowerCase()||(n.message='[p]You must type [strong]"DELETE"[/strong] in the required field to confirm that you want to delete your account.[/p]',n.type="info",n.options.title="Field required",n.options.actions=[{type:"button",text:"OK",attributes:{class:"button-primary trigger-lbox-close",href:"#"}}]),MAIN.openDialog(n),$(t).on("click","#trigger-delete-account",(function(){!function(e){MAIN.thinking(!0,!0);var t=HELP.getFormValues(e);t.customer_id=customerID=USER.current.stripeCustomerId,HELP.sendAJAX({url:"https://hook.us1.make.com/rouyiju7uboj6bnpon9l74q2i6vjvqhc",method:"POST",data:t,timeout:12e4,callbackSuccess:function(t){MAIN.thinking(!1),MAIN.handleAjaxResponse(t,e)},callbackError:function(e){MAIN.thinking(!1),console.log("error")}},e)}(a)})),!1}))})),{}}(jQuery,0,this.document);