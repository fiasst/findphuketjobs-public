var BILLING = (function($, window, document, undefined){
    var pub = {}


    // User-friendly versions of Stripe invoice terminology.
    pub.invoiceReasons = {
        subscription_create: "Subscription created",
        subscription_cycle: "Subscription renewal",
        subscription_update: "Subscription updated",
        subscription: "Subscription",
        manual: "Manual payment",
        upcoming: "Upcoming",
        subscription_threshold: "Billing threshold reached"
    };


    // Webhooks.
    const listMembersInvoices = "https://hook.us1.make.com/xq3ycqbici93ertr6ixfoea3hg9sqsew";
    const cancelMembersSubscription = (planId, priceId, customerID, amount) => `https://hook.us1.make.com/bg7py9xulyk6m3wyhmg5okn2ctcfkjiw?plan_id=${planId}&price_id=${priceId}&customer_id=${customerID}&amount=${amount}`;


    // On DOM ready.
    $(function() {
        // Build Member's subscription plan list from JSON.
        HELP.waitFor(USER, "current.id", 100, function() {
            var plans = USER.current.planConnections || [],
                wrapper = $('#plans-wrapper');

            if (plans.length < 1) {
                // No plans exist.
                wrapper.append("<p>You haven't purchased a plan yet. <a href=\"/pricing\">Select a plan</a> to post jobs and start finding candidates.</p>");    
            }
            else {
                var subscriptionPlans = [],
                    customerID = USER.current.stripeCustomerId,
                    hasActiveSubscription = false;

                // Sort plans by payment.lastBillingDate DESC.
                plans = HELP.sortArrayByObjectValue(plans, 'payment.lastBillingDate');

                $.each(plans, function(i, item) {
                    if (item['type'] != "SUBSCRIPTION") {
                        return;
                    }
                    var planName = MAIN.planNames[item['planId']],
                        payment = item['payment'],
                        cancelLink = nextBillDate = lastBillDate = null;

                    if (payment.nextBillingDate) {
                        nextBillDate = $('<div>', {class: ["bill-next"], html: '<strong>Your plan renews on</strong> '+ HELP.formatTimestamp(payment.nextBillingDate) });  
                    }
                    if (payment.lastBillingDate) {
                        lastBillDate = $('<div>', {class: ["bill-last"], html: '<strong>Last billing date:</strong> '+ HELP.formatTimestamp(payment.lastBillingDate) });   
                    }
                    if (item['status'] == "ACTIVE") {
                        hasActiveSubscription = true;

                        cancelLink = $('<a>', {
                            'href': cancelMembersSubscription(item.planId, payment.priceId, customerID, payment.amount),
                            'text': 'Cancel subscription',
                            'class': 'link-cancel'
                        });
                    }

                    subscriptionPlans.push(
                        $('<div class="plan">').append(
                            $('<div>', {class: ["name"], html: '<h3>'+planName+'</h3>'}),
                            $('<div>', {class: ["status"], html: '<strong>Status:</strong> '+item['status']}),
                            $('<div>', {
                                class: ["amount"],
                                html:
                                    '<strong>Amount:</strong> '+ 
                                    '<span>'+payment.currency.toUpperCase()+'</span> '+
                                    // We don't need getCurrencySymbol() as it outputs "THB" which is displayed by payment.currency already.
                                    // HELP.getCurrencySymbol('en-US', payment.currency)+
                                    HELP.formatCurrency(payment.amount)
                            }),
                            nextBillDate,
                            lastBillDate,
                            cancelLink
                        )
                    );
                });

                if (subscriptionPlans.length > 0) {
                    $('#subscriptions').append(subscriptionPlans);
                    $('#banner-sub-join').toggleClass('hide', hasActiveSubscription);
                }
              
                $('.link-cancel').on('click', function(e) {
                    e.preventDefault();
                    MAIN.thinking(true, false);
                    
                    HELP.sendAJAX({
                        url: $(this).attr('href'),
                        data: HELP.ajaxMetaValues(),
                        method: "GET",
                        callbackSuccess: function(data) {
                            MAIN.thinking(false);

                            // TODO: move this logic inside Make Webhook response and use MAIN.handleAjaxResponse().
                            var msg = "Your subscription has been cancelled. We hope you will join us again soon.",
                                type = "success";

                            if (data.status != "canceled") {
                                msg = "Something may have gone wrong. If your subscription does not show as <strong>Cancelled</strong>, please contact our team.";
                                type = "error";
                            }
                            MAIN.dialog({
                                message: `<p>${msg}</p>`,
                                type: type,
                                mode: "dialog",
                                options: {
                                    title: "Your subscription",
                                    actions: [{
                                        type: "button",
                                        text: "OK",
                                        attributes: {
                                            class: "button-primary trigger-lbox-close trigger-reload",
                                            href: "#"
                                        }
                                    }]
                                }
                            });
                        },
                        callbackError: function(data) {
                            MAIN.thinking(false);
                            console.log('error');
                        }
                    });
                });
            }

            // Get list of Member's invoices.
            HELP.sendAJAX({
                url: listMembersInvoices,
                data: {
                    env: HELP.getEnvType(),
                    customer_id: USER.current.stripeCustomerId
                },
                method: "GET",
                callbackSuccess: function(data) {
                    var invoices = [];

                    $.each(data, function(i, item) {
                        var currencySymbol = HELP.getCurrencySymbol('en-US', item['Amount']['Currency']),  
                            periodDate = HELP.formatTimestamp(item['Period']['Start'], false, true),
                            paidDate = null,
                            // title = item['Subscription'] ? "Subscription" : "One-time";
                            title = pub.invoiceReasons[item['Billing Reason']];

                        if (item['Period']['Start'] != item['Period']['End']) {
                            periodDate += " - "+HELP.formatTimestamp(item['Period']['End'], false, true);   
                        }
                        if (item['Paid date']) {
                            paidDate = $('<div>', {
                                class: ["date-paid"],
                                html: '<strong>Paid:</strong> '+HELP.formatTimestamp(item['Paid date'], false, true)
                            });   
                        }
                        invoices.push(
                            $('<div class="plan">').append(
                                $('<div>', {class: ["title"], html: '<h3>'+title+' - '+periodDate+'</h3>'}),
                                $('<div>', {
                                    class: ["number"],
                                    html:
                                        '<strong>Invoice:</strong> <a href="'+item['Invoice URL']+'" target="_blank">'+
                                        item['Invoice Number']+'</a>'
                                }),
                                $('<div>', {class: ["status"], html: '<strong>Status:</strong> '+item['Status']}),
                                $('<div>', {
                                    class: ["amount"],
                                    html:
                                        '<span>'+item['Amount']['Currency'].toUpperCase()+'</span> '+
                                        currencySymbol+HELP.formatCurrency(item['Amount']['Paid'] / 100)
                                }),
                                paidDate
                            )
                        );
                    });
                    if (invoices.length < 1) {
                        invoices = $('<p>', {html: "You don't have any invoices yet."});
                    }
                    $('#invoices').append(invoices);
                },
                callbackError: function(data) {
                    console.log('error');
                }
            });
        });
    });

    return pub;
}(jQuery, this, this.document));





