define(['mathjax', 'c3', './main', 'math', '../services/all'],
	function (MathJax, c3, controllerModule, math) {
	
		controllerModule
		.controller('QuadratureController', ['$scope', 'PageManipulationService',
			function($scope, PageManipulationService) {
				$scope.func = "sin(x)^2";
				$scope.errorBound = 0.0001;
				$scope.lowerBound = 0;
				$scope.upperBound = 5;
				
				$scope.functionProblem = null;
				
				var tolerance = 0.8,
					FUNCTION_PLOT_N = 100,
					MAX_DEPTH = 12;
				
				var parser = math.parser();
				
				$scope.quad = function(doNotScroll){
					try{
						parser.eval("f(x) = " + $scope.func);
					}
					catch(e){
						$scope.functionProblem = "The function could not be read correctly!!";
						clearDraw();
						return;
					}
					try{
						var func = parser.get("f");
						
						var a = $scope.lowerBound,
							b = $scope.upperBound,
							errorBound = $scope.errorBound,
							sFunction = $scope.func;
							
						var pointsAccumulator = [];
						var maxDepthReached = {val: false};
						var Q = _quad(a, 
							b, 
							func(a), 
							func(b), 
							func, 
							errorBound, 
							0,
							maxDepthReached);
					
						draw(a, b, func, Q, sFunction);
						
						var quad = 0;
						for(var i = 0; i < Q.length; ++i){
							quad += Q[i].area;
						}
						
						$scope.quadrature = {
							Q: Q,
							value: quad
						};
						$scope.maxDepthReached = maxDepthReached.val;
						$scope.functionProblem = null;
						if(!doNotScroll){
							PageManipulationService.scrollTo("#QuadratureSolution");
						}
					}
					catch(e){
						$scope.functionProblem = "The function is not well defined.";
						clearDraw();
					}
				};
				
				var chart;
				$scope.$on('$destroy', function() {
					if(chart != null){
						chart.destroy();
					}
				});
				
				function draw(a, b, f, Q, sFunction){
					var qLabel = 'Interpolation used for Q',
						qXs = ['x1'],
						qData = [qLabel],
						funcLabel = 'f(x) = ' + sFunction,
						funcXs = ['x2'],
						funcData = [funcLabel];
					
					var N = FUNCTION_PLOT_N,
						h = (b - a) / N;
					for(var i = 0; i <= N; ++i){
						funcXs.push(a + (i * h));
						funcData.push(f(a + i * h));
					}
					
					for(var i = 0; i < Q.length; ++i){
						qXs.push(Q[i].l);
						qData.push(f(Q[i].l));
					}
					qXs.push(Q[Q.length - 1].r);
					qData.push(f(Q[Q.length - 1].r));
					
					var xs = {};
					xs[qLabel] = 'x1';
					xs[funcLabel] = 'x2';
					
					var types = {};
					types[qLabel] = 'area';
					types[funcLabel] = 'area-spline';
					
					if(chart != null){
						chart.destroy();
					}
					
					chart = c3.generate({
						bindto: '#FunctionPlot',
						data: {
							xs: xs,
							columns: [
								qXs,
								funcXs,
								qData,
								funcData
							],
							types: types
						},
						axis: {
							x: {
								tick: {
									count: 6,
									format: function (x) { return x.toPrecision(4); }
								}
							},
							y : {
								tick: {
									format: function(d){ 
										return d.toPrecision(3);
									}
								}
							}
						},
						tooltip: {
							show: false
						}
					});
				}
				
				function clearDraw(){
					c3.generate({
						bindto: '#FunctionPlot',
						data: {
							xs: {},
							columns: [
							]
						}
					});
				}
				
				function _quad(a, b, valA, valB, f, maxError, currDepth, maxDepthReached){
					var h = b - a,
						x_mid = (a + b)/2,
						Q_h = (valA + valB) * h / 2,
						valMid = f(x_mid),
						Q_h_2_l = (valA + valMid) * h / 4,
						Q_h_2_r = (valB + valMid) * h / 4,
						Q_h_2 = Q_h_2_l + Q_h_2_r;
					if(isNaN(valA) || isNaN(valB)){
						throw("Function blew up");
					}
					if(currDepth >= MAX_DEPTH || Math.abs(Q_h - Q_h_2) / 3 <= maxError * tolerance){
						if(currDepth >= MAX_DEPTH){
							maxDepthReached.val = true;
						}
						return [{
									area: Q_h_2_l,
									l: a,
									r: x_mid
								},
								{
									area: Q_h_2_r,
									l: x_mid,
									r: b
								}];
					}
					else{
						return _quad(a, x_mid, valA, valMid, f, maxError/2, currDepth+1, maxDepthReached).concat
							(_quad(x_mid, b, valMid, valB, f, maxError/2, currDepth+1, maxDepthReached));
					}
				}
				
				MathJax.Hub.Typeset();
				
			}]);
	
	});