define(['./main', 'socket.io'],
	function (servicesModule, io) {
		servicesModule.provider('socket', function(){

			this.$get = ["$rootScope", function($rootScope){
				var socket = io.connect();
				return {
					on: function(eventName, callback){
						socket.on(eventName, function(){  
							var args = arguments;
							$rootScope.$apply(function(){
								callback.apply(socket, args);
							});
						});
					},
					off: function(eventName, data, callback){
						if (typeof callback == 'function') {
							socket.removeListener(event, callback);
						} else {
							socket.removeAllListeners(event);
						}
					},
					emit: function(eventName, data, callback){
						socket.emit(eventName, data, function(){
							var args = arguments;
							$rootScope.$apply(function(){
								if (callback) {
									callback.apply(socket, args);
								}
							});
						});
					}
				};
			}];
			
		});
	});