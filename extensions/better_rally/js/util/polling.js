(function () {
    var waitForElementsAndExecute = function (selectors, command) {
        var pollingId = setInterval(function () {
            var shouldExecute = true;
            _.each(selectors, function (selector) {
                if ($(selector).length === 0) {
                    shouldExecute = false;
                }
            });

            if (shouldExecute) {
                var completed = command();
                if (completed) {
                    clearInterval(pollingId);
                }
            }
        }, 2000);
    };

    var waitForIframeElementsAndExecute = function (selectors, command) {
        waitForElementsAndExecute(['iframe.rally-html'], function () {
                var iframe_document = $('iframe.rally-html')[0].contentDocument;
                waitForElementsAndExecute(selectors, command(iframe_document));
                return true;
            }
        );
    };

    window.RallyUtil = window.RallyUtil || {};
    RallyUtil.waitForElementsAndExecute = waitForElementsAndExecute;
    RallyUtil.waitForIframeElementsAndExecute = waitForIframeElementsAndExecute;
})();


