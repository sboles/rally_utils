var addJQuery = function (callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js");
    script.addEventListener('load', function () {
        var script = document.createElement("script");
        script.textContent = "(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
};

window.hideBadRows = function () {
    var me = this;
    me.removeBadFields = function (d, container_id) {
        var STORY_FIELDS_TO_HIDE = [
            "Tags",
            "Blocked",
            "Release",
            "Iteration",
            "Plan Est",
            "Task Est",
            "Actual",
            "To Do",
            "Affects User Learning",
            "Anticipated Toggle On Date",
            "Blocked Reason",
            "Customer Development Kanban",
            "date",
            "Due Date",
            "External Link",
            "Data Migration",
            "Integrations Kanban",
            "Integrations TAM Votes",
            "IT Effort",
            "IT Value",
            "On-Prem Impact",
            "Onboarding Kanban",
            "Partner Coach Kanban",
            "Partner Coach Vette Kanban",
            "Partner Kanban States",
            "Portfolio Tab",
            "Priority",
            "Product Marketing Kanban",
            "ProvisioningKanbanState",
            "PS Allocation",
            "Requesting Customers",
            "Number of Requests",
            "Salesforce Feature",
            "Link Label",
            "ID",
            "Recon",
            "Risk",
            "Affected Customers",
            "Number of Cases",
            "Salesforce Case",
            "Link Label",
            "ID",
            "Salesforce Council Kanban",
            "SalesOps",
            "SalesOps Specific",
            "Stratus Load All Stories",
            "Sustainability Kanban",
            "T-Shirt",
            "Urgent",
            "Watch List",
            "Work Start Date",
            "Change Description"];

        var DEFECT_FIELDS_TO_HIDE = [
            "Target Build",
            "Target Date",
            "xcv",
            "Type",
            "Exception Email",
            "ReOpened"
        ];

        var FIELDS_TO_HIDE = $.merge(STORY_FIELDS_TO_HIDE, DEFECT_FIELDS_TO_HIDE);

        var elementsToHide = [];
        $(d).find('#' + container_id + ' tr').each(function (index, row) {
            var shouldHide = false;
            var headers = $(row).find('th');
            headers.each(function (i, header) {
                var $header = $(header);
                var labelText = $header.text();
                $(FIELDS_TO_HIDE).each(function (i, field) {
                    shouldHide |= labelText.indexOf(field) !== -1;
                });

                if (shouldHide) {
                    elementsToHide.push(header);
                    elementsToHide.push($header.next()[0]);
                }
            });
        });

        $(elementsToHide).hide();
    };

    me.filterKanbanStates = function (d) {
        var VALID_VALUES = ['Ready', 'Building', 'Testing', 'Completed', 'Accepting', 'Merging', 'Released'];
        var STORY_KANBANSTATE_OID = '442934705';
        $kanbanStateSelect = $(d).find('#custom_attribute_' + STORY_KANBANSTATE_OID);
        var optionsToHide = $kanbanStateSelect.find('option').filter(function (i) {
            return $.inArray($(this).val(), VALID_VALUES) === -1;
        });
        optionsToHide.remove();
    };

    me.expandAllKanbanCards = function (d) {
        var $expandedStyle = $("<style type='text/css'>.cardboard .cardMenu{height: 18px !important;}</style>");
        $('head', d).append($expandedStyle);
    };

    me.claimButtonClicked = function () {
        var $card = $(this).parents('.card');
        var formattedId = $card.find('.leftCardHeader').text();
        var newOwnerDisplayName = $('#options').find('a').first().text();

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
                            type:'HierarchicalRequirement',
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

    me.trimNavigationMenuItems = function () {
        var DESIRED_TABS = ["Dashboard", "TESTenv", "Backlog", "User Stories", "Portfolio Items", "Kanban (S)", "Defects"];

        $('.nav-menu-item').filter(function () {
            var $menuItem = $(this);
            var shouldHide = true;
            $(DESIRED_TABS).each(function (i, tab) {
                if ($menuItem.text() === tab) {
                    shouldHide = false;
                }
            });

            return shouldHide;
        }).remove();

        $('.nav-tab:contains("Reports")').remove();
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
                Rally.data.ModelFactory.getModel({
                    type:'HierarchicalRequirement',
                    success:function (model) {
                        model.find({
                            filters:[
                                {
                                    property:'FormattedID',
                                    value:cardFormattedId
                                }
                            ],
                            callback:function (storyRecord) {
                                var branchHtml = "<strong>Branch:</strong> " + storyRecord.get('ImplementedIn');
                                $card.find('.branchName').html(branchHtml);
                                $card.find('.branchName').bind('selectstart',function(e){e.stopPropagation();});
                            }
                        });
                    }
                });
            }
        });
    };

    $(document).ready(function () {
        $('body').mouseover(function () {
            me.setupKanbanBoardRallyLink();
            me.removeBadFields(document, 'detailContent');

            var iframeDocument = $('iframe')[0].contentDocument;
            me.expandAllKanbanCards(iframeDocument);
            me.addClaimButtonToKanbanCards(iframeDocument);
            me.addImplementedInFieldToMergingCards(iframeDocument);

            me.removeUnusedStoryMenuItems();
            me.trimNavigationMenuItems();

            if (editorWindow) {
                me.removeBadFields(editorWindow.document, 'formContent');
                me.filterKanbanStates(editorWindow.document);
            }
        });
    });
};
addJQuery(hideBadRows);
