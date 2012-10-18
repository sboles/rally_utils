(function () {
    var removeFilters = function (d) {
        $('#appHeader', d).remove();
        $('#userStories', d).remove();
        $('#defects', d).remove();
        $('.filterByTagsDropdown', d).remove();
    };

    RallyUtil.waitForIframeElementsAndExecute(['#appHeader', '#userStories', '#defects', '.filterByTagsDropdown' ], removeFilters);
})();