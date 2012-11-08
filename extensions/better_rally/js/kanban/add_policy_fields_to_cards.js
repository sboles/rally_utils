(function () {
    var setupSelectFromAllowedValues = function (allowedValues, initialDisplayValue, $policyHtml) {
        var initialValue = null;
        var $select = $("<select>");
        $.each(allowedValues, function (i, allowedValue) {
            var $option = $("<option>");
            $option.val(allowedValue.value);
            $option.text(allowedValue.displayValue);

            if (allowedValue.displayValue === initialDisplayValue) {
                initialValue = allowedValue.value;
            }

            $select.append($option);
        });

        $select.val(initialValue);

        $select.change(policyFieldSelectChange);
        $select.hide();
        $policyHtml.append($select);

        $policyHtml.click(showHidePolicyFieldEditor);
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
            }
        ],
        "Peer Review":[
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
            },
            {
                displayName:'Impact On Ops',
                modelName:'ImpactonOps'
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
        "Release":RallyUtil.getReleases
    };

    var policyFieldSelectChange = function () {
        var $select = $(this);
        $select.attr('disabled', true);
        var newValue = $select.val();
        var newValueDisplayValue = $select.find(':selected').text();

        var modelName = $($select.parents('p')[0]).data('model-name');
        var formattedId = RallyUtil.getFormattedIdForCard($($select.parents('.card')[0]));

        RallyUtil.queryForArtifact(formattedId, function (record) {
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
                    $card.find('.cardContent').append("<div style='margin-top:7px' class='policyFields'></div>");

                    var cardFormattedId = RallyUtil.getFormattedIdForCard($(this));
                    RallyUtil.queryForArtifact(cardFormattedId, function (record) {
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

    RallyUtil.waitForIframeElementsAndExecute([], addPolicyFieldsToCards);
})();