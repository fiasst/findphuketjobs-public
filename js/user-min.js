USER=function($,e,t,r){var n={};return n.current=HELP.getCookie("MSmember")||{},n.getCurrentMember=function(t){if(HELP.checkKeyExists(USER,"current"))return USER.current;HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.getCurrentMember().then((({data:e})=>(e=e||{},USER.current=$.extend(!0,USER.current,e),t&&t(e),USER.current)))}))},n.getCurrentMember(),n.updateCurrentUser=function(e){USER.current=$.extend(!0,USER.current,e),HELP.setCookie("MSmember",USER.current)},n.getMemberJSON=function(t){HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.getMemberJSON().then((({data:e})=>(e=e||{},t&&t(e),e)))}))},n.updateMemberJSON=function(t,r){HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.updateMemberJSON({json:t}).then((({data:e})=>(e=e||{},r&&r(e),e)))}))},n.getMemberPlans=function(e,t){if(t=t||n.getCurrentMember(),HELP.checkKeyExists(t,"planConnections")&&t.planConnections.length){var r=$.map(t.planConnections,(function(e,t){if("ACTIVE"==e.status)return e.type.toLowerCase()}));return e?$.inArray(e,r)>-1:r}return!e&&[]},n}(jQuery,this,this.document);