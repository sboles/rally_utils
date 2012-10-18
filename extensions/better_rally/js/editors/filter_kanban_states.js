(function () {
    var filterKanbanStates = function (window) {
        if (typeof(editorWindow) === 'undefined') {
            return;
        }

        var VALID_VALUES = ['Backlog', 'Ready', 'Building', 'Peer Review', 'Testing', 'Completed', 'Accepting', 'Merging', 'Released'];
        var STORY_KANBANSTATE_OID = '442934705';
        $kanbanStateSelect = $(editorWindow.document).find('#custom_attribute_' + STORY_KANBANSTATE_OID);
        var optionsToHide = $kanbanStateSelect.find('option').filter(function (i) {
            return $.inArray($(this).val(), VALID_VALUES) === -1;
        });
        optionsToHide.remove();
    };

    RallyUtil.pollForever(filterKanbanStates);
})();