define(['jquery', './main'],
	function ($, directiveModule) {
	
		directiveModule
		.directive('jumbtronBackground', ['$timeout', function($timeout) {
			return {
				link: function(scope, element, attrs) {
					
					var m_canvas = document.createElement('canvas');
					m_canvas.width = element.parent().outerWidth();
					m_canvas.height = element.parent().outerHeight();
					
					var m_context = m_canvas.getContext("2d");
					
					var step = 3;
					element.css("background-size", "100%;");
					
					var rerender = function(){
						m_canvas.width = element.parent().outerWidth();
						m_canvas.height = element.parent().outerHeight();
						m_context.fillStyle="rgb(47, 47, 47)";
						m_context.fillRect(0,0,m_canvas.width,m_canvas.height);
						
						var step = m_canvas.width * 2 / m_canvas.height;
							step += 3;
							
						for(var i = 0; i < m_canvas.width + m_canvas.height; i+= step){
							m_context.fillStyle="#300";
							m_context.beginPath();
							m_context.moveTo(i,0);
							m_context.lineTo(-i, m_canvas.height);
							m_context.closePath();
							m_context.stroke();
						}
						element.css("background",
							"url(" + m_canvas.toDataURL() + ")");
					}
					$(window).resize(function() {
						rerender()
					});
					
					rerender();
				}
			};
		}]);
	
	});