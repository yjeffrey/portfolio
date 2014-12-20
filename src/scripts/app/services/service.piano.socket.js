define(['./main', './provider.socket'],
	function (servicesModule) {
		servicesModule.factory('PianoSocket', ['socket',
		function(Socket) {
		
			return new Socket('/piano');
			
		}]);
	});