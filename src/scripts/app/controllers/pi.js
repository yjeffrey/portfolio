define(['mathjax', './main'],
	function (MathJax, controllerModule) {
	
		controllerModule
		.controller('PiController', ['$scope',
			function($scope) {
				
				$scope.Math = Math;
				
				$scope.monteCarloN = 1000;
				$scope.absN = 1;
				$scope.cosN = 1;
				
				var $canvas = $("#MonteCarloDemo");
				var canvas = $canvas[0];
				var context = canvas.getContext("2d");
					
				var m_canvas = document.createElement('canvas');
				var m_context = m_canvas.getContext("2d");
				clear(m_canvas, m_context);
				
				$scope.monteCarlo = function(){
					var n = $scope.monteCarloN;
					var acc = 0;
					
					clear(canvas, context);
					clear(m_canvas, m_context)
					m_context.fillStyle = "#000000";  
					
					var x, y;
					for(var i = 0; i < n; ++i){
						x = Math.random();
						y = Math.random();
						
						m_context
							.fillRect(x * canvas.width, y * canvas.width, 1, 1);
						if(Math.pow(x, 2) + Math.pow(y, 2) < 1){
							++acc;
						}
					}
					
					context.drawImage(m_canvas, 0, 0);
					$scope.monteCarloPi = acc * 4 / n;
				}
								
				$canvas.css("height", $canvas.parent().width() + 'px');
				$canvas.css("width", $canvas.parent().width() + 'px');
				clear(canvas, context);
				
				function clear(canvas, context){
					canvas.width = $canvas.parent().width();
					canvas.height = canvas.width;
					
					context.fillStyle = "#FF0000";  
					context.beginPath();
					context.arc(0, canvas.height, canvas.height,
						0, Math.PI /2, true);
					context.fill();
					context.fillStyle = "#FFFFFF";  
					context.beginPath();
					context.arc(0, canvas.height, canvas.height-1,
						0, Math.PI /2, true);
					context.fill();
				}
				
				$scope.seriesAbsX = function(){
					var n = $scope.absN;
					var acc = 0;
					
					for(var i = 0; i < n; ++i){
						acc += 1/Math.pow(2*i+1, 2);
					}
					$scope.absXPi = Math.sqrt(acc * 8);
				}
				
				$scope.seriesCos = function(){
					var n = $scope.cosN;
					var acc = 0;
					var m = Math.ceil(n/2);
					
					for(var i = 1; i < m; ++i){
						acc += 1/(4 * Math.pow(2*i - 1, 2) - 1);
					}
					
					for(var i = 1; i < m; ++i){
						acc -= 1/(4 * Math.pow(2*i, 2) - 1);
					}
					
					$scope.cosPi = 2 + 4 * acc;
				}
				
				MathJax.Hub.Typeset();
				
			}]);
	
	});