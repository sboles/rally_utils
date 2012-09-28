document.addEventListener("DOMNodeInserted", function (event) {
    if ($('.sp-label').length == 0) {
        return;
    }

    $('.sp-label').css('font-size', '1.5em');
    $('.sp-label').click(function () {
        location.href = "https://rally1.rallydev.com/#/6895507658d/custom/3173483378";
    });
});

