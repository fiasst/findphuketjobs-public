USER = (function($, window, document, undefined){
    var pub = {};


    pub.current = HELP.getCookie("MSmember") || {};
    /*HELP.getCurrentMember(function(member){
        // pub.member = $.extend(true, {}, pub.member, member);
        $.extend(true, pub.member, member);
    });*/


    pub.updateCurrentUser = function(obj){
        USER.current = USER.current || pub.current;

        // Merge into current user var and add to session cookie.
        // HELP.setCookie("MSmember", JSON.stringify(USER.current));
        // pub.current = $.extend(true, USER.current, obj);
        console.log('USER.current', USER.current);
        console.log('pub.current', pub.current);
        
        $.extend(true, USER.current, obj);
        console.log(2, USER.current);
    };


    // get the current Member then fire callback function.
    pub.getCurrentMember = function(callback) {
        USER.current = USER.current || pub.current;

        /*if (pub.checkKeyExists(window, 'MSmember')){
            return window.MSmember;
        }*/
        console.log(0, HELP.checkKeyExists(USER.current, 'id'));
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
                // console.log(3, pub.current);
                console.log(3, USER.current);
                // return pub.current;
                return USER.current;
            });
        });
    };
    // init.
    pub.getCurrentMember();
    

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



    // On DOM ready.
    // $(function(){
        //
    // });

    return pub;
}(jQuery, this, this.document));





