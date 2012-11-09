(function () {
    var filterOwners = function (w) {

        if (_.isUndefined(w)) {
            return;
        }

        var noEntry = $(w.document).find('select[name = "owner"] option[value = "NULL_CRITERIA"]');
        var ownerGroups = $(w.document).find('optgroup');
        var nonCrazyGroup = ownerGroups[1];

        $(nonCrazyGroup).remove();
        $(noEntry).remove();
    };

    RallyUtil.pollForever(function () {
        filterOwners(editorWindow);
    });
})();