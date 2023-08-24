var USER={},MAIN={},ADD_JOB={},HELP=function($,e,t,r){var n={};return n.timezone="Asia/Bangkok",n.cleanLowerString=(e="")=>$.trim(e.toLowerCase()),n.removeNonNumeric=(e="")=>e.toString().replace(/\D/g,""),n.sanitizeHTML=e=>{if(!e)return;const t={"&":"&amp;","<":"&lt;",">":"&gt;"};return e.toString().replace(/<.*?script.*?>|.constructor/gi,"").replace(/(\s*<[^>]*)on\w+/gi,"").replace(/javascript.*?:|script.*?:/gi,"").replace(/&#0*115;?|&#0*99;?|&#0*114;?|&#0*105;?|&#0*112;?|&#0*116;?|&#0*58;?/g,"").replace(/&#x0*73;?|&#x0*63;?|&#x0*72;?|&#x0*69;?|&#x0*70;?|&#x0*74;?|&#x0*3A;?/gi,"").replace(/[<>]|&(?!(?:apos|quot|[gl]t|amp);)/gi,(e=>t[e])).replace(/(\x3c:?|\u003c:?)|(?:&(amp;)?#0*60;?|&(amp;)?#x0*3c;?):?/gi,"")},n.sanitizeAttrs=(e={})=>{const t=["id","class","href","data-ms-action"];for(var r in e)t.includes(r)||delete e[r];return e},n.tokenHTML=e=>{if(e)return(e=n.sanitizeHTML(e)).replace(/\[(\/?(?:p|strong|em|a|div|h[1-6]|span)(?:\s+[^[\]]+)?)]/gi,((e,t)=>{var r=(t=t.toLowerCase()).startsWith("/")?`</${t.slice(1)}`:"<"+t;return r.endsWith("]")?r.slice(0,-1)+">":r+">"})).replace(/(\s*<[^>]*)on\w+/gi,"")},n.stripHTML=function(e){if(e)return e.replace(/<\s*\/?\s*([a-zA-Z0-9]+)\s*>/g,"").replace(/<[^>]*>/g,"")},n.stripHTMLWithLinebreaks=function(e){return e=(e=e.replace(/<br\s*\/?>/gi,"\n")).replace(/<(?:div|p|blockquote|h[1-6]|table|ul|ol)[^>]*>/gi,"\n"),$("<div>").html(e).text().trim()},n.getEnvType=function(){return location.hostname.indexOf("webflow")>-1?"dev":"live"},n.getCurrentDomain=function(){return e.location.origin},n.getCurrentLang=function(){return n.checkKeyExists(e,"Weglot")?Weglot.getCurrentLang():"en"},n.formatCurrency=function(e){return parseFloat(e,10).toFixed(2).toString()},n.getCurrencySymbol=(e,t)=>(0).toLocaleString(e,{style:"currency",currency:t,minimumFractionDigits:0,maximumFractionDigits:0}).replace(/\d/g,"").trim(),n.getSetQuerystring=(t="",r,i=e.location.href)=>{i=i.indexOf("://")<0?e.location.origin+i:i;let a=new URL(i);if("object"==typeof t){for(let[e,r]of Object.entries(t)){let t=n.sanitizeHTML(e),i=n.sanitizeHTML(r);a.searchParams.append(t,i)}return r?a.pathname+a.search:a.search}return n.sanitizeHTML(a.searchParams.get(t.toString()))},n.formatTimestamp=function(e,t,r){if(e){var i=new Date(e),a=n.getCurrentLang(),o={year:"numeric",month:"long",day:"numeric"};return r&&(o.timeZone=n.timezone),t&&$.extend(o,{hour12:!1,hour:"2-digit",minute:"2-digit"}),"string"==typeof e&&(e=i.getTime()),e.toString().length<11&&i.setTime(1e3*e),i.toLocaleDateString(a,o)}},n.getTimestamp=(e,t)=>{let r,i=n.getCurrentLang(),a={};if(t&&(a.timeZone=n.timezone),e){let t=e.lastIndexOf(" "),n=e.substring(0,t),o=e.substring(t+1),s=n.replace(/[-\/\s]/g,"||").split("||");r=new Date,r.setMonth(s[1]-1),a.month="short",s[1]=r.toLocaleString(i,a),e=s.join(" ")+` ${o} GMT`}else e=new Date;return $.extend(a,{day:"numeric",month:"numeric",year:"numeric",hour:"numeric",minute:"numeric",second:"numeric"}),r=new Date(Date.parse(e+" GMT")).toLocaleString(i,a),Date.parse(r)},n.getISOdate=(e,t)=>{var r=n.getTimestamp(e,t);return new Date(r).toISOString()},n.pluralize=(e,t,r)=>`${e} ${1!==e?r||t+"s":t}`,n.timePast=e=>{const t=6e4,r=36e5,i=24*r,a=7*i,o=30*i,s=365*i;var c=n.getTimestamp(!1,!0)-(e=n.getTimestamp(e));return c<t?n.pluralize(Math.round(c/1e3),"second"):c<r?(c=Math.round(c/t),n.pluralize(c,"minute")):c<i?(c=Math.round(c/r),n.pluralize(c,"hour")):c<o?(c=Math.round(c/i),n.pluralize(c,"day")):c<a?(c=Math.round(c/a),n.pluralize(c,"week")):c<s?(c=Math.round(c/o),n.pluralize(c,"month")):(c=Math.round(c/s),n.pluralize(c,"year"))},n.checkKeyExists=function(e,t){return!!e&&(0===(t="string"==typeof t?t.split("."):t).length||n.checkKeyExists(e[t.shift()],t))},n.getProperty=function(e,t){let r=t.split("."),n=e;for(let e=0;e<r.length;e++)if(n=n[r[e]],null==n)return null;return n},n.callNestedFunction=function(t,...r){var i=t.split("."),a=i.pop(),o=n.getProperty(e,i.join("."));if(o&&"function"==typeof o[a])return o[a](...r);console.error("Function not found:",t)},n.waitFor=function(e,t,r,i){var a=setInterval((function(){n.checkKeyExists(e,t)&&(i(),clearInterval(a))}),r)},n.filterArrayByObjectValue=function(e,t,r){return Array.isArray(r)?$.map(e,(function(e,n){return r.includes(e[t])?e:null})):$.map(e,(function(e,n){return e[t]==r?e:null}))},n.sortArrayByObjectValue=function(e,t,r,i="desc"){return e.sort(((e,a)=>(e=n.getProperty(e,t),a=n.getProperty(a,t),r?"desc"===i?(a===r)-(e===r):(e===r)-(a===r):function(e,t,r){return null===e?"desc"===r?1:-1:null===t?"desc"===r?-1:1:"desc"===r?t-e:e-t}(e,a,i))))},n.hasPermissions=function(e,t){var r=0===e.indexOf("!"),n=e.replace("!",""),i=$.inArray(n,t.permissions);return r?i<0:i>-1},n.ajaxMetaValues=function(e,t){var r={};return r.member_id=USER.current.id||null,r.env=n.getEnvType(),r.url=n.getCurrentDomain(),r.language=n.getCurrentLang(),r.submitted=n.getISOdate(),r.submittedTimestamp=n.getTimestamp(),"formData"!=t?r:$.each(r,(function(t,r){e.set(t,r)}))},n.getFormValues=function(e,t){var r=new FormData(e[0]),i={};for(elementName in $(e).find(":input").each((function(){var e=$(this),t=e.attr("name"),n=e.val();if(e.is("select[multiple]"))r.set(t,e.val());else if(e.is(":checkbox:checked")&&t.endsWith("[]")){var a=t.slice(0,-2);i[a]||(i[a]=[]),i[a].push(n),r.delete(t)}})),i)r.set(elementName,i[elementName]);return n.ajaxMetaValues(r,"formData"),console.log("formData",r),"formData"==t?r:"json"==t?JSON.stringify(Object.fromEntries(r)):Object.fromEntries(r)},n.sendAJAX=function(t,r){params=$.extend({method:"POST",timeout:6e4,success:function(e,t){console.log(t,e),"function"==typeof params.callbackSuccess&&params.callbackSuccess(e)},error:function(t,i,a){console.log(i,a),"function"==typeof params.callbackError&&params.callbackError(i,a);var o={mode:"dialog",message:"[p]Sorry, something went wrong, please try again. if the problem continues, contact our team for help.[/p]",type:"error",enableForm:!0,options:{title:"There was a problem...",overlayClose:!1,actions:[{type:"button",text:"OK",attributes:{class:"button-primary trigger-lbox-close",href:"#"}}]}};n.checkKeyExists(e.jQuery,"litbox")?MAIN.handleAjaxResponse(o,r||!1):alert(o.message)}},t),$.ajax(params)},n.parseIfStringJSON=function(e){return"string"==typeof e&&"{"==(e=e.trim())[0]&&"}"==e[e.length-1]?JSON.parse(e):e},n.formatDDMMYYYY=(e,t=" / ")=>{var r=e.replace(/[^\d]/g,""),n="",i=r.slice(0,2),a=r.slice(2,4),o=r.slice(4,8);return i&&(n+=i,2===i.length&&(n+=t)),a&&(n+=a,2===a.length&&(n+=t)),o&&(n+=o),n},n.setCookie=function(e,r,n){var i="";if(n){var a=new Date;a.setTime(a.getTime()+24*n*60*60*1e3),i="; expires="+a.toUTCString()}t.cookie=e+"="+(r||"")+i+"; path=/"},n.getCookie=function(e){for(var r=e+"=",i=t.cookie.split(";"),a=0;a<i.length;a++){var o=i[a].trim();if(0===o.indexOf(r))return n.parseIfStringJSON(o.substring(r.length))}return null},n.deleteCookie=function(e){t.cookie=e+"=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/"},n}(jQuery,this,this.document);