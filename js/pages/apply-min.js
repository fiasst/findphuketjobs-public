var APPLY=function($,t,n,e){return $((function(){$("#wf-form-Apply-Form").on("click",".form-submit",(function(t){$(t.target).addClass("clicked")})).on("submit",(function(t){t.preventDefault();var n=$(this),e=n.find(".form-submit.clicked"),o=HELP.getFormValues(n,"formData");return MAIN.buttonThinking(e),HELP.sendAJAX({url:n.attr("action"),method:n.attr("method"),data:o,processData:!1,contentType:!1,cache:!1,timeout:12e4,callbackSuccess:function(t,e){MAIN.handleAjaxResponse(t,n)}},n),!1}))})),{}}(jQuery,0,this.document);