var LANG=function($,e,t,n){var r={getCurrentLang:function(){return r.checkKeyExists(e,"Weglot")?Weglot.getCurrentLang():"en"}};const s=$memberstackDom._showMessage;return $memberstackDom._showMessage=function(){if(arguments.length){let e=r.getCurrentLang();"en"!=e&&Weglot.translate({words:[{t:1,w:arguments[0]}],languageTo:e},(function(e){e=e[0],s.apply(this,arguments)}))}},r}(jQuery,this,this.document);