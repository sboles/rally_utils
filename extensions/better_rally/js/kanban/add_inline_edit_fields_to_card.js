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
            var formattedId = getFormattedIdForCard($($modifiedInput.parents('.card')[0]));
            queryForArtifact(formattedId, function (record) {
                var fieldToChange = null;
                var name = $modifiedInput.attr('name');
                if (name === "branch") {
                    fieldToChange = record.store.model.elementName == "HierarchicalRequirement" ? 'ImplementedIn' : 'FixedInBuild';
                }
                else if (name === "peerReview") {
                    fieldToChange = "PeerReview";
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

    var getFormattedIdForCard = function ($card) {
        return $card.find('.leftCardHeader').text();
    };

    var getModelNameFromFormattedId = function (formattedId) {
        return formattedId.substring(0, 1) == "S" ? "HierarchicalRequirement" : "Defect";
    };

    var queryForArtifact = function (formattedId, callback) {
        var modelName = getModelNameFromFormattedId(formattedId);
        Rally.data.ModelFactory.getModel({
            type:modelName,
            success:function (model) {
                model.find({
                    filters:[
                        {
                            property:'FormattedID',
                            value:formattedId
                        }
                    ],
                    callback:callback
                });
            }
        });
    };

    var addImplementedInToCard = function () {
        var $card = $(this);
        if ($card.find('.branchIndicator').length === 0) {
            $card.find('.cardName').after("<hr/><div class='branchIndicator inlineHolder'></div>");

            var cardFormattedId = getFormattedIdForCard($(this));
            queryForArtifact(cardFormattedId, function (record) {
                var modelName = record.store.model.elementName;
                var branchName = modelName == "HierarchicalRequirement" ? record.get('ImplementedIn') : record.get("FixedInBuild");
                var branchLabel = modelName == "HierarchicalRequirement" ? "Branch" : "Fixed In";
                var branchHtml = "<strong>" + branchLabel + ":</strong> " +
                    "<span class='branchName'>" +
                    "<span class='readOnlyInline'>" + branchName + "</span> " +
                    "<input name='branch' class='editBranchName' style='display:none' type='text'/>" +
                    "</span>";
                $card.find('.branchIndicator').html(branchHtml);

                $card.find('.branchIndicator').click(enableInlineEdit);
                $card.find('.editBranchName').keypress(inlineEditInputKeyEvent);
                $card.find('.editBranchName')[0].onblur = hideEditableInputFields;
                $card.find('.branchIndicator').bind('selectstart', function (e) {
                    e.stopPropagation();
                });
            });
        }
    };

    var addPeerReviewToCard = function () {
        var $card = $(this);
        if ($card.find('.peerReview').length === 0) {
            $card.find('.branchIndicator').after("<div class='peerReview inlineHolder'></div>");

            var cardFormattedId = getFormattedIdForCard($(this));
            queryForArtifact(cardFormattedId, function (record) {
                var peerReviewLink = record.get("PeerReview");
                var peerReviewHtml = "<strong>Peer Review:</strong> " +
                    "<span class='peerReviewSpan'>" +
                    "<span class='readOnlyInline'>" + peerReviewLink + "</span> " +
                    "<input name='peerReview' class='editPeerReview' style='display:none' type='text'/>" +
                    "</span>";

                $card.find('.peerReview').html(peerReviewHtml);

                $card.find('.peerReview').click(enableInlineEdit);
                $card.find('.editPeerReview').keypress(inlineEditInputKeyEvent);
                $card.find('.editPeerReview')[0].onblur = hideEditableInputFields;
                $card.find('.peerReview').bind('selectstart', function (e) {
                    e.stopPropagation();
                });
            });
        }
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
    };

    setInterval(function (event) {
        if ($('iframe').length == 0) {
            return;
        }

        $('iframe').each(function () {
            addInlineEditFields($(this)[0].contentDocument);
        });
    }, 2000);
})();