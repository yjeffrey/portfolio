define(['./main', 'three', 'three.skyshader', 'modernizr'],
	function (directiveModule, THREE, SkyShader, Modernizr) {

		directiveModule
		.directive('waveDisplay', [function() {
			return {
				scope: {
					grid: '=grid',
					wireframe: '=wireframe',
					zFactor: '=zFactor'
				},
				link: function(scope, element, attrs) {
						
					var texture;

					var container, stats;

					var camera, scene, renderer;
					
					var meshXLength,
						meshYLength,
						meshXStep,
						meshYStep;
						
					var mesh;
					
					var cameraRadius = 500,
						cameraHeight = 100;

					var cross;
					
					var active = true;
					
					if (Modernizr.webgl){ 
						// texture = THREE.ImageUtils.loadTexture(
							// "assets/textures/watereditededited.jpg", {}, 
							// function() {
								// texture.wrapS = THREE.RepeatWrapping;
								// texture.wrapT = THREE.RepeatWrapping;
								// texture.repeat.set(16, 16);
								// init();
								// animate();
								// render();
							// });
						texture = THREE.ImageUtils.loadTexture(
							"assets/textures/blackwhite.jpg", {}, 
							function() {
								texture.wrapS = THREE.RepeatWrapping;
								texture.wrapT = THREE.RepeatWrapping;
								init();
								animate();
								render();
							});
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
						camera.position.y = cameraHeight;
						camera.position.x = cameraRadius / Math.pow(3, 0.5);
						camera.position.z = cameraRadius ;
						camera.lookAt(new THREE.Vector3(0,0,0));

						scene = new THREE.Scene();
						scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

						// world
						generateMesh();
						
						// lights
						light = new THREE.DirectionalLight(0xffffff, 1);
						light.position.set(
							-1* camera.position.x, 
							camera.position.y, 
							camera.position.z);
						scene.add(light);


						light = new THREE.AmbientLight(0x222222);
						scene.add( light );
						
						light = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.3 ); 
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
							meshXLength = scope.grid[0].length;
							meshYLength = scope.grid.length;
							meshXStep = cameraRadius * 3 / meshXLength;
							meshYStep =  cameraRadius * 3 / meshYLength;
							generateMesh();
						}
						for(var i = 0; i < meshYLength; ++i){
							for(var j = 0; j < meshXLength; ++j){
								mesh.geometry.vertices[i * meshXLength +  j].y
								= scope.grid[i][j] * scope.zFactor;
							}
						}
						mesh.geometry.verticesNeedUpdate = true;
						mesh.material.wireframe = scope.wireframe;
					}
					
					function generateMesh(){
						if(mesh != null){
							scene.remove(mesh);
						}
						var geometry = new THREE.Geometry();
					
						for(var i = 0; i < meshYLength; ++i){
							var y = i * meshYStep;
							for(var j = 0; j < meshXLength; ++j){
								geometry.vertices.push(
									new THREE.Vector3(
									j * meshXStep, 
									scope.grid[i][j] * scope.zFactor,
									y)
								);
							}
						}
						
						var material = new THREE.MeshBasicMaterial({
							map: texture
						});
						
						for(var i = 0; i < meshYLength - 1; ++i){
							for(var j = 0; j < meshXLength - 1; ++j){
								geometry.faces.push(
									new THREE.Face3(
									i * meshXLength +  j + 1,
									i * meshXLength +  j,
									(i+1) * meshXLength +  j + 1)
								);
								geometry.faces.push(
									new THREE.Face3(
									(i * meshXLength) +  j,
									(i+1) * meshXLength +  j,
									(i+1) * meshXLength  +  j + 1)
								);
								
								geometry.faceVertexUvs[ 0 ].push([
									new THREE.Vector2( 0, 0 ),
									new THREE.Vector2( 0, 1 ),
									new THREE.Vector2( 1, 0 ),    
								]);

								geometry.faceVertexUvs[ 0 ].push([
									new THREE.Vector2( 0, 1 ),
									new THREE.Vector2( 1, 1 ),
									new THREE.Vector2( 1, 0 ),    
								]);
							}
						}
						
						geometry.computeFaceNormals();
						geometry.computeVertexNormals();
					
						mesh = new THREE.Mesh( geometry, material );
						mesh.position.x = meshXStep * -1 * meshXLength  * 0.5;
						mesh.position.y = 0;
						mesh.position.z = meshYStep * -1 * meshYLength  * 0.5;
						
						mesh.updateMatrix();
						mesh.matrixAutoUpdate = false;
						mesh.geometry.dynamic = true;
						scene.add(mesh);
					}
				}
				
			};
		}]);

	});