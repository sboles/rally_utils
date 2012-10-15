(function () {
    var enableInlineEdit = function (e) {
        if (!$(this).find('input').is(":visible")) {
            var $readOnlyLabel = $(this).find('.readOnlyInline');
            var currentValue = $readOnlyLabel.text();

            var $inlineEditInput = $(this).find('input');
            $inlineEditInput.val(currentValue);
            $inlineEditInput.prop('disabled', false);

            $readOnlyLabel.hide();
            $inlineEditInput.show();
            $inlineEditInput[0].focus();
        }
    };

    var inlineEditInputKeyEvent = function (e) {
        var ENTER_KEY_CODE = 13;
        if ((e.keyCode || e.which) == ENTER_KEY_CODE) {
            var $modifiedInput = $(this);
            $modifiedInput.prop('disabled', true);

            var newBranchName = $modifiedInput.val();
            var formattedId = RallyUtil.getFormattedIdForCard($($modifiedInput.parents('.card')[0]));
            RallyUtil.queryForArtifact(formattedId, function (record) {
                var fieldToChange = null;
                var name = $modifiedInput.attr('name');
                if (name === "branch") {
                    fieldToChange = record.store.model.elementName == "HierarchicalRequirement" ? 'ImplementedIn' : 'FixedInBuild';
                }
                else if (name === "peerReview") {
                    fieldToChange = "PeerReview";
                }
                else if (name === "blockedReason") {
                    fieldToChange = "BlockedReason";
                }

                record.set(fieldToChange, newBranchName);
                record.save({callback:function () {
                    $modifiedInput.hide();
                    var $readOnlyBranchName = $($modifiedInput.parents('.inlineHolder')[0]).find('.readOnlyInline');
                    $readOnlyBranchName.text(newBranchName);
                    $readOnlyBranchName.show();
                }});
            });
        }
    };

    var hideEditableInputFields = function () {
        var $card = $($(this).parents('.card')[0]);
        $card.find('input').hide();
        $card.find('.readOnlyInline').show();
    };

    var addImplementedInToCard = function () {
        var $card = $(this);
        if ($card.find('.branchIndicator').length === 0) {
            $card.find('.cardName').after("<hr/><div class='branchIndicator inlineHolder'></div>");

            var cardFormattedId = RallyUtil.getFormattedIdForCard($(this));
            RallyUtil.queryForArtifact(cardFormattedId, function (record) {
                var modelName = record.store.model.elementName;
                var branchName = modelName == "HierarchicalRequirement" ? record.get('ImplementedIn') : record.get("FixedInBuild");
                var branchLabel = modelName == "HierarchicalRequirement" ? "Branch" : "Fixed In";
                var branchHtml = "<strong>" + branchLabel + ":</strong> " +
                    "<span class='branchName'>" +
                    "<span class='readOnlyInline'>" + branchName + "</span> " +
                    "<input name='branch' class='editBranchName' style='display:none' type='text'/>" +
                    "</span>";

                buildCardWithEvents($card, branchHtml, 'branchIndicator', 'editBranchName');
            });
        }
    };

    var addPeerReviewToCard = function () {
        var $card = $(this);
        if ($card.find('.peerReview').length === 0) {
            $card.find('.branchIndicator').after("<div class='peerReview inlineHolder'></div>");

            var cardFormattedId = RallyUtil.getFormattedIdForCard($(this));
            RallyUtil.queryForArtifact(cardFormattedId, function (record) {
                var peerReviewLink = record.get("PeerReview");
                var peerReviewHtml = "<strong>Peer Review:</strong> " +
                    "<span class='peerReviewSpan'>" +
                    "<span class='readOnlyInline'>" + peerReviewLink + "</span> " +
                    "<input name='peerReview' class='editPeerReview' style='display:none' type='text'/>" +
                    "</span>";

                buildCardWithEvents($card, peerReviewHtml, 'peerReview', 'editPeerReview');
            });
        }
    };

    var addBlockedReasonToCard = function () {
        var $card = $(this);
        if ($card.find('.blockedReason').length === 0) {
            var precedingElement = '.peerReview';
            if ($card.find('.peerReview').length === 0) {
                precedingElement = '.branchIndicator';
            }

            $card.find(precedingElement).after("<div class='blockedReason inlineHolder'></div>");

            var cardFormattedId = RallyUtil.getFormattedIdForCard($(this));
            RallyUtil.queryForArtifact(cardFormattedId, function (record) {
                var blockedReason = record.get("BlockedReason");
                var blockedReasonHtml = "<div class='blockedReasonHolder' style='display:none'>" +
                    "<strong>Blocked:</strong> " +
                    "<span class='blockedReason'>" +
                    "<span class='readOnlyInline'>" + blockedReason + "</span> " +
                    "<input name='blockedReason' class='editBlockedReason' style='display:none' type='text'/>" +
                    "</span>" +
                    "</div>";

                buildCardWithEvents($card, blockedReasonHtml, 'blockedReason', 'editBlockedReason');

                if (record.get("Blocked")) {
                    $card.find('.blockedReasonHolder').show();
                }
            });
        }
    };


    var buildCardWithEvents = function ($card, html, inlineHolderClass, inputClass) {
        $card.find('.' + inlineHolderClass).html(html);

        $card.find('.' + inlineHolderClass).click(enableInlineEdit);
        $card.find('.' + inlineHolderClass).bind('selectstart', function (e) {
            e.stopPropagation();
        });
        $card.find('.' + inputClass).keypress(inlineEditInputKeyEvent);
        $card.find('.' + inputClass)[0].onblur = hideEditableInputFields;
    };

    var addInlineEditFields = function (d) {
        var IMPLEMENTED_IN_COLUMNS = ['Building', 'Peer Review', 'Testing', 'Merging'];
        $(IMPLEMENTED_IN_COLUMNS).each(function (i, header) {
            var $cards = $('.columnHeader:contains("' + header + '")', d).parents('.column').find('.card');
            $cards.each(addImplementedInToCard);
        });

        var PEER_REVIEW_COLUMNS = ['Building', 'Peer Review'];
        $(PEER_REVIEW_COLUMNS).each(function (i, header) {
            var $cards = $('.columnHeader:contains("' + header + '")', d).parents('.column').find('.card');
            $cards.each(addPeerReviewToCard);
        });

        var BLOCKED_REASON_COLUMNS = ['Building', 'Peer Review', 'Testing', 'Merging'];
        $(BLOCKED_REASON_COLUMNS).each(function (i, header) {
            var $cards = $('.columnHeader:contains("' + header + '")', d).parents('.column').find('.card');
            $cards.each(addBlockedReasonToCard);
        });
    };

    var addBlockedToggleListener = function (d) {
        $('.card:not(.blockBound)', d).each(function () {
            var $card = $(this);
            if ($card.find('.blockedIndicator').length === 0) {
                return;
            }

            $card.addClass('blockBound');
            var $blockedIndicator = $card.find('.blockedIndicator');
            $blockedIndicator.addClass("blockBound");
            $blockedIndicator.click(function () {
                var $blockedReasonHolder = $card.find('.blockedReasonHolder');
                $blockedReasonHolder.toggle();
                if ($blockedReasonHolder.is(":visible")) {
                    $card.find('.blockedReason').click();
                }
            });
        });
    };

    setInterval(function (event) {
        if ($('iframe').length == 0) {
            return;
        }

        $('iframe').each(function () {
            addInlineEditFields($(this)[0].contentDocument);
            addBlockedToggleListener($(this)[0].contentDocument);
        });
    }, 2000);
})();