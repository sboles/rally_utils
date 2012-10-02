(function () {
    var shortenDisplayNames = function (d) {
        if ($('.cardOwnerName', d).length === 0) {
            return;
        }

        $('.cardOwnerName', d).each(function () {
            var spaceIndex = $(this).text().indexOf(" ");
            if (spaceIndex !== -1) {
                var shortText = $(this).text().substring(0, spaceIndex);
                $(this).text(shortText);
            }
        });
    };

    setInterval(function (event) {
        if ($('iframe').length == 0) {
            return;
        }

        $('iframe').each(function () {
            shortenDisplayNames($(this)[0].contentDocument);
        });
    }, 2000);
})();