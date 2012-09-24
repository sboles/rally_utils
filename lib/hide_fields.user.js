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
    $(document).ready(function () {
        $('body').mouseover(function () {
            console.log("HELLO");
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
                "KanbanState",
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

            var rowsToHide = $('#detailContent tr').filter(function (index, row) {
                var shouldHide = false;
                $(FIELDS_TO_HIDE).each(function (i, field) {
                    shouldHide |= $(row).text().indexOf(field) !== -1;
                });

                return shouldHide;
            });

            $(rowsToHide).hide();
        });
    });
};

addJQuery(hideBadRows);