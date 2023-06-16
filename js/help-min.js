var USER={},MAIN={},ADD_JOB={},HELP=function($,e,t,n){var r={timezone:"Asia/Bangkok",breakpoints:{tabletBP:767,tabletLandscapeBP:991,desktopBP:1247},cleanLowerString:function(e){return $.trim(e.toLowerCase())},stripHTML:function(e){return $("<div/>").html(e).text()}};return r.sanitizeHTML=e=>$.each($($.parseHTML(e,t)),(function(e,t){$.each(this.attributes,(function(e,n){0===n.name.indexOf("on")&&$(t).removeAttr(n.name)}))})),r.getEnvType=function(){return location.hostname.indexOf("webflow")>-1?"dev":"live"},r.getCurrentDomain=function(){return e.location.origin},r.getCurrentLang=function(){return r.checkKeyExists(e,"Weglot")?Weglot.getCurrentLang():"en"},r.formatCurrency=function(e){return parseFloat(e,10).toFixed(2).toString()},r.getCurrencySymbol=(e,t)=>(0).toLocaleString(e,{style:"currency",currency:t,minimumFractionDigits:0,maximumFractionDigits:0}).replace(/\d/g,"").trim(),r.getSetQuerystring=(t="",n)=>{n=n||e.location.href;const i=new URL(n);return"object"==typeof t?($.each(t,(function(e,t){i.searchParams.set(r.stripHTML(e),r.stripHTML(t))})),i.searchParams.entries()):r.stripHTML(i.searchParams.get(t))},r.formatTimestamp=function(e,t,n){var i=new Date(e),a=r.getCurrentLang(),o={year:"numeric",month:"long",day:"numeric"};return n&&(o.timeZone=r.timezone),t&&$.extend(o,{hour12:!1,hour:"2-digit",minute:"2-digit"}),"string"==typeof e&&(e=i.getTime()),e.toString().length<11&&i.setTime(1e3*e),i.toLocaleDateString(a,o)},r.getTimestamp=function(e,t){if(e)return new Date(e).getTime();var n=new Date,i={};return t&&(i.timeZone=r.timezone),n=n.toLocaleString(r.getCurrentLang(),i),new Date(n).getTime()},r.getISOdate=function(e,t){var n=r.getTimestamp(e,t);return new Date(n).toISOString()},r.pluralize=(e,t,n="s")=>`${e} ${t}${1!==e?n:""}`,r.timePast=e=>{const t=6e4,n=36e5,i=24*n,a=7*i,o=30*i,s=365*i;var u=r.getTimestamp(!1,!0)-(e=r.getTimestamp(e));return u<t?r.pluralize(Math.round(u/1e3),"second"):u<n?(u=Math.round(u/t),r.pluralize(u,"minute")):u<i?(u=Math.round(u/n),r.pluralize(u,"hour")):u<o?(u=Math.round(u/i),r.pluralize(u,"day")):u<a?(u=Math.round(u/a),r.pluralize(u,"week")):u<s?(u=Math.round(u/o),r.pluralize(u,"month")):(u=Math.round(u/s),r.pluralize(u,"year"))},r.checkKeyExists=function(e,t){return!!e&&(0===(t="string"==typeof t?t.split("."):t).length||r.checkKeyExists(e[t.shift()],t))},r.callNestedFunction=function(t,...n){for(var r=t.split("."),i=r.pop(),a=e,o=0;o<r.length;o++)a=a[r[o]];"function"==typeof a[i]?a[i](...n):console.error("Function not found:",t)},r.waitFor=function(e,t,n,i){var a=setInterval((function(){r.checkKeyExists(e,t)&&(i(),clearInterval(a))}),n)},r.hasPermissions=function(e,t){return $.inArray(e,t.permissions)>-1},r.getFormValues=function(e,t){var n=new FormData(e[0]);return $.each(n.entries(),(function(t,r){var i=$(e).find(':input[name="'+t+'"]');i.is("select[multiple]")&&n.set(t,i.val())})),n.append("member_id",USER.current.id||null),n.append("env",r.getEnvType()),n.append("url",r.getCurrentDomain()),n.append("submitted",r.getISOdate()),n.append("submittedTimestamp",r.getTimestamp()),console.log("formData",n),"formData"==t?n:"json"==t?JSON.stringify(Object.fromEntries(n)):Object.fromEntries(n)},r.sendAJAX=function(t,n){params=$.extend({method:"POST",timeout:6e4,success:function(e,t){console.log(t,e),"function"==typeof params.callbackSuccess&&params.callbackSuccess(e)},error:function(t,i,a){console.log(i,a),"function"==typeof params.callbackError&&params.callbackError(i,a);var o={mode:"dialog",message:"Sorry, something went wrong, please try again. if the problem continues, contact our team for help.",type:"error",enableForm:!0,options:{title:"There was a problem...",overlayClose:!1,actions:[{type:"button",text:"OK",attributes:{class:"button-primary trigger-lbox-close",href:"#"}}]}};r.checkKeyExists(e.jQuery,"litbox")?MAIN.handleAjaxResponse(o,n||!1):alert(o.message)}},t),$.ajax(params)},r.parseIfStringJSON=function(e){return"string"==typeof e&&"{"==(e=e.trim())[0]&&"}"==e[e.length-1]?JSON.parse(e):e},r.formatDDMMYYYY=(e,t=" / ")=>{var n=e.replace(/[^\d]/g,""),r="",i=n.slice(0,2),a=n.slice(2,4),o=n.slice(4,8);return i&&(r+=i,2===i.length&&(r+=t)),a&&(r+=a,2===a.length&&(r+=t)),o&&(r+=o),r},r.setCookie=function(e,n,r){var i="";if(r){var a=new Date;a.setTime(a.getTime()+24*r*60*60*1e3),i="; expires="+a.toUTCString()}t.cookie=e+"="+(n||"")+i+"; path=/"},r.getCookie=function(e){for(var n=e+"=",i=t.cookie.split(";"),a=0;a<i.length;a++){var o=i[a].trim();if(0===o.indexOf(n))return r.parseIfStringJSON(o.substring(n.length))}return null},r.deleteCookie=function(e){t.cookie=e+"=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/"},r}(jQuery,this,this.document);