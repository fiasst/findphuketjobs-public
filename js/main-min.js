var MAIN=function($,t,e,a){var i={};return i.planNames={"pln_credit-package-1-p63bl01ya":"1 Credit","pln_credit-package-2-pg3bd0zgw":"3 Credits","pln_credit-package-3-la3be0z5o":"6 Credits","pln_subscription-package-1-p73bj0zxa":"Standard monthly subscription","pln_subscription-package-2-il3bk0zto":"Pro monthly subscription","pln_subscription-package-3-9x3bl0z6j":"Enterprise monthly subscription"},i.planCompanyLimits={"pln_credit-package-1-p63bl01ya":1,"pln_credit-package-2-pg3bd0zgw":1,"pln_credit-package-3-la3be0z5o":1,"pln_subscription-package-1-p73bj0zxa":2,"pln_subscription-package-2-il3bk0zto":3,"pln_subscription-package-3-9x3bl0z6j":5},i.controlHTML=function(t,e){e?t.each((function(){var t=$(this);t.hasClass("hide")?t.removeClass("hide"):t.show()})):t.remove()},i.itemState=function(t,e){switch(t){case"edit":return $.inArray(e,["Rejected","Deleted"])<0;case"review":return $.inArray(e,["Draft","Rejected","Archived","Deleted"])<0}},i.memberCanModerate=function(t){return HELP.hasPermissions("can:moderate",t)},i.memberCanEdit=function(t,e){var a=e.find(".node-author").attr("data-author");return!!HELP.checkKeyExists(t,"id")&&(t.id==a||i.memberCanModerate(t))},i.handleAjaxResponse=function(t,e){i.dialog(t),HELP.checkKeyExists(t,"callback")&&HELP.callNestedFunction(t.callback,t,e),e&&HELP.checkKeyExists(t,"enableForm")&&t.enableForm&&i.buttonThinking(e.find(".form-submit"),!0)},i.dialog=function(t){if(HELP.checkKeyExists(t,"mode"))switch(t.mode){case"alert":case"banner":alert(t.message);break;case"dialog":i.openDialog(t)}},i.openDialog=a=>{HELP.checkKeyExists(a,"options.actions")&&(actions=$('<div class="actions justify-center" />'),$.each(a.options.actions,(function(t,e){e.attributes.class=e.attributes.class||"","button"==e.type&&(e.attributes.class+=" w-button small"),actions.append($("<a>",{text:e.text,attr:e.attributes}))})));var n={bodyClasses:"lbox-dialog",html:[HELP.sanitizeHTML(a.message),actions],css:{xxs:{offset:20,maxWidth:650,contentInnerPadding:20}}};HELP.waitFor(t.jQuery,"litbox",100,(function(){$.litbox($.extend(!0,{},n,a.options))})),$(e).one("click",".trigger-lbox-close",(function(t){"#"==$(this).attr("href")&&t.preventDefault(),$.litbox.close()})).one("click",".trigger-reload",(function(e){e.preventDefault(),$("body").hasClass("litbox-show")&&$.litbox.close(),i.thinking(!0),t.location=t.location.href.split("#")[0]}))},i.thinking=(t,e=!1)=>{let a=t?e?"thinking-overlay":"thinking":"thinking-overlay thinking";$("body").toggleClass(a,t)},i.buttonThinking=function(t,e){e?(t.removeAttr("disabled").removeClass("thinking clicked"),"BUTTON"==t.get(0).nodeName?t.text(t.data("dataValue")):t.attr("value",t.data("dataValue"))):(t.attr("disabled",!0).addClass("thinking"),"BUTTON"==t.get(0).nodeName?t.data("dataValue",t.text()).text(t.attr("data-wait")):t.data("dataValue",t.attr("value")).attr("value",t.attr("data-wait")))},i.replaceTextWithMetadata=function(t){$("[data-ms-member-meta]").each((function(){var e=$(this).attr("data-ms-member-meta");HELP.checkKeyExists(t,e)&&$(this).html(t[e])}))},i.bodyPreventScroll=function(t,e){$("body").toggleClass(e||"no-scroll",t)},i.timePast=function(t){t.text(HELP.timePast(t.text())+" ago").addClass("parsed")},i.uploadFields=function(){$(".upload-wrapper").each((function(){var t=!!$(this).find(".file-existing .file-upload-text").text();$(".upload-field",this).toggle(!t),$(".file-existing",this).toggle(t)})),$(".file-existing .file-upload-button").on("click",(function(){var t=$(this).parents(".upload-wrapper");t.find(".file-existing").remove(),t.find(".upload-field").fadeIn(500)}))},i.jobItem=function(){$(".card.job").each((function(){var t=$(this);t.find(".js-salary-amount").text()||t.find(".salary").hide(),t.find(".salary").length||t.find(".js-salary-hidden").show()}))},i.collectionItem=function(){$(".w-dyn-item").each((function(){var t=$(this);i.timePast(t.find(".time-past:not(.parsed)"))}))},i.openLitbox=e=>{var a={title:!1,inline:!0,returnFocus:!1,trapFocus:!1,overlayClose:!1,escKey:!1,css:{xxs:{offset:20,maxWidth:900,width:"100%",opacity:.4},sm:{offset:"5% 20px"}}};HELP.waitFor(t.jQuery,"litbox",100,(function(){$.litbox($.extend(!0,{},a,e))}))},$((function(){i.jobItem(),i.collectionItem(),i.uploadFields(),t.fsAttributes=t.fsAttributes||[],t.fsAttributes.push(["cmsfilter",t=>{const[e]=t;e.listInstance.on("renderitems",(t=>{i.jobItem(),i.collectionItem()}))}]),USER.getCurrentMember((function(e){if(console.log(e),HELP.checkKeyExists(e,"metaData")&&i.replaceTextWithMetadata(e.metaData),HELP.checkKeyExists(e,"id")){var a=$(".input-member-id");a&&!a.val()&&(a.val(e.id),a.parents("form").find(".form-submit").removeAttr("disabled"))}$(".node-author").length&&$(".node-author").each((function(){var t=$(this).parents(".node"),a=$(".node-status",t).attr("data-status");i.controlHTML($(".author-access",t),i.memberCanEdit(e,t)),i.controlHTML($(".edit-access",t),i.itemState("edit",a)&&i.memberCanEdit(e,t)),i.controlHTML($(".review-access",t),i.itemState("review",a)&&i.memberCanModerate(e)&&!!$("#form-review-job").length)})),$("[data-ms-perm]").each((function(){i.controlHTML($(this),HELP.hasPermissions($(this).attr("data-ms-perm"),e))}));t.location.hash.length>1&&$(t.location.hash).length&&$(`.trigger-lbox[href="${t.location.hash}"]:eq(0)`).trigger("click")})),$(".trigger-lbox").on("click",(function(t){t.preventDefault(),i.openLitbox({title:$(this).attr("data-title"),href:$(this).attr("href")})})),$(".accordion").on("click",".accordion-header",(function(){$(this).parent().toggleClass("active").find(".accordion-content").toggleClass("active")})),$("form").on("submit",(function(){var t=HELP.getSetQuerystring("destination");t&&localStorage.setItem("fp_redirect","/"+t)})),$(".job-block-visibility").each((function(){$(this).toggle(!!$(this).find(".w-dyn-item").length)})),$(".link-add-querystring").each((function(){var t=$(this);t.attr("href",HELP.getSetQuerystring({[t.attr("data-query-name")]:t.attr("data-query-value")},!0))})),$(".format-ddmmyyyy").on("keyup",(function(t){t&&"Backspace"!=t.key&&"Delete"!=t.key&&$(this).val(HELP.formatDDMMYYYY($(this).val()))})),$(".ajax-submit").on("click",".form-submit",(function(t){$(t.target).addClass("clicked")})).on("submit",(function(t){t.preventDefault();var e=$(this),a=e.find(".form-submit.clicked"),n=e.attr("data-validation");if(n&&!HELP.callNestedFunction(n))return console.log("Validation failed"),i.buttonThinking(a,!0),!1;var o=HELP.getFormValues(e),s=HELP.getCookie("form-valid");s=s?Number(s):0,o.increment=++s,HELP.setCookie("form-valid",o.increment),i.buttonThinking(a),i.thinking(!0,!1),console.log(o),HELP.sendAJAX({url:e.attr("action"),method:e.attr("method"),data:o,timeout:12e4,callbackSuccess:function(t){i.thinking(!1),i.handleAjaxResponse(t,e)},callbackError:function(t){i.thinking(!1),console.log("error")}},e)})),$(":input[data-default-value]").each((function(){var t=$(this),e=t.attr("data-default-value");t.val()||("number"==t.attr("type")&&(e=HELP.removeNonNumeric(e)),t.val(e))})),$(".input-default-value").each((function(){var t=$(this),e=t.parent().find(":input"),a=e.siblings(".w-checkbox-input"),i=!!t.text()&&"false"!==t.text();"checkbox"==e.attr("type")?(a&&a.hasClass("w--redirected-checked")!==i&&a.trigger("click"),e.prop("checked",i)):e.val()||e.val(HELP.stripHTMLWithLinebreaks(t.html()))})),$(":input[data-maxlength]").each((function(){$(this).attr("maxlength",$(this).attr("data-maxlength"))})),$(".alert-confirm").on("click.alertConfirm",(function(t){var e=$(this).attr("data-confirm");if(e){if(t.preventDefault(),!confirm(e))return $(this).removeClass("clicked"),!1;$(this).off("click.alertConfirm").trigger("click")}})),$(e).on("click",".toggle-vis",(function(t){var e=$(this).attr("href");e&&(t.preventDefault(),$(e).toggleClass("hide"))})),$(e).on("click",".link-dashboard",(function(e){e.preventDefault(),HELP.checkKeyExists(USER,"current.loginRedirect")&&(t.location.href=USER.current.loginRedirect)})),$('.form-submit[name="op"]').on("click",(function(){$(this).parents("form").find(".form-action-op").val($(this).val())})),$(".node-job-row").each((function(){var t=$(this),e=t.find(".table-links a"),a=t.find(".col-status").text().toLowerCase();if(a)switch(t.addClass(a),a){case"draft":e.removeClass("hide");break;case"expired":case"archived":e.removeClass("hide").filter('[data-link="publish"]').text("Republish");break;case"pending":case"published":e.filter('[data-link="edit"]').removeClass("hide")}})),$(".select-list-options").createSelectOptions(),HELP.waitFor(t,"Weglot",400,(function(){Weglot.on("languageChanged",(function(){$(".select-list-options").each((function(){var t=$(this).parent(".select-list-wrapper").find("select");$(this).find(".w-dyn-item").each((function(e){console.log(e,$(this).text()),t.find("option").eq(e).text($(this).text()).val($(this).data("lang-en"))})),t.hasClass("select2-hidden-accessible")&&(t.select2("destroy"),t.select2(t.data("select2-options")))}))}))})),$(".select2-field:not(.collection-list)").createSelect2(),$(e).on("lbox_open",(function(){}))})),i}(jQuery,this,this.document);$.fn.createSelectOptions=function(t){t=t||{},$.each(this,(function(t,e){var a=$(this).parent(".select-list-wrapper"),i=a.find("select"),n=a.find(".input-default-value").attr("data-value")||"",o=[];$(this).find(".w-dyn-item").each((function(){var t=$(this).text();!t||$.inArray(t,o)>-1||(o.push(t),$(this).data("lang-en",t),$("<option />",{value:t,selected:t==n&&"selected"}).text(t).appendTo($(i)))})),i.hasClass("select2-field")&&i.createSelect2()}))},$.fn.createSelect2=function(t){t=t||{};var e=this;if(!$(e).length)return!1;HELP.waitFor(jQuery,"fn.select2",100,(function(){var a;console.log("select2 found"),$.each(e,(function(e,i){(a=t).placeholder=$(i).attr("placeholder")||"Select...";var n=$(i).find("option[selected]");$(i).attr("multiple")||$(i).prepend('<option value="">'+a.placeholder+"</option>"),$(i).select2(a).data("select2-options",a).val(n.length?$(i).val():"").trigger("change")}))}))},jQuery.expr[":"].icontains=function(t,e,a,i){return(t.textContent||t.innerText||"").toLowerCase().indexOf((a[3]||"").toLowerCase())>=0},jQuery.expr[":"].selectedInput=function(t,e,a){return"checkbox"==t.type||"radio"==t.type?t.checked:""!=t.value};