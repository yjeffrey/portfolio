'use strict';
	
define(['angular', 
	'app/controllers/all', 
	'app/directives/all', 
	'app/services/all', 
	'ui-router'],
	function (angular, controllers, directives, services) {
	
		var app = angular.module('app', [controllers.name, 
										directives.name,
										services.name,
										'ui.router']);
		console.log("App module initialized");
		
		app.config([
		'$stateProvider', '$urlRouterProvider', '$locationProvider',
		function($stateProvider, $urlRouterProvider, $locationProvider) {

			$urlRouterProvider.otherwise("/404");
			
			$stateProvider
				.state('base', {
					abstract: true,
					views: {
						"contact": { 
							templateUrl: "partials/contact.html",
							controller: 'ContactController'
						},
						"navbar": {
							templateUrl: "partials/navbar.html",
							controller: 'NavbarController'
						},
						"footer": {
							templateUrl: "partials/footer.html"
						}
					}
				})
				.state('base.home', {
					url: "/",
					views: {
						"main@": {
							templateUrl: "partials/home.html",
							controller: 'HomeController'
						}
					}
				})
				.state('base.404', {
					url: "/404",
					views: {
						"main@": {
							templateUrl: "partials/404.html",
							controller: ['$scope', '$timeout', '$state', 
								function($scope, $timeout, $state){
									var timer = $timeout(function(){
										 $state.go('base.home');
									}, 3000);
									
								   $scope.$on("$destroy", function(event){
										if(timer != null){
											$timeout.cancel(timer);
										}
									});
								}
							]
						}
					}
				})
				.state('base.demo', {
					url: "/demo",
					abstract: true
				})
				.state('base.demo.sudoku', {
					url: "/sudoku",
					views: {
						"main@": {
							templateUrl: "partials/demos.sudoku.html",
							controller: 'SudokuSolverController'
						}
					}
				})
				.state('base.demo.pi', {
					url: "/pi",
					views: {
						"main@": {
							templateUrl: "partials/demos.pi.html",
							controller: 'PiController'
						}
					}
				})
				.state('base.demo.modulo', {
					url: "/modulo",
					views: {
						"main@": {
							templateUrl: "partials/demos.modulo.html",
							controller: 'ModuloController'
						}
					}
				})
				.state('base.demo.quadrature', {
					url: "/quadrature",
					views: {
						"main@": {
							templateUrl: "partials/demos.quadrature.html",
							controller: 'QuadratureController'
						}
					}
				});
				
			$locationProvider.html5Mode(true);
		}]);
		
		
		return app;
	});