(function () {
    var claimButtonClicked = function () {
        var $card = $(this).parents('.card');
        var formattedId = $card.find('.leftCardHeader').text();
        var newOwnerDisplayName = $('#options').find('a').first().text();

        var modelName = formattedId.substring(0, 1) == "S" ? "HierarchicalRequirement" : "Defect";

        Rally.data.ModelFactory.getModel({
            type:'User',
            success:function (model) {
                model.find({
                    filters:[
                        {
                            property:'DisplayName',
                            value:newOwnerDisplayName
                        }
                    ],
                    callback:function (ownerRecord) {
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
                                    callback:function (storyRecord) {
                                        storyRecord.set("Owner", ownerRecord.data);
                                        storyRecord.save({
                                            callback:function (record, operation) {
                                                if (operation.success) {
                                                    $card.find('.cardOwnerName').text(newOwnerDisplayName);
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

        return false;
    };

    var findCardsMissingClaimButton = function (d) {
        return $('.card:not(:contains(Claim))', d);
    };

    var addClaimButtonToKanbanCards = function (d) {
        if ($('.card .editLinkContainer', d).length === 0) {
            return;
        }

        var $cardsMissingClaimButton = findCardsMissingClaimButton(d);
        var claimHtml = " <a style='padding-left:1em' class='claimButton' href='#'>Claim</a>";
        $cardsMissingClaimButton.find('.editLinkContainer').append(claimHtml);
        $cardsMissingClaimButton.find('.claimButton').click(claimButtonClicked);
    };

    setInterval(function (event) {
        if ($('iframe').length == 0) {
            return;
        }

        $('iframe').each(function () {
            addClaimButtonToKanbanCards($(this)[0].contentDocument);
        });
    }, 2000);
})();