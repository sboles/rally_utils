(function () {
    var addImplementedInFieldToCards = function (d) {
        var COLUMNS_TO_ADD_FIELD_TO = ['Building', 'Testing', 'Merging'];
        $(COLUMNS_TO_ADD_FIELD_TO).each(function (i, header) {
            var $cards = $('.columnHeader:contains("' + header + '")', d).parents('.column').find('.card');
            $cards.each(function () {
                var $card = $(this);
                if ($card.find('.branchName').length === 0) {
                    $card.find('.cardName').after("<hr/><div class='branchName'></div>");

                    var cardFormattedId = $(this).find('.leftCardHeader').text();
                    var modelName = cardFormattedId.substring(0, 1) == "S" ? "HierarchicalRequirement" : "Defect";
                    Rally.data.ModelFactory.getModel({
                        type:modelName,
                        success:function (model) {
                            model.find({
                                filters:[
                                    {
                                        property:'FormattedID',
                                        value:cardFormattedId
                                    }
                                ],
                                callback:function (record) {
                                    var branchName = modelName == "HierarchicalRequirement" ? record.get('ImplementedIn') : record.get("FixedInBuild");
                                    var branchHtml = "<strong>Branch:</strong> " + branchName;
                                    $card.find('.branchName').html(branchHtml);
                                    $card.find('.branchName').bind('selectstart', function (e) {
                                        e.stopPropagation();
                                    });
                                }
                            });
                        }
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