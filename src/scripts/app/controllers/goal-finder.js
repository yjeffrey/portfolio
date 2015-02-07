'use strict'

define(['./main', '../services/all', '../models/priorityqueueset'],
	function (controllerModule, services, PriorityQueueSet) {
	
		controllerModule
		.controller('GoalFinderController', ['$scope', '$timeout', 'PageManipulationService',
			function($scope, $timeout, PageManipulationService) {
				var L = 20,
					H = 20,
					MAZE = generateMaze(L, H);
				
				var START = 0,
					GOAL = 1,
					DONE = 2;
				
				$scope.maze = MAZE;
				
				$scope.pathColor = function(d){
					switch(d.rootType){
						case START:
							return "blue";
							break;
						case GOAL:
							return "green";
							break;
						default:
							return "orange";
					}
				};
				
				var nodeColorLookUp = {
					null: "gray",
					'm': 'red'
				};
				
				$scope.nodeColor = function(d){
					switch(d.type){
						case START:
							return "blue";
							break;
						case GOAL:
							return "green";
							break;
						default:
							return nodeColorLookUp[d.costType];
					}
				};
				
				solve();
				
				function solve(){
					var maze = MAZE;
					
					var starts = getStarts(),
						goals = getGoals();
						
					var costLookup = getCostLookUp();
					
					var frontier 
						= createNewFrontier(maze, starts, goals,
							getMinimumTypeCost(costLookup));
				
					resetMaze(maze, L, H);
					addStartCells(starts, maze, frontier);
					addGoalCells(goals, maze, frontier);
					
					var nodes = generateNodes(maze);
					var edges = [];
					$scope.nodes = nodes;
					$scope.edges = edges;
					$scope.xLength = maze[0].length;
					$scope.yLength = maze.length;
					
					var keepSolving = function(){
						$timeout(function(){
							if(frontier.length() > 0 && 
								!trySolveNextStep(maze, frontier, costLookup, edges)){
								keepSolving();
							}
						}, 1);
					};
					keepSolving();
				}
				
				function createNewFrontier(maze, starts, goals, lowestTypeCost){
					return new PriorityQueueSet({
						comparator: function(a, b){
							a = estimateCost(maze, a, starts, goals, lowestTypeCost);
							b = estimateCost(maze, b, starts, goals, lowestTypeCost);
							return a - b;
						},
						key: function(a){
							return a.location[0] + "," + a.location[1];
						}
					});
				}
				
				function getStarts(){
					return [{
						location: [4, 5]
					},{
						location: [10, 15]
					}];
				}
				
				function getGoals(){
					return [{
						location: [10, 1],
						known: true
					},
					{
						location: [3, 15],
						known: false
					}];
				}
				
				function getCostLookUp(){
					return {
						null: 1,
						m : 10000
					};
				}
				
				function trySolveNextStep(maze, frontier, costLookup, edges){
					var frontierNode = frontier.dequeue(),
						location = frontierNode.location,
						currentCell = getCell(maze, location);
						currentCell.visited = true;
					
					if(currentCell.prevInPath == null){
					}
					else if(currentCell.prevInPath2 != null){
						edges.push({
							from: currentCell.prevInPath,
							to: location
						});
						edges.push({
							from: currentCell.prevInPath2,
							to: location
						});
					}
					else{
						edges.push({
							from: currentCell.prevInPath,
							to: location,
							rootType: getCell(maze, currentCell.root).type
						});
					}
					
					if(currentCell.type == DONE){
						return currentCell;
					}
					var neighbourLocations = [
						[location[0] - 1, location[1]],
						[location[0] + 1, location[1]],
						[location[0], location[1] - 1],
						[location[0], location[1] + 1]
					];
					for(var i = 0; i < neighbourLocations.length; ++i){
						var neighbourLocation = neighbourLocations[i];
						if(isInBounds(maze, neighbourLocation)){
							var neighbour = getCell(maze, neighbourLocation);
							
							if(neighbour.root != null && 
								getCell(maze, neighbour.root).type 
									!= getCell(maze, currentCell.root).type){
								neighbour.prevInPath2 = location;
								neighbour.prevInPath = neighbour.prevInPath ||
									true;
								neighbour.pathCost =
									currentCell.pathCost + 
									neighbour.pathCost;
								neighbour.type = DONE;
								frontier.queue({
									location: neighbourLocation,
									cost: neighbour.pathCost
								});
							}
							else if(neighbour.root == null ||
								(neighbour.type != DONE &&
								!isSameLocation(neighbour.root, currentCell.root))){
								neighbour.prevInPath = location;
								neighbour.root = currentCell.root;
								neighbour.pathCost =
									currentCell.pathCost + 
									costLookup[neighbour.costType];
								frontier.queue({
									location: neighbourLocation,
									cost: neighbour.pathCost
								}, true);
							}
						}
					}
					return false;
				}
				
				function generateMaze(l, h){
					var maze = new Array(h);
					for(var i = 0; i < h; ++i){
						var row = new Array(l);
						for(var j = 0; j < l; ++j){
							row[j] = {
								costType: null,
								prevInPath: null,
								root: null,
								pathCost: Infinity,
								visited: false
							}
							if(Math.random() > 0.5){
								row[j].costType = 'm';
							}
						}
						maze[i] = row;
					}
					return maze;
				}
				
				function resetMaze(maze, l ,h){
					for(var i = 0; i < h; ++i){
						for(var j = 0; j < l; ++j){
							maze[i][j].prevInPath = null;
							maze[i][j].root = null;
							maze[i][j].visited = false;
							maze[i][j].type = null;
							maze[i][j].pathCost = Infinity;
						}
					}
				}
				
				function addStartCells(starts, maze, frontier){
					var cell;
					var start;
					for(var i = 0; i < starts.length; ++i){
						start = starts[i];
						cell = maze[start.location[1]]
								[start.location[0]];
						cell.type = START;
						cell.root = start.location;
						cell.pathCost = 0;
						frontier.queue({
							location: start.location,
							cost: 0,
							type: START
						}, true);
					}
				}
				
				function addGoalCells(goals, maze, frontier){
					for(var i = 0; i < goals.length; ++i){
						var goal = goals[i];
						var cell = maze[goal.location[1]]
								[goal.location[0]];
						cell.type = GOAL;
						cell.root = goal.location;
						cell.pathCost = 0;
						if(goal.known){
							frontier.queue({
								location: goal.location,
								cost: 0,
								type: GOAL
							}, true);
						}
					}
				}
				
				function generateNodes(maze){
					var nodes = [];
					for(var i = 0; i < maze.length; ++i){
						for(var j = 0; j < maze[i].length; ++j){
							nodes.push({
								type: maze[i][j].type,
								costType: maze[i][j].costType,
								location: [j, i]
							});
						}
					}
					return nodes;
				}	
				
				function isSameLocation(loc1, loc2){
					return loc1[0] == loc2[0] && loc1[1] == loc2[1];
				}
				
				function isInBounds(maze, loc){
					return 0 <= loc[0]
						&& loc[0] < maze[0].length 
						&& 0 <= loc[1] 
						&& loc[1] < maze.length;
				}
				
				function getCell(maze, loc){
					if(isInBounds(maze, loc)){
						return maze[loc[1]][loc[0]];
					}
				}
				
				function estimateCost(maze, node, starts, goals, lowestTypeCost){
					var rootType = getCell(maze, 
						getCell(maze, node.location).root).type;
					if(rootType == GOAL){
						return node.cost + 
							estimateCostFromTo(node.location, starts, lowestTypeCost);
					}
					else if(rootType == START){
						return node.cost + 
							estimateCostFromTo(node.location, goals, lowestTypeCost);
					}
					else if(rootType == DONE){
						return node.cost;
					}
					else{
						return Infinity;
					}
				}
				
				function estimateCostFromTo(location, points, lowestTypeCost){
					var minDistance = Infinity;
					for(var i = 0; i < points.length; ++i){
						var distance = Math.abs(points[i].location[0] - location[0]) +
										Math.abs(points[i].location[1] - location[1]);
						minDistance = Math.min(minDistance, distance);
					}
					return minDistance * lowestTypeCost;
				}
				
				function getMinimumTypeCost(costLookup){
					var lowestTypeCost = Infinity;
					for (var key in costLookup) {
						if (costLookup.hasOwnProperty(key)) {
							lowestTypeCost = Math.min(lowestTypeCost, costLookup[key]);
						}
					}
					return lowestTypeCost;
				}
			
			}]);
	
	});