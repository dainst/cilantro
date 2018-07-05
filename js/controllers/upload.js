angular.module('controller.upload', ['ngFileUpload'])

.controller('upload', ['$scope', '$rootScope','Upload', '$timeout', 'settings', 'webservice', 'messenger', 'staging_dir',
	function ($scope, $rootScope, Upload, $timeout, settings, webservice, messenger, staging_dir) {


		$scope.uploadedFiles = [];
		$scope.uploadedFoldersAndFiles = [];

		function updateUploadedFoldersAndFiles(files){
			let folders = [];
			files.forEach(function(file){
				if (file.path){
					let folderName = file.path.split('/',1)[0];
					if (!folders.includes(folderName)){
						folders.push(folderName);
						$scope.uploadedFoldersAndFiles.push("[DIR] " + folderName);
					}
				} else {
					$scope.uploadedFoldersAndFiles.push(file.name);
				}
			});
		}

		$scope.dropFile = function(f)  {
			console.log(f);
		};

		$scope.uploadFiles = function(files, uploadTask, callback) {

		if (!files || !files.length) {
			$scope.invalidFiles = true;
			return;
		}


		//working with ngFileUpload directive
		Upload.upload({
			url: 'http://localhost:5000/staging',
			method: 'POST',
			headers: {"Content-Type" : 'multipart/form-data'},
			data:files,


		}).success(function(data, status, headers, config){
			if (data.success){
				$scope.progress = 0;
				$scope.uploadedFiles = $scope.uploadedFiles.concat(files);
				updateUploadedFoldersAndFiles(files);
				$scope.invalidFiles = false;
				console.log("files", files);
				webservice.get('staging')
                                .then((stagingFolder) => {
                                    console.log("stagingFolder", stagingFolder);
                                    $scope.staging_dir.update(stagingFolder);
                                    $rootScope.$broadcast('refreshView');
                                })
			}; 
		}).error(function(data, status, headers, config){
			messenger.error("Upload failed.");
      		$scope.progress = 0;
      		console.log("Upload failed with Status ", status);
      		console.log("Upload headers:", headers);

		}).progress(function(event){
			$scope.progress = Math.min(100, parseInt(100.0 * event.loaded / event.total));
		});
 
	$scope.uploadCSV = function(files, callback) {
		$scope.uploadFiles(files, 'uploadCSV', callback)
	}
}

}]).filter('trustHtml', function($sce) {
	return function(val) {
		return $sce.trustAsHtml(val);
	};
});
