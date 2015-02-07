'use strict';

define(['angular', 
	'app/controllers/all',
	'app/directives/all',
	'app/services/all',
	'animate-animate',
	'ui-router',
	'angular-strap',
	'angular-strap.tpl'],
	function (angular, controllers, directives, services) {

		var app = angular.module('app', [controllers.name, 
										directives.name,
										services.name,
										'ngAnimate',
										'ui.router',
										'mgcrea.ngStrap']);
		console.log("App module initialized");

		app.config(['$provide',
		'$stateProvider', '$urlRouterProvider', '$locationProvider',
		'$typeaheadProvider',
		function($provide, $stateProvider, $urlRouterProvider, 
				$locationProvider, $typeaheadProvider) {
				
			$provide.decorator('$state', ['$delegate', function($delegate) {
				var old = $delegate.go;
				$delegate.go = function(name, params, settings) {
					if(settings == null){
						settings = {
							reload: true
						};
					}
					else if(undefined === settings.reload ||
						null === settings.reload){
						settings.reload = true;
					}
					return old(name, params, settings);
				};
				return $delegate;
			}]);
			
			angular.extend($typeaheadProvider.defaults, {
				animation: 'am-flip-x',
				minLength: 0,
				limit: 10
			});

			$urlRouterProvider.otherwise("/404");

			$stateProvider
				.state('base', {
					abstract: true,
					views: {
						"contact": { 
							templateUrl: "partials/contact.html",
							controller: 'ContactController'
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
									$scope.countdown = 3000;
									
									$scope.round = Math.round;
									
									var timer;
									
									function countdown(timeLeft){
										if(timeLeft <= 0){
											$state.go('base.home');
										}
										else{
											$scope.countdown -= 1000;
											timer = $timeout(function(){
												countdown($scope.countdown);
											}, 1000);
										}
									}
									
									countdown($scope.countdown);      
									$scope.$on('$destroy', function() {
										if(timer != null){
											$timeout.cancel(timer);
										}
									});
								}
							]
						}
					}
				});
				
			$stateProvider
				.state('base.demo', {
					url: "/demo",
					abstract: true
				})
				.state('base.demo.modulo', {
					url: "/modulo-algorithm",
					views: {
						"main@": {
							templateUrl: "partials/demos.modulo.html",
							controller: 'ModuloController'
						}
					}
				})
				.state('base.demo.pi', {
					url: "/pi-approximations",
					views: {
						"main@": {
							templateUrl: "partials/demos.pi.html",
							controller: 'PiController'
						}
					}
				})
				.state('base.demo.piano', {
					url: "/public-piano",
					views: {
						"main@": {
							templateUrl: "partials/demos.piano.html",
							controller: 'PianoController'
						}
					}
				})
				.state('base.demo.quadrature', {
					url: "/adaptive-quadrature",
					views: {
						"main@": {
							templateUrl: "partials/demos.quadrature.html",
							controller: 'QuadratureController'
						}
					}
				})
				.state('base.demo.sudoku', {
					url: "/sudoku-solver",
					views: {
						"main@": {
							templateUrl: "partials/demos.sudoku.html",
							controller: 'SudokuSolverController'
						}
					}
				})
				.state('base.demo.goal-finder', {
					url: "/goal-finder",
					views: {
						"main@": {
							templateUrl: "partials/demos.goal-finder.html",
							controller: 'GoalFinderController'
						}
					}
				})
				.state('base.demo.wave', {
					url: "/wave-equation",
					views: {
						"main@": {
							templateUrl: "partials/demos.wave.html",
							controller: 'WaveController'
						}
					}
				})
				.state('base.demo.weather', {
					url: "/canadian-weather",
					views: {
						"main@": {
							templateUrl: "partials/demos.weather.html",
							controller: 'WeatherController'
						}
					}
				});
				
			$locationProvider.html5Mode(true);
		}]);
		
		app.run(['$rootScope', 'PageManipulationService',
			function($rootScope, PageManipulationService) {
			
				$rootScope.$on('$stateChangeStart', 
					function(event, toState, toParams, fromState, fromParams){
						PageManipulationService.goToTop();
					});
			}]);

		return app;
	});