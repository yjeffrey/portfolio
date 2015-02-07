define(['./main', 'modernizr'],
	function (servicesModule, Modernizr) {
		servicesModule.factory('PianoService', ['$q', '$http', '$timeout', '$rootScope',
		function($q, $http, $timeout, $rootScope) {

			var deferred = $q.defer();
			if (!!!(window.webkitAudioContext || window.AudioContext)){
				deferred.reject(null);
				return deferred.promise;
			}
			
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			var context;
			try{
				context = new AudioContext();
			}
			catch(e){
				deferred.reject(e);
				return deferred.promise;
			}
			var promises = [];
			var files = ['/assets/scale-low.mp3', '/assets/scale-high.mp3'];
			for(var i = 0; i < files.length; ++i){
				(function(){
					var d = $q.defer();
					promises.push(d.promise);
					
					$http.get(files[i], {responseType: "arraybuffer"})
						.then(function(response){
							context.decodeAudioData(response.data,
								function(buffer) {
									$rootScope.$apply(function(){
										d.resolve(buffer);
									});
								},
								function(error){
									$rootScope.$apply(function(){
										d.reject(error);
									});
								});
						});
				})()
			}

			$q.all(promises)
			.then(function(data) {
				deferred.resolve({
					buffers: data,
					playNote: function(index){
						index = index | 0;
						
						var i = 0;
						
						if(index > 24){
							return;
						}
						
						if(index > 11){
							i = 1;
							index -= 12;
						}
						if(index == 0){
							index = 0.1;
						}
						else if(index <= 9){
							index += 0.1;
						}
						else if(index <= 11 || (i==1 && index == 12)){
							index += 0.2;
						}
						
						var source = context.createBufferSource();
						source.buffer = this.buffers[i];
						source.connect(context.destination);
						
						source.start(0, index, 0.9);
						$timeout(function(){
							source.connect(context.destination);
							source.disconnect(context.destination);
						}, 1100);
						
					}
				});
			})
			.catch(function(error){
				deferred.reject(error);
			});
			
			return deferred.promise;
		}]);
	});