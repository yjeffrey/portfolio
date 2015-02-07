define(['./main', './provider.socket'],
	function (servicesModule) {
		servicesModule.factory('PianoSocket', ['socket',
		function(Socket) {
			var socket = new Socket('/piano');
			return {
				getSocket: function(){
					if(!socket.socket.connected){
						socket.socket.connect();
					}
					return socket;
				}
			};
			
		}]);
	});