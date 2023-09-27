var FORMS=function($,e,t,a){var n={getKey:e=>"key"in e?e.key:e.keyCode,uploadFields:function(){$(".upload-wrapper").each((function(){var e=!!$(this).find(".file-existing .file-upload-text").text();$(".upload-field",this).toggle(!e),$(".file-existing",this).toggle(e)})),$(".file-existing .file-upload-button").on("click",(function(){var e=$(this).parents(".upload-wrapper");e.find(".file-existing").remove(),e.find(".upload-field").fadeIn(500)}))},toggleCustomInputField:function(e,t,a){e&&e.hasClass("w--redirected-checked")!==a&&e.trigger("click"),t.prop("checked",a)},initEditor:function(){let e="textarea.editor";$(e).length<1||tinymce.init({selector:e,toolbar:"undo redo | bullist numlist",plugins:"lists",min_height:200,max_height:400,menubar:!1,branding:!1,statusbar:!1,custom_undo_redo_levels:8,setup:function(e){e.on("keydown keyup change",(function(e){let t=this,a=t.getContent({format:"text"}).length,r=$(t.getContainer()),i=Number($(t).data("data-maxlength"));switch(e.type){case"keydown":if(a>=i){let t=n.getKey(e);HELP.allowCommonKeyPress(e,t)||e.preventDefault()}case"change":i&&a>i&&$(t.targetElm).val("");case"keyup":case"change":n.updateCharCount(r,a,i)}})).on("change",(function(t){let a=e.getContent();$textarea=$(e.targetElm),a.replace(/\t/g,"").replace(/( *&nbsp; *)+/g," ").replace(/ {2,}/g," "),$textarea.val(a),$textarea.trigger("blur")}))},init_instance_callback:function(e){let t=$(e.targetElm),a=e.getContent({format:"text"}).length,r=Number(t.attr("data-valid-maxlength")),i=$(e.getContainer());t.addClass("editor-processed"),$(e).data("data-maxlength",r),r&&n.setupCharCount(i,a,r)}})},setupCharCount:(e,t,a)=>{e.after(`<div class="char-count"><span>${Number(t)}</span> / ${Number(a)}</div>`).parent().addClass("char-count-wrapper")},updateCharCount:(e,t,a)=>{e.parent().find(".char-count span").toggleClass("color-danger",t>=Number(a)-20).text(t)}};return $((function(){USER.getCurrentMember((function(e){if(HELP.checkKeyExists(e,"id")){var t=$(".input-member-id");t&&!t.val()&&(t.val(e.id),t.parents("form").find(".form-submit").removeAttr("disabled"))}}));const a=HELP.getSetQuerystring("dest");a&&$("form").find(".fp_redirect").attr("data-redirect","/"+a),$("form").on("submit",(function(){var e=$(this).find(".fp_redirect").attr("data-redirect");e&&localStorage.setItem("fp_redirect",e)}));var r=0;$(".bouncer .input-wrapper").each((function(e,t){var a="error-wrapper-"+r++;$(t).append($('<div class="error-wrapper" id="'+a+'" />')).find(":input").attr("data-bouncer-target","#"+a)}));var i=new Bouncer("form.bouncer",{fieldClass:"error",errorClass:"error-text",fieldPrefix:"bouncer-field_",errorPrefix:"bouncer-error_",disableSubmit:!0,customValidations:{editorMaxlength:function(e){if(!$(e).hasClass("editor"))return!1;var t=$(e).parents(".input-wrapper").find("iframe").contents().find("body");return!!t&&t.text().length>Number($(e).attr("data-valid-maxlength"))}},messages:{missingValue:{checkbox:"This field is required",radio:"Please select an option",select:"Please select an option","select-multiple":"Please select one or more options",default:"This field is required"},patternMismatch:{email:"Please enter a valid email address",url:"Please enter a valid URL (Example: http://example.com)",number:"Please enter a number",color:"Please match the following format: #rrggbb",date:"Please use the YYYY-MM-DD format",time:"Please use the 24-hour time format (Example: 23:00)",month:"Please use the YYYY-MM format (Example: 2065-08)",default:"Please enter a value in the required format"},outOfRange:{over:"Value must not exceed {max} characters",under:"Value must not be lower than {min} characters"},wrongLength:{over:"Value must not exceed {maxLength} characters",under:"Value must not be lower than {minLength} characters"},editorMaxlength:function(e){return"Value must not exceed "+Number($(e).attr("data-valid-maxlength"))+" characters"},fallback:"There was an error with this field"}});$("textarea.editor, .select2-field").on("blur",(function(e){i.validate(this)})),$(t).on("bouncerShowError bouncerRemoveError",(function(e){$(e.target).parents(".input-wrapper").toggleClass("error","bouncerShowError"==e.type)})).on("bouncerFormValid",(function(e){o(e)})),$(".ajax-submit").on("click",".form-submit",(function(e){$(e.target).addClass("clicked")})).on("submit",(function(e){e.preventDefault(),o(e)}));const o=e=>{var t=$(e.target),a=t.find(".form-submit.clicked"),n=t.attr("data-validation"),r=t.attr("data-form-values-type");if(n&&!HELP.callNestedFunction(n))return console.log("Validation failed"),MAIN.buttonThinking(a,!0),!1;var i=HELP.getFormValues(t,r),o=HELP.getCookie("form-valid");o=o?Number(o):0,o=++o,"formData"==r?i.set("increment",o):i.increment=o,HELP.setCookie("form-valid",o);var l={url:t.attr("action"),method:t.attr("method"),data:i,timeout:12e4,callbackSuccess:function(e){MAIN.thinking(!1),MAIN.handleAjaxResponse(e,t)},callbackError:function(e){MAIN.thinking(!1),console.log("error")}};"formData"==r&&(l.processData=!1,l.contentType=!1,l.cache=!1),MAIN.buttonThinking(a),MAIN.thinking(!0,!1),console.log("data: ",l.data),HELP.sendAJAX(l,t)};$(":input[data-default-value]").each((function(){var e=$(this),t=e.attr("data-default-value");e.val()||("number"==e.attr("type")&&(t=HELP.removeNonNumeric(t)),e.val(HELP.sanitizeHTML(t)))})),$(".input-default-value").each((function(){var e=$(this),t=e.text(),a=e.parent().find(":input"),r=a.eq(0).attr("type");"checkbox"==r||"radio"==r?a.each((function(){var e=$(this).siblings(`.w-${r}-input`),a=!!t&&t==$(this).val();"checkbox"==r&&(a=!!t&&"false"!==t),n.toggleCustomInputField(e,$(this),a)})):a.val()||a.val(HELP.stripHTMLWithLinebreaks(e.html()))})),$(".w-form-formradioinput--inputType-custom").each((function(){var e=$(this),t=e.siblings(":input"),a=e.hasClass("w--redirected-checked");a&&n.toggleCustomInputField(e,t,a)})),$(":input[data-maxlength]").each((function(){$(this).attr("maxlength",Number($(this).attr("data-maxlength")))})),$(".format-ddmmyyyy").on("keyup",(function(e){e&&"Backspace"!=e.key&&"Delete"!=e.key&&$(this).val(HELP.formatDDMMYYYY($(this).val()))})),$(".format-numeric").on("keydown",(function(e){let t=n.getKey(e);HELP.allowCommonKeyPress(e,t)||t>=0&&t<=9||e.preventDefault()})).on("change",(function(){$(this).val(HELP.removeNonNumeric($(this).val()))})),$(".format-email").on("keydown change",(function(e,t){var a=$(this).val()||"",r=n.getKey(e);a=a.toString().toLowerCase().replace(/\s+/g,"")," "!=r?(!1!==t?a=a.replace(/[^a-z0-9+\-_.@]/gi,""):/[^a-z0-9+\-_.@!()]/gi.test(a)&&(a=""),$(this).val(a.trim())):e.preventDefault()})).each((function(e,t){$(t).trigger("change",!1)})),$(".format-url").on("focus blur",(function(e){var t=$(this).val();"focus"!=e.type||t||$(this).val(HELP.addHttpProtocol(t)),"blur"==e.type&&t.length<9&&$(this).val("")})).on("keydown change",(function(e){var t=$(this).val()||"",a=n.getKey(e);(t=t.toString().toLowerCase().replace(/\s+/g,""))&&(t=HELP.addHttpProtocol(t))," "!=a?$(this).val(t):e.preventDefault()})).each((function(e,t){$(t).trigger("change")})),$('.form-submit[name="op"]').on("click",(function(){$(this).parents("form").find(".form-action-op").val($(this).val())})),HELP.waitFor(e,"Weglot",400,(function(){Weglot.on("languageChanged",(function(){$(".select-list-options").each((function(){var e=$(this).parent(".select-list-wrapper").find("select");$(this).find(".w-dyn-item").each((function(t){console.log(t,$(this).text()),e.find("option").eq(t).text($(this).text()).val($(this).data("lang-en"))})),e.hasClass("select2-hidden-accessible")&&(e.select2("destroy"),e.select2(e.data("select2-options")))}))}))})),HELP.waitFor(USER,"current.id",50,(function(){$(".select-list-options").buildSelectOptions(),$(".select2-field").filter((function(){return!$(this).parents(".select-list-wrapper").length})).createSelect2()})),$(t).on("lbox_open",(function(){})),n.uploadFields(),$(".char-count[maxlength]:not(.editor)").charCountTextareas()})),n}(jQuery,this,this.document);$.fn.buildSelectOptions=function(e){e=e||{},$.each(this,(function(e,t){var a=$(this).parent(".select-list-wrapper"),n=$("select",a),r=$(".input-default-value",a),i=r.text()?r.text():r.attr("data-value"),o=[],l=n.is("select[multiple]");i=$.trim(HELP.sanitizeHTML(i))||"",l&&(i=i.split("|")),$(this).find(".w-dyn-item").each((function(){var e=$.trim($(this).text()),t=e==i&&"selected";l&&(t=$.inArray(e,i)>-1),!e||$.inArray(e,o)>-1||(o.push(e),$(this).data("lang-en",e),$("<option />",{value:e,selected:t}).text(e).appendTo(n))})),n.trigger("change"),n.hasClass("select2-field")&&n.createSelect2()}))},$.fn.createSelect2=function(e){e=e||{};var t=this;if(!$(t).length)return!1;HELP.waitFor(jQuery,"fn.select2",100,(function(){var a;$.each(t,(function(t,n){(a=e).placeholder=$(n).attr("placeholder")||"Select...";var r=$(n).find("option[selected]");$(n).attr("multiple")||$(n).prepend('<option value="">'+HELP.sanitizeHTML(a.placeholder)+"</option>"),$(n).select2(a).data("select2-options",a).val(r.length?$(n).val():"").trigger("change").on("change",(function(){$(this).trigger("blur")}))}))}))},$.fn.charCountTextareas=function(){$(this).each((function(){FORMS.setupCharCount($(this),$(this).val().length,$(this).attr("data-valid-maxlength"))})),$(document).on("keyup",this,(function(e){FORMS.updateCharCount($(e.target),$(e.target).val().length,$(e.target).attr("data-valid-maxlength"))}))},jQuery.expr[":"].selectedInput=(e,t,a)=>"checkbox"==e.type||"radio"==e.type?e.checked:["submit","button","reset","hidden"].indexOf(e.type)<0&&e.value;