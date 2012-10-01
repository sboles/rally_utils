chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.refresh) {
            location.reload();
        }
    }
);

chrome.extension.sendMessage({is_toggled_on:true}, function (response) {
    if (response.is_toggled_on) {
        function injectJs(links) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = links[0];
            var callback = function () {
                if (links.length > 1) {
                    injectJs(links.slice(1));
                }
            };
            script.addEventListener('load', callback, false);

            (document.head || document.body || document.documentElement).appendChild(script);
        }
        injectJs([
            chrome.extension.getURL("js/lib/jquery-1.8.2.min.js"),
            chrome.extension.getURL("js/editors/remove_bad_fields.js"),
            chrome.extension.getURL("js/editors/remove_unused_story_menu_items.js"),
            chrome.extension.getURL("js/editors/filter_kanban_states.js"),
            chrome.extension.getURL("js/kanban/expand_all_kanban_cards.js"),
            chrome.extension.getURL("js/kanban/add_claim_button_to_kanban_cards.js"),
            chrome.extension.getURL("js/kanban/add_implemented_in_field_to_cards.js"),
            chrome.extension.getURL("js/kanban/setup_kanban_rally_link.js"),
            chrome.extension.getURL("js/kanban/hide_titlebar.js"),
            chrome.extension.getURL("js/kanban/add_policy_fields_to_cards.js"),
            chrome.extension.getURL("js/navigation/trim_navigation_menu.js")
        ]);
    }
});
