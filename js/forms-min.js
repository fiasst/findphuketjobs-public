var FORMS=function($,t,e,a){var n={getKey:t=>"key"in t?t.key:t.keyCode,uploadFields:function(){$(".upload-wrapper").each((function(){var t=!!$(this).find(".file-existing .file-upload-text").text();$(".upload-field",this).toggle(!t),$(".file-existing",this).toggle(t)})),$(".file-existing .file-upload-button").on("click",(function(){var t=$(this).parents(".upload-wrapper");t.find(".file-existing").remove(),t.find(".upload-field").fadeIn(500)}))},toggleCustomInputField:function(t,e,a){t&&t.hasClass("w--redirected-checked")!==a&&t.trigger("click"),e.prop("checked",a)},initEditor:function(){let t="textarea.editor";$(t).length<1||tinymce.init({selector:t,toolbar:"undo redo | bold | bullist numlist",plugins:"lists",min_height:200,max_height:400,menubar:!1,branding:!1,statusbar:!1,custom_undo_redo_levels:8,setup:function(t){t.on("keydown keyup change",(function(t){let e=this,a=e.getContent({format:"text"}).length,i=$(e.getContainer()),o=Number($(e).data("data-maxlength"));switch(t.type){case"keydown":if(a>=o){let e=n.getKey(t);HELP.allowCommonKeyPress(t,e)||t.preventDefault()}case"change":o&&a>o&&$(e.targetElm).val("");case"keyup":case"change":n.updateCharCount(i,a,o)}})).on("change",(function(e){let a=t.getContent();$textarea=$(t.targetElm),a.replace(/\t/g,"").replace(/( *&nbsp; *)+/g," ").replace(/ {2,}/g," "),$textarea.val(a),$textarea.trigger("blur")}))},init_instance_callback:function(t){let e=$(t.targetElm),a=t.getContent({format:"text"}).length,i=Number(e.attr("data-valid-maxlength")),o=$(t.getContainer());e.addClass("editor-processed"),$(t).data("data-maxlength",i),i&&n.setupCharCount(o,a,i)}})},setupCharCount:(t,e,a)=>{t.after(`<div class="char-count"><span>${Number(e)}</span> / ${Number(a)}</div>`).parent().addClass("char-count-wrapper")},updateCharCount:(t,e,a)=>{t.parent().find(".char-count span").toggleClass("color-danger",e>=.8*Number(a)).text(e)}};return $((function(){USER.getCurrentMember((function(t){if(HELP.checkKeyExists(t,"id")){var e=$(".input-member-id");e&&!e.val()&&(e.val(t.id),e.parents("form").find(".form-submit").removeAttr("disabled"))}}));const a=HELP.getSetQuerystring("dest");a&&$("form").find(".fp_redirect").attr("data-redirect","/"+a),$("form").on("submit",(function(){var t=$(this).find(".fp_redirect").attr("data-redirect");t&&localStorage.setItem("fp_redirect",t)})),$(".ajax-submit").on("click",".form-submit",(function(t){$(t.target).addClass("clicked")})).on("submit",(function(t){t.preventDefault();var e=$(this),a=e.find(".form-submit.clicked"),n=e.attr("data-validation"),i=e.attr("data-form-values-type");if(n&&!HELP.callNestedFunction(n))return console.log("Validation failed"),MAIN.buttonThinking(a,!0),!1;var o=HELP.getFormValues(e,i),r=HELP.getCookie("form-valid");r=r?Number(r):0,r=++r,"formData"==i?o.set("increment",r):o.increment=r,HELP.setCookie("form-valid",r);var l={url:e.attr("action"),method:e.attr("method"),data:o,timeout:12e4,callbackSuccess:function(t){MAIN.thinking(!1),MAIN.handleAjaxResponse(t,e)},callbackError:function(t){MAIN.thinking(!1),console.log("error")}};"formData"==i&&(l.processData=!1,l.contentType=!1,l.cache=!1),MAIN.buttonThinking(a),MAIN.thinking(!0,!1),console.log("data: ",l.data),HELP.sendAJAX(l,e)})),$(":input[data-default-value]").each((function(){var t=$(this),e=t.attr("data-default-value");t.val()||("number"==t.attr("type")&&(e=HELP.removeNonNumeric(e)),t.val(HELP.sanitizeHTML(e)))})),$(".input-default-value").each((function(){var t=$(this),e=t.text(),a=t.parent().find(":input"),i=a.eq(0).attr("type");"checkbox"==i||"radio"==i?a.each((function(){var t=$(this).siblings(`.w-${i}-input`),a=!!e&&e==$(this).val();"checkbox"==i&&(a=!!e&&"false"!==e),n.toggleCustomInputField(t,$(this),a)})):a.val()||a.val(HELP.stripHTMLWithLinebreaks(t.html()))})),$(".w-form-formradioinput--inputType-custom").each((function(){var t=$(this),e=t.siblings(":input"),a=t.hasClass("w--redirected-checked");a&&n.toggleCustomInputField(t,e,a)})),$(":input[data-maxlength]").each((function(){$(this).attr("maxlength",Number($(this).attr("data-maxlength")))})),$(".format-ddmmyyyy").on("keyup",(function(t){t&&"Backspace"!=t.key&&"Delete"!=t.key&&$(this).val(HELP.formatDDMMYYYY($(this).val()))})),$(".format-numeric").on("keydown",(function(t){let e=n.getKey(t);HELP.allowCommonKeyPress(t,e)||e>=0&&e<=9||t.preventDefault()})).on("change",(function(){$(this).val(HELP.removeNonNumeric($(this).val()))})),$(".format-email").on("keydown change",(function(t,e){var a=$(this).val()||"",i=n.getKey(t);a=a.toString().toLowerCase().replace(/\s+/g,"")," "!=i?(!1!==e?a=a.replace(/[^a-z0-9+\-_.@]/gi,""):/[^a-z0-9+\-_.@!()]/gi.test(a)&&(a=""),$(this).val(a.trim())):t.preventDefault()})).each((function(t,e){$(e).trigger("change",!1)})),$(".format-url").on("focus blur",(function(t){var e=$(this).val();"focus"!=t.type||e||$(this).val(HELP.addHttpProtocol(e)),"blur"==t.type&&e.length<9&&$(this).val("")})).on("keydown change",(function(t){var e=$(this).val()||"",a=n.getKey(t);(e=e.toString().toLowerCase().replace(/\s+/g,""))&&(e=HELP.addHttpProtocol(e))," "!=a?$(this).val(e):t.preventDefault()})).each((function(t,e){$(e).trigger("change")})),$('.form-submit[name="op"]').on("click",(function(){$(this).parents("form").find(".form-action-op").val($(this).val())})),HELP.waitFor(t,"Weglot",400,(function(){Weglot.on("languageChanged",(function(){$(".select-list-options").each((function(){var t=$(this).parent(".select-list-wrapper").find("select");$(this).find(".w-dyn-item").each((function(e){console.log(e,$(this).text()),t.find("option").eq(e).text($(this).text()).val($(this).data("lang-en"))})),t.hasClass("select2-hidden-accessible")&&(t.select2("destroy"),t.select2(t.data("select2-options")))}))}))})),HELP.waitFor(USER,"current.id",50,(function(){$(".select-list-options").buildSelectOptions(),$(".select2-field").filter((function(){return!$(this).parents(".select-list-wrapper").length})).createSelect2()})),$(e).on("lbox_open",(function(){})),n.uploadFields(),$(".char-count[maxlength]:not(.editor)").charCountTextareas()})),n}(jQuery,this,this.document);$.fn.buildSelectOptions=function(t){t=t||{},$.each(this,(function(t,e){var a=$(this).parent(".select-list-wrapper"),n=$("select",a),i=$(".input-default-value",a),o=i.text()?i.text():i.attr("data-value"),r=[],l=n.is("select[multiple]");o=$.trim(HELP.sanitizeHTML(o))||"",l&&(o=o.split("|")),$(this).find(".w-dyn-item").each((function(){var t=$.trim($(this).text()),e=t==o&&"selected";l&&(e=$.inArray(t,o)>-1),!t||$.inArray(t,r)>-1||(r.push(t),$(this).data("lang-en",t),$("<option />",{value:t,selected:e}).text(t).appendTo(n))})),n.trigger("change"),n.hasClass("select2-field")&&n.createSelect2()}))},$.fn.createSelect2=function(t){t=t||{};var e=this;if(!$(e).length)return!1;HELP.waitFor(jQuery,"fn.select2",100,(function(){var a;$.each(e,(function(e,n){(a=t).placeholder=$(n).attr("placeholder")||"Select...";var i=$(n).find("option[selected]");$(n).attr("multiple")||$(n).prepend('<option value="">'+HELP.sanitizeHTML(a.placeholder)+"</option>"),$(n).select2(a).data("select2-options",a).val(i.length?$(n).val():"").trigger("change").on("change",(function(){$(this).trigger("blur")}))}))}))},$.fn.charCountTextareas=function(){$(this).each((function(){FORMS.setupCharCount($(this),$(this).val().length,$(this).attr("data-valid-maxlength"))})),$(document).on("keyup",this,(function(t){FORMS.updateCharCount($(t.target),$(t.target).val().length,$(t.target).attr("data-valid-maxlength"))}))},jQuery.expr[":"].selectedInput=(t,e,a)=>"checkbox"==t.type||"radio"==t.type?t.checked:["submit","button","reset","hidden"].indexOf(t.type)<0&&t.value;