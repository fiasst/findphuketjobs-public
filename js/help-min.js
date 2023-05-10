var HELP=function($,e,t,n){var r={breakpoints:{tabletBP:767,tabletLandscapeBP:991,desktopBP:1247},cleanLowerString:function(e){return $.trim(e.toLowerCase())},getEnvType:function(){return location.hostname.indexOf("webflow")>-1?"dev":"live"},getCurrentLang:function(){return r.checkKeyExists(e,"Weglot")?Weglot.getCurrentLang():"en"},formatCurrency:function(e){return parseFloat(e,10).toFixed(2).toString()},getCurrencySymbol:(e,t)=>(0).toLocaleString(e,{style:"currency",currency:t,minimumFractionDigits:0,maximumFractionDigits:0}).replace(/\d/g,"").trim(),formatTimestamp:function(e){var t=new Date(e),n=r.getCurrentLang();return"string"==typeof e&&(e=t.getTime()),e.toString().length<11&&t.setTime(1e3*e),t.toLocaleDateString(n,{year:"numeric",month:"long",day:"numeric"})},getTimestamp:function(e){if(e)return new Date(e).getTime();var t=new Date;return t=t.setDate(t.getDate()),new Date(t).getTime()},getISOdate:function(e){var t=r.getTimestamp(e);return new Date(t).toISOString()},checkKeyExists:function(e,t){return null!=e&&(e.hasOwnProperty(t)||"object"==typeof e&&t in e)},waitFor:function(e,t,n,o){var i=setInterval((function(){r.checkKeyExists(e,t)&&(o(),clearInterval(i))}),n)},hasPermissions:function(e,t){return $.inArray(e,t.permissions)>-1},getFormValues:function(t){var n=new FormData(t[0]),o=Object.fromEntries(n);return console.log([n,o]),$.each(o,(function(e,n){var r=$(t).find(':input[name="'+e+'"]');r.is("select[multiple]")&&(o[e]=r.val())})),o.member_id=e.MSmember.id||null,o.env=r.getEnvType(),o.submitted=r.getISOdate(),o},sendAJAX:function(e){var t=$.extend({method:"POST",timeout:6e4,success:!1,error:!1},e);$.ajax({url:t.url,method:t.method,data:t.data,timeout:t.timeout,success:function(e,n){console.log(n,e),$.isFunction(t.success)&&t.success(e)},error:function(e,n,r){console.log(n,r),$.isFunction(t.error)&&t.error([n,r])}})},pluralize:(e,t,n="s")=>`${e} ${t}${1!==e?n:""}`,timePast:e=>{const t=6e4,n=36e5,o=24*n,i=7*o,a=30*o,u=365*o;let c=r.getTimestamp()-r.getTimestamp(e);return c<t?r.pluralize(Math.round(c/1e3),"second"):c<n?(c=Math.round(c/t),r.pluralize(c,"minute")):c<o?(c=Math.round(c/n),r.pluralize(c,"hour")):c<a?(c=Math.round(c/o),r.pluralize(c,"day")):c<i?(c=Math.round(c/i),r.pluralize(c,"week")):c<u?(c=Math.round(c/a),r.pluralize(c,"month")):(c=Math.round(c/u),r.pluralize(c,"year"))},getCurrentMember:function(t){if(r.checkKeyExists(e,"MSmember"))return e.MSmember;r.waitFor(e,"$memberstackDom",100,(function(){e.$memberstackDom.getCurrentMember().then((({data:n})=>{if(!t)return r;var r=n||{};e.MSmember=r,t(r)}))}))},getMemberJSON:function(t){r.waitFor(e,"$memberstackDom",100,(function(){e.$memberstackDom.getMemberJSON().then((({data:e})=>{t&&t(e||{})}))}))},updateMemberJSON:function(t,n){r.waitFor(e,"$memberstackDom",100,(function(){e.$memberstackDom.updateMemberJSON({json:t}).then((({data:e})=>{n&&n(e||{})}))}))},getMemberPlans:function(e,t){if(t=t||r.getCurrentMember(),r.checkKeyExists(t,"planConnections")&&t.planConnections.length){var n=$.map(t.planConnections,(function(e,t){if("ACTIVE"==e.status)return e.type.toLowerCase()}));return e?$.inArray(e,n)>-1:n}return!e&&[]},setCookie:function(e,n,r){var o="";if(r){var i=new Date;i.setTime(i.getTime()+24*r*60*60*1e3),o="; expires="+i.toUTCString()}t.cookie=e+"="+(n||"")+o+"; path=/"},getCookie:function(e){for(var n=e+"=",r=t.cookie.split(";"),o=0;o<r.length;o++){for(var i=r[o];" "==i.charAt(0);)i=i.substring(1,i.length);if(0==i.indexOf(n))return i.substring(n.length,i.length)}return null},deleteCookie:function(e){t.cookie=e+"=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/"}};return r}(jQuery,this,this.document);