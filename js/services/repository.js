angular
.module("module.repository", [])
.factory("repository", ['journal', function(journal) {

	var repository = {};
	repository.list = [];

	repository.update = function (loaded_repository) {
		repository.list = loaded_repository;
		console.log(repository.list);
	}

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
	}

	repository.getFileInfo = function(path) {
		if (!path) {
			return;
		}
		// not elegant, but hey okay
		for (let i = 0; i < repository.list.length; i++) {
			if (repository.list[i].path === path) {
				return repository.list[i];
			}
		}
		messenger.alert(path + ' is not found in repository');
	}

	return (repository);

}]);