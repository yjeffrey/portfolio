define(['./main', 'd3'],
	function (directiveModule, d3) {

		directiveModule
		.directive('mazeDisplay', [function() {
			return {
				scope: {
					nodes: '=nodes',
					edges: '=edges',
					xLength: '=mazeX',
					yLength: '=mazeX',
					nodeColor: '=nodeColor',
					pathColor: '=pathColor'
				},
				templateUrl: '/partials/directive.maze.html',
				transclude: true,
				link: function(scope, element, attrs) {
					
					scope.$watch("nodes", function(){
						if(scope.nodes != null){
							drawMazeCells(scope.xLength, scope.yLength, scope.nodes);
						}
					});
					scope.$watch("edges", function(){
						if(scope.edges != null){
							drawEdges(scope.xLength, scope.yLength, scope.edges);
						}
					}, true);
					
					function drawMazeCells(xLength, yLength, nodes){
						var xGrid = 100/(xLength+1);
						var yGrid = 100/(yLength+1);
						var xGridLengthPercent = 0.3;
						var yGridLengthPercent = 0.3;
						var svg = d3.select('svg');
							
						svg.selectAll("circle")
							.data(nodes)
							.enter()
							.append("circle")
							.attr("cx", function (d) {
								return xGrid * 
									(1+d.location[0]);
							})
							.attr("cy", function (d) {
								return yGrid * 
									(1+d.location[1]);
							})
							.attr("r", Math.min(xGrid * xGridLengthPercent,
								yGrid * yGridLengthPercent))
							.style("fill", scope.nodeColor)
							.style("stroke", "black")
							.style("stroke-width", 0.2);
					}
				
					function drawEdges(xLength, yLength, edges){
						var xGrid = 100/(xLength+1);
						var yGrid = 100/(yLength+1);
						var svg = d3.select('svg');
							
						svg.selectAll("path")
							.data(edges)
							.enter()
							.append("path")
							.attr("d", function(d){
								var x1 =  xGrid * 
									(d.from[0]+1);
								var y1 = yGrid * 
									(d.from[1]+1);
								var x2 =  xGrid * 
									(d.to[0]+1);
								var y2 = yGrid * 
									(d.to[1]+1);
								return "M " + x1 + " " + y1 + " L " +
									x2 + " " + y2 + " Z";
							})
							.attr("stroke", scope.pathColor)
							.attr("stroke-width", 0.5);
					}		
					
				}
				
			};
		}]);

	});