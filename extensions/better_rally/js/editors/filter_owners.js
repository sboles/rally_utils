(function () {
    var filterOwners = function (w) {

        if (_.isUndefined(w)) {
            return;
        }

        var ownerGroups = $(w.document).find('optgroup');
        var nonCrazyGroup = ownerGroups[1];

        $(nonCrazyGroup).remove();
    };

    RallyUtil.pollForever(function () {
        filterOwners(editorWindow);
    });
})();