define(['./main'],
	function (servicesModule) {

		servicesModule.constant('demos', [
			'base.demo.sudoku', 
			'base.demo.quadrature',
			'base.demo.heat',
			'base.demo.wave',
			'base.demo.pi',
			'base.demo.piano',
			'base.demo.weather'
		]);
		
		servicesModule.factory('DemoService', ['demos', function(demos) {
		
			return {
				demos: demos,
				getRandomDemo: function(){
					var demos = this.demos;
					return demos[Math.floor(Math.random() * demos.length)];
				}
			};
			
		}]);
	});