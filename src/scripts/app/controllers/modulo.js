define(['mathjax', './main', '../services/all'],
	function (MathJax, controllerModule, services) {
	
		controllerModule
		.controller('ModuloController', ['$scope', 'PageManipulationService', 
		function($scope, PageManipulationService) {
			$scope.number = 5;
			$scope.moduloNumber = 2;
			$scope.state = 0;
			$scope.nBin = null;
			
			$scope.mod;
			
			$scope.load = function (number, moduloNumber){
				if(number == null || moduloNumber == null){
					return "Error";
				}
				var sN = number.toString(2);
				$scope.currentDigit = sN[0];
				$scope.nBin = sN.substring(1, sN.length);
				$scope.nBinParsed = "";
				
				$scope.value = number;
				$scope.state = 0;
				$scope.mod = moduloNumber;
				
				fsm($scope.mod);
			};
			
			$scope.load($scope.number, $scope.moduloNumber);
			
			$scope.step = function(){
				if($scope.currentDigit == null){
					return "Error";
				}
				var digit =	$scope.currentDigit;
				if(digit == '0'){
					$scope.state = ($scope.state * 2) % $scope.mod;
				}
				else if(digit == '1'){
					$scope.state = (($scope.state * 2) + 1) % $scope.mod;
				}
				$scope.currentDigit = $scope.nBin[0];
				$scope.nBin = $scope.nBin.substring(1, $scope.nBin.length);
				$scope.nBinParsed = $scope.nBinParsed + digit;
			}
			
			function fsm(number){
				var transitions = [];
				for(var i = 0; i < number; ++i){
					transitions.push({
						from: i,
						next: 0,
						to: (2*i) % number
					});
					transitions.push({
						from: i,
						next: 1,
						to: ((2*i)+1) % number
					});
				}
				$scope.transitions = transitions;
			}
				
			MathJax.Hub.Typeset();
			
		}]);
	
	});