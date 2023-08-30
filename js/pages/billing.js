var BILLING = (function($, window, document, undefined) {
    var pub = {};


    //
    // User-friendly versions of Stripe invoice terminology.
    //
    pub.invoiceReasons = {
        subscription_create: "Subscription created",
        subscription_cycle: "Subscription renewal",
        subscription_update: "Subscription updated",
        subscription: "Subscription",
        manual: "Manual payment",
        upcoming: "Upcoming",
        subscription_threshold: "Billing threshold reached"
    };


    //
    // Webhooks.
    //
    const listMembersInvoices = "https://hook.us1.make.com/xq3ycqbici93ertr6ixfoea3hg9sqsew";


    //
    // On DOM ready.
    //
    $(function() {
        //
        // Build Member's subscription plan list from JSON.
        //
        HELP.waitFor(USER, "current.id", 100, function() {
            var plans = USER.current.planConnections || [],
                wrapper = $('#plans-wrapper');

            if (plans.length > 0) {
                // User has a plan.
                var subscriptionPlans = [],
                    customerID = USER.current.stripeCustomerId,
                    hasActiveSubscription = false;

                // Sort plans by payment.lastBillingDate DESC.
                plans = HELP.sortArrayByObjectValue(plans, 'payment.lastBillingDate');

                $.each(plans, function(i, item) {
                    if (item['type'] != "SUBSCRIPTION") {
                        return;
                    }
                    var planName = MAIN.planNames[item['planId']] || 'Subscription',
                        payment = item['payment'],
                        currencySymbol = HELP.getCurrencySymbol('en-US', payment.currency),
                        cancelLink = nextBillDate = lastBillDate = null;

                    if (currencySymbol == "THB") {
                        // We don't need getCurrencySymbol() as it outputs "THB" which is displayed by payment.currency already.
                        currencySymbol = "";
                    }

                    // If plan has been cancelled but is still active until expiry date.
                    if (payment.cancelAtDate) {
                        nextBillDate = $('<div>', {class: ["bill-next"], html: '<strong>Your plan will cancel on:</strong> '+ HELP.formatTimestamp(payment.cancelAtDate) });
                    }
                    else if (payment.nextBillingDate) {
                        nextBillDate = $('<div>', {class: ["bill-next"], html: '<strong>Renews on:</strong> '+ HELP.formatTimestamp(payment.nextBillingDate) });
                    }
                    if (payment.lastBillingDate) {
                        lastBillDate = $('<div>', {class: ["bill-last"], html: '<strong>Last billed:</strong> '+ HELP.formatTimestamp(payment.lastBillingDate) });
                    }
                    if (item['status'] == "ACTIVE" || item['status'] == "TRIALING") {
                        hasActiveSubscription = true;

                        cancelLink = $('<a>', {
                            'href': '#',
                            'text': 'Manage subscription',
                            'class': 'trigger-customer-portal link-grey'
                        });
                    }

                    subscriptionPlans.push(
                        $('<div class="plan">').append(
                            $('<div>', {class: ["name"], html: '<h3>'+ HELP.sanitizeHTML(planName) +'</h3>'}),
                            $('<div>', {class: ["status"], html: '<strong>Status:</strong> '+item['status']}),
                            $('<div>', {
                                class: ["amount"],
                                html:
                                    '<strong>Amount:</strong> '+ 
                                    '<span>'+payment.currency.toUpperCase()+'</span> '+
                                    currencySymbol + HELP.formatCurrency(payment.amount)
                            }),
                            nextBillDate,
                            lastBillDate,
                            cancelLink
                        )
                    );
                });

                if (subscriptionPlans.length > 0) {
                    $('#subscriptions').append(subscriptionPlans);
                    // $('#banner-sub-join').toggleClass('hide', hasActiveSubscription);
                }
              
                /*$('.link-cancel').on('click', function(e) {
                    e.preventDefault();
                    var $link = $(this),
                        msg = HELP.sanitizeHTML($link.attr('data-confirm'));

                    if (msg && !confirm(msg)) {
                        return false;
                    }
                    MAIN.thinking(true, false);
                    
                    HELP.sendAJAX({
                        url: $link.attr('href'),
                        data: HELP.ajaxMetaValues(),
                        method: "GET",
                        callbackSuccess: function(data) {
                            MAIN.thinking(false);
                            MAIN.handleAjaxResponse(data);
                        },
                        callbackError: function(data) {
                            MAIN.thinking(false);
                            console.log('error');
                        }
                    });
                });*/
            }

            //
            // Get list of Member's invoices.
            //
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
                        var periodDate = HELP.formatTimestamp(item['Period']['Start'], false, true),
                            currencySymbol = HELP.getCurrencySymbol('en-US', item['Amount']['Currency']),  
                            paidDate = null,
                            // title = item['Subscription'] ? "Subscription" : "One-time";
                            title = item['Subscription'] ? pub.invoiceReasons[item['Billing Reason']] : "Credits purchased";

                        if (currencySymbol == "THB") {
                            // We don't need getCurrencySymbol() as it outputs "THB" which is displayed by payment.currency already.
                            currencySymbol = "";
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
                                        currencySymbol + HELP.formatCurrency(item['Amount']['Paid'] / 100)
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





