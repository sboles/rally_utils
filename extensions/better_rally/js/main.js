var main = function () {
    var me = this;

    me.filterKanbanStates = function (d) {
        var VALID_VALUES = ['Ready', 'Building', 'Testing', 'Completed', 'Accepting', 'Merging', 'Released'];
        var STORY_KANBANSTATE_OID = '442934705';
        $kanbanStateSelect = $(d).find('#custom_attribute_' + STORY_KANBANSTATE_OID);
        var optionsToHide = $kanbanStateSelect.find('option').filter(function (i) {
            return $.inArray($(this).val(), VALID_VALUES) === -1;
        });
        optionsToHide.remove();
    };

    me.addImplementedInFieldToMergingCards = function (d) {
        var $cards = $('.columnHeader:contains("Merging")', d).parents('.column').find('.card');
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
    };

    $('body').mouseover(function () {
        var iframeDocument = $('iframe')[0].contentDocument;
        me.addImplementedInFieldToMergingCards(iframeDocument);

        if (typeof(editorWindow) !== "undefined") {
            me.filterKanbanStates(editorWindow.document);
        }
    });
};
main();