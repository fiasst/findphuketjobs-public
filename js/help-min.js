var USER={},MAIN={},ADD_JOB={},HELP=function($,e,t,n){var r={breakpoints:{tabletBP:767,tabletLandscapeBP:991,desktopBP:1247},cleanLowerString:function(e){return $.trim(e.toLowerCase())},getEnvType:function(){return location.hostname.indexOf("webflow")>-1?"dev":"live"},getCurrentLang:function(){return r.checkKeyExists(e,"Weglot")?Weglot.getCurrentLang():"en"},formatCurrency:function(e){return parseFloat(e,10).toFixed(2).toString()},getCurrencySymbol:(e,t)=>(0).toLocaleString(e,{style:"currency",currency:t,minimumFractionDigits:0,maximumFractionDigits:0}).replace(/\d/g,"").trim(),formatTimestamp:function(e){var t=new Date(e),n=r.getCurrentLang();return"string"==typeof e&&(e=t.getTime()),e.toString().length<11&&t.setTime(1e3*e),t.toLocaleDateString(n,{year:"numeric",month:"long",day:"numeric"})},getTimestamp:function(e){if(e)return new Date(e).getTime();var t=new Date;return t=t.setDate(t.getDate()),new Date(t).getTime()},getISOdate:function(e){var t=r.getTimestamp(e);return new Date(t).toISOString()},checkKeyExists:function(e,t){return null!=e&&(e.hasOwnProperty(t)||"object"==typeof e&&t in e)},waitFor:function(e,t,n,i){var o=setInterval((function(){r.checkKeyExists(e,t)&&(i(),clearInterval(o))}),n)},hasPermissions:function(e,t){return $.inArray(e,t.permissions)>-1},getFormValues:function(e){var t=new FormData(e[0]),n=Object.fromEntries(t);return console.log([t,n]),$.each(n,(function(t,r){var i=$(e).find(':input[name="'+t+'"]');i.is("select[multiple]")&&(n[t]=i.val())})),n.member_id=USER.current.id||null,n.env=r.getEnvType(),n.submitted=r.getISOdate(),n},sendAJAX:function(e){var t=$.extend({method:"POST",timeout:6e4,success:!1,error:!1},e);$.ajax({url:t.url,method:t.method,data:t.data,timeout:t.timeout,success:function(e,n){console.log(n,e),$.isFunction(t.success)&&t.success(e)},error:function(e,n,r){console.log(n,r),$.isFunction(t.error)&&t.error([n,r])}})},pluralize:(e,t,n="s")=>`${e} ${t}${1!==e?n:""}`,timePast:e=>{const t=6e4,n=36e5,i=24*n,o=7*i,a=30*i,u=365*i;let s=r.getTimestamp()-r.getTimestamp(e);return s<t?r.pluralize(Math.round(s/1e3),"second"):s<n?(s=Math.round(s/t),r.pluralize(s,"minute")):s<i?(s=Math.round(s/n),r.pluralize(s,"hour")):s<a?(s=Math.round(s/i),r.pluralize(s,"day")):s<o?(s=Math.round(s/o),r.pluralize(s,"week")):s<u?(s=Math.round(s/a),r.pluralize(s,"month")):(s=Math.round(s/u),r.pluralize(s,"year"))},setCookie:function(e,n,r){var i="";if(r){var o=new Date;o.setTime(o.getTime()+24*r*60*60*1e3),i="; expires="+o.toUTCString()}t.cookie=e+"="+(n||"")+i+"; path=/"},getCookie:function(e){for(var n=e+"=",r=t.cookie.split(";"),i=0;i<r.length;i++){for(var o=r[i];" "==o.charAt(0);)o=o.substring(1,o.length);if(0==o.indexOf(n))return o.substring(n.length,o.length)}return null},deleteCookie:function(e){t.cookie=e+"=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/"}};return r}(jQuery,this,this.document);