define(['mathjax', './main', 'math', 'modernizr', '../services/all'],
	function (MathJax, controllerModule, math, Modernizr) {
	
		controllerModule
		.controller('WaveController', ['$scope', '$interval', 
				'$timeout', 'PageManipulationService',
			function($scope, $interval, $timeout, PageManipulationService) {
				
				$scope.c = 1;
				$scope.N = 60;
				$scope.s  = 0.001;
				$scope.wireframe = false;
				$scope.zFactor = 0.1;
				$scope.fnIndex = 3;
				
				var U_prev, 
					U_curr, 
					extraBuffer;
					
				var L = 30000,
					h,
					k = 3,
					multiplier,
					w;
				
				$scope.f_0s = [{
						fn:function(x,y){
							return y*x*3/ 3000000;
						},
						name: "Large Low Frequency Waves"
					},
					{
						fn:	function(x,y){
							return x*x/(y+1)*3/ 300000;
						},
						name: "Large High Frequency Waves"
					},
					{
						fn:	function(x,y){
							return 300*Math.cos(Math.sqrt(Math.pow((x-L/2),2) + Math.pow((y-L/2),2))/360);
						},
						name: "Radial Bumps"
					},
					{
						fn:	function(x,y){
							return 10000/(Math.sqrt(Math.pow((x-L/2),2) + Math.pow((y-L/2),2))+1);
						},
						name: "Pillar in Center"
					},
					{
						fn:	function(x,y){
							return 100*Math.log(Math.sqrt(Math.pow((x-L/2),2) + Math.pow((y-L/2),2))+0.0001)-1000;
						},
						name: "Dip in Center"
					}];
					
				var f_0_d = function(x,y){
					return (Math.random()-0.5) * 0.5;
				};
				
				var ticker;
				
				$scope.loaded = false;
				// N Should be between 100 and 400
				$scope.load = function(fnIndex, N, c){
					if(ticker != null){
						$interval.cancel(ticker);
					}
					h = L / N;
					var initialFunction = $scope.f_0s[fnIndex].fn;
					U_curr = new Array(N);
					U_prev = new Array(N);
					extraBuffer = new Array(N);
					$scope.grid = U_curr;
					for(var i = 0; i < N; ++i){
						U_curr[i] = (new Array(N));
						U_prev[i] = (new Array(N));
						extraBuffer[i] = (new Array(N));
						for(var j = 0; j < N; ++j){
							U_curr[i][j] = initialFunction(j * h, i * h);
							U_prev[i][j] = U_curr[i][j] 
								- f_0_d(j * h, i * h) * k;
						}
					}
					
					multiplier = c * k*k / (h * h);
					
					w = $scope.s;
					$scope.loaded = true;
				};
				
				$scope.start = function(){
					if($scope.loaded){
						PageManipulationService.scrollTo("#WaveDisplay");
						$timeout(function(){
							ticker = $interval(tick, 1);
						}, 300);
						$scope.loaded = false;
					}
				};
				
				function tick(){
					var N = extraBuffer.length;
					for(var i = 0; i < N; ++i){
						for(var j = 0; j < N; ++j){
							extraBuffer[i][j] = U_prev[i][j];
							U_prev[i][j] = U_curr[i][j];
						}
					}
					for(var i = 0; i < N; ++i){
						for(var j = 0; j < N; ++j){
							extraBuffer[i][j] = 
								(2 * U_prev[i][j] - extraBuffer[i][j]
								+ multiplier * (
									-4 * U_prev[i][j] +
									U_prev[i][(j+N - 1)%(N)] +
									U_prev[i][(N+j +1)%(N)] +
									U_prev[(N+i-1)%(N)][j] +
									U_prev[(N+i+1)%(N)][j]
								));
						}
					}
					for(var i = 0; i < N; ++i){
						for(var j = 0; j < N; ++j){
							U_curr[i][j] = 
								(1-w) * extraBuffer[i][j]
								+ w * (
									extraBuffer[i][(j+N - 1)%(N)] +
									extraBuffer[i][(j + 1)%(N)] +
									extraBuffer[(N+i - 1)%(N)][j] +
									extraBuffer[(i + 1)%(N)][j]
								)/4;
						}
					}
				}
				
				$scope.$on("$destroy", function() {
					if(ticker != null){
						$interval.cancel(ticker);
					}
				});
				if (Modernizr.webgl){
					$scope.webgl= true;
					$scope.load(3, $scope.N, $scope.c);
				}
				else{
					$scope.webgl= false;
				}
				MathJax.Hub.Typeset();
				
			}]);
	
	});