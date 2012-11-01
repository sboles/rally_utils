(function () {
    var filterKanbanStates = function (w) {

        if (_.isUndefined(w)) {
            return;
        }

        var VALID_VALUES = ['Backlog', 'Ready', 'Building', 'Peer Review', 'Testing', 'Completed', 'Accepting', 'Merging', 'Released'];
        var STORY_KANBANSTATE_OID = '442934705';
        $kanbanStateSelect = $(w.document).find('#custom_attribute_' + STORY_KANBANSTATE_OID);
        var optionsToHide = $kanbanStateSelect.find('option').filter(function (i) {
            return $.inArray($(this).val(), VALID_VALUES) === -1;
        });
        optionsToHide.slice(1).remove();
    };

    RallyUtil.pollForever(function () {
        filterKanbanStates(editorWindow);
    });
})();