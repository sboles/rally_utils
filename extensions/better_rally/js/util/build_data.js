(function () {
    var _buildData = {};
    var _buildDefinitions = {};
    var _interestingBuilds = JSON.parse(localStorage['rally_utils.interesting_builds']);

    var _fetchBuildDefinitions = function () {
        _.each(_interestingBuilds, function (buildName) {
            _buildDefinitions[buildName] ||
            Rally.data.ModelFactory.getModel({
                type:'BuildDefinition',
                success:function (model) {
                    model.find({
                        filters:[
                            {
                                property:'Name',
                                value:buildName
                            }
                        ],
                        callback:function (buildDefinition) {
                            _buildDefinitions[buildName] = buildDefinition;
                        }
                    });
                }
            });
        });
    };

    var _fetchBuildData = function (oid, callback) {
        Rally.data.ModelFactory.getModel({
            type:"Build",
            success:function (model) {
                model.find({
                    filters:[
                        {
                            property:'ObjectID',
                            value:oid
                        }
                    ],
                    callback:callback
                });
            }
        });
    };

    var _refreshBuildData = function () {
        _.each(_buildDefinitions, function (buildDefinition, buildDefinitionName) {
            _buildData[buildDefinitionName] = _buildData[buildDefinitionName] || {};
            _buildData[buildDefinitionName]['lastBuildStatus'] = buildDefinition.get('LastStatus');
            _buildData[buildDefinitionName]['lastBuildObjectID'] = buildDefinition.get('LastBuild').ObjectID;
            _fetchBuildData(_buildData[buildDefinitionName]['lastBuildObjectID'], function (buildModel) {
                _buildData[buildDefinitionName]['lastBuildNumber'] = buildModel.get('Number');
            });
        });
    };

    var _refreshInterestingBuilds = function () {
        _fetchBuildDefinitions();
        _refreshBuildData();
    };

    var _fetchBuildStatusData = function () {
        return _buildData;
    };

    window.RallyUtil = window.RallyUtil || {};
    RallyUtil.fetchBuildStatusData = _fetchBuildStatusData;

    RallyUtil.pollForever(_refreshInterestingBuilds, 300000);
    setTimeout(_refreshInterestingBuilds, 5000);

})();