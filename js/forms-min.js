var FORMS=function($,t,e,i){var n={uploadFields:function(){$(".upload-wrapper").each((function(){var t=!!$(this).find(".file-existing .file-upload-text").text();$(".upload-field",this).toggle(!t),$(".file-existing",this).toggle(t)})),$(".file-existing .file-upload-button").on("click",(function(){var t=$(this).parents(".upload-wrapper");t.find(".file-existing").remove(),t.find(".upload-field").fadeIn(500)}))}};return $((function(){n.uploadFields(),USER.getCurrentMember((function(t){if(HELP.checkKeyExists(t,"id")){var e=$(".input-member-id");e&&!e.val()&&(e.val(t.id),e.parents("form").find(".form-submit").removeAttr("disabled"))}}));const i=HELP.getSetQuerystring("dest");i&&$("form").find(".fp_redirect").attr("data-redirect","/"+i),$("form").on("submit",(function(){var t=$(this).find(".fp_redirect").attr("data-redirect");t&&localStorage.setItem("fp_redirect",t)})),$(".ajax-submit").on("click",".form-submit",(function(t){$(t.target).addClass("clicked")})).on("submit",(function(t){t.preventDefault();var e=$(this),i=e.find(".form-submit.clicked"),n=e.attr("data-validation");if(n&&!HELP.callNestedFunction(n))return console.log("Validation failed"),MAIN.buttonThinking(i,!0),!1;var a=HELP.getFormValues(e),l=HELP.getCookie("form-valid");l=l?Number(l):0,a.increment=++l,HELP.setCookie("form-valid",a.increment),MAIN.buttonThinking(i),MAIN.thinking(!0,!1),console.log(a),HELP.sendAJAX({url:e.attr("action"),method:e.attr("method"),data:a,timeout:12e4,callbackSuccess:function(t){MAIN.thinking(!1),MAIN.handleAjaxResponse(t,e)},callbackError:function(t){MAIN.thinking(!1),console.log("error")}},e)})),$(":input[data-default-value]").each((function(){var t=$(this),e=t.attr("data-default-value");t.val()||("number"==t.attr("type")&&(e=HELP.removeNonNumeric(e)),t.val(e))})),$(".input-default-value").each((function(){var t=$(this),e=t.parent().find(":input"),i=e.siblings(".w-checkbox-input"),n=!!t.text()&&"false"!==t.text();"checkbox"==e.attr("type")?(i&&i.hasClass("w--redirected-checked")!==n&&i.trigger("click"),e.prop("checked",n)):e.val()||e.val(HELP.stripHTMLWithLinebreaks(t.html()))})),$(":input[data-maxlength]").each((function(){$(this).attr("maxlength",$(this).attr("data-maxlength"))})),$('.form-submit[name="op"]').on("click",(function(){$(this).parents("form").find(".form-action-op").val($(this).val())})),$(".select-list-options").createSelectOptions(),HELP.waitFor(t,"Weglot",400,(function(){Weglot.on("languageChanged",(function(){$(".select-list-options").each((function(){var t=$(this).parent(".select-list-wrapper").find("select");$(this).find(".w-dyn-item").each((function(e){console.log(e,$(this).text()),t.find("option").eq(e).text($(this).text()).val($(this).data("lang-en"))})),t.hasClass("select2-hidden-accessible")&&(t.select2("destroy"),t.select2(t.data("select2-options")))}))}))})),$(".select2-field:not(.collection-list)").createSelect2(),$(e).on("lbox_open",(function(){}))})),n}(jQuery,this,this.document);$.fn.createSelectOptions=function(t){t=t||{},$.each(this,(function(t,e){var i=$(this).parent(".select-list-wrapper"),n=i.find("select"),a=i.find(".input-default-value").attr("data-value")||"",l=[];$(this).find(".w-dyn-item").each((function(){var t=$(this).text();!t||$.inArray(t,l)>-1||(l.push(t),$(this).data("lang-en",t),$("<option />",{value:t,selected:t==a&&"selected"}).text(t).appendTo($(n)))})),n.hasClass("select2-field")&&n.createSelect2()}))},$.fn.createSelect2=function(t){t=t||{};var e=this;if(!$(e).length)return!1;HELP.waitFor(jQuery,"fn.select2",100,(function(){var i;console.log("select2 found"),$.each(e,(function(e,n){(i=t).placeholder=$(n).attr("placeholder")||"Select...";var a=$(n).find("option[selected]");$(n).attr("multiple")||$(n).prepend('<option value="">'+i.placeholder+"</option>"),$(n).select2(i).data("select2-options",i).val(a.length?$(n).val():"").trigger("change")}))}))},jQuery.expr[":"].selectedInput=function(t,e,i){return"checkbox"==t.type||"radio"==t.type?t.checked:""!=t.value};