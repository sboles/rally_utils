(function () {
    var titleBarHidden = false;
    var $style = $("<style type='text/css'>.portlet {padding-top: 0 !important;}</style>");
    var hideTitlebar = function () {
        titleBarHidden = true;
        $('.titlebar:contains(Kanban)').hide();
        $('head').append($style);
    };

    var lookForTitleBar = function (event) {
        if ($('.titlebar').length == 0 || titleBarHidden) {
            return;
        }

        hideTitlebar();
    };

    document.addEventListener("DOMNodeInserted", lookForTitleBar);

})();
