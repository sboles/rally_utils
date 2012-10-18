(function () {
    var expandKanbanBoardCards = function (d) {
        var $expandedStyle = $("<style type='text/css'>.cardboard .cardMenu{height: 18px !important;}</style>");
        $('head', d).append($expandedStyle);
    };

    RallyUtil.waitForIframeElementsAndExecute(['head'], expandKanbanBoardCards);
})();
