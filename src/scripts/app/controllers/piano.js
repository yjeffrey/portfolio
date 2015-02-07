define(['./main'],
	function (controllerModule) {

		controllerModule
		.controller('PianoController', 
		['$scope', '$timeout', '$interval', 'PianoSocket', 'PianoService',
			function($scope, $timeout, $interval, PianoSocket, PianoService) {
				
				var destroy = false;
				var refreshInterval;
				$scope.play = function(){};
				$scope.ind = 0;
				$scope.notWorking = false;
				
				$scope.activeKeys = [];
				
				PianoSocket = PianoSocket.getSocket();
				
				PianoSocket.on("population", function(population){
					$scope.population = population;
				});
				
				$scope.$on('$destroy', function(){
					destroy = true;
					if(refreshInterval != null){
						$interval.cancel(refreshInterval);
					}
					PianoSocket.off();
					PianoSocket.disconnect();
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
							}, 200);
						});	
						PianoSocket.emit("population");
						
						var refreshInterval = $interval(function(){
							PianoSocket.emit("population");
						}, 3000);
					}
				})
				.catch(function(error){
					$scope.notWorking = true;
				});
				
			}]);

	});