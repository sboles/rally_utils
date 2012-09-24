// ==UserScript==
// @match https://rally1.rallydev.com/*
// ==/UserScript==

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
        var FIELDS_TO_HIDE = [
            "Tags",
            "State",
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

        var elementsToHide = [];
        $(d).find('#' + container_id + ' tr').each(function (index, row) {
            var shouldHide = false;
            var header = $(row).find('th');
            var labelText = header.text();
            $(FIELDS_TO_HIDE).each(function (i, field) {
                shouldHide |= labelText.indexOf(field) !== -1;
            });

            if (shouldHide) {
                elementsToHide.push(header[0]);
                elementsToHide.push(header.next()[0]);
            }
        });

        $(elementsToHide).hide();
    };

    $(document).ready(function () {
        $('body').mouseover(function () {
            me.removeBadFields(document, 'detailContent');
            if (editorWindow) {
                me.removeBadFields(editorWindow.document, 'formContent');
            }
        });
    });
};

addJQuery(hideBadRows);