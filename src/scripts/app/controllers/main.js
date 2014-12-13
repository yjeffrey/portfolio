define(['angular', '../services/all'],
	function (angular, services) {
		var controllerModule = angular.module('controller', [services.name]);
		console.log("Controllers module initalized");
		
		return controllerModule;
	});