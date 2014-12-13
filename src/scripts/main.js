'use strict';
	
requirejs.config({
	baseUrl: 'scripts',
	paths: {
		"angular": "//ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular.min",
		"angular-strap": "//cdnjs.cloudflare.com/ajax/libs/angular-strap/2.1.2/angular-strap.min",
		"angular-strap.tpl": "//cdnjs.cloudflare.com/ajax/libs/angular-strap/2.1.2/angular-strap.tpl.min",
        "bootstrap": "//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min",
        "c3": "//cdnjs.cloudflare.com/ajax/libs/c3/0.3.0/c3.min",
        "d3": "//cdnjs.cloudflare.com/ajax/libs/d3/3.4.13/d3.min",
		"jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min",
		"math": "//cdnjs.cloudflare.com/ajax/libs/mathjs/1.0.1/math.min",
		"mathjax": "//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML",
		"modernizr": "//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min",
		"three": "//cdnjs.cloudflare.com/ajax/libs/three.js/r69/three.min",
		"three.orbit-control": "lib/OrbitControls",
        "ui-router": "//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.11/angular-ui-router.min" 
	},
    shim : {
        "angular" : { 
			"deps" :['jquery'],
			"exports": "angular"
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
        "mathjax" : { 
			"exports": "MathJax"
		},
        "modernizr" : { 
			"exports": "Modernizr"
		},
        "three" : { 
			"exports": "THREE"
		},
        "three.orbit-control" : { 
			"deps" :['three'] 
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
			messageStyle: "none"
		});

		angular.element(document).ready(function() {
			angular.bootstrap(document, [app.name]);
			$('body').removeClass("loading");
			console.log("Finished Bootstrapping");
		});

	});