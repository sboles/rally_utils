(function () {
    var $style = $("<style type='text/css'>.portlet {padding-top: 0 !important;}</style>");
    var hideTitlebar = function (d) {
        var $kanbanTitleBar = $('.titlebar:contains(Kanban)', d);
        if ($kanbanTitleBar.length === 0) {
            return false;
        }

        $kanbanTitleBar.remove();
        $('head', d).append($style);

        return true;
    };

    var titleBarHidden = false;
    setInterval(function () {
        if ($('.titlebar').length == 0 || titleBarHidden) {
            return;
        }

        titleBarHidden = hideTitlebar(document);
    }, 2000);
})();
