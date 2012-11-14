(function () {
    var DEFAULT_POLL_INTERVAL = 2000;

    var waitForElementsAndExecute = function (selectors, command, d) {
        d = d || document;
        var pollingId = setInterval(function () {
            var shouldExecute = true;
            _.each(selectors, function (selector) {
                if ($(selector, d).length === 0) {
                    shouldExecute = false;
                }
            });

            if (shouldExecute) {
                var completed = command(d);
                if (completed) {
                    clearInterval(pollingId);
                }
            }
        }, DEFAULT_POLL_INTERVAL);
    };

    var pollForever = function (command, interval) {
        command();
        setInterval(command, interval || DEFAULT_POLL_INTERVAL);
    };

    var waitForIframeElementsAndExecute = function (selectors, command) {
        waitForElementsAndExecute(['iframe.rally-html'], function () {
                var iframe_document = $('iframe.rally-html')[0].contentDocument;
                var shouldExecute = true;
                _.each(selectors, function (selector) {
                    if ($(selector, iframe_document).length === 0) {
                        shouldExecute = false;
                    }
                });
                if (shouldExecute) {
                    command(iframe_document);
                }
                return false;
            }
        );
    };

    window.RallyUtil = window.RallyUtil || {};
    RallyUtil.pollForever = pollForever;
    RallyUtil.waitForElementsAndExecute = waitForElementsAndExecute;
    RallyUtil.waitForIframeElementsAndExecute = waitForIframeElementsAndExecute;
})();


