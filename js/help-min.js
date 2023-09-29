var USER={},MAIN={},ADD_JOB={},HELP=function($,e,t,r){var n={};return n.timezone="Asia/Bangkok",n.cleanLowerString=(e="")=>$.trim(e.toLowerCase()),n.zeroTrim=(e="")=>e.replace(/&zwj;/gi,"").replace("<p><br></p>","").trim(),n.removeNonNumeric=(e="")=>e.toString().replace(/\D/g,""),n.allowCommonKeyPress=(e,t)=>!!("Backspace"==t||"Delete"==t||t&&0===t.indexOf("Arrow"))||(e.metaKey||e.ctrlKey)&&("c"==t||"v"==t||"a"==t||"x"==t),n.addHttpProtocol=(e="",t="http://")=>/^https?:\/\//i.test(e)?e:t+e.replace(/^.*?\/\/|^.+?\//,""),n.sanitizeHTML=(e,t)=>{if(!e)return;const r={"&":"&amp;","<":"&lt;",">":"&gt;"};if(t){var n=new RegExp(`<((?!/?(${t})\\b)[^>]+)>`,"gi");e=e.replace(n,"").replace(/src/gi,"")}else e=e.replace(/[<>]|&(?!(?:apos|quot|[gl]t|amp);)/gi,(e=>r[e])).replace(/(\x3c:?|\u003c:?)|(?:&(amp;)?#0*60;?|&(amp;)?#x0*3c;?):?/gi,"");return e=e.toString().replace(/<.*?script.*?>|.constructor|document.cookie|document.domain/gi,"").replace(/<[^>]*\s+[^>]*on\w+[^>]*>/gi,"").replace(/javascript.*?:|script.*?:|&{/gi,"").replace(/&#0*115;?|&#0*99;?|&#0*114;?|&#0*105;?|&#0*112;?|&#0*116;?|&#0*58;?/g,"").replace(/&#x0*73;?|&#x0*63;?|&#x0*72;?|&#x0*69;?|&#x0*70;?|&#x0*74;?|&#x0*3A;?/gi,"")},n.sanitizeAttrs=(e={})=>{const t=["id","class","href","data-ms-action"];for(var r in e)t.includes(r)||delete e[r];return e},n.tokenHTML=e=>{if(e)return(e=n.sanitizeHTML(e)).replace(/\[(\/?(?:p|strong|em|a|div|h[1-6]|span)(?:\s+[^[\]]+)?)]/gi,((e,t)=>{var r=(t=t.toLowerCase()).startsWith("/")?`</${t.slice(1)}`:"<"+t;return r.endsWith("]")?r.slice(0,-1)+">":r+">"})).replace(/on\w{2,}=/gi,"")},n.stripHTML=function(e){if(e)return e.replace(/<\s*\/?\s*([a-zA-Z0-9]+)\s*>/g,"").replace(/<[^>]*>/g,"")},n.stripHTMLWithLinebreaks=function(e){return e=(e=e.replace(/<br\s*\/?>/gi,"\n")).replace(/<(?:div|p|blockquote|h[1-6]|table|ul|ol)[^>]*>/gi,"\n"),$("<div>").html(e).text().trim()},n.getEnvType=function(){return location.hostname.indexOf("webflow")>-1?"test":"live"},n.getCurrentDomain=function(){return e.location.origin},n.getCurrentLang=function(){return n.checkKeyExists(e,"Weglot")?Weglot.getCurrentLang():"en"},n.formatCurrency=function(e){return parseFloat(e,10).toFixed(2).toString()},n.getCurrencySymbol=(e,t)=>(0).toLocaleString(e,{style:"currency",currency:t,minimumFractionDigits:0,maximumFractionDigits:0}).replace(/\d/g,"").trim(),n.getSetQuerystring=(t="",r="relative",i=e.location.href)=>{i=i.indexOf("://")<0?e.location.origin+i:i;let a=new URL(i);if("object"==typeof t){for(let[e,r]of Object.entries(t)){let t=n.sanitizeHTML(e),i=n.sanitizeHTML(r);a.searchParams.append(t,i)}switch(r){case"absolute":return a.origin+a.pathname+a.search;case"relative":return a.pathname+a.search;case"query":return a.search}}return n.sanitizeHTML(a.searchParams.get(t.toString()))},n.formatTimestamp=function(e,t,r){if(e){var i=new Date(e),a=n.getCurrentLang(),o={year:"numeric",month:"long",day:"numeric"};return r&&(o.timeZone=n.timezone),t&&$.extend(o,{hour12:!1,hour:"2-digit",minute:"2-digit"}),"string"==typeof e&&(e=i.getTime()),e.toString().length<11&&i.setTime(1e3*e),i.toLocaleDateString(a,o)}},n.getTimestamp=(e,t,r)=>{let i=new Date,a=n.getCurrentLang(),o={};if(t&&(o.timeZone=n.timezone),e){let t=e.lastIndexOf(" "),n=e.substring(0,t),s=e.substring(t+1),c=n.replace(/[-\/\s]/g,"||").split("||"),l=r?0:1;i.setMonth(c[l]-1),o.month="short",c[l]=i.toLocaleString(a,o),e=c.join(" ")+` ${s} GMT`}else e=new Date;$.extend(o,{day:"numeric",month:"numeric",year:"numeric",hour:"numeric",minute:"numeric",second:"numeric"});let s=t?0:60*i.getTimezoneOffset()*1e3;return i=new Date(Date.parse(e)+s).toLocaleString(a,o),Date.parse(i)},n.getISOdate=(e,t)=>{var r=n.getTimestamp(e,t);return new Date(r).toISOString()},n.pluralize=(e,t,r)=>`${e} ${1!==e?r||t+"s":t}`,n.timePast=(e,t="ago")=>{const r=6e4,i=36e5,a=24*i,o=7*a,s=30*a,c=365*a;var l,u=n.getTimestamp(!1,!0)-(e=n.getTimestamp(e,!1,!0));if((l=u<r?{elapsed:0,string:"minutes"}:u<i?{elapsed:Math.round(u/r),string:"minute"}:u<a?{elapsed:Math.round(u/i),string:"hour"}:u<s?{elapsed:Math.round(u/a),string:"day"}:u<o?{elapsed:Math.round(u/o),string:"week"}:u<c?{elapsed:Math.round(u/s),string:"month"}:{elapsed:Math.round(u/c),string:"year"}).elapsed){return`${n.pluralize(l.elapsed,l.string)} ${t}`}return""},n.checkKeyExists=function(e,t){return!!e&&(0===(t="string"==typeof t?t.split("."):t).length||n.checkKeyExists(e[t.shift()],t))},n.getProperty=function(e,t){let r=t.split("."),n=e;for(let e=0;e<r.length;e++)if(n=n[r[e]],null==n)return null;return n},n.callNestedFunction=function(t,...r){var i=t.split("."),a=i.pop(),o=n.getProperty(e,i.join("."));if(o&&"function"==typeof o[a])return o[a](...r);console.error("Function not found:",t)},n.waitFor=function(e,t,r,i){var a=setInterval((function(){n.checkKeyExists(e,t)&&(i(),clearInterval(a))}),r)},n.filterArrayByObjectValue=function(e,t,r){return Array.isArray(r)?$.map(e,(function(e,n){return r.includes(e[t])?e:null})):$.map(e,(function(e,n){return e[t]==r?e:null}))},n.sortArrayByObjectValue=function(e,t,r,i="desc"){return e.sort(((e,a)=>(e=n.getProperty(e,t),a=n.getProperty(a,t),r?"desc"===i?(a===r)-(e===r):(e===r)-(a===r):function(e,t,r){return null===e?"desc"===r?1:-1:null===t?"desc"===r?-1:1:"desc"===r?t-e:e-t}(e,a,i))))},n.hasPermissions=function(e,t){var r=0===e.indexOf("!"),n=e.replace("!",""),i=$.inArray(n,t.permissions);return r?i<0:i>-1},n.ajaxMetaValues=function(e,t){var r={};return r.member_id=USER.current.id||null,r.env=n.getEnvType(),r.url=n.getCurrentDomain(),r.language=n.getCurrentLang(),"formData"!=t?r:$.each(r,(function(t,r){e.set(t,r)}))},n.getFormValues=function(e,t){var r=new FormData(e[0]),i={};for(elementName in $(e).find(":input").each((function(){var e=$(this),t=e.attr("name"),n=e.val();if(e.is("select[multiple]"))r.set(t,n);else if(e.is(":checkbox:checked")&&t.endsWith("[]")){var a=t.slice(0,-2);i[a]||(i[a]=[]),i[a].push(n),r.delete(t)}})),i)r.set(elementName,i[elementName]);return n.ajaxMetaValues(r,"formData"),console.log(Object.fromEntries(r)),"formData"==t?r:"json"==t?JSON.stringify(Object.fromEntries(r)):Object.fromEntries(r)},n.sendAJAX=function(t,r){params=$.extend({method:"POST",timeout:6e4,success:function(e,t){console.log(t,e),"function"==typeof params.callbackSuccess&&params.callbackSuccess(e)},error:function(t,i,a){console.log(i,a),"function"==typeof params.callbackError&&params.callbackError(i,a);var o={mode:"dialog",message:"[p]Sorry, something went wrong, please try again. if the problem continues, contact our team for help.[/p]",type:"error",enableForm:!0,options:{title:"There was a problem...",overlayClose:!1,actions:[{type:"button",text:"OK",attributes:{class:"button-primary trigger-lbox-close",href:"#"}}]}};n.checkKeyExists(e.jQuery,"litbox")?MAIN.handleAjaxResponse(o,r||!1):alert(o.message)}},t),$.ajax(params)},n.parseIfStringJSON=function(e){return"string"==typeof e&&"{"==(e=e.trim())[0]&&"}"==e[e.length-1]?JSON.parse(e):e},n.formatDDMMYYYY=(e,t=" / ")=>{var r=e.replace(/[^\d]/g,""),n="",i=r.slice(0,2),a=r.slice(2,4),o=r.slice(4,8);return i&&(n+=i,2===i.length&&(n+=t)),a&&(n+=a,2===a.length&&(n+=t)),o&&(n+=o),n},n.setCookie=function(e,r,n){var i="";if(n){var a=new Date;a.setTime(a.getTime()+24*n*60*60*1e3),i="; expires="+a.toUTCString()}t.cookie=e+"="+(r||"")+i+"; path=/"},n.getCookie=function(e){for(var r=e+"=",i=t.cookie.split(";"),a=0;a<i.length;a++){var o=i[a].trim();if(0===o.indexOf(r))return n.parseIfStringJSON(o.substring(r.length))}return null},n.deleteCookie=function(e){t.cookie=e+"=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/"},n.setLocalStorage=function(e,t){"string"!=typeof t&&(t=JSON.stringify(t)),localStorage.setItem(e,t)},n.getLocalStorage=function(e){return n.parseIfStringJSON(localStorage.getItem(e))},n.deleteLocalStorage=function(e){localStorage.removeItem(e)},n}(jQuery,this,this.document);