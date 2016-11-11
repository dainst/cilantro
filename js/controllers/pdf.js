'use strict';
/**
 * 
 * controller for journal-specific step 2 with pdf analysis
 * 
 * 
 */


angular

.module('controller.pdf', [])

.controller('pdf', ['$scope', '$log', 'journalmaster', 'settings', 'pimportws', function($scope, $log, journalmaster, settings, pimportws) {

	var master = $scope.master = journalmaster.control;
	
	$scope.master.title = 'Analyze PDF';
	$scope.status = "Start";
	$scope.statusError = false;
	
	master.fileUrl = '';
	
	function message(msg, isError) {
		$scope.statusError = isError || false;
		$scope.status = msg;
		$log.log(msg);
	}
	
	function refresh() {
		//$log.log('refresh');
		$scope.$apply();
	}
	
	/*
	var BASE64_MARKER = ';base64,';

	function convertDataURIToBinary(dataURI) {
	  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
	  var base64 = dataURI.substring(base64Index);
	  var raw = window.atob(base64);
	  var rawLength = raw.length;
	  var array = new Uint8Array(new ArrayBuffer(rawLength));

	  for(var i = 0; i < rawLength; i++) {
	    array[i] = raw.charCodeAt(i);
	  }
	  return array;
	}
	*/
	
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
			
			//master.PDF.documentPath = doc;
				  
			/*
			pimportws.get('getFromRepository', {file: doc}, function(response) {
				
				//console.log(response);
				
				if (typeof response === "object") {
					return;
				}

				var ta = convertDataURIToBinary(response)

				master.PDF.api.getDocument(ta).then(function(pdf) {
					master.PDF.object = pdf;			
					master.start();		
				}, function(err) {
					// ugly but handy
					alert(err);
					location.reload(); 
				});
				
				
			});
			*/
			
			// Fetch the PDF document from the URL using promises.
			
			var url = settings.rep_url  + doc;
			
			master.PDF.api.getDocument(url).then(function(pdf) {
				master.PDF.object = pdf;			
				master.start();
				master.fileUrl = url;
			}, function(err) {
				// ugly but handy
				alert(err);
				//location.reload(); 
			});


		};
		
		master.getDocument($scope.master.journal.importFilePath);
		
	});
}]);