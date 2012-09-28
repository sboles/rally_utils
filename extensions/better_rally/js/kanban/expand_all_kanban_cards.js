var expandKanbanBoardCards = function (d) {
    var $expandedStyle = $("<style type='text/css'>.cardboard .cardMenu{height: 18px !important;}</style>");
    $('head', d).append($expandedStyle);
};

document.addEventListener("DOMNodeInserted", function (event) {
    if ($('iframe').length == 0) {
        return;
    }

    $('iframe').each(function () {
        expandKanbanBoardCards($(this)[0].contentDocument);
    });
});