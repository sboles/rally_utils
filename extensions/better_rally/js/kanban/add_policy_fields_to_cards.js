(function () {
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

    var addPolicyFieldsToCards = function (d) {
        var $cards = $('.columnHeader:contains(Building)', d).parents('.column').find('.card');
        $cards.each(function () {
            var $card = $(this);
            if ($card.find('.policyFields').length === 0) {
                $card.find('.cardContent').append("<div style='display:none' class='policyFields'><hr/></div>");

                var cardFormattedId = getFormattedIdForCard($(this));
                queryForArtifact(cardFormattedId, function (record) {
                    var featureToggleStatus = "<p class='feature-toggle-status'><strong>Feature Toggle Status:</strong> " +
                        "<span class='value'>" + record.get("FeatureToggleStatus") + "</span></p>";

                    $card.find('.policyFields').append(featureToggleStatus);
                });
            }
        });
    };

    var findCardsMissingMoreButton = function (d) {
        return $('.card', d).filter(function(){
            return $(this).text().indexOf("Less...") === -1 && $(this).text().indexOf("More...") === -1;
        });
    };

    var moreButtonClicked = function(){
        var $policyFields = $($(this).parents('.card')[0]).find('.policyFields');
        if( $policyFields.is(":visible")){
            $policyFields.fadeOut();
            $(this).text('More...');
        }
        else {
            $policyFields.fadeIn();
            $(this).text('Less...');
        }
    };

    var addMoreButtonToCards = function (d) {
        if ($('.card .editLinkContainer', d).length === 0) {
            return;
        }

        var $cardsMissingButton = findCardsMissingMoreButton(d);
        var claimHtml = " <a style='padding-left:1em' class='moreButton' href='#'>More...</a>";
        $cardsMissingButton.find('.editLinkContainer').append(claimHtml);
        $cardsMissingButton.find('.moreButton').click(moreButtonClicked);
    };

    setInterval(function (event) {
        if ($('iframe').length == 0) {
            return;
        }

        $('iframe').each(function () {
            addMoreButtonToCards($(this)[0].contentDocument);
            addPolicyFieldsToCards($(this)[0].contentDocument);
        });
    }, 2000);
})();