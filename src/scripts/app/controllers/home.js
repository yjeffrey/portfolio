define(['angular', './main'],
	function (angular, controllerModule) {
	
		controllerModule
		.controller('HomeController', ['$scope', '$state', function($scope, $state) {
			
			var demos = ['base.demo.sudoku', 
				'base.demo.quadrature',
				'base.demo.modulo',
				'base.demo.pi'];
			$scope.goToRandomDemo = function(){
				$state.go(demos[Math.floor(Math.random() * demos.length)]);
			};
			
		}]);
	
	});