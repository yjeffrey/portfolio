define(['./main'],
	function (controllerModule) {

		controllerModule
		.controller('PianoController', 
		['$scope', '$timeout', 'PianoSocket', 'PianoService',
			function($scope, $timeout, PianoSocket, PianoService) {
				
				var destroy = false;
				$scope.play = function(){};
				$scope.ind = 0;
				$scope.notWorking = false;
				
				$scope.activeKeys = [];
						
				PianoSocket.on("population", function(population){
					$scope.population = population;
				});
				
				$scope.$on('$destroy', function(){
					destroy = true;
					PianoSocket.off();
				});
				
				PianoService
				.then(function(piano){
					if(!destroy){
						$scope.play = function(i){
							PianoSocket.emit("note", i);
							
							piano.playNote(i);
						};
						
						PianoSocket.on("note", function(i){
							piano.playNote(i);
							$scope.activeKeys[i] = true;
							$timeout(function(){
								$scope.activeKeys[i] = false;
							}, 300);
						});	
						PianoSocket.emit("population");
					}
				})
				.catch(function(error){
					$scope.notWorking = true;
				});
				
			}]);

	});