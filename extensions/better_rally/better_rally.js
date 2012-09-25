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
            "Notes",
            "Change Description"];

        var DEFECT_FIELDS_TO_HIDE = [
            "Target Build",
            "Target Date"
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

    me.filterKanbanStates = function (document) {
        var VALID_VALUES = ['Ready', 'Building', 'Testing', 'Completed', 'Accepting', 'Merging', 'Released'];
        $kanbanStateSelect = $(document).find('#custom_attribute_442934705');
        var optionsToHide = $kanbanStateSelect.find('option').filter(function (i) {
            return $.inArray($(this).val(), VALID_VALUES) === -1;
        });
        optionsToHide.remove();
    };

    $(document).ready(function () {
        $('body').mouseover(function () {
            me.removeBadFields(document, 'detailContent');
            if (editorWindow) {
                me.removeBadFields(editorWindow.document, 'formContent');
                me.filterKanbanStates(editorWindow.document);
            }
        });
    });
};
addJQuery(hideBadRows);
