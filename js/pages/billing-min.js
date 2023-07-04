var BILLING=function($,t,a,e){var n={invoiceReasons:{subscription_create:"Subscription created",subscription_cycle:"Subscription renewal",subscription_update:"Subscription updated",subscription:"Subscription",manual:"Manual payment",upcoming:"Upcoming",subscription_threshold:"Billing threshold reached"}};const s=(t,a,e)=>`https://hook.us1.make.com/bg7py9xulyk6m3wyhmg5okn2ctcfkjiw?plan_id=${t}&customer_id=${a}&amount=${e}`;return $((function(){HELP.waitFor(USER,"current.id",100,(function(){var t=USER.current.planConnections||[],a=$("#plans-wrapper");if(t.length<1)a.append('<p>You haven\'t purchased a plan yet. <a href="/pricing">Select a plan</a> to post jobs and start finding candidates.</p>');else{var e,o=[],i=USER.current.stripeCustomerId;t=HELP.sortArrayByObjectValue(t,"payment.lastBillingDate"),$.each(t,(function(t,a){if("SUBSCRIPTION"==a.type){var n=MAIN.planNames[a.planId],r=a.payment,l=nextBillDate=lastBillDate=null;r.nextBillingDate&&(nextBillDate=$("<div>",{class:["bill-next"],html:"<strong>Your plan renews on</strong> "+HELP.formatTimestamp(r.nextBillingDate)})),r.lastBillingDate&&(lastBillDate=$("<div>",{class:["bill-last"],html:"<strong>Last billing date:</strong> "+HELP.formatTimestamp(r.lastBillingDate)})),"ACTIVE"==a.status&&(e=!0,l=$("<a>",{href:s(a.planId,i,r.amount),text:"Cancel subscription",class:"link-cancel"})),o.push($('<div class="plan">').append($("<div>",{class:["name"],html:"<h3>"+n+"</h3>"}),$("<div>",{class:["status"],html:"<strong>Status:</strong> "+a.status}),$("<div>",{class:["amount"],html:"<strong>Amount:</strong> <span>"+r.currency.toUpperCase()+"</span> "+HELP.formatCurrency(r.amount)}),nextBillDate,lastBillDate,l))}})),o.length>0&&($("#subscriptions").append(o),$("#banner-sub-join").toggleClass("hide",!e)),$(".link-cancel").on("click",(function(t){t.preventDefault(),HELP.sendAJAX({url:$(this).attr("href"),data:HELP.ajaxMetaValues(),method:"GET",callbackSuccess:function(t){var a="Your subscription has been cancelled. We hope you will join us again in future.",e="success";"canceled"!=t.status.toLowerCase()&&(a="Something may have gone wrong. If your subscription does not show as <strong>Cancelled</strong>, please contact our team.",e="error"),MAIN.dialog({message:`<p>${a}</p>`,type:e,mode:"dialog",options:{title:"Your subscription",actions:[{type:"button",text:"OK",attributes:{class:"button-primary trigger-lbox-close trigger-reload",href:"#"}}]}})},callbackError:function(t){console.log("error")}})}))}HELP.sendAJAX({url:"https://hook.us1.make.com/xq3ycqbici93ertr6ixfoea3hg9sqsew",data:{env:HELP.getEnvType(),customer_id:USER.current.stripeCustomerId},method:"GET",callbackSuccess:function(t){var a=[];$.each(t,(function(t,e){var s=HELP.getCurrencySymbol("en-US",e.Amount.Currency),o=HELP.formatTimestamp(e.Period.Start,!1,!0),i=null,r=e.Subscription?"Subscription":"One-time";e.Period.Start!=e.Period.End&&(o+=" - "+HELP.formatTimestamp(e.Period.End,!1,!0)),e["Paid date"]&&(i=$("<div>",{class:["date-paid"],html:"<strong>Paid:</strong> "+HELP.formatTimestamp(e["Paid date"],!1,!0)})),a.push($('<div class="plan">').append($("<div>",{class:["title"],html:"<h3>"+r+" - "+o+"</h3>"}),$("<div>",{class:["number"],html:'<strong>Invoice:</strong> <a href="'+e["Invoice URL"]+'" target="_blank">'+e["Invoice Number"]+"</a>"}),$("<div>",{class:["status"],html:"<strong>Status:</strong> "+e.Status}),$("<div>",{class:["status"],html:"<strong>Type:</strong> "+n.invoiceReasons[e["Billing Reason"]]}),$("<div>",{class:["amount"],html:"<span>"+e.Amount.Currency.toUpperCase()+"</span> "+s+HELP.formatCurrency(e.Amount.Paid/100)}),i))})),a.length<1&&(a=$("<p>",{html:"You don't have any invoices yet."})),$("#invoices").append(a)},callbackError:function(t){console.log("error")}})}))})),n}(jQuery,0,this.document);