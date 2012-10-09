(function () {
    var KANBAN_COLUMN_POLICIES = {
        "Building":[
            {
                displayName:'State',
                modelName:'ScheduleState'
            },
            {
                displayName:'Feature Toggle Status',
                modelName:'FeatureToggleStatus'
            },
            {
                displayName:'Impact On Ops',
                modelName:'ImpactonOps'
            },
            {
                displayName:'Data Migration',
                modelName:'DataMigration'
            }
        ],
        "Accepting":[
            {
                displayName:'State',
                modelName:'ScheduleState'
            }
        ],
        "Testing":[
            {
                displayName:'State',
                modelName:'ScheduleState'
            }
        ],
        "Merging":[
            {
                displayName:'Release',
                modelName:'Release'
            }
        ]
    };

    var ALLOWED_VALUES = {
        "ScheduleState":[
            "Idea",
            "Defined",
            "In-Progress",
            "Completed",
            "Accepted",
            "Released"],
        "FeatureToggleStatus":[
            "",
            "No Feature Toggle",
            "Toggled Off",
            "Toggled On For Rally",
            "Private Beta",
            "Open Beta",
            "Toggled On For All",
            "GA (Toggle Removed)"
        ],
        "ImpactonOps": [
            "No Entry",
            "No Impact",
            "Cold Migration",
            "Hot Migration",
            "SOLR Rebuild",
            "Cassandra",
            "We need to talk"
        ]
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

    var policyFieldSelectChange = function () {
        var $select = $(this);
        $select.attr('disabled', true);
        var newValue = $select.val();
        var modelName = $($select.parents('p')[0]).data('model-name');
        var formattedId = getFormattedIdForCard($($select.parents('.card')[0]));

        queryForArtifact(formattedId, function (record) {
            record.set(modelName, newValue);
            record.save({callback:function () {
                $select.attr('disabled', false);
                var parent = $($select.parents('p')[0]);
                parent.find('.readOnly').text(newValue);

                showHidePolicyFieldEditorFromCard(parent);
            }});
        });
    };

    var showHidePolicyFieldEditor = function () {
        showHidePolicyFieldEditorFromCard($(this));
    };

    var showHidePolicyFieldEditorFromCard = function ($card) {
        $card.find('select').toggle();
        $card.find('.readOnly').toggle();
    };

    var addPolicyFieldsToCards = function (d) {
        $.each(KANBAN_COLUMN_POLICIES, function (column) {
            var $cards = $('.columnHeader:contains(' + column + ')', d).parents('.column').find('.card');
            $cards.each(function () {
                var $card = $(this);
                if ($card.find('.policyFields').length === 0) {
                    $card.find('.cardContent').append("<div style='display:none' class='policyFields'><hr/></div>");

                    var cardFormattedId = getFormattedIdForCard($(this));
                    queryForArtifact(cardFormattedId, function (record) {
                        $(KANBAN_COLUMN_POLICIES[column]).each(function (i, field) {
                            var initialValue = record.get(field.modelName);
                            var $policyHtml = $("<p style='margin-top:0;margin-bottom:0'>" +
                                "<strong>" + field.displayName + ":</strong> " +
                                "<span class='value readOnly'>" + initialValue + "</span>" +
                                "</p>");

                            $policyHtml.data('model-name', field.modelName);

                            if (ALLOWED_VALUES[field.modelName]) {
                                var $select = $("<select>");
                                $.each(ALLOWED_VALUES[field.modelName], function (i, allowedValue) {
                                    var $option = $("<option>");
                                    $option.val(allowedValue);
                                    $option.text(allowedValue);
                                    $select.append($option);
                                });

                                $select.val(initialValue);

                                $select.change(policyFieldSelectChange);
                                $select.hide();
                                $policyHtml.append($select);

                                $policyHtml.click(showHidePolicyFieldEditor);
                            }

                            $card.find('.policyFields').append($policyHtml);
                        });
                    });
                }
            });
        });
    };

    var findCardsMissingMoreButton = function (d) {
        return $('.card', d).filter(function () {
            return $(this).text().indexOf("Less...") === -1 && $(this).text().indexOf("More...") === -1;
        });
    };

    var moreButtonClicked = function () {
        var $policyFields = $($(this).parents('.card')[0]).find('.policyFields');
        if ($policyFields.is(":visible")) {
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