USER=function($,e,r,t){var n={};return n.current=HELP.getCookie("MSmember")||{},n.updateCurrentUser=function(e){console.log("USER.current",USER.current),console.log("pub.current",n.current),$.extend(!0,USER.current,e),console.log(2,USER.current)},n.getCurrentMember=function(r){if(console.log(0,HELP.checkKeyExists(USER.current,"id")),HELP.checkKeyExists(USER.current,"id"))return console.log(4,USER.current),USER.current;HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.getCurrentMember().then((({data:e})=>(e=e||{},console.log(1,e),n.updateCurrentUser(e),r&&r(),console.log(3,n.current),n.current)))}))},n.getCurrentMember(),n.getMemberJSON=function(r){HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.getMemberJSON().then((({data:e})=>(e=e||{},r&&r(e),e)))}))},n.updateMemberJSON=function(r,t){HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.updateMemberJSON({json:r}).then((({data:e})=>(e=e||{},t&&t(e),e)))}))},n.getMemberPlans=function(e,r){if(r=r||n.getCurrentMember(),HELP.checkKeyExists(r,"planConnections")&&r.planConnections.length){var t=$.map(r.planConnections,(function(e,r){if(e.active)return e.type.toLowerCase()}));return e?$.inArray(e,t)>-1:t}return!e&&[]},n}(jQuery,this,this.document);