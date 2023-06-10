var MAIN=function($,t,e,a){var i={};return i.planNames={"pln_monthly-subscription-lqn04e7":"Monthly subscription","pln_3-credits-jmv04pd":"3 Credits","pln_6-credits-5cx04l8":"6 Credits","pln_12-credits-72z04tc":"12 Credits"},i.controlHTML=function(t,e){e?t.removeClass("hide"):t.remove()},i.itemState=function(t,e){switch(t){case"edit":if($.inArray(e,["Rejected","Deleted"])>-1)return!1;case"review":if($.inArray(e,["Draft","Rejected","Archived","Deleted"])>-1)return!1}return!0},i.handleAjaxResponse=function(t,a){if(HELP.checkKeyExists(t,"mode")){switch(t.mode){case"alert":case"banner":alert(t.message);break;case"dialog":var n;HELP.checkKeyExists(t,"options.actions")&&(n=$('<div class="actions justify-center" />'),$.each(t.options.actions,(function(t,e){e.attributes.class=e.attributes.class||"","button"==e.type&&(e.attributes.class+=" w-button small"),n.append($("<a>",{text:e.text,attr:e.attributes}))})));var s={bodyClasses:"lbox-dialog",html:[HELP.sanitizeHTML(t.message),n],css:{xxs:{offset:20,maxWidth:650,contentInnerPadding:20}}},o=$.extend(!0,{},s,t.options||{});$.litbox(o),$(e).on("click",".trigger-lbox-close",(function(t){t.preventDefault(),$.litbox.close()}))}HELP.checkKeyExists(t,"callback")&&HELP.callNestedFunction(t.callback,t,a)}HELP.checkKeyExists(t,"enableForm")&&t.enableForm&&i.buttonThinking(a.find(".form-submit"),!0)},i.thinking=(t,e=!1)=>{let a=t?e?"thinking-overlay":"thinking":"thinking-overlay thinking";$("body").toggleClass(a,t)},i.buttonThinking=function(t,e){e?(t.removeAttr("disabled").removeClass("thinking clicked"),"BUTTON"==t.get(0).nodeName?t.text(t.data("dataValue")):t.attr("value",t.data("dataValue"))):(t.attr("disabled",!0).addClass("thinking"),"BUTTON"==t.get(0).nodeName?t.data("dataValue",t.text()).text(t.attr("data-wait")):t.data("dataValue",t.attr("value")).attr("value",t.attr("data-wait")))},i.replaceTextWithMetadata=function(t){$("[data-ms-member-meta]").each((function(){var e=$(this).attr("data-ms-member-meta");HELP.checkKeyExists(t,e)&&$(this).html(t[e])}))},i.bodyPreventScroll=function(t,e){$("body").toggleClass(e||"no-scroll",t)},i.timePast=function(){$(".time-past:not(.parsed)").each((function(){$(this).text(HELP.timePast($(this).text())+" ago").addClass("parsed")}))},$((function(){i.timePast(),USER.getCurrentMember((function(t){if(console.log(t),HELP.checkKeyExists(t,"id")){var e=$(".input-member-id");e&&!e.val()&&(e.val(t.id),e.parents("form").find(".form-submit").removeAttr("disabled"))}$(".node-author").length&&$(".node-author").each((function(){var e=$(this).attr("data-author"),a=!!t&&HELP.checkKeyExists(t,"id")&&(t.id==e||HELP.hasPermissions("can:moderate",t));i.controlHTML($(this).parents(".node").find(".author-access"),a)})),$("[data-ms-perm]").each((function(){i.controlHTML($(this),HELP.hasPermissions($(this).attr("data-ms-perm"),t))}))})),$(".accordion").on("click",".accordion-header",(function(){$(this).parent().toggleClass("active").find(".accordion-content").toggleClass("active")})),$("form").on("submit",(function(){var t=$(this).find(".fp_redirect").attr("data-redirect");t&&localStorage.setItem("fp_redirect",t)})),$(".format-ddmmyyyy").on("keyup",(function(t){t&&"Backspace"!=t.key&&"Delete"!=t.key&&$(this).val(HELP.formatDDMMYYYY($(this).val()))})),$(".ajax-submit").on("click",".form-submit",(function(t){$(t.target).addClass("clicked")})).on("submit",(function(t){t.preventDefault();var e=$(this),a=e.find(".form-submit.clicked"),n=HELP.getFormValues(e),s=HELP.getCookie("form-valid");s=s?Number(s):0,n.increment=++s,HELP.setCookie("form-valid",n.increment),i.buttonThinking(a),console.log(n),HELP.sendAJAX({url:e.attr("action"),method:e.attr("method"),data:n,timeout:12e4,callbackSuccess:function(t){i.handleAjaxResponse(t,e)},callbackError:function(t){console.log("error")}})})),$(":input[data-default-value]").each((function(){$(this).val()||$(this).val($(this).attr("data-default-value"))})),$(":input[data-maxlength]").each((function(){$(this).attr("maxlength",$(this).attr("data-maxlength"))})),$(".alert-confirm").on("click.alertConfirm",(function(t){var e=$(this).attr("data-confirm");if(e){if(t.preventDefault(),!confirm(e))return $(this).removeClass("clicked"),!1;$(this).off("click.alertConfirm").trigger("click")}})),$(".toggle-vis").on("click",(function(t){var e=$(this).attr("data-target");e&&(t.preventDefault(),$("#"+e).toggleClass("hide"))})),$(e).on("click",".link-dashboard",(function(e){e.preventDefault(),HELP.checkKeyExists(USER,"current.loginRedirect")&&(t.location.href=USER.current.loginRedirect)})),$('.form-submit[name="op"]').on("click",(function(){$(this).parents("form").find(".form-action-op").val($(this).val())})),$(".node-job-row").each((function(){var t=$(this),e=t.find(".table-links a"),a=t.find(".col-status").text().toLowerCase();if(a)switch(t.addClass(a),a){case"draft":e.removeClass("hide");break;case"expired":case"archived":e.removeClass("hide").filter('[data-link="publish"]').text("Republish");break;case"pending":case"published":e.filter('[data-link="edit"]').removeClass("hide")}})),$(".link-hook-publish").on("click",(function(t){t.preventDefault();var e=$(this);if(e.hasClass("disabled"))return!1;e.addClass("disabled");var a={member_id:$(this).attr("data-member-id"),item_id:$(this).attr("data-item-id"),submitted:HELP.getISOdate()},i=HELP.getCookie("form-valid");i=i?Number(i):0,a.increment=++i,HELP.setCookie("form-valid",a.increment),HELP.sendAJAX({url:"https://hook.us1.make.com/dv56t4535h1sfag5g0693924h3sg5582",data:a,timeout:12e4,callbackSuccess:function(t){},callbackError:function(t){console.log("error")}})})),$(".select-list-options").createSelectOptions(),HELP.waitFor(t,"Weglot",400,(function(){Weglot.on("languageChanged",(function(){$(".select-list-options").each((function(){var t=$(this).parent(".select-list-wrapper").find("select");$(this).find(".w-dyn-item").each((function(e){console.log(e,$(this).text()),t.find("option").eq(e).text($(this).text()).val($(this).data("lang-en"))})),t.hasClass("select2-hidden-accessible")&&(t.select2("destroy"),t.select2(t.data("select2-options")))}))}))})),$(".select2-field:not(.collection-list)").createSelect2(),$(e).on("lbox_open",(function(){}))})),i}(jQuery,this,this.document);$.fn.createSelectOptions=function(t){t=t||{},$.each(this,(function(t,e){var a=$(this).parent(".select-list-wrapper"),i=a.find("select"),n=a.find(".select-list-default-value").attr("data-value")||"",s=[];$(this).find(".w-dyn-item").each((function(){var t=$(this).text();$.inArray(t,s)>-1||(s.push(t),$(this).data("lang-en",t),$("<option />",{value:t,selected:t==n&&"selected"}).text(t).appendTo($(i)))})),i.hasClass("select2-field")&&i.createSelect2()}))},$.fn.createSelect2=function(t){t=t||{};var e=this;if(!$(e).length)return!1;HELP.waitFor(jQuery,"fn.select2",100,(function(){var a;console.log("select2 found"),$.each(e,(function(e,i){(a=t).placeholder=$(i).attr("placeholder")||"Select...";var n=$(i).find("option[selected]");$(i).attr("multiple")||$(i).prepend('<option value="">'+a.placeholder+"</option>"),$(i).select2(a).data("select2-options",a).val(n.length?$(i).val():"").trigger("change")}))}))},jQuery.expr[":"].icontains=function(t,e,a,i){return(t.textContent||t.innerText||"").toLowerCase().indexOf((a[3]||"").toLowerCase())>=0},jQuery.expr[":"].selectedInput=function(t,e,a){return"checkbox"==t.type||"radio"==t.type?t.checked:""!=t.value};