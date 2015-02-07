define(['angular', './main', 'modernizr', '../services/all'],
	function (Angular, controllerModule, Modernizr) {
	
		controllerModule
		.controller('WeatherController', 
			['$scope', '$interval', '$q', 'WeatherService',
				function($scope, $interval, $q, WeatherService) {
					$scope.stations;
					$scope.getReadingsFor = getReadings;
					
					var updater;
					updateStations();
					updater = $interval(updateStations, 1000 * 30);
					$scope.$on('$destroy', function() {
						if(updater != null){
							$interval.cancel(updater);
						}
					});
					
					function getReadings(stationId, cb){
						WeatherService.getReadingFor(stationId)
						.then(function(readings){
							readings.sort(function(a,b){
								a = new Date(a.timestamp);
								b = new Date(b.timestamp);
								if(a > b) return -1;
								if(a < b) return 1;
								return 0;
							});
							for(var i = 0; i < $scope.stations.length; ++i){
								if($scope.stations[i].id == stationId){
									$scope.stations[i].readings = readings;
									return cb($scope.stations[i]);
								}
							}
							cb(null);
						});
					}
					
					function updateStations(){
						WeatherService.updateReadings();
						WeatherService.updateStations();
						$q.all([
							WeatherService.stations,
							WeatherService.readings
						])
						.then(function(responses){
							var tempStations = {};
							var stations = responses[0];
							for(var i = 0; i < stations.length; ++i){
								var station = stations[i];
								station = angular.copy(station);
								station.readings = [];
								tempStations[station.id] = station;
							}
							var readings = responses[1];
							for(var i = 0; i < readings.length; ++i){
								var reading = readings[i];
								if(tempStations[reading.station_id] != null){
									tempStations[reading.station_id]
										.readings.push(angular.copy(reading));
								}
							}
							stations = [];
							for (var key in tempStations) {
								if (tempStations.hasOwnProperty(key)) {
									stations.push(tempStations[key]);
								}
							}
							$scope.stations = stations;
						});
					}
					
				}]);
	
	});