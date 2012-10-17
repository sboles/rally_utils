(function () {
    var removeFilters = function (d) {
        var $appHeader = $('#appHeader', d);
        var $userStorySelector = $('#userStories', d);
        var $defectSelector = $('#defects', d);
        var $filterSelector = $('.filterByTagsDropdown', d);

        var readyToRemove = $appHeader.length !== 0 && $userStorySelector.length !== 0 && $defectSelector !== 0 && $filterSelector !== 0;
        if (!readyToRemove) {
            return false;
        }

        $appHeader.remove();
        $userStorySelector.remove();
        $defectSelector.remove();
        $filterSelector.remove();

        return readyToRemove;
    };

    setInterval(function (event) {
        if ($('iframe').length == 0 || $('iframe').data('filters-removed')) {
            return;
        }

        $('iframe').each(function () {
            var filtersRemoved = removeFilters($(this)[0].contentDocument);
            $(this).data('filters-removed', filtersRemoved);
        });
    }, 2000);
})();