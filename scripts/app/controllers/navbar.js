define(['angular', './main', '../services/all'],
	function (angular, controllerModule, services) {
	
		controllerModule
		.controller('NavbarController', ['$scope', 'PageManipulationService', 
		function($scope, PageManipulationService) {
		
			$scope.reset = function(){
				PageManipulationService.scrollTo("body", 'fast');
			};
			
		}]);
	
	});