(function () {
    var filterKanbanStates = function (d) {
        var VALID_VALUES = ['Ready', 'Building', 'Testing', 'Completed', 'Accepting', 'Merging', 'Released'];
        var STORY_KANBANSTATE_OID = '442934705';
        $kanbanStateSelect = $(d).find('#custom_attribute_' + STORY_KANBANSTATE_OID);
        var optionsToHide = $kanbanStateSelect.find('option').filter(function (i) {
            return $.inArray($(this).val(), VALID_VALUES) === -1;
        });
        optionsToHide.remove();
    };

    setInterval(function (event) {
        if (typeof(editorWindow) === 'undefined') {
            return;
        }

        filterKanbanStates(editorWindow.document);
    }, 2000);
})();