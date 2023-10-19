//
// 
//
var LANG = (function($, window, document, undefined) {
    var pub = {};


    //
    //
    //
    pub.currentLang = function() {
        return HELP.checkKeyExists(window, "Weglot") ? Weglot.getCurrentLang() : 'en';
    };


    //
    // Translate Memberstack message Strings.
        // Remove this and use language.js instead once
        // usng Gulp to combine and minify all JS files.
        // Don't want to add any more HTTP requests...
    //
    /*HELP.waitFor(window, '$memberstackDom', 50, function() {
        const msShowMessage = $memberstackDom._showMessage;
        // Wrapper function.
        $memberstackDom._showMessage = function(arguments) {
          if (!!arguments.length) {
            let lang = LANG.currentLang();
            if (lang != 'en' && HELP.checkKeyExists(window, 'Weglot')) {
              Weglot.translate({
                'words':[{
                    "t": 1, "w": arguments[0]}],
                'languageTo': lang
              }, function(data) {
                  arguments[0] = data[0];
                  // Call original method with translated message.
                  msShowMessage.apply(this, arguments);
              });
            }
          }
        };
    });*/

    
    //
    // Use this in other files as a listener so you don't need to add multiple waitFor() wrappers
    // just to listen for language switch events.
    //
    HELP.waitFor(window, "Weglot", 100, function() {
      Weglot.on("languageChanged", function(newLang, prevLang) {
        $(document).trigger('languageChanged.weglot', [newLang, prevLang]);
      });
    });


    //
    // On DOM ready.
    //
    // $(function() {
        //
        //
        //
    // });


    return pub;
}(jQuery, this, this.document));



