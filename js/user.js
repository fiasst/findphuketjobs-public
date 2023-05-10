USER = (function($, window, document, undefined){
    var pub = {};


    pub.current = HELP.getCookie("MSmember") || {};
    /*HELP.getCurrentMember(function(member){
        // pub.member = $.extend(true, {}, pub.member, member);
        $.extend(true, pub.member, member);
    });*/
    pub.getCurrentMember();


    // get the current Member then fire callback function.
    pub.getCurrentMember = function(callback) {
        /*if (pub.checkKeyExists(window, 'MSmember')){
            return window.MSmember;
        }*/
        if (HELP.checkKeyExists(USER.current, 'ms')){
            return USER.current;
        }
        HELP.waitFor(window, "$memberstackDom", 50, function(){
            window.$memberstackDom.getCurrentMember().then(({ data: member }) => {
                member = member || {};
                // window.MSmember = output;
                USER.current = $.extend(true, USER.current, {ms: member});

                if (!!callback) {
                    callback(member);
                }
                // else {
                    // return member;
                // }
                return USER.current;
            });
        });
    };


    pub.updateCurrentUser = function(obj){
        // Merge into current user var and add to session cookie.
        HELP.setCookie("MSmember", $.extend(true, USER.current, obj));
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

        if (HELP.checkKeyExists(member.ms, 'planConnections') && !!member.ms.planConnections.length){
            // Get active plans.
            var plans = $.map(member.ms.planConnections, function(item, i){
                if (item.status == "ACTIVE"){
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



    // On DOM ready.
    // $(function(){
        //
    // });

    return pub;
}(jQuery, this, this.document));





