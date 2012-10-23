(function () {
    var findCardsMissingReleaseListener = function (d) {
        return $('.columnHeader:contains("Merging")', d).parents('.column').find('.card').filter(function () {
            return $(this).attr('class').indexOf("autoReleaseBound") === -1;
        });
    };

    var determineRelease = function (releases) {
        var today = Date.today();
        var releaseHasBeenChosen = today.is().thursday() || today.is().friday() || today.is().saturday();

        var releaseSaturday = null;
        if (releaseHasBeenChosen) {
            releaseSaturday = today.next().saturday().next().saturday();
        }
        else {
            releaseSaturday = today.next().saturday();
        }

        var releaseToSelect = null;
        $(releases).each(function (i, release) {
            if (release.displayValue == "No Entry") {
                return;
            }

            var releaseDate = Date.parse(release.displayValue);
            if (releaseSaturday.same().day(releaseDate)) {
                releaseToSelect = release;
            }
        });

        return releaseToSelect;
    };

    var addAutoReleaseListener = function (d) {
        findCardsMissingReleaseListener(d).each(function () {
            var $card = $(this);
            $card.addClass('autoReleaseBound');
            $card.find('.readyIndicator').click(function () {
                $card.find('a:contains(More...)').click();
                RallyUtil.getReleases(function (releases) {
                    var releaseToSet = determineRelease(releases);
                    console.log(releaseToSet);
                    RallyUtil.queryForArtifact(RallyUtil.getFormattedIdForCard($card), function (r) {
                        r.set("Release", releaseToSet.value);
                        r.save({
                            callback:function () {
                                var $select = $card.find('p:contains(Release)').find('select');
                                $select.hide();

                                var $readOnlyText = $($select.parents('p')[0]).find('.readOnly');
                                $readOnlyText.text(releaseToSet.displayValue);
                                $readOnlyText.show();
                            }
                        });
                    });
                });
            });
        });
    };

    RallyUtil.waitForIframeElementsAndExecute([], addAutoReleaseListener);
})();