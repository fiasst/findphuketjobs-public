var USER={},MAIN={},ADD_JOB={},HELP=function($,e,t,n){var r={timezone:"Asia/Bangkok",breakpoints:{tabletBP:767,tabletLandscapeBP:991,desktopBP:1247},cleanLowerString:function(e){return $.trim(e.toLowerCase())},stripHTML:function(e){return $("<div/>").html(e).text()}};return r.sanitizeHTML=e=>$.each($($.parseHTML(e,t)),(function(e,t){$.each(this.attributes,(function(e,n){0===n.name.indexOf("on")&&$(t).removeAttr(n.name)}))})),r.getEnvType=function(){return location.hostname.indexOf("webflow")>-1?"dev":"live"},r.getCurrentDomain=function(){return e.location.origin},r.getCurrentLang=function(){return r.checkKeyExists(e,"Weglot")?Weglot.getCurrentLang():"en"},r.formatCurrency=function(e){return parseFloat(e,10).toFixed(2).toString()},r.getCurrencySymbol=(e,t)=>(0).toLocaleString(e,{style:"currency",currency:t,minimumFractionDigits:0,maximumFractionDigits:0}).replace(/\d/g,"").trim(),r.formatTimestamp=function(e,t,n){var i=new Date(e),o=r.getCurrentLang(),a={year:"numeric",month:"long",day:"numeric"};return n&&(a.timeZone=r.timezone),t&&$.extend(a,{hour12:!1,hour:"2-digit",minute:"2-digit"}),"string"==typeof e&&(e=i.getTime()),e.toString().length<11&&i.setTime(1e3*e),i.toLocaleDateString(o,a)},r.getTimestamp=function(e,t){if(e)return new Date(e).getTime();var n=new Date,i={};return t&&(i.timeZone=r.timezone),n=n.toLocaleString(r.getCurrentLang(),i),new Date(n).getTime()},r.getISOdate=function(e,t){var n=r.getTimestamp(e,t);return new Date(n).toISOString()},r.pluralize=(e,t,n="s")=>`${e} ${t}${1!==e?n:""}`,r.timePast=e=>{const t=6e4,n=36e5,i=24*n,o=7*i,a=30*i,u=365*i;var s=r.getTimestamp(!1,!0)-(e=r.getTimestamp(e));return s<t?r.pluralize(Math.round(s/1e3),"second"):s<n?(s=Math.round(s/t),r.pluralize(s,"minute")):s<i?(s=Math.round(s/n),r.pluralize(s,"hour")):s<a?(s=Math.round(s/i),r.pluralize(s,"day")):s<o?(s=Math.round(s/o),r.pluralize(s,"week")):s<u?(s=Math.round(s/a),r.pluralize(s,"month")):(s=Math.round(s/u),r.pluralize(s,"year"))},r.checkKeyExists=function(e,t){return!!e&&(0===(t="string"==typeof t?t.split("."):t).length||r.checkKeyExists(e[t.shift()],t))},r.callNestedFunction=function(t,...n){for(var r=t.split("."),i=r.pop(),o=e,a=0;a<r.length;a++)o=o[r[a]];"function"==typeof o[i]?o[i](...n):console.error("Function not found:",t)},r.waitFor=function(e,t,n,i){var o=setInterval((function(){r.checkKeyExists(e,t)&&(i(),clearInterval(o))}),n)},r.hasPermissions=function(e,t){return $.inArray(e,t.permissions)>-1},r.getFormValues=function(e){var t=new FormData(e[0]),n=Object.fromEntries(t);return console.log([t,n]),$.each(n,(function(t,r){var i=$(e).find(':input[name="'+t+'"]');i.is("select[multiple]")&&(n[t]=i.val())})),n.member_id=USER.current.id||null,n.env=r.getEnvType(),n.url=r.getCurrentDomain(),n.submitted=r.getISOdate(),n.submittedTimestamp=r.getTimestamp(),n},r.sendAJAX=function(e){var t=$.extend({method:"POST",timeout:6e4,success:!1,error:!1},e);$.ajax({url:t.url,method:t.method,data:t.data,timeout:t.timeout,success:function(e,n){console.log(n,e),"function"==typeof t.success&&t.success(e)},error:function(e,n,r){console.log(n,r),"function"==typeof t.error&&t.error([n,r])}})},r.parseIfStringJSON=function(e){return"string"==typeof e&&"{"==(e=e.trim())[0]&&"}"==e[e.length-1]?JSON.parse(e):e},r.formatDDMMYYYY=(e,t=" / ")=>{var n=e.replace(/[^\d]/g,""),r="",i=n.slice(0,2),o=n.slice(2,4),a=n.slice(4,8);return i&&(r+=i,2===i.length&&(r+=t)),o&&(r+=o,2===o.length&&(r+=t)),a&&(r+=a),r},r.setCookie=function(e,n,r){var i="";if(r){var o=new Date;o.setTime(o.getTime()+24*r*60*60*1e3),i="; expires="+o.toUTCString()}t.cookie=e+"="+(n||"")+i+"; path=/"},r.getCookie=function(e){for(var n=e+"=",i=t.cookie.split(";"),o=0;o<i.length;o++){var a=i[o].trim();if(0===a.indexOf(n))return r.parseIfStringJSON(a.substring(n.length))}return null},r.deleteCookie=function(e){t.cookie=e+"=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/"},r}(jQuery,this,this.document);