(function () {
    var enableInlineEditForBranchName = function () {
        if (!$(this).find('input').is(":visible")) {
            var $readOnlyBranchName = $(this).find('.readOnlyBranchName');
            var branchName = $readOnlyBranchName.text();

            var $inlineEditInput = $(this).find('input');
            $inlineEditInput.val(branchName);
            $inlineEditInput.prop('disabled', false);

            $readOnlyBranchName.hide();
            $inlineEditInput.show();
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
                var fieldToChange = record.store.model.elementName == "HierarchicalRequirement" ? 'ImplementedIn' : 'FixedInBuild';
                record.set(fieldToChange, newBranchName);
                record.save({callback:function () {
                    $modifiedInput.hide();
                    var $readOnlyBranchName = $($modifiedInput.parents('.branchIndicator')[0]).find('.readOnlyBranchName');
                    $readOnlyBranchName.text(newBranchName);
                    $readOnlyBranchName.show();
                }});
            });
        }
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

    var addImplementedInFieldToCards = function (d) {
        var COLUMNS_TO_ADD_FIELD_TO = ['Building', 'Testing', 'Merging'];
        $(COLUMNS_TO_ADD_FIELD_TO).each(function (i, header) {
            var $cards = $('.columnHeader:contains("' + header + '")', d).parents('.column').find('.card');
            $cards.each(function () {
                var $card = $(this);
                if ($card.find('.branchIndicator').length === 0) {
                    $card.find('.cardName').after("<hr/><div class='branchIndicator'></div>");

                    var cardFormattedId = getFormattedIdForCard($(this));
                    queryForArtifact(cardFormattedId, function (record) {
                        var modelName = record.store.model.elementName;
                        var branchName = modelName == "HierarchicalRequirement" ? record.get('ImplementedIn') : record.get("FixedInBuild");
                        var branchHtml = "<strong>Branch:</strong> " +
                            "<span class='branchName'>" +
                            "<span class='readOnlyBranchName'>" + branchName + "</span> " +
                            "<input class='editBranchName' style='display:none' type='text'/>" +
                            "</span>";
                        $card.find('.branchIndicator').html(branchHtml);

                        $card.find('.branchIndicator').dblclick(enableInlineEditForBranchName);
                        $card.find('.editBranchName').keypress(inlineEditInputKeyEvent);
                        $card.find('.branchIndicator').bind('selectstart', function (e) {
                            e.stopPropagation();
                        });
                    });
                }
            });
        });
    };

    setInterval(function (event) {
        if ($('iframe').length == 0) {
            return;
        }

        $('iframe').each(function () {
            addImplementedInFieldToCards($(this)[0].contentDocument);
        });
    }, 2000);
})();