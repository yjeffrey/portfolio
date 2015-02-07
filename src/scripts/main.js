'use strict';
	
requirejs.config({
	baseUrl: 'scripts',
	paths: {
		"angular": "//ajax.googleapis.com/ajax/libs/angularjs/1.3.12/angular.min",
		"animate-animate": "//ajax.googleapis.com/ajax/libs/angularjs/1.3.12/angular-animate.min",
		"angular-strap": "//cdnjs.cloudflare.com/ajax/libs/angular-strap/2.1.6/angular-strap.min",
		"angular-strap.tpl": "//cdnjs.cloudflare.com/ajax/libs/angular-strap/2.1.6/angular-strap.tpl.min",
        "bootstrap": "//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min",
        "c3": "//cdnjs.cloudflare.com/ajax/libs/c3/0.4.9/c3.min",
        "d3": "//cdnjs.cloudflare.com/ajax/libs/d3/3.5.3/d3.min",
		"jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min",
		"leaflet": "//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet",
		"math": "//cdnjs.cloudflare.com/ajax/libs/mathjs/1.2.0/math.min",
		"mathjax": "//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML",
		"modernizr": "//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min",
		"priority-queue": "/scripts/lib/priority-queue.min",
		"socket.io": "/socket.io/socket.io",
		"three": "//cdnjs.cloudflare.com/ajax/libs/three.js/r70/three.min",
        "ui-router": "//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.13/angular-ui-router.min" 
	},
    shim : {
        "angular" : {
			"deps" :['jquery'],
			"exports": "angular"
		},
        "animate-animate" : {
			"deps" :['angular']
		},
        "angular-strap" : {
			"deps" :['angular']
		},
        "angular-strap.tpl" : {
			"deps" :['angular-strap']
		},
        "bootstrap" : {
			"deps" :['jquery'] 
		},
        "c3" : {
			"deps" :['d3'],
			"exports": "angular"
		},
        "d3" : {
			"deps" :['jquery'],
			"exports": "d3"
		},
        "leaflet" : {
			"exports": "L"
		},
        "mathjax" : {
			"exports": "MathJax"
		},
        "modernizr" : {
			"exports": "Modernizr"
		},
        "socket.io" : {
			"exports": "io"
		},
        "three" : {
			"exports": "THREE"
		},
        "ui-router" : {
			"deps" :['angular'] 
		},
    }
});

requirejs(['angular',
			'jquery',
			'app/main',
			'mathjax',
			'bootstrap'],
	function (angular, $, app, MathJax){
	
		MathJax.Hub.Config({
			extensions: ["jsMath2jax.js"],
			showMathMenu: false,
			showProcessingMessages: false,
			messageStyle: "none",
			"HTML-CSS": { linebreaks: { automatic: true } },
			SVG: { linebreaks: { automatic: true } }
		});
			
		$(document).ready(function () {
			$(document).click(function (event) {
				var clickover = $(event.target);
				var navBar =  $(".navbar-collapse");
				var _opened = navBar.hasClass("in");
				_opened = _opened && navBar.hasClass("navbar-collapse");
				if (_opened === true && !clickover.hasClass("navbar-toggle")) {
					$("button.navbar-toggle").click();
				}
			});
		});

		angular.element(document).ready(function() {
			angular.bootstrap(document, [app.name]);
			
			console.log("Finished Bootstrapping");
		});

	});