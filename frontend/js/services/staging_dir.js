angular
.module("module.stagingDir", [])
.factory("stagingDir", ["messenger", function(messenger) {

    let staging_dir = {};
    staging_dir.list = {};
    staging_dir.tree = [];

    function addPaths(tree) {
        tree.path = (this.path || "") + tree.name;
        if (tree.type === "directory") {
            tree.contents.sort(natSort).forEach(addPaths.bind({path: tree.path + '/'}))
        }
    }

    function natSort(a, b) {
        console.log("|",a,b);
        return a.name.localeCompare(b.name);
    }

    function flattenTree(tree) {
        staging_dir.list[tree.path] = tree;
        if (tree.type === "directory") {
            tree.contents.map(flattenTree);
        }
    }

    staging_dir.update = function(loaded_repository) {
        staging_dir.tree = loaded_repository;
        staging_dir.tree.sort(natSort).forEach(addPaths);
        staging_dir.tree.forEach(flattenTree);
        console.log("files-tree", staging_dir.tree);
        console.log("files-list", staging_dir.list);
    };

    staging_dir.getFirstFile = function() {
        if (staging_dir.list.length < 1) {
            return null;
        }
        let i = -1;
        while (i++ < staging_dir.list.length) {
            if (staging_dir.list[i].type === "file") {
                return staging_dir.list[i];
            }
        }
    };

    staging_dir.getFileInfo = function(path) {
        if (angular.isUndefined(staging_dir.list[path])) {
            messenger.error(path + ' is not found in staging_dir');
            return;
        }
        return staging_dir.list[path];
    };

    return (staging_dir);

}]);