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

    me.claimButtonClicked = function () {
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

    me.addClaimButtonToKanbanCards = function (document) {
        if ($('.claimButton', document).length > 0) {
            return;
        }

        var claimHtml = " <a style='padding-left:1em' class='claimButton' href='#'>Claim</a>";
        $('.card .editLinkContainer', document).append(claimHtml);
        $('.claimButton', document).click(me.claimButtonClicked);
    };

    me.removeUnusedStoryMenuItems = function () {
        var MENU_ITEMS_TO_HIDE = ["Changesets", "Chart", "Test Run", "Test Cases", "Tasks", "Successors", "Predecessors"];
        $('#detail_tree_cell .treenode').filter(function () {
            var menuItemText = $(this).text();
            var shouldHide = false;
            $(MENU_ITEMS_TO_HIDE).each(function (index, item) {
                if (menuItemText.indexOf(item) !== -1) {
                    shouldHide = true;
                }
            });

            return shouldHide;
        }).hide();
    };

    me.setupKanbanBoardRallyLink = function () {
        $('.sp-label').css('font-size', '1.5em');
        $('.sp-label').click(function () {
            location.href = "https://rally1.rallydev.com/#/6895507658d/custom/3173483378";
        });
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
        me.setupKanbanBoardRallyLink();

        var iframeDocument = $('iframe')[0].contentDocument;
        me.addClaimButtonToKanbanCards(iframeDocument);
        me.addImplementedInFieldToMergingCards(iframeDocument);

        me.removeUnusedStoryMenuItems();

        if (typeof(editorWindow) !== "undefined") {
            me.filterKanbanStates(editorWindow.document);
        }
    });
};
main();