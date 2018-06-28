angular
.module("module.repository", [])
.factory("repository", ["messenger", function(messenger) {

	let repository = {};
	repository.list = {};
    repository.tree = [];

	function addPaths(tree) {
        tree.path = (this.path || "") + tree.name;
        if (tree.type === "directory") {
            tree.contents.forEach(addPaths.bind({path:tree.path + '/'}))
        }
    }

    function flattenTree(tree) {
        repository.list[tree.path] = tree;
        if (tree.type === "directory") {
            tree.contents.map(flattenTree);
        }
    }

	repository.update = function(loaded_repository) {
		repository.tree = loaded_repository;
		repository.tree.forEach(addPaths);
        repository.tree.forEach(flattenTree);
		console.log("files-tree", repository.tree);
		console.log("files-list", repository.list);
	};

	repository.getFirstFile = function() {
		if (repository.list.length < 1) {
			return null;
		}
		let i = -1;
		while (i++ < repository.list.length) {
			if (repository.list[i].type === "file") {
				return repository.list[i];
			}
		}
	};

	repository.getFileInfo = function(path) {
		if (angular.isUndefined(repository.list[path])) {
            messenger.error(path + ' is not found in repository');
            return;
        }
		return repository.list[path];
	};

	return (repository);

}]);