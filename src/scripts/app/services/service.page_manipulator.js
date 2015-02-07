define(['jquery', './main'],
	function ($, servicesModule) {
	
		servicesModule.factory('PageManipulationService', function() {
		
			return {
				scrollTo: function(selector, speed){
					try{
						$('html,body')
						.unbind()
						.animate({
							scrollTop: $(selector).offset().top - 60
						}, speed || 'slow');
					}
					catch(e){
					}
				},
				goToTop: function(){
					$('html,body').scrollTop(0);
				}
			};
		});
	});