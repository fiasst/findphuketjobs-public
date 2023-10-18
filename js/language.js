//
// 
//
var LANG = (function($, window, document, undefined) {
    var pub = {};


    //
    //
    //
    pub.getCurrentLang = function() {
        return pub.checkKeyExists(window, "Weglot") ? Weglot.getCurrentLang() : 'en';
    };


    //
    // Translate Memberstack message Strings.
    //
    const msShowMessage = $memberstackDom._showMessage;
    // Wrapper function.
    $memberstackDom._showMessage = function() {
      if (!!arguments.length) {
        let lang = pub.getCurrentLang();
        if (lang != 'en') {
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


    /*
    * Use this in other files as a listener so you don't need to add multiple waitFor() wrappers
    * just to listen for language switch events.
    *
    HELP.waitFor(window, "Weglot", 100, function() {
      Weglot.on("languageChanged", function(newLang, prevLang) {
        $(document).trigger('languageChanged.weglot', [newLang, prevLang]);
      });
    });*/


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



