(function () {
    var $style = $("<style type='text/css'>.portlet {padding-top: 0 !important;}</style>");
    var hideTitlebar = function () {
        var $kanbanTitleBar = $('.titlebar:contains(Kanban)');
        $kanbanTitleBar.remove();
        $('head').append($style);

        return true;
    };

    RallyUtil.waitForElementsAndExecute(['.titlebar:contains(Kanban)'], hideTitlebar);
})();
