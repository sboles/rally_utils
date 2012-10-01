(function () {
    var titleBarHidden = false;
    var hideTitlebar = function () {
        $('.titlebar:contains(Kanban)').hide();
        $('head').append("<style type='text/css'>.portlet {padding-top: 0 !important;}</style>");
        titleBarHidden = true;
    };

    document.addEventListener("DOMNodeInserted", function (event) {
        if ($('.titlebar').length == 0 || titleBarHidden) {
            return;
        }

        hideTitlebar();
    });
})();