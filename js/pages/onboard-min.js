var ONBOARD=function($,e,t,o){var n,i,s,r="fpj_onboarding";i=HELP.getSetQuerystring("signup"),s=HELP.getSetQuerystring("signup_biz"),(i||s)&&(n={type:i||null,business:s?decodeURIComponent(e.atob(s)):null}),n&&HELP.setCookie(r,JSON.stringify(n));return $((function(){var e=HELP.getCookie(r);e&&USER.getCurrentMember((function(o){if(HELP.checkKeyExists(o,"id"))MAIN.dialog({message:"[p][strong]Thank you for creating an account and joining our Soft-launch![/strong] We're so glad you decided to give our service a try.[/p]\n[p]We'll send you an email once your current job vacancies have been posted. There’s no need to add your Business to your account, we’ll do that for you.[/p]\n[p]Since our website is new, there's bound to be some technical faults and lots of features not yet included. We appreciate your patience while we make big improvements in the months to come.[/p]\n[p]Thanks again and welcome - team Find Phuket Jobs[/p]",type:"success",mode:"dialog",options:{title:"Welcome!",overlayClose:!1,closeButton:!1,actions:[{type:"button",text:"Close",attributes:{class:"button-primary trigger-lbox-close",href:"#"}}]}}),$(t).one("click",".trigger-lbox-close",(function(e){HELP.deleteCookie(r)}));else{var n=$("form.form-register");HELP.checkKeyExists(e,"type")&&$('input[name="campaign"]',n).val(e.type),HELP.checkKeyExists(e,"business")&&$('input[name="signup_biz"]',n).val(e.business)}}))})),{}}(jQuery,this,this.document);