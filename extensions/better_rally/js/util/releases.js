(function () {
    var releasesStore = null;
    var getReleaseNamesFromStore = function (store) {
        var releases = [
        ];
        store.each(function (record) {
            var name = record.get("Name");
            releases.push({displayValue:name, value:record.get("_ref"), project: record.get("Project")._refObjectName});
        });

        return trimReleasesToFuture(releases);
    };

    var trimReleasesToFuture = function (releases) {
        var today = new Date();

        var trimmedReleases = [
            {displayValue:'No Entry', value:''}
        ];
        Ext4.Array.forEach(releases, function (release) {
            try {
                var parsedReleaseDate = Date.parse(release.displayValue);
                if (release.project == "Crazy Train" && new Date(parsedReleaseDate) >= (today - 60*60*24*1000)) {
                    trimmedReleases.push(release);
                }
            }
            catch (ignored) {
            }
        });
        Ext4.Array.forEach(releases, function (release) {
            var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
            if (release.project == "Crazy Train" && release.displayValue.search('Crazy Train') >= 0 && release.displayValue.search(monthNames[today.getMonth()]) >= 0) {
                trimmedReleases.push(release);
            }
        });
        return trimmedReleases;
    };

    var releasesLoading = false;

    window.RallyUtil = window.RallyUtil || {};
    window.RallyUtil.getReleases = function (callback) {
        if (releasesLoading) {
            setTimeout(function () {
                RallyUtil.getReleases(callback);
            }, 1000);
            return;
        }

        if (releasesStore) {
            callback(getReleaseNamesFromStore(releasesStore));
            return;
        }

        releasesLoading = true;
        Rally.data.ModelFactory.getModel({
            type:"Release",
            success:function (model) {
                releasesStore = Ext4.create("Ext.data.Store", {
                    fetch:["Name"],
                    pageSize:100,
                    model:model
                });
                releasesStore.load({callback:function () {
                    releasesLoading = false;
                    callback(getReleaseNamesFromStore(releasesStore));
                }});
            }
        });
    };
})();
