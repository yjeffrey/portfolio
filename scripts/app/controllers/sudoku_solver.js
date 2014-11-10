define(['angular', './main', '../services/all'],
	function (angular, controllerModule, services) {
	
		controllerModule
		.controller('SudokuSolverController', ['$scope', 'PageManipulationService', 
		function($scope, PageManipulationService) {
			var DONE = 0,
				IMPOSSIBLE = 1,
				INCOMPLETE = 2,
				MAX_SOLUTION_COUNT = 27;
			
			$scope.MAX_SOLUTION_COUNT = MAX_SOLUTION_COUNT;
			var sudokuGame = [
				[null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null]
			];
			
			sudokuGame[0][5] = 9;
			sudokuGame[0][6] = 6;
			sudokuGame[0][7] = 1;
			sudokuGame[0][8] = 3;
			
			sudokuGame[1][1] = 6;
			sudokuGame[1][3] = 2;
			sudokuGame[1][5] = 7;
			sudokuGame[1][6] = 9;
			sudokuGame[1][8] = 5;
			
			sudokuGame[2][1] = 5;
			sudokuGame[2][7] = 8;
			sudokuGame[2][8] = 2;
			
			sudokuGame[3][1] = 4;
			sudokuGame[3][4] = 5;
			sudokuGame[3][5] = 3;
			sudokuGame[3][8] = 7;
			
			sudokuGame[4][1] = 1;
			sudokuGame[4][4] = 9;
			sudokuGame[4][7] = 3;
			
			sudokuGame[5][0] = 7;
			sudokuGame[5][3] = 6;
			sudokuGame[5][4] = 1;
			sudokuGame[5][7] = 2;
			
			sudokuGame[6][1] = 9;
			sudokuGame[6][7] = 6;
			
			sudokuGame[7][2] = 6;
			sudokuGame[7][3] = 4;
			sudokuGame[7][5] = 1;
			sudokuGame[7][7] = 5;
			
			sudokuGame[8][1] = 8;
			sudokuGame[8][2] = 4;
			sudokuGame[8][3] = 9;
			
			$scope.sudokuGame = sudokuGame;
			
			$scope.solve = function(){
				var input = $scope.sudokuGame;
				
				var initialState = [];
				
				var value;
				var row;
				for(var i = 0; i < 9; ++i){
					var row = [];
					initialState.push(row);
					for(var j = 0; j < 9; ++j){
						value = input[i][j];
						if(value == null){
							row.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
						}
						else{
							row.push([value]);
						}
					}
				}
				$scope.solutionsCount = 0;
				$scope.solutions = innerSolve(initialState);
				if($scope.solutions.length > 0){
					PageManipulationService.scrollTo("#SudokuSolutions");
				}
			};
			
			function innerSolve(state){
				var status = doArc(state);
				if($scope.solutionsCount >= MAX_SOLUTION_COUNT){
					return [];
				}
				else if(status == DONE){
					++$scope.solutionsCount;
					return [state];
				}
				else if(status == INCOMPLETE){
					var halfStateA = angular.copy(state),
						halfStateB = angular.copy(state);
					
					for(var i = 0; i < 9; ++i){
						for(var j = 0; j < 9; ++j){
							if(state[i][j].length > 1){
								var copy = state[i][j].slice(0);
								var halfLength = Math.ceil(copy.length / 2);    
								var leftSide = copy.splice(0, halfLength);
								
								halfStateA[i][j] = copy;
								halfStateB[i][j] = leftSide;
								
								return innerSolve(halfStateA).concat(innerSolve(halfStateB));
							}
						}
					}
				}
				else{
					return [];
				}
			}
			
			function doArc(state){
				var square;
				var wasUpdated = true;
				while(wasUpdated){
					wasUpdated = false;
					for(var i = 0; i < 9; ++i){					
						for(var j = 0; j < 9; ++j){
							wasUpdated = wasUpdated 
								|| doArcOnSquare(state, i ,j);
						}
					}
				}
				return getStatus(state);
			}
			
			function getStatus(state){
				for(var i = 0; i < 9; ++i){
					for(var j = 0; j < 9; ++j){
						if(state[i][j].length == 0){
							return IMPOSSIBLE;
						}
						else if(state[i][j].length > 1){
							return INCOMPLETE;
						}
					}
				}
				return DONE;
			}
			
			function doArcOnSquare(state, x, y){
				var square = state[x][y],
					wasUpdated = false;
				
				var positionFulfilled;
				var falseIndex;
				
				positionFulfilled = new Array(9);
				for(var i = 0; i < 9; ++i){
					if(i != y){
						wasUpdated 
							= wasUpdated || updateExclusiveRequirement(state[x][i], 
								square, 
								positionFulfilled);
					}
				}
				wasUpdated 
					= wasUpdated || updateInclusionRequirement(square, 
											positionFulfilled);
				
				positionFulfilled = new Array(9);
				for(var i = 0; i < 9; ++i){
					if(i != x){
						wasUpdated 
							= wasUpdated || updateExclusiveRequirement(state[i][y], 
							square, 
							positionFulfilled);
					}
				}
				wasUpdated 
					= wasUpdated || updateInclusionRequirement(square, 
											positionFulfilled);
				
				positionFulfilled = new Array(9);
				var groupingX = Math.floor(x / 3);
				var groupingY = Math.floor(y / 3);
				
				for(var i = 0; i < 3; ++i){
					for(var j = 0; j < 3; ++j){
						if(groupingX*3+i != x || groupingY*3+j != y){
							wasUpdated = wasUpdated 
								|| updateExclusiveRequirement(
									state[groupingX*3+i][groupingY*3+j], 
									square, 
									positionFulfilled);
						}
					}
				}
				wasUpdated 
					= wasUpdated || updateInclusionRequirement(square, 
											positionFulfilled);
				
				return wasUpdated;
			}

			function updateExclusiveRequirement(squareToUpdate, square, possArray){
				var wasUpdated = false;
				if(square.length == 1){
					var index = squareToUpdate.indexOf(square[0]);
					if (index > -1) {
						squareToUpdate.splice(index, 1);
						wasUpdated = true;
					}
				}
				for(var j = 0; j < squareToUpdate.length; ++j){
					possArray[squareToUpdate[j]] = true;
				}
				return wasUpdated;
			}
			
			function updateInclusionRequirement(square, array){
				var index;
				
				for(var i = 1; i <= 9; ++i){
					if(!array[i] && index == null){
						index = i;
					}
					else if(!array[i] && index != null){
						return false;
					}
				}
				
				if(index != null){
					var updated = false;
					for(var i = 0; i < square.length; ++i){
						if(square[i] != index){
							square.splice(i, 1);
							updated = true;
						}
					}
					return updated;
				}
				else{
					return false;
				}
			}
			
		}]);
	
	});