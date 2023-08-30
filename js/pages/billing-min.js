var BILLING=function($,t,n,a){var e={invoiceReasons:{subscription_create:"Subscription created",subscription_cycle:"Subscription renewal",subscription_update:"Subscription updated",subscription:"Subscription",manual:"Manual payment",upcoming:"Upcoming",subscription_threshold:"Billing threshold reached"}};const s=(t,n,a,e)=>`https://hook.us1.make.com/bg7py9xulyk6m3wyhmg5okn2ctcfkjiw?plan_id=${t}&price_id=${n}&customer_id=${a}&amount=${e}`;return $((function(){HELP.waitFor(USER,"current.id",100,(function(){var t=USER.current.planConnections||[];$("#plans-wrapper");if(t.length>0){var n=[],a=USER.current.stripeCustomerId;t=HELP.sortArrayByObjectValue(t,"payment.lastBillingDate"),$.each(t,(function(t,e){if("SUBSCRIPTION"==e.type){var i=MAIN.planNames[e.planId]||"Subscription",r=e.payment,l=HELP.getCurrencySymbol("en-US",r.currency),o=nextBillDate=lastBillDate=null;"THB"==l&&(l=""),r.nextBillingDate&&(nextBillDate=$("<div>",{class:["bill-next"],html:"<strong>Your plan renews on</strong> "+HELP.formatTimestamp(r.nextBillingDate)})),r.lastBillingDate&&(lastBillDate=$("<div>",{class:["bill-last"],html:"<strong>Last billing date:</strong> "+HELP.formatTimestamp(r.lastBillingDate)})),"ACTIVE"!=e.status&&"TRIALING"!=e.status||(!0,o=$("<a>",{href:s(e.planId,r.priceId,a,r.amount),text:"Cancel subscription",class:"link-cancel","data-confirm":"Are you sure you want to cancel your subscription?"})),n.push($('<div class="plan">').append($("<div>",{class:["name"],html:"<h3>"+HELP.sanitizeHTML(i)+"</h3>"}),$("<div>",{class:["status"],html:"<strong>Status:</strong> "+e.status}),$("<div>",{class:["amount"],html:"<strong>Amount:</strong> <span>"+r.currency.toUpperCase()+"</span> "+l+HELP.formatCurrency(r.amount)}),nextBillDate,lastBillDate,o))}})),n.length>0&&$("#subscriptions").append(n),$(".link-cancel").on("click",(function(t){t.preventDefault();var n=$(this),a=HELP.sanitizeHTML(n.attr("data-confirm"));if(a&&!confirm(a))return!1;MAIN.thinking(!0,!1),HELP.sendAJAX({url:n.attr("href"),data:HELP.ajaxMetaValues(),method:"GET",callbackSuccess:function(t){MAIN.thinking(!1),MAIN.handleAjaxResponse(t)},callbackError:function(t){MAIN.thinking(!1),console.log("error")}})}))}HELP.sendAJAX({url:"https://hook.us1.make.com/xq3ycqbici93ertr6ixfoea3hg9sqsew",data:{env:HELP.getEnvType(),customer_id:USER.current.stripeCustomerId},method:"GET",callbackSuccess:function(t){var n=[];$.each(t,(function(t,a){var s=HELP.formatTimestamp(a.Period.Start,!1,!0),i=HELP.getCurrencySymbol("en-US",a.Amount.Currency),r=null,l=a.Subscription?e.invoiceReasons[a["Billing Reason"]]:"Credits purchased";"THB"==i&&(i=""),a["Paid date"]&&(r=$("<div>",{class:["date-paid"],html:"<strong>Paid:</strong> "+HELP.formatTimestamp(a["Paid date"],!1,!0)})),n.push($('<div class="plan">').append($("<div>",{class:["title"],html:"<h3>"+l+" - "+s+"</h3>"}),$("<div>",{class:["number"],html:'<strong>Invoice:</strong> <a href="'+a["Invoice URL"]+'" target="_blank">'+a["Invoice Number"]+"</a>"}),$("<div>",{class:["status"],html:"<strong>Status:</strong> "+a.Status}),$("<div>",{class:["amount"],html:"<span>"+a.Amount.Currency.toUpperCase()+"</span> "+i+HELP.formatCurrency(a.Amount.Paid/100)}),r))})),n.length<1&&(n=$("<p>",{html:"You don't have any invoices yet."})),$("#invoices").append(n)},callbackError:function(t){console.log("error")}})}))})),e}(jQuery,0,this.document);