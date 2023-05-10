var USER = (function($, window, document, undefined){
    var pub = {};


    pub.current = HELP.getCookie("MSmember") || {};
    /*HELP.getCurrentMember(function(member){
        // pub.member = $.extend(true, {}, pub.member, member);
        $.extend(true, pub.member, member);
    });*/
    HELP.getCurrentMember();


    pub.updateCurrent = function(obj){
        // Merge into current user var and add to session cookie.
        HELP.setCookie("MSmember", $.extend(true, USER.current, obj));
    };



    // On DOM ready.
    // $(function(){
        //
    // });

    return pub;
}(jQuery, this, this.document));





