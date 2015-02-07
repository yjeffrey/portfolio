define(['./main', 'modernizr'],
	function (servicesModule, Modernizr) {
		servicesModule.factory('WeatherService', ['$http', '$q',
		function($http, $q) {
			var service = {
				updateStations: function(){
					var deferred = $q.defer();
					$http.get('/services/weather/stations')
						.success(function(data){
							deferred.resolve(data);
						})
						.error(function(error){
							deferred.reject(error);
						});
					this.stations = deferred.promise;	
					return this.stations;
				},
				stations: null,
				updateReadings: function(){
					var deferred = $q.defer();
					$http.get('/services/weather/readings')
						.success(function(data){
							for(var i = 0; i < data.length; ++i){
								data[i].timestamp = new Date(data[i].timestamp);
							}
							deferred.resolve(data);
						})
						.error(function(error){
							deferred.reject(error);
						});
					this.readings = deferred.promise;
					return this.readings;
				},
				readings: null,
				getReadingFor: function(stationId){
					var deferred = $q.defer();
					$http.get('/services/weather/readings/' +
						stationId)
						.success(function(data){
							for(var i = 0; i < data.length; ++i){
								data[i].timestamp = new Date(data[i].timestamp);
							}
							deferred.resolve(data);
						})
						.error(function(error){
							deferred.reject(error);
						});
					return deferred.promise;
				}
			};
			
			service.updateStations();
			service.updateReadings();
			
			return service;
		}]);
	});