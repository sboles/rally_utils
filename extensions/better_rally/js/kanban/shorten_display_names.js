(function () {
    var shortenDisplayNames = function (d) {
        $('.cardOwnerName', d).each(function () {
            var spaceIndex = $(this).text().indexOf(" ");
            if (spaceIndex !== -1) {
                var shortText = $(this).text().substring(0, spaceIndex);
                $(this).text(shortText);
            }
        });

        return false;
    };

    RallyUtil.waitForIframeElementsAndExecute(['.cardOwnerName'], shortenDisplayNames);
})();