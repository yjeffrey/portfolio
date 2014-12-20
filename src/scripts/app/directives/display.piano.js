define(['jquery', './main'],
	function ($, directiveModule) {

		directiveModule
		.directive('piano', ['$timeout', function($timeout) {
			return {
				scope:{
					play: '=play',
					activeKeys: '=activeKeys',
					notWorking: '=visualDisable'
				},
				templateUrl: '/partials/directive.piano.html',
				transclude: true,
				link: function(scope, element, attrs) {
					if (!!!(window.webkitAudioContext || window.AudioContext)){
						scope.notWorking = true;
						return;
					}
					else{
						var keys = [122,115,120,100,99,118,103,98,104,110,106
							,109,44,108,46,59,47,113,50,119,51,101,52,114,116];
						
						var buttons = element.children('ol').children('li');
						
						scope.keypress = function(e) {
							var code = e.keyCode || e.which;
							var i;
							
							for(var i = 0; i < keys.length; ++i){
								if(keys[i] == code){
									(function(i){
										scope.play(i);
										scope.activeKeys[i] = true;
										$timeout(function(){
												scope.activeKeys[i] = false;
										}, 200);
									})(i);
								}
							}
						};
					}
				}
			};
		}]);

	});