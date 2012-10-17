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


    window.RallyUtil = window.RallyUtil || {};
    RallyUtil.waitForElementsAndExecute = waitForElementsAndExecute;
})();


