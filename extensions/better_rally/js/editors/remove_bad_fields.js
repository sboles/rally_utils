(function () {

    var STORY_FIELDS_TO_HIDE = [
        "ALM Kanban State",
        "Code Review Link",
        "Code Review",
        "test",
        "Tags",
        "Blocked",
        "Iteration",
        "Plan Est",
        "Task Est",
        "Actual",
        "To Do",
        "Affects User Learning",
        "Anticipated Toggle On Date",
        "Customer Development Kanban",
        "date",
        "Due Date",
        "External Link",
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

    var hideBadFieldsInDocument = function (w, container_id) {

        if (_.isUndefined(w)) {
            return;
        }

        var d = w.document;

        var elementsToHide = [];
        $(d).find('#' + container_id + ' tr').each(function (index, row) {
            var shouldHide = false;
            var headers = $(row).find('th');
            headers.each(function (i, header) {
                var $header = $(header);
                var labelText = $header.text();
                labelText = $.trim(labelText.substring(0, labelText.indexOf(":")));

                $(FIELDS_TO_HIDE).each(function (i, field) {
                    shouldHide |= labelText === field;
                });

                if (shouldHide) {
                    elementsToHide.push(header);
                    elementsToHide.push($header.next()[0]);
                }
            });
        });

        $(elementsToHide).hide();
    };

    RallyUtil.pollForever(function () {
        hideBadFieldsInDocument(window, 'detailContent')
    });

    RallyUtil.pollForever(function () {
        hideBadFieldsInDocument(editorWindow, 'formContent')
    });

})();