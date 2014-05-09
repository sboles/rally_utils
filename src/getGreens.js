var http = require('http');
var _ = require('lodash');
var u = require('url');

/** ----------- global data ----------- */
var jenkinsBase = 'http://alm-build:8080';
var jenkinsPaths = {
    alm: '/hudson/job/alm/',
    appCatalog: '/hudson/job/master-app-catalog-continuous/',
    appsdkBridge: '/hudson/job/appsdk-alm-bridge/'
};


/** ----------- functions ----------- */
function jenkinsAjax(opt, callback) {
    var jenkinsInfo = u.parse(jenkinsBase);
    var options = {
        hostname: jenkinsInfo.hostname,
        port: jenkinsInfo.port,
        path: opt.jenkinsPath + 'api/json',
        method: 'GET'
    };

    var req = http.request(options);

    req.on('response', function (res) {
        res.setEncoding('utf8');

        var body = "";
        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            callback(JSON.parse(body));
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
}


function getLastSuccessfulBuildUrl(json) {
    return json.lastSuccessfulBuild.url;
}

function isBuildFailure(buildObj) {
    return _.any(buildObj.subBuilds, function (subBuildObj) {
        return subBuildObj.result !== 'SUCCESS';
    });
}

function requestCommit(path, callback) {
    jenkinsAjax({jenkinsPath: path}, function (json) {
        var item = _.find(json.actions, function (item) {
            return item.hasOwnProperty('lastBuiltRevision');
        });
        callback(item.lastBuiltRevision.SHA1);
    });
}

function requestGreenAppCatalogAndSdkPaths(json, callback) {
    var buildsStartingWithLatestSuccess = _.rest(json.builds, isBuildFailure);
    findMostRecentBump(buildsStartingWithLatestSuccess, callback);
}

function findMostRecentBump(builds, callback) {
    var build = _.first(builds);
    var jenkinsPath = u.parse(build.url).path;
    jenkinsAjax({jenkinsPath: jenkinsPath}, function (json) {
        var bumps = getBumpsFromCommitMessage(json.changeSet.items);

        if (!bumps) {
            findMostRecentBump(_.rest(builds), callback)
        } else {
            callback({
                appCatalogPath: jenkinsPaths.appCatalog + bumps.appCatalog + '/',
                appsdkBridgePath: jenkinsPaths.appsdkBridge + bumps.appsdkBridge + '/'
            });
        }
    });
}

function getBumpsFromCommitMessage(changeSets) {
    var msg;
    var match;
    for (var i in changeSets) {
        msg = changeSets[i].msg;
        matches = msg.match(/bumping app catalog to (\d+).*sdk\-(\d+)/);

        if (matches) {
            return {
                appCatalog: matches[1],
                appsdkBridge: matches[2]
            }
        }
    }

    return null;
}

function executeCallbackIfDone(obj, callback) {
    var isDone = _.all(obj, function (o) {
        return !!o.commit;
    });

    if (!isDone) {
        return;
    }

    callback(obj);
}


/** ----------- exports ----------- */
function getGreens(callback) {

    var output = {
        alm: {
            message: 'alm ->'
        },
        appCatalog: {
            message: 'app-catalog ->'
        },
        appsdk: {
            message: 'appsdk ->'
        }
    };

    jenkinsAjax({jenkinsPath: jenkinsPaths.alm}, function (json) {
        var url = getLastSuccessfulBuildUrl(json);
        var jenkinsPath = u.parse(url).path;

        output.alm.path = jenkinsPath;

        requestCommit(jenkinsPath, function (commit) {
            output.alm.commit = commit;
            executeCallbackIfDone(output, callback);
        });

        requestGreenAppCatalogAndSdkPaths(json, function (paths) {
            output.appCatalog.path = paths.appCatalogPath;
            output.appsdk.path = paths.appsdkBridgePath;

            requestCommit(paths.appCatalogPath, function (commit) {
                output.appCatalog.commit = commit;
                executeCallbackIfDone(output, callback);
            });

            requestCommit(paths.appsdkBridgePath, function (commit) {
                output.appsdk.commit = commit;
                executeCallbackIfDone(output, callback);
            });
        });
    });

}

function printOutput(obj) {
    var output = ['Latest Greens:'];
    _.each(obj, function (o) {
        output.push([o.message, o.commit, '(' + jenkinsBase + o.path + ')'].join(' '));
    });
    output.push('');
    console.log(output.join('\n'));
}

module.exports = {
    getGreens: getGreens,
    printOutput: printOutput
};