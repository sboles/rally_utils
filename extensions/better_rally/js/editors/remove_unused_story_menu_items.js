(function () {
    var removeUnusedStoryMenuItems = function () {
        var MENU_ITEMS_TO_HIDE = ["Changesets", "Chart", "Test Run", "Test Cases", "Tasks", "Successors", "Predecessors"];
        $('#detail_tree_cell .treenode').filter(function () {
            var menuItemText = $(this).text();
            var shouldHide = false;
            $(MENU_ITEMS_TO_HIDE).each(function (index, item) {
                if (menuItemText.indexOf(item) !== -1) {
                    shouldHide = true;
                }
            });

            return shouldHide;
        }).hide();
    };

    document.addEventListener("DOMNodeInserted", function (event) {
        if ($('#detail_tree_cell').length === 0) {
            return;
        }

        removeUnusedStoryMenuItems();
    });
})();