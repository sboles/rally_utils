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
function requestJson (opt, callback) {
  var jenkinsInfo = u.parse(jenkinsBase);
  var options = {
    hostname: jenkinsInfo.hostname,
    port: jenkinsInfo.port,
    path: opt.jenkinsPath + 'api/json',
    method: 'GET'
  };

  var req = http.request(options);

  req.on('response', function(res) {
    res.setEncoding('utf8');

    var body = "";
    res.on('data', function (chunk) {
      body += chunk;
    });

    res.on('end', function () {
      callback(JSON.parse(body));
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.end();
}


function getLastSuccessfulBuildUrl (json) {
  return json.lastSuccessfulBuild.url;
}

function isBuildSuccessful (buildObj) {
  return _.all(buildObj.subBuilds, function (subBuildObj) {
    return subBuildObj.result === 'SUCCESS';
  });
}

function requestCommit (path, callback) {
  requestJson({jenkinsPath: path}, function (json) {
    var item = _.find(json.actions, function (item) {
      return item.hasOwnProperty('lastBuiltRevision');
    });
    callback(item.lastBuiltRevision.SHA1);
  });
}

function requestGreenAppCatalogAndSdkPaths (json, callback) {
  var successfulBuilds = _.filter(json.builds, isBuildSuccessful);
  findMostRecentBump(successfulBuilds, callback);
}

function findMostRecentBump (builds, callback) {
  var build = _.first(builds);
  var jenkinsPath = u.parse(build.url).path;
  requestJson({jenkinsPath: jenkinsPath}, function (json) {
    var changeSets = json.changeSet.items;
    var matches;
    var msg;
    
    if (changeSets.length > 0) {
      msg = json.changeSet.items[0].msg;
      matches = msg.match(/bumping app catalog to (\d+).*sdk\-(\d+)/);
    }

    if (!matches) {
      findMostRecentBump(_.rest(builds), callback)
    } else {
      callback({
        appCatalogPath: jenkinsPaths.appCatalog + matches[1] + '/',
        appsdkBridgePath: jenkinsPaths.appsdkBridge + matches[2] + '/'
      });
    }
  });
}

function checkDoneAndPrint (obj) {
  var isDone = _.all(obj, function (o) {
    return !!o.commit;
  });

  if (!isDone) {
    return;
  }

  _.each(obj, function (o) {
    console.log([o.message, o.commit, '(' + jenkinsBase + o.path + ')'].join(' '));
  });
}


/** ----------- main ----------- */
function main () {

  var output = {
    alm: {
      message: '[alm]'
    },
    appCatalog: {
      message: '[app-catalog]'
    },
    appsdk: {
      message: '[appsdk]'
    }
  }

  requestJson({jenkinsPath: jenkinsPaths.alm}, function (json) {
    var url = getLastSuccessfulBuildUrl(json);
    var jenkinsPath = u.parse(url).path;

    output.alm.path = jenkinsPath;
    requestCommit(jenkinsPath, function (commit) {
      output.alm.commit = commit;
    });

    requestGreenAppCatalogAndSdkPaths(json, function (paths) {
      output.appCatalog.path = paths.appCatalogPath;
      output.appsdk.path = paths.appsdkBridgePath;

      requestCommit(paths.appCatalogPath, function (commit) {
        output.appCatalog.commit = commit;
        checkDoneAndPrint(output);
      });

      requestCommit(paths.appsdkBridgePath, function (commit) {
        output.appsdk.commit = commit;
        checkDoneAndPrint(output);
      });
    });
  });

}

module.exports = main;