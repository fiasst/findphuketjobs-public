var MAIN=function($,t,e,a){var i={};return i.planNames={"pln_credit-package-1-p63bl01ya":"1 Credit","pln_credit-package-2-pg3bd0zgw":"3 Credits","pln_credit-package-3-la3be0z5o":"6 Credits","pln_subscription-package-1-p73bj0zxa":"Standard monthly subscription","pln_subscription-package-2-il3bk0zto":"Pro monthly subscription","pln_subscription-package-3-9x3bl0z6j":"Enterprise monthly subscription"},i.controlHTML=function(t,e){e?t.each((function(){var t=$(this);t.hasClass("hide")?t.removeClass("hide"):t.show()})):t.remove()},i.itemState=function(t,e){switch(t){case"edit":return $.inArray(e,["Rejected","Deleted"])<0;case"review":return $.inArray(e,["Draft","Rejected","Archived","Deleted"])<0}},i.memberCanModerate=function(t){return HELP.hasPermissions("can:moderate",t)},i.memberCanEdit=function(t,e){var a=HELP.sanitizeHTML(e.find(".node-author").attr("data-author"));return!!HELP.checkKeyExists(t,"id")&&(t.id==a||i.memberCanModerate(t))},i.handleAjaxResponse=function(t,e){i.dialog(t),HELP.checkKeyExists(t,"callback")&&HELP.callNestedFunction(t.callback,t,e),e&&HELP.checkKeyExists(t,"enableForm")&&t.enableForm&&i.buttonThinking(e.find(".form-submit"),!0)},i.dialog=function(t){if(HELP.checkKeyExists(t,"mode"))switch(t.mode){case"alert":case"banner":break;default:i.openDialog(t)}},i.openDialog=a=>{var n;HELP.checkKeyExists(a,"options.actions")&&(n=$('<div class="actions justify-center" />'),$.each(a.options.actions,(function(t,e){e.attributes.class=e.attributes.class||"","button"==e.type&&(e.attributes.class+=" w-button small"),n.append($("<a>",{text:e.text,attr:HELP.sanitizeAttrs(e.attributes)}))})));var s={bodyClasses:"lbox-dialog",html:[HELP.tokenHTML(a.message),n],css:{xxs:{offset:20,maxWidth:650,contentInnerPadding:20}}};HELP.waitFor(t.jQuery,"litbox",100,(function(){$.litbox($.extend(!0,{},s,a.options))})),$(e).one("click",".trigger-lbox-close",(function(t){"#"==$(this).attr("href")&&t.preventDefault(),$.litbox.close()})).one("click",".trigger-reload",(function(e){e.preventDefault(),$("body").hasClass("litbox-show")&&$.litbox.close(),i.thinking(!0),t.location=t.location.href.split("#")[0]}))},i.thinking=(t,e=!1)=>{let a=t?e?"thinking-overlay":"thinking":"thinking-overlay thinking";$("body").toggleClass(a,t)},i.buttonThinking=function(t,e){if(t.length<1)return!1;e?(t.removeAttr("disabled").removeClass("thinking clicked"),"BUTTON"==t.get(0).nodeName?t.text(t.data("dataValue")):t.attr("value",t.data("dataValue"))):(t.attr("disabled",!0).addClass("thinking"),"BUTTON"==t.get(0).nodeName?t.data("dataValue",t.text()).text(t.attr("data-wait")):t.data("dataValue",t.attr("value")).attr("value",t.attr("data-wait")))},i.replaceTextWithMetadata=function(t){$("[data-ms-member-meta]").each((function(){var e=$(this).attr("data-ms-member-meta");HELP.checkKeyExists(t,e)&&$(this).html(HELP.sanitizeHTML(t[e]))}))},i.bodyPreventScroll=function(t,e){$("body").toggleClass(e||"no-scroll",t)},i.timePast=function(t){t.text(HELP.timePast(t.text())+" ago").addClass("parsed")},i.jobItem=function(){$(".card.job").each((function(){var t=$(this);t.find(".js-salary-amount").text()||t.find(".salary").hide(),t.find(".salary").length||t.find(".js-salary-hidden").show()}))},i.collectionItem=function(){$(".w-dyn-item").each((function(){var t=$(this);i.timePast(t.find(".time-past:not(.parsed)"))}))},i.openLitbox=e=>{var a={title:!1,inline:!0,returnFocus:!1,trapFocus:!1,overlayClose:!1,escKey:!1,css:{xxs:{offset:20,maxWidth:900,width:"100%",opacity:.4},sm:{offset:"5% 20px"}}};HELP.waitFor(t.jQuery,"litbox",100,(function(){$.litbox($.extend(!0,{},a,e))}))},$((function(){i.jobItem(),i.collectionItem(),t.fsAttributes=t.fsAttributes||[],t.fsAttributes.push(["cmsfilter",t=>{const[e]=t;e.listInstance.on("renderitems",(t=>{i.jobItem(),i.collectionItem()}))}]),USER.getCurrentMember((function(e){console.log(e),HELP.checkKeyExists(e,"metaData")&&i.replaceTextWithMetadata(e.metaData),$(".node-author").length&&$(".node-author").each((function(){var t=$(this).parents(".node"),a=$(".node-status",t).attr("data-status");i.controlHTML($(".author-access",t),i.memberCanEdit(e,t)),i.controlHTML($(".edit-access",t),i.itemState("edit",a)&&i.memberCanEdit(e,t)),i.controlHTML($(".review-access",t),i.itemState("review",a)&&i.memberCanModerate(e)&&!!$("#form-review-job").length)})),$("[data-ms-perm]").each((function(){i.controlHTML($(this),HELP.hasPermissions($(this).attr("data-ms-perm"),e))}));var a;(a=t.location.hash).length>1&&$(a).length&&($(`.trigger-lbox[href="${a}"]:eq(0)`).trigger("click"),$(`.w-tab-menu .w-tab-link[href="${a}"]`).trigger("click"))})),$("a").filter("[data-query-value]").each((function(){var t=$(this),e=$.trim(t.attr("data-query-name")),a=$.trim(t.attr("data-query-value"));t.attr("href",HELP.getSetQuerystring({[e]:a},!0,t.attr("href")))})),$("a").filter("[data-hash]").each((function(){var t=$(this);t.attr("href",HELP.sanitizeHTML(t.attr("href")+"#"+t.attr("data-hash")))})),$(".trigger-lbox").on("click",(function(t){t.preventDefault(),i.openLitbox({title:$(this).attr("data-title"),href:$(this).attr("href")})})),$(".accordion").on("click",".accordion-header",(function(){$(this).parent().toggleClass("active").find(".accordion-content").toggleClass("active")})),$(".job-block-visibility").each((function(){$(this).toggle(!!$(this).find(".w-dyn-item").length)})),$(".format-ddmmyyyy").on("keyup",(function(t){t&&"Backspace"!=t.key&&"Delete"!=t.key&&$(this).val(HELP.formatDDMMYYYY($(this).val()))})),$(".alert-confirm").on("click.alertConfirm",(function(t){var e=HELP.sanitizeHTML($(this).attr("data-confirm"));if(e){if(t.preventDefault(),!confirm(e))return $(this).removeClass("clicked"),!1;$(this).off("click.alertConfirm").trigger("click")}})),$(e).on("click",".toggle-vis",(function(t){var e=HELP.sanitizeHTML($(this).attr("href"));e.length&&(t.preventDefault(),$(this).toggleClass("active"),$(e).toggleClass($(this).attr("data-toggle-class")||"hide"))})),setTimeout((function(){var t=$(".sidebar.pullout.start-open.active");t.length&&(t.removeClass("active"),$("#toggle-sidebar").removeClass("active"))}),300),$(e).on("click",".link-dashboard",(function(e){e.preventDefault(),HELP.checkKeyExists(USER,"current.loginRedirect")&&(t.location.href=USER.current.loginRedirect)})),$(".node-job-row").each((function(){var t=$(this),e=t.find(".table-links a"),a=t.find(".col-status").text().toLowerCase();if(a)switch(t.addClass(a),a){case"draft":e.removeClass("hide");break;case"expired":case"archived":e.removeClass("hide").filter('[data-link="publish"]').text("Republish");break;case"pending":case"published":e.filter('[data-link="edit"]').removeClass("hide")}})),$(e).on("click",".js-next-step",(function(t){t.preventDefault(),$(this).parents(".js-steps").find('[class*="js-step-"]').addClass("hide").filter(".js-step-"+$(this).attr("data-step")).removeClass("hide")})),$.fn.resetSteps=function(){$(this).find('[class*="js-step-"]').addClass("hide").filter(".js-step-1").removeClass("hide")}})),i}(jQuery,this,this.document);jQuery.expr[":"].icontains=function(t,e,a,i){return(t.textContent||t.innerText||"").toLowerCase().indexOf((a[3]||"").toLowerCase())>=0};