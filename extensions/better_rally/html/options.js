(function () {

    var _builds = ['master-alm-continuous',
        'master-alm-continuous-guitest',
        'master-alm-continuous-java',
        'master-alm-continuous-js',
        'master-flaky-finder-continuous'
    ];

    localStorage["rally_utils.interesting_builds"] = JSON.stringify(_builds);

})();