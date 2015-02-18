define(['./main', 'three', 'modernizr'],
	function (directiveModule, THREE, Modernizr) {

		directiveModule
		.directive('heatDisplay', [function() {
			return {
				scope: {
					grid: '=grid',
					zFactor: '=zFactor'
				},
				link: function(scope, element, attrs) {

					var container;

					var camera, scene, renderer;
					
					var meshXLength,
						meshYLength,
						meshZLength,
						meshXStep,
						meshYStep,
						meshZStep;
						
					var sphereMeshes,
						sphereGeometry = new THREE.SphereGeometry( 10, 16, 16);
					
					var cameraRadius = 400;
					
					var active = true;
					
					if (Modernizr.webgl){ 
						init();
						animate();
						render();
					} 
					else{
						var notAvailable = $('<div>' +
						'<p>WebGl is not supported by your browser/device</p><br><p>Please try Chrome or FireFox</p>' +
						  '</div>');
						container = element;
						container.css({
							'text-align': 'center',
							'vertical-align': 'middle',
							border: 'solid 1px black'
						});
						notAvailable.css({
							display: 'inline-block',
							'text-align': 'center',
							padding: '5px',
							display: 'inline-block'
						});
						notAvailable.appendTo(container);
					}
					
					scope.$on('$destroy', function(){
						active = false;
					});
					
					function init() {

						camera = 
							new THREE.PerspectiveCamera(60, 
							window.innerWidth / window.innerHeight, 
							1, 10000000);
						camera.position.z = 
							camera.position.x =
							camera.position.y = cameraRadius* 1.75;
						camera.lookAt(new THREE.Vector3(0,0,0));

						scene = new THREE.Scene();
						
						// world
						// generateMesh();
						
						// lights
						light = new THREE.DirectionalLight(0xffffff, 1);
						light.position.set(
							-1* camera.position.x, 
							camera.position.y, 
							camera.position.z);
						scene.add(light);


						light = new THREE.AmbientLight(0x222222);
						scene.add( light );
						
						// sky 
						var sky = new THREE.Sky();
						
						// Add Sun Helper
						sunSphere = new THREE.Mesh( new THREE.SphereGeometry( 20000, 300, 300 ),
							new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: false }));
						sunSphere.position.y = -700000;
						sunSphere.visible = true;
						
						var distance = 4000;
						var uniforms = sky.uniforms;
						uniforms.turbidity.value = 9;
						uniforms.reileigh.value = 0.1;
						uniforms.luminance.value = 0.9;
						uniforms.mieCoefficient.value = 0.0163;
						uniforms.mieDirectionalG.value = 0.49;
						var theta = Math.PI * (0.2 - 0.5);
						var phi = 2 * Math.PI * (0.25 - 0.5);
						sunSphere.position.x = distance * Math.cos(phi);
						sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta); 
						sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta); 
						sunSphere.visible = false;
						sky.uniforms.sunPosition.value.copy(sunSphere.position);
				
						scene.add( sky.mesh );
						scene.add( sunSphere );
						
						// renderer
						renderer = new THREE.WebGLRenderer({antialias: false});
						renderer.setClearColor( 0, 1 );
						renderer.setSize(window.innerWidth, window.innerHeight);

						container = element;
						container.append(renderer.domElement);
						renderer.domElement.style.width = "100%";
						renderer.domElement.style.height = "100%";
						
						window.addEventListener('resize', onWindowResize, false);
						
						scope.$on("$destroy", function() {
							window.removeEventListener('resize', onWindowResize);
						});
					}

					function onWindowResize() {
						camera.aspect = window.innerWidth / window.innerHeight;
						camera.updateProjectionMatrix();

						renderer.setSize(window.innerWidth, window.innerHeight);
						renderer.domElement.style.width = "100%";
						renderer.domElement.style.height = "100%";

						render();
					}

					function animate(){
						if(active){
							requestAnimationFrame(animate);
							render();
							
							camera.applyMatrix( 
									new THREE.Matrix4().makeRotationY( 0.005 )
							);
							camera.updateMatrixWorld();
						}
					}

					function render(){
						renderer.render(scene, camera);
						if(scope.grid == null){
						}
						else if(scope.grid.length == meshYLength &&
							scope.grid[0].length == meshXLength){
						}
						else{
							meshZLength = scope.grid[0][0].length;
							meshXLength = scope.grid[0].length;
							meshYLength = scope.grid.length;
							meshXStep = cameraRadius * 2 / meshXLength;
							meshYStep =  cameraRadius * 2 / meshYLength;
							meshZStep =  cameraRadius * 2 / meshZLength;
							generateMesh();
						}
						
						var n = 0;
						for( var i = 0; i < meshXLength; i++ ) {
							for( var j = 0; j < meshYLength; j++ ) {
								for( var k = 0; k < meshZLength; k++ ) {
									
									var sphereMesh = sphereMeshes[n];
									var color
										= sphereMesh.material.color;
									
									var intensity = scope.grid[i][j][k];
									color.setHSL(toHSL(intensity), 1, 0.5 );
									
									++n;
									sphereMesh.scale.x =
										sphereMesh.scale.y =
										sphereMesh.scale.z = Math.log(intensity+2)/2;
								}
							}
						}
						
					}
					
					function generateMesh(){
						if(sphereMeshes != null){
							for(var i = 0; i < sphereMeshes.length; ++i){
								scene.remove(sphereMeshes[i]);
							}
						}
						
						sphereMeshes = [];
						
						for( var i = 0; i < meshXLength; i++ ) {
							for( var j = 0; j < meshYLength; j++ ) {
								for( var k = 0; k < meshZLength; k++ ) {
									
									var intensity = scope.grid[i][j][k];
									var color = new THREE.Color( 1,1,1 );
									color.setHSL(toHSL(intensity), 1, 0.5 );
									
									var material = new THREE.MeshBasicMaterial( {color: color} );
									var sphere 
										= new THREE.Mesh( sphereGeometry, material );
										
									sphere.position.x = (i+.5) * meshXStep - meshXLength * meshXStep * 0.5;
									sphere.position.z = (j+.5) * meshYStep - meshYLength * meshYStep * 0.5;
									sphere.position.y = (k+1) * meshZStep - meshZLength * meshZStep * 0.5;
									
									sphereMeshes.push(sphere);
									scene.add(sphere);
								}
							}
						}
					}
					
					function toHSL(number){
						var val = -1*(number.toPrecision(2)/1800) + 0.7;
						if(val > 1){
							return 1;
						}
						else if(val < 0){
							return 0;
						}
						else{
							return val;
						}
					}
				}
				
			};
		}]);

	});