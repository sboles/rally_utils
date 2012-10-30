(function () {
    var addOverclaimedIndicator = function (d) {
        var allNames = {};
        var $allCardOwners = $('.cardRealOwnerName', d);
        var $allCards = $('.cardRealOwnerName', d).parents('.card');
        $allCardOwners.each(function () {
            var currentName = $(this).text();
            if (!currentName.match(/No/)) {
                allNames[currentName] = true;
            }
        });
        var name;
        for (name in allNames) {
            var $cardsBeingWorked = $allCards.filter(function () {
                var $thisCard = $(this);
                var isOwnCard = $thisCard.find('.cardRealOwnerName').text() === name;
                var cardIsNotBlocked = $thisCard.find('.blockedIndicator').css('background-image').match(/not-blocked/);
                var cardIsNotReady = $thisCard.find('.readyIndicator').css('background-image').match(/unready/);
                var cardIsBeingWorked = isOwnCard && cardIsNotBlocked && cardIsNotReady;
                return cardIsBeingWorked;
            });
            if ($cardsBeingWorked.size() > 1) {
                $cardsBeingWorked.find('.claimButton').each(function () {
                    $(this).css('background-color', '#FFEB02');
                });
            } else {
                $cardsBeingWorked.find('.claimButton').each(function () {
                    $(this).css('background-color', '');
                });
            }
        }
    };

    RallyUtil.waitForIframeElementsAndExecute(['.cardRealOwnerName'], addOverclaimedIndicator);
})();