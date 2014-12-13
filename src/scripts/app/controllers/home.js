define(['angular', './main'],
	function (angular, controllerModule) {

		controllerModule
		.controller('HomeController', ['$scope', '$state', 'DemoService', 
			function($scope, $state, DemoService) {

				$scope.goToRandomDemo = function(){
					$state.go(DemoService.getRandomDemo());
				};

			}]);
	});