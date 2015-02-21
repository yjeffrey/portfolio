define(['mathjax', './main', 'modernizr', '../services/all'],
	function (MathJax, controllerModule, Modernizr) {
	
		controllerModule
		.controller('HeatController', ['$scope', '$interval', 
				'$timeout', 'PageManipulationService',
			function($scope, $interval, $timeout, PageManipulationService) {
				
				$scope.c = 7;
				$scope.N = 12;
				
				$scope.icIndex = 0;
				$scope.bcIndex = 0;
				$scope.fIndex = 2;
				var bcIndex = 0;
				var fIndex = 0;
				
				var U_curr, 
					U_p1;
					
				var L = 100,
					h,
					k = 1,
					multiplier;
				
				$scope.ics = [
					{
						fn:	function(x,y,z){
							var d = Math.sqrt(Math.pow((x-L/2),2) + 
											Math.pow((y-L/2),2) + 
											Math.pow((z-L/2),2));
							return Math.min(1000,(Math.exp(-1*(d-50)/4)));
						},
						name: "Hot in Center"
					},
					{
						fn:	function(x,y,z){
							var d = Math.sqrt(Math.pow((x-L/2),2) + 
											Math.pow((y-L/2),2) + 
											Math.pow((z-L/2),2));
							return Math.min(1000,(Math.exp((d-30)/4)));
						},
						name: "Cold in Center"
					}];
					
				$scope.bcs = [
					{
						fn:	function(x, y, z){
							return 0;
						},
						name: "Dirichlet (Ice Bath)"
					},
					{
						fn:	function(i, j, l, N){
							var val = (
									-6 * U_p1[i][j][l] +
									U_p1[i][(j+N - 1)%(N)][l] +
									U_p1[i][(N+j +1)%(N)][l] +
									U_p1[(N+i-1)%(N)][j][l] +
									U_p1[(N+i+1)%(N)][j][l] +
									U_p1[i][j][(l+N - 1)%(N)] +
									U_p1[i][j][(N+l +1)%(N)]
								);
							if(i == 0){
								val -= U_p1[(N+i-1)%(N)][j][l];
								val += U_p1[i][j][l];
							}
							else if(i == N-1){
								val -= U_p1[(N+i+1)%(N)][j][l];
								val += U_p1[i][j][l];
							}
							if(j == 0){
								val -= U_p1[i][(j+N - 1)%(N)][l];
								val += U_p1[i][j][l];
							}
							else if(j == N-1){
								val -= U_p1[i][(j+N + 1)%(N)][l];
								val += U_p1[i][j][l];
							}
							if(l == 0){
								val -= U_p1[i][j][(l+N - 1)%(N)];
								val += U_p1[i][j][l];
							}
							else if(l == N-1){
								val -= U_p1[i][j][(l+N + 1)%(N)];
								val += U_p1[i][j][l];
							}
							return (U_p1[i][j][l]
								+ multiplier * val).toPrecision(4) - 0;
						},
						name: "Neumann (Insulated)"
					},
					{
						fn:	function(i, j, l, N){
							if(l == 0){
								return 2000;
							}
							else if(l == N-1){
								return 2000;
							}
							if(i == 0){
								return 0;
							}
							else if(i == N-1){
								return 0;
							}
							if(j == 0){
								return 0;
							}
							else if(j == N-1){
								return 0;
							}
						},
						name: "Inhomogeneous Dirichlet 1"
					},
					{
						fn:	function(i, j, l, N){
							if(l == 0){
								return 2000;
							}
							else if(l == N-1){
								return 0;
							}
							if(i == 0){
								return 0;
							}
							else if(i == N-1){
								return 0;
							}
							if(j == 0){
								return 0;
							}
							else if(j == N-1){
								return 0;
							}
						},
						name: "Inhomogeneous Dirichlet 2"
					},
					{
						fn:	function(i, j, l, N){
							var val = (
									-6 * U_p1[i][j][l] +
									U_p1[i][(j+N - 1)%(N)][l] +
									U_p1[i][(N+j +1)%(N)][l] +
									U_p1[(N+i-1)%(N)][j][l] +
									U_p1[(N+i+1)%(N)][j][l] +
									U_p1[i][j][(l+N - 1)%(N)] +
									U_p1[i][j][(N+l +1)%(N)]
								);
							if(i == 0){
								val -= U_p1[(N+i-1)%(N)][j][l];
								val += U_p1[i][j][l];
							}
							else if(i == N-1){
								val -= U_p1[(N+i+1)%(N)][j][l];
								val += U_p1[i][j][l];
							}
							if(j == 0){
								return 1000;
							}
							else if(j == N-1){
								return 0;
							}
							if(l == 0){
								return 2000;
							}
							else if(l == N-1){
								return 0;
							}
							return (U_p1[i][j][l]
								+ multiplier * val).toPrecision(4) - 0;
						},
						name: "Mixed 1"
					},
					{
						fn:	function(i, j, l, N){
							var val = (
									-6 * U_p1[i][j][l] +
									U_p1[i][(j+N - 1)%(N)][l] +
									U_p1[i][(N+j +1)%(N)][l] +
									U_p1[(N+i-1)%(N)][j][l] +
									U_p1[(N+i+1)%(N)][j][l] +
									U_p1[i][j][(l+N - 1)%(N)] +
									U_p1[i][j][(N+l +1)%(N)]
								);
							if(i == 0){
								val -= U_p1[(N+i-1)%(N)][j][l];
								val += U_p1[i][j][l];
							}
							else if(i == N-1){
								val -= U_p1[(N+i+1)%(N)][j][l];
								val += U_p1[i][j][l];
							}
							if(j == 0){
								return 0;
							}
							else if(j == N-1){
								return 0;
							}
							if(l == 0){
								return 2000;
							}
							else if(l == N-1){
								return 0;
							}
							return (U_p1[i][j][l]
								+ multiplier * val).toPrecision(4) - 0;
						},
						name: "Mixed 2"
					}];
					
				$scope.fs = [
					{
						fn:	function(x, y, z){
							return 0;
						},
						name: "None"
					},
					{
						fn:	function(x, y, z){
							if(x>0.40 *L && x < 0.60*L
								&& y>0.40 *L && y < 0.60*L
								&& z>0.40 *L && z < 0.60*L){
								return 100;
							}
							else{
								return 0;
							}
						},
						name: "Heater in the Room"
					},
					{
						fn:	function(x, y, z, N){
							var cornerTotalHeat = U_p1[1][1][1] +
								U_p1[N-2][1][1] +
								U_p1[1][N-2][1] +
								U_p1[1][1][N-2] +
								U_p1[N-2][N-2][1] +
								U_p1[1][N-2][N-1] +
								U_p1[N-2][1][N-2] +
								U_p1[N-2][N-2][N-2];
							if(cornerTotalHeat < 20
								&& x>0.40 *L && x < 0.60*L
								&& y>0.40 *L && y < 0.60*L
								&& z>0.40 *L && z < 0.60*L){
								return 1000;
							}
							else{
								return 0;
							}
						},
						name: "Negative Feedback w/ Very Hot Heater"
					}];
					
				var ticker;
				
				$scope.loaded = false;
				
				$scope.load = function(icIndex, bcI, fnI, N, c){
					if(ticker != null){
						$interval.cancel(ticker);
					}
					h = L / N;
					var initialFunction = $scope.ics[icIndex].fn;
					U_curr = new Array(N);
					U_p1 = new Array(N);
					$scope.grid = U_curr;
					
					for(var i = 0; i < N; ++i){
						U_curr[i] = (new Array(N));
						U_p1[i] = (new Array(N));
						for(var j = 0; j < N; ++j){
							U_curr[i][j] = (new Array(N));
							U_p1[i][j] = (new Array(N));
							for(var l = 0; l < N; ++l){
								U_curr[i][j][l] = 
								U_p1[i][j][l] = initialFunction(i * h, j * h, l*h);
							}
						}
					}
					bcIndex = $scope.bcIndex;
					fIndex = $scope.fIndex;
					for(var i = 0; i < N; ++i){
						for(var j = 0; j < N; ++j){
							for(var l = 0; l < N; ++l){
								if(i == 0
									|| i == N - 1
									|| j == 0
									|| j == N - 1
									|| l == 0
									|| l == N - 1){
									U_curr[i][j][l] = 
										$scope.bcs[bcIndex].fn(i,j,l,N);
								}
							}
						}
					}
					
					multiplier = c * k / (h * h);
					
					$scope.loaded = true;
				};
				
				$scope.start = function(){
					if($scope.loaded){
						PageManipulationService.scrollTo("#HeatDisplay");
						$timeout(function(){
							ticker = $interval(tick, 1);
						}, 300);
						$scope.loaded = false;
					}
				};				
				
				function tick(){
					var N = U_p1.length;
					for(var i = 0; i < N; ++i){
						for(var j = 0; j < N; ++j){
							for(var l = 0; l < N; ++l){
								U_p1[i][j][l] = U_curr[i][j][l];
							}
						}
					}
					for(var i = 0; i < N; ++i){
						for(var j = 0; j < N; ++j){
							for(var l = 0; l < N; ++l){
								if(i == 0
									|| i == N - 1
									|| j == 0
									|| j == N - 1
									|| l == 0
									|| l == N - 1){
									U_curr[i][j][l] = 
										$scope.bcs[
											bcIndex].fn(i,j,l,N) 
										+ k * $scope.fs[fIndex].fn(i*h,j*h,l*h,N);
								}
								else{
									U_curr[i][j][l] = 
										(U_p1[i][j][l]
										+ multiplier * (
											-6 * U_p1[i][j][l] +
											U_p1[i][(j+N - 1)%(N)][l] +
											U_p1[i][(N+j +1)%(N)][l] +
											U_p1[(N+i-1)%(N)][j][l] +
											U_p1[(N+i+1)%(N)][j][l] +
											U_p1[i][j][(l+N - 1)%(N)] +
											U_p1[i][j][(N+l +1)%(N)]
										))
										+ k * $scope.fs[fIndex].fn(i*h,j*h,l*h,N);
									U_curr[i][j][l].toPrecision(4);
								}
							}
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
					$scope.load($scope.icIndex, $scope.bcIndex, 
					$scope.fIndex, $scope.N, $scope.c);
				}
				else{
					$scope.webgl= false;
				}
				MathJax.Hub.Typeset();
				
			}]);
	
	});