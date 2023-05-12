USER = (function($, window, document, undefined){
    var pub = {};


    pub.current = HELP.getCookie("MSmember") || {};


    pub.updateCurrentUser = function(obj){
        USER.current = USER.current || pub.current;

        // Merge into current user var.
        $.extend(true, USER.current, obj);
    };


    // get the current Member then fire callback function.
    pub.getCurrentMember = function(callback) {
        USER.current = USER.current || pub.current;

        if (HELP.checkKeyExists(USER, 'current.id')){
            return USER.current;
        }
        HELP.waitFor(window, "$memberstackDom", 50, function(){
            window.$memberstackDom.getCurrentMember().then(({ data: member }) => {
                member = member || {};
                pub.updateCurrentUser(member);

                if (!!callback) {
                    callback(USER.current);
                }
                return USER.current;
            });
        });
    };
    

    // get Member's JSON then fire callback function.
    pub.getMemberJSON = function(callback) {
        HELP.waitFor(window, "$memberstackDom", 50, function(){
            window.$memberstackDom.getMemberJSON().then(({ data: memberJSON }) => {
                memberJSON = memberJSON || {};

                if (!!callback) {
                    callback(memberJSON);
                }
                return memberJSON;
            });
        });
    };


    // update Member's JSON.
    pub.updateMemberJSON = function(json, callback) {
        HELP.waitFor(window, "$memberstackDom", 50, function(){
            window.$memberstackDom.updateMemberJSON({ json: json }).then(({ data: memberJSON }) => {
                memberJSON = memberJSON || {};

                if (!!callback) {
                    callback(memberJSON);
                }
                return memberJSON;
            });
        });
    };


    pub.getMemberPlans = function(planType, member) {
        member = member || pub.getCurrentMember();

        if (HELP.checkKeyExists(member, 'planConnections') && !!member.planConnections.length){
            // Get active plans.
            var plans = $.map(member.planConnections, function(item, i){
                if (item.active){
                    return item.type.toLowerCase();
                }
            });
            // Check if a plan type exists for member.
            if (planType){
                // Is planType in the user's plans.
                return $.inArray(planType, plans) > -1;
            }
            // Return all active user plans.
            return plans;
        }
        return planType ? false : [];
    };


    // init.
    pub.getCurrentMember();


    // On DOM ready.
    // $(function(){
        //
    // });


    return pub;
}(jQuery, this, this.document));





