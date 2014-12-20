define(['./main', 'socket.io'],
	function (servicesModule, io) {
		servicesModule.provider('socket', function(){

			this.$get = ["$rootScope", function($rootScope){
				var socket = io.connect();
				
				function Socket(namespace){
					this.socket = io.connect(namespace);
				}
				
				Socket.prototype.on = function(eventName, callback){
					this.socket.on(eventName, function(){  
						var args = arguments;
						$rootScope.$apply(function(){
							callback.apply(socket, args);
						});
					});
				};
				
				Socket.prototype.off = function(eventName, data, callback){
					if(typeof callback == 'function'){
						this.socket.removeListener(eventName, callback);
					}
					else{
						this.socket.removeAllListeners();
					}
				};
				
				Socket.prototype.emit = function(eventName, data, callback){
					this.socket.emit(eventName, data, function(){
						var args = arguments;
						$rootScope.$apply(function(){
							if(callback){
								callback.apply(socket, args);
							}
						});
					});
				};
				
				return Socket;
				
			}];
			
		});
	});