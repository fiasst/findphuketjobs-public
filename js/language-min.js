var LANG=function($,e,t,n){var o={currentLang:function(){return HELP.checkKeyExists(e,"Weglot")?Weglot.getCurrentLang():"en"}};return HELP.waitFor(e,"$memberstackDom",50,(function(){const t=$memberstackDom._showMessage;$memberstackDom._showMessage=function(n,o){let a=LANG.currentLang();"en"!=a&&HELP.checkKeyExists(e,"Weglot")?Weglot.translate({words:[{t:1,w:n}],languageTo:a},(function(e){t.apply(this,[e[0],o])})):t.apply(this,[n,o])}})),HELP.waitFor(e,"Weglot",50,(function(){Weglot.on("languageChanged",(function(e,n){$(t).trigger("languageChanged.weglot",[e,n])}))})),o}(jQuery,this,this.document);