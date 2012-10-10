(function () {
    var setupSelectFromAllowedValues = function (allowedValues, initialValue, $policyHtml) {
        var $select = $("<select>");
        $.each(allowedValues, function (i, allowedValue) {
            var $option = $("<option>");
            $option.val(allowedValue.value);
            $option.text(allowedValue.displayValue);
            $select.append($option);
        });

        $select.val(initialValue);

        $select.change(policyFieldSelectChange);
        $select.hide();
        $policyHtml.append($select);

        $policyHtml.click(showHidePolicyFieldEditor);
    }

    var releasesStore = null;
    var getReleaseNamesFromStore = function (store) {
        var names = [];
        store.each(function (record) {
            names.push({displayValue:record.get("Name"), value:record.get("_ref")});
        });
        return names;
    };

    var releasesLoading = false;
    var getReleases = function (callback) {
        if (releasesLoading) {
            setTimeout(function () {
                getReleases(callback);
            }, 1000);
            return;
        }

        if (releasesStore) {
            callback(getReleaseNamesFromStore(releasesStore));
            return;
        }

        releasesLoading = true;
        Rally.data.ModelFactory.getModel({
            type:"Release",
            success:function (model) {
                releasesStore = Ext4.create("Ext.data.Store", {
                    fetch:["Name"],
                    model:model
                });
                releasesStore.load({callback:function () {
                    releasesLoading = false;
                    callback(getReleaseNamesFromStore(releasesStore));
                }});
            }
        });
    };

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
            {displayValue:"Idea", value:"Idea"},
            {displayValue:"Defined", value:"Defined"},
            {displayValue:"In-Progress", value:"In-Progress"},
            {displayValue:"Completed", value:"Completed"},
            {displayValue:"Accepted", value:"Accepted"},
            {displayValue:"Released", value:"Released"}
        ],
        "FeatureToggleStatus":[
            {displayValue:"", value:""},
            {displayValue:"No Feature Toggle", value:"No Feature Toggle"},
            {displayValue:"Toggled Off", value:"Toggled Off"},
            {displayValue:"Toggled On For Rally", value:"Toggled On For Rally"},
            {displayValue:"Private Beta", value:"Private Beta"},
            {displayValue:"Open Beta", value:"Open Beta"},
            {displayValue:"Toggled On For All", value:"Toggled On For All"},
            {displayValue:"GA (Toggle Removed)", value:"GA (Toggle Removed)"}
        ],
        "ImpactonOps":[
            {displayValue:"No Entry", value:"No Entry"},
            {displayValue:"No Impact", value:"No Impact"},
            {displayValue:"Cold Migration", value:"Cold Migration"},
            {displayValue:"Hot Migration", value:"Hot Migration"},
            {displayValue:"SOLR Rebuild", value:"SOLR Rebuild"},
            {displayValue:"Cassandra", value:"Cassandra"},
            {displayValue:"We need to talk", value:"We need to talk"}
        ],
        "Release":getReleases
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
        var newValueDisplayValue = $select.find(':selected').text();

        var modelName = $($select.parents('p')[0]).data('model-name');
        var formattedId = getFormattedIdForCard($($select.parents('.card')[0]));

        queryForArtifact(formattedId, function (record) {
            record.set(modelName, newValue);
            record.save({callback:function () {
                $select.attr('disabled', false);
                var parent = $($select.parents('p')[0]);
                parent.find('.readOnly').text(newValueDisplayValue);

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
                            if (Ext4.isObject(initialValue)) {
                                initialValue = record.get(field.modelName)["_refObjectName"];
                            }

                            var $policyHtml = $("<p style='margin-top:0;margin-bottom:0'>" +
                                "<strong>" + field.displayName + ":</strong> " +
                                "<span class='value readOnly'>" + initialValue + "</span>" +
                                "</p>");

                            $policyHtml.data('model-name', field.modelName);

                            var allowedValuesLookup = ALLOWED_VALUES[field.modelName];
                            if (allowedValuesLookup) {
                                if (Ext4.isArray(allowedValuesLookup)) {
                                    setupSelectFromAllowedValues(allowedValuesLookup, initialValue, $policyHtml);
                                }
                                else {
                                    allowedValuesLookup(function (allowedValues) {
                                        setupSelectFromAllowedValues(allowedValues, initialValue, $policyHtml);
                                    });
                                }
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