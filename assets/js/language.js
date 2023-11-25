//
// 
//
var LANG = (function($, window, document, undefined) {
    var pub = {};


    // The website's default language.
    pub.defaultLang = 'en';


    //
    //
    //
    pub.currentLang = function() {
        return HELP.checkKeyExists(window, "Weglot") ? Weglot.getCurrentLang() : pub.defaultLang;
    };


    //
    // Translate Memberstack message Strings.
    //
    HELP.waitFor(window, '$memberstackDom', 50, function() {
        // Original MS method.
        const msShowMessage = $memberstackDom._showMessage;
        // Wrapper function.
        $memberstackDom._showMessage = function(text, isError) {
          let lang = LANG.currentLang();
          // If not language != English and Weglot has loaded.
          if (lang != 'en' && HELP.checkKeyExists(window, 'Weglot')) {
            Weglot.translate({
              'words':[{"t": 1, "w": text}],
              'languageTo': lang
            }, function(data) {
              // Call original method with translated message.
              msShowMessage.apply(this, [data[0], isError]);
            });
          }
          else {
            // Show original message without translating.
            msShowMessage.apply(this, [text, isError]);
          }
        };
    });

    
    //
    // Use this in other files as a listener so you don't need to add multiple waitFor() wrappers
    // just to listen for language switch events.
    //
    HELP.waitFor(window, "Weglot", 50, function() {
      Weglot.on("languageChanged", function(newLang, prevLang) {
        // Usage: $(document).on('languageChanged.weglot', function(e, newLang, prevLang) {}
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



