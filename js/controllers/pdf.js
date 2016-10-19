'use strict';
/**
 * 
 * controller for journal-specific step 2 with pdf analysis
 * 
 * 
 */


angular

.module('controller.pdf', [])

.controller('pdf', ['$scope', '$log', 'journalmaster', 'settings', function($scope, $log, journalmaster, settings) {

	var master = $scope.master = journalmaster.control;
	
	$scope.master.title = 'Analyze PDF';
	$scope.status = "Start";
	$scope.statusError = false;
	
	function message(msg, isError) {
		$scope.statusError = isError || false;
		$scope.status = msg;
		$log.log(msg);
	}
	
	function refresh() {
		//$log.log('refresh');
		$scope.$apply();
	}
		
	
	require.config({paths: {'pdfjs': 'inc/pdf.js'}});
	
	require(['pdfjs/display/api', 'pdfjs/display/global'], function(pdfjs_api, pdfjs_global) {
					
		master.PDF = {
			"api": pdfjs_api,
			"global": pdfjs_global,
			"data": null,
			'object': null,
		}
		
		master.PDF.global.PDFJS.workerSrc = 'js/other/pdfjs_worker_loader.js';
			
		master.message = message;
		master.refresh = refresh;
		
		message('Ready to analyze');
	
		master.getDocument = function(doc) {
			message("get Document: " + doc);
			
			master.PDF.documentPath = doc;
				  
			// Fetch the PDF document from the URL using promises.
			
			master.PDF.api.getDocument(doc).then(function(pdf) {
				master.PDF.object = pdf;			
				master.start();		
			}, function(err) {
				// ugly but handy
				alert(err);
				location.reload(); 
			});
		};
		
		master.getDocument(settings.rep_url + $scope.master.journal.importFilePath);
		
	});
}]);