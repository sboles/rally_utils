chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.refresh) {
            location.reload();
        }
    }
);

chrome.extension.sendMessage({is_toggled_on:true}, function (response) {
    if (response.toggled_on) {
        function injectJs(link) {
            var scr = document.createElement("script");
            scr.type="text/javascript";
            scr.src=link;
            (document.head || document.body || document.documentElement).appendChild(scr);
        }

        injectJs(chrome.extension.getURL("js/jquery-1.8.2.min.js"));
        injectJs(chrome.extension.getURL("js/main.js"));
    }
});
