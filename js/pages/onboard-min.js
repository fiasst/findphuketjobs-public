var ONBOARD=function($,e,o,t){var n,s,i,r="fpj_onboarding";s=HELP.getSetQuerystring("signup"),i=HELP.getSetQuerystring("signup_biz"),(s||i)&&(n={type:s||null,business:i?decodeURIComponent(i):null}),n&&HELP.setCookie(r,JSON.stringify(n));return $((function(){var e=HELP.getCookie(r);e&&USER.getCurrentMember((function(t){if(HELP.checkKeyExists(t,"id"))MAIN.dialog({message:"[h1 class=\"title size-h2 text-center\"]Welcome! 🤩[/h1][p][strong]Thank you for creating an account and joining our Soft-launch![/strong] We're so glad you decided to give our service a try.[/p]\n[p]We'll send you an email once your current job vacancies have been posted. There’s no need to add your Business to your account, we’ll do that for you.[/p]\n[p]And again, there's absolutely no fee for trying our service during our Soft-launch. However, you can see plan details on this page, should you wish to add more jobs.[/p]\n[p]Since our website is new, there's bound to be lots of features not yet included. We appreciate your patience while we make big improvements in the months to come.[/p]\n[p]Thanks again and welcome - team Find Phuket Jobs[/p]",type:"success",mode:"dialog",options:{title:!1,overlayClose:!1,closeButton:!1,actions:[{type:"button",text:"Close",attributes:{class:"button-primary trigger-lbox-close",href:"#"}}]}}),$(o).one("click",".trigger-lbox-close",(function(e){HELP.deleteCookie(r)}));else{var n=$("form.form-register");HELP.checkKeyExists(e,"type")&&$('input[name="campaign"]',n).val(e.type),HELP.checkKeyExists(e,"business")&&$('input[name="signup_biz"]',n).val(e.business)}}))})),{}}(jQuery,0,this.document);