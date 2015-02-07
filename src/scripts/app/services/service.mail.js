define(['./main', 'modernizr'],
	function (servicesModule, Modernizr) {
		servicesModule.factory('MailService', ['$http',
		function($http) {
			return {
				sendContactInfo: function(from, message){
					return $http.post('/services/contact', {
						from: from,
						message: message
					});
				}
			};
		}]);
	});