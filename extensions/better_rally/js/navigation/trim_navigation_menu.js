(function () {
    var trimNavigationMenu = function () {
        var DESIRED_TABS = ["Dashboard", "TESTenv", "Backlog", "User Stories", "Portfolio Items", "Kanban (S)", "Portfolio/Story Hierarchy", "Defects", "Team Metrics for Steering", "Time In Process (TIP) Chart Prototype", "Cumulative Flow Diagram Prototype"];
        $('.nav-menu-item').filter(function () {
            var $menuItem = $(this);
            var shouldHide = true;
            $(DESIRED_TABS).each(function (i, tab) {
                if ($menuItem.text() === tab) {
                    shouldHide = false;
                }
            });

            return shouldHide;
        }).remove();
    };


    document.addEventListener("DOMNodeInserted", function () {
        if ($('.nav-menu-item').length == 0) {
            return;
        }

        trimNavigationMenu();
    });
})();

