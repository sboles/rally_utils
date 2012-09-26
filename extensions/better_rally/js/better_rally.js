chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.refresh) {
            location.reload();
        }
    }
);

chrome.extension.sendMessage({is_toggled_on:true}, function (response) {
    if (response.toggled_on) {
        function injectJs(links) {
            var script = document.createElement("script");
            script.type="text/javascript";
            script.src=links[0];
            script.addEventListener('load', function () {
                var script = document.createElement("script");
                script.src = links[1];
                document.body.appendChild(script);
            }, false);

            (document.head || document.body || document.documentElement).appendChild(script);
        }

        injectJs([
            chrome.extension.getURL("js/jquery-1.8.2.min.js"),
            chrome.extension.getURL("js/main.js")
        ]);
    }
});
