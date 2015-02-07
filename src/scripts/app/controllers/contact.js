define(['./main'],
	function (controllerModule) {

		controllerModule
		.controller('ContactController', ['$scope', 'MailService', 
			function($scope, MailService) {

				$scope.sending = false;
				$scope.sent = false;
				$scope.error = false;

				$scope.sendMessage = function(from, message){
					$scope.sending = true;
					MailService
					.sendContactInfo(from.toString(), message.toString())
						.success(function(data, status, headers) {
							$scope.sending = false;
							$scope.sent = true;
							$scope.error = false;
						})
						.error(function(data, status, headers) {
							$scope.sending = false;
							$scope.sent = false;
							$scope.error = true;
						});
				};

			}]);

	});