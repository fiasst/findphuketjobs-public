USER=function($,e,t,r){var n={};return n.current=HELP.getCookie("MSmember")||{},n.updateCurrentUser=function(e){USER.current=USER.current||n.current,$.extend(!0,USER.current,e)},n.getCurrentMember=function(t){if(USER.current=USER.current||n.current,HELP.checkKeyExists(USER.current,"id"))return USER.current;HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.getCurrentMember().then((({data:e})=>(e=e||{},n.updateCurrentUser(e),t&&t(),USER.current)))}))},n.getMemberJSON=function(t){HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.getMemberJSON().then((({data:e})=>(e=e||{},t&&t(e),e)))}))},n.updateMemberJSON=function(t,r){HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.updateMemberJSON({json:t}).then((({data:e})=>(e=e||{},r&&r(e),e)))}))},n.getMemberPlans=function(e,t){if(t=t||n.getCurrentMember(),HELP.checkKeyExists(t,"planConnections")&&t.planConnections.length){var r=$.map(t.planConnections,(function(e,t){if(e.active)return e.type.toLowerCase()}));return e?$.inArray(e,r)>-1:r}return!e&&[]},n.getCurrentMember(),n}(jQuery,this,this.document);