define(['./main'],
	function (controllerModule) {

		controllerModule
		.controller('ContactController', ['$scope', '$http', function($scope, $http) {

			$scope.sending = false;
			$scope.sent = false;
			$scope.error = false;

			$scope.sendMessage = function(from, message){
				$scope.sending = true;
				$http.post('/contact', {
					from: from.toString(),
					message: message.toString()
				})
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