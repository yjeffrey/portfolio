define(['angular', './main'],
	function (angular, controllerModule, services) {
	
		controllerModule
		.controller('NavbarController', ['$scope', 'PageManipulationService', 
			'$state', 'DemoService', 
		function($scope, PageManipulationService, $state, DemoService) {
		
			$scope.reset = function(){
				PageManipulationService.scrollTo("body", 'fast');
			};
		
		}]);
	
	});