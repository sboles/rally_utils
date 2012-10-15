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

    window.RallyUtil = window.RallyUtil || {};
    RallyUtil.queryForArtifact = queryForArtifact;
    RallyUtil.getModelNameFromFormattedId = getModelNameFromFormattedId;
    RallyUtil.getFormattedIdForCard = getFormattedIdForCard;
})();
