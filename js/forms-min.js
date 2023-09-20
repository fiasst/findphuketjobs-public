var FORMS=function($,t,e,i){var n={uploadFields:function(){$(".upload-wrapper").each((function(){var t=!!$(this).find(".file-existing .file-upload-text").text();$(".upload-field",this).toggle(!t),$(".file-existing",this).toggle(t)})),$(".file-existing .file-upload-button").on("click",(function(){var t=$(this).parents(".upload-wrapper");t.find(".file-existing").remove(),t.find(".upload-field").fadeIn(500)}))},toggleCustomInputField:function(t,e,i){t&&t.hasClass("w--redirected-checked")!==i&&t.trigger("click"),e.prop("checked",i)},inittextareaEditor:function(){$LAB.script("https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js").wait((function(){tinymce.init({selector:"textarea.editor",toolbar:"undo redo | bold | bullist numlist",plugins:"lists wordcount",icons_url:"https://www.example.com/icons/small/icons.js",icons:"small",min_height:100,max_height:400,resize:!0,menubar:!1,branding:!1,statusbar:!1})}))}};return $((function(){USER.getCurrentMember((function(t){if(HELP.checkKeyExists(t,"id")){var e=$(".input-member-id");e&&!e.val()&&(e.val(t.id),e.parents("form").find(".form-submit").removeAttr("disabled"))}}));const i=HELP.getSetQuerystring("dest");i&&$("form").find(".fp_redirect").attr("data-redirect","/"+i),$("form").on("submit",(function(){var t=$(this).find(".fp_redirect").attr("data-redirect");t&&localStorage.setItem("fp_redirect",t)})),$(".ajax-submit").on("click",".form-submit",(function(t){$(t.target).addClass("clicked")})).on("submit",(function(t){t.preventDefault();var e=$(this),i=e.find(".form-submit.clicked"),n=e.attr("data-validation"),a=e.attr("data-form-values-type");if(n&&!HELP.callNestedFunction(n))return console.log("Validation failed"),MAIN.buttonThinking(i,!0),!1;var o=HELP.getFormValues(e,a),r=HELP.getCookie("form-valid");r=r?Number(r):0,r=++r,"formData"==a?o.set("increment",r):o.increment=r,HELP.setCookie("form-valid",r);var l={url:e.attr("action"),method:e.attr("method"),data:o,timeout:12e4,callbackSuccess:function(t){MAIN.thinking(!1),MAIN.handleAjaxResponse(t,e)},callbackError:function(t){MAIN.thinking(!1),console.log("error")}};"formData"==a&&(l.processData=!1,l.contentType=!1,l.cache=!1),MAIN.buttonThinking(i),MAIN.thinking(!0,!1),console.log("data: ",l.data),HELP.sendAJAX(l,e)})),$(":input[data-default-value]").each((function(){var t=$(this),e=t.attr("data-default-value");t.val()||("number"==t.attr("type")&&(e=HELP.removeNonNumeric(e)),t.val(HELP.sanitizeHTML(e)))})),$(".input-default-value").each((function(){var t=$(this),e=t.text(),i=t.parent().find(":input"),a=i.eq(0).attr("type");"checkbox"==a||"radio"==a?i.each((function(){var t=$(this).siblings(`.w-${a}-input`),i=!!e&&e==$(this).val();"checkbox"==a&&(i=!!e&&"false"!==e),n.toggleCustomInputField(t,$(this),i)})):i.val()||i.val(HELP.stripHTMLWithLinebreaks(t.html()))})),$(".w-form-formradioinput--inputType-custom").each((function(){var t=$(this),e=t.siblings(":input"),i=t.hasClass("w--redirected-checked");i&&n.toggleCustomInputField(t,e,i)})),$(":input[data-maxlength]").each((function(){$(this).attr("maxlength",HELP.sanitizeHTML($(this).attr("data-maxlength")))})),$(".format-ddmmyyyy").on("keyup",(function(t){t&&"Backspace"!=t.key&&"Delete"!=t.key&&$(this).val(HELP.formatDDMMYYYY($(this).val()))})),$(".format-numeric").on("keydown",(function(t){let e="key"in t?t.key:t.keyCode;HELP.allowCommonKeyPress(t,e)||e>=0&&e<=9||t.preventDefault()})).on("change",(function(){$(this).val(HELP.removeNonNumeric($(this).val()))})),$(".format-email").on("keydown change",(function(t,e){var i=$(this).val()||"",n="key"in t?t.key:t.keyCode;i=i.toString().toLowerCase().replace(/\s+/g,"")," "!=n?(!1!==e?i=i.replace(/[^a-z0-9+\-_.@]/gi,""):/[^a-z0-9+\-_.@!()]/gi.test(i)&&(i=""),$(this).val(i.trim())):t.preventDefault()})).each((function(t,e){$(e).trigger("change",!1)})),$(".format-url").on("focus blur",(function(t){var e=$(this).val();"focus"!=t.type||e||$(this).val(HELP.addHttpProtocol(e)),"blur"==t.type&&e.length<9&&$(this).val("")})).on("keydown change",(function(t){var e=$(this).val()||"",i="key"in t?t.key:t.keyCode;(e=e.toString().toLowerCase().replace(/\s+/g,""))&&(e=HELP.addHttpProtocol(e))," "!=i?$(this).val(e):t.preventDefault()})).each((function(t,e){$(e).trigger("change")})),$('.form-submit[name="op"]').on("click",(function(){$(this).parents("form").find(".form-action-op").val($(this).val())})),HELP.waitFor(t,"Weglot",400,(function(){Weglot.on("languageChanged",(function(){$(".select-list-options").each((function(){var t=$(this).parent(".select-list-wrapper").find("select");$(this).find(".w-dyn-item").each((function(e){console.log(e,$(this).text()),t.find("option").eq(e).text($(this).text()).val($(this).data("lang-en"))})),t.hasClass("select2-hidden-accessible")&&(t.select2("destroy"),t.select2(t.data("select2-options")))}))}))})),HELP.waitFor(USER,"current.id",50,(function(){$(".select-list-options").buildSelectOptions(),$(".select2-field").filter((function(){return!$(this).parents(".select-list-wrapper").length})).createSelect2()})),$(e).on("lbox_open",(function(){})),$("textarea.editor").length&&n.inittextareaEditor(),n.uploadFields(),$(".char-count[maxlength]:not(.editor)").charCountTextareas()})),n}(jQuery,this,this.document);$.fn.buildSelectOptions=function(t){t=t||{},$.each(this,(function(t,e){var i=$(this).parent(".select-list-wrapper"),n=$("select",i),a=$(".input-default-value",i),o=a.text()?a.text():a.attr("data-value"),r=[],l=n.is("select[multiple]");o=$.trim(HELP.sanitizeHTML(o))||"",l&&(o=o.split("|")),$(this).find(".w-dyn-item").each((function(){var t=$.trim($(this).text()),e=t==o&&"selected";l&&(e=$.inArray(t,o)>-1),!t||$.inArray(t,r)>-1||(r.push(t),$(this).data("lang-en",t),$("<option />",{value:t,selected:e}).text(t).appendTo(n))})),n.trigger("change"),n.hasClass("select2-field")&&n.createSelect2()}))},$.fn.createSelect2=function(t){t=t||{};var e=this;if(!$(e).length)return!1;HELP.waitFor(jQuery,"fn.select2",100,(function(){var i;$.each(e,(function(e,n){(i=t).placeholder=$(n).attr("placeholder")||"Select...";var a=$(n).find("option[selected]");$(n).attr("multiple")||$(n).prepend('<option value="">'+HELP.sanitizeHTML(i.placeholder)+"</option>"),$(n).select2(i).data("select2-options",i).val(a.length?$(n).val():"").trigger("change")}))}))},$.fn.charCountTextareas=function(){$(this).each((function(){var t=HELP.sanitizeHTML($(this).attr("maxlength"));$(this).after('<div class="char-count"><span>0</span> / '+t+"</div>").parent().addClass("char-count-wrapper")})),$(document).on("keyup",this,(function(t){$(t.target).parent().find(".char-count span").text($(t.target).val().length)}))},jQuery.expr[":"].selectedInput=(t,e,i)=>"checkbox"==t.type||"radio"==t.type?t.checked:["submit","button","reset","hidden"].indexOf(t.type)<0&&t.value;