USER = (function($, window, document, undefined){
    var pub = {};


    pub.current = HELP.getCookie("MSmember") || {};
    /*HELP.getCurrentMember(function(member){
        // pub.member = $.extend(true, {}, pub.member, member);
        $.extend(true, pub.member, member);
    });*/


    // get the current Member then fire callback function.
    pub.getCurrentMember = function(callback) {
        /*if (pub.checkKeyExists(window, 'MSmember')){
            return window.MSmember;
        }*/
        if (HELP.checkKeyExists(USER.current, 'id')){
            console.log(4, USER.current);
            return USER.current;
        }
        HELP.waitFor(window, "$memberstackDom", 50, function(){
            window.$memberstackDom.getCurrentMember().then(({ data: member }) => {
                member = member || {};
                // window.MSmember = output;
                // Add MS data to USER.curtent Object.
                // USER.current = $.extend(true, {}, USER.current, member);
                console.log(1, member);
                pub.updateCurrentUser(member);

                if (!!callback) {
                    // callback(member);
                    callback();
                }
                // else {
                    // return member;
                // }
                console.log(3, USER.current);
                return USER.current;
            });
        });
    };
    pub.getCurrentMember();


    pub.updateCurrentUser = function(obj){
        // Merge into current user var and add to session cookie.
        // HELP.setCookie("MSmember", USER.current);
        USER.current = $.extend(true, {}, USER.current, obj);
        console.log(2, USER.current);
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





