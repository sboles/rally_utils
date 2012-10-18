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
        interval = interval || DEFAULT_POLL_INTERVAL;
        setInterval(command, interval);
    };

    var waitForIframeElementsAndExecute = function (selectors, command) {
        waitForElementsAndExecute(['iframe.rally-html'], function () {
                var iframe_document = $('iframe.rally-html')[0].contentDocument;
                waitForElementsAndExecute(selectors, command, iframe_document);
                return true;
            }
        );
    };

    window.RallyUtil = window.RallyUtil || {};
    RallyUtil.pollForever = pollForever;
    RallyUtil.waitForElementsAndExecute = waitForElementsAndExecute;
    RallyUtil.waitForIframeElementsAndExecute = waitForIframeElementsAndExecute;
})();


