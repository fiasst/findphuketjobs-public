var DASHBOARD = (function($, window, document, undefined) {
    var pub = {};


    // On DOM ready.
    $(function() {
        // Make tab active if there's only 1 tab pane (a Jobseeker's Applications).
        var $tabPanes = $('#my-content .w-tab-pane');
        if ($tabPanes.length === 1) {
        	// Show the only remaining pane.
            $tabPanes.addClass('w--tab-active');
        }
    });


    return pub;
}(jQuery, this, this.document));

