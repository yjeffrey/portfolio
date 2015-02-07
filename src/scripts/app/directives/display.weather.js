define(['./main', 'leaflet', 'jquery', 'c3'],
	function(directiveModule, L, $, c3) {

		directiveModule
		.directive('weatherDisplay', ['$interval', '$timeout', 'PageManipulationService',
		function($interval, $timeout, PageManipulationService) {
			return {
				scope: {
					stations: "=stations",
					stationClick: "=stationClick"
				},
				templateUrl: '/partials/directive.weather.html',
				transclude: true,
				link: function(scope, element, attrs) {
					scope.station = null;
					
					var TEMPERATURE = 'temperature';
					var PRESSURE = 'pressure';
					var HUMIDITY = 'relativeHumidity';
					
					scope.TEMPERATURE = TEMPERATURE;
					scope.PRESSURE = PRESSURE;
					scope.HUMIDITY = HUMIDITY;
					
					scope.state = TEMPERATURE;
					
					scope.range = [];
					
					var ids = [
						'#ReadingTemperaturePlot',
						'#ReadingPressurePlot',
						'#ReadingHumidityPlot',
						'#ReadingVisibilityPlot'
					];
					
					var charts = [];
					
					for(var i = 0; i < 100; ++i){
						scope.range.push(colorTemperatureToHSL(i/100));
					}
					
					var mapboxUrl = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';
					var mapboxAttribution =
						'<a href="http://www.mapbox.com/about/maps/" target="_blank">' +
						'MapBox Terms &amp; Feedback</a>';
					
					
					var grayscale = L.tileLayer(mapboxUrl, {id: 'examples.map-i87786ca', attribution: mapboxAttribution}),
						streets   = L.tileLayer(mapboxUrl, {id: 'examples.map-i86nkdio', attribution: mapboxAttribution});

					var map = L.map('map', {
						center: [67, -107],
						zoom: 3,
						layers: [streets]
					});
					
					var interval = $interval(function(){
						if(scope.station != null &&
							scope.station.id != null){
							scope.stationClick(scope.station.id,
								function(station){
									if(station == null){
										scope.station = null;
									}
									else{
										scope.station = station;
									}
								});
						}
					}, 15000);
					
					scope.$on('$destroy', function() {
						if(interval != null){
							$interval.cancel(interval);
						}
						for(var i = 0; i < charts.length; ++i){
							charts[i].destroy();
						}
						map.remove();
					});
					
					var baseMaps = {
						"Streets": streets,
						"Grayscale": grayscale
					};
					
					L.control.layers(baseMaps).addTo(map);
					
					var myLayer = L.geoJson(null, {
							style: function(feature) {
								return {color: "#ff0000"};
							},
							onEachFeature: onEachFeature,
							pointToLayer: pointToLayer
						}).addTo(map);
						
					var info = L.control();

					info.onAdd = function (map) {
						this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
						this.update();
						return this._div;
					};

					// method that we will use to update the control based on feature properties passed
					info.update = function (property) {
						this._div.innerHTML = '<h4>Canadian Weather Stations</h4>' +  (property ?
							'<b>' + property.name + '</b><br/>' +
							'<b>on ' + property.readings[0].timestamp + '</b><br/>' +
							"<table>" +
								"<tr>" +
									'<td><b>Temperature:</b></td>' + 
									'<td>' + (property.readings[0].temperature.value || 'N/A') + ' Celsius </td>' +
								"</tr>" +
								"<tr>" +
									'<td><b>Pressure:</b></td>' +
									'<td>' + (property.readings[0].pressure.value || 'N/A') + ' KPa </td>' +
								"</tr>" +
								"<tr>" +
									'<td><b>Rel.Humidity:</b></td>' + 
									'<td>' + (property.readings[0].relativeHumidity.value || 'N/A') + ' % </td>' +
								"</tr>" +
							"</table>"
							: 'Hover over a station');
					};

					info.addTo(map)
					
					scope.$watch('[stations,state]', function() {
						redraw();
					}, true);
					scope.$watch('station.id', function() {
						if(scope.station != null && typeof scope.station != 'string'){
							scope.stationClick(scope.station.id,
								function(station){
									if(station == null){
										scope.station = null;
									}
									else{
										scope.station = station;
										showMoreDetails(station);
									}
								});
						}
					}, true);
					
					function redraw(){
						if(scope.stations == null){
							return;
						}
						
						var geojsonFeature = [];
						for(var i = 0; i < scope.stations.length; ++i){
							var station = scope.stations[i];
							geojsonFeature.push({
								"type": "Feature",
								"properties": {
									"name": station.station_name,
									"id": station.id,
									"readings": station.readings
								},
								"geometry": {
									"type": "Point",
									"coordinates": [station.longitude, station.latitude]
								}
							});
						}
						
						myLayer.clearLayers(); 
						myLayer.addData(geojsonFeature);
						
						if(scope.station == null || scope.station.id == null){
							return;
						}
						
						for(var i = 0; i < scope.stations.length; ++i){
							if(scope.stations[i].id == scope.station.id){
								return scope.stationClick(scope.station.id,
									function(station){
										if(station == null){
											scope.station = null;
										}
										else{
											scope.station = station;
										}
									});
							}
						}
					}
					
					function pointToLayer(feature, latlng) {
						var readings = feature.properties.readings;
						var latestReading = null;
						for(var i = 0; i < readings.length; ++i){
							if(latestReading == null ||
								latestReading.timestamp < 
								readings[i].timestamp){
								latestReading = readings[i];
							}
						}
						if(latestReading == null){
							return L.circleMarker(latlng, {
								radius: 8,
								fillColor: "black",
								stroke: true,
								color: "black",
								dashArray: "5 5",
								weight: 1,
								opacity: 1,
								fillOpacity: 0.8
							});
						}
						var color = latestReading[scope.state].value;
						if(color == null){
							color = "black";
						}
						else{
							if(scope.state == TEMPERATURE){
								color = (color + 50) / 100;
							}
							else if(scope.state == PRESSURE){
								color = (color - 100) / 9;
							}
							else if(scope.state == HUMIDITY){
								color = color / 100;
							}
							color = colorTemperatureToHSL(color);
						}
						return L.circleMarker(latlng, {
							radius: 8,
							fillColor: color,
							stroke: true,
							color: "black",
							dashArray: "5 5",
							weight: 1,
							opacity: 1,
							fillOpacity: 0.8
						});
					}
					
					function highlightFeature(e) {
						var layer = e.target;

						layer.setStyle({
							weight: 5,
							color: '#666',
							dashArray: '',
							fillOpacity: 0.7
						});

						if (!L.Browser.ie && !L.Browser.opera) {
							layer.bringToFront();
						}
						info.update(layer.feature.properties);
					}
					
					function onEachFeature(feature, layer) {
						layer.on({
							mouseover: highlightFeature,
							mouseout: resetHighlight,
							click: zoomToFeature
						});
					}
					
					function resetHighlight(e) {
						myLayer.resetStyle(e.target);
						info.update();
					}

					function zoomToFeature(e) {
						map.fitBounds(e.target.getBounds());
						map.setZoom(10);
						scope.stationClick(e.target.feature.properties.id,
							function(station){
								if(station == null){
									scope.station = null;
								}
								else{
									scope.station = station;
									showMoreDetails(station);
								}
							});
					}
					
					function showMoreDetails(station){
						if(station == null){
							return;
						}
						for(var i = 0; i < charts.length; ++i){
							charts[i].destroy();
						}
						
						var readings = station.readings;
						var xs = ['x'];
						var temperatures = ['Temperature in C'];
						var pressures = ['Pressure in KPa'];
						var relHumidities = ["Rel. Humidity in %"];
						var visibilities = ['Visibility in Km'];
						
						var reading;
						
						for(var i = 0; i < readings.length; ++i){
							reading = readings[i];
							xs.push(reading.timestamp);
							temperatures.push(reading.temperature.value);
							pressures.push(reading.pressure.value);
							relHumidities.push(reading.relativeHumidity.value);
							visibilities.push(reading.visibility.value);
						}
						var plots = [
							temperatures,
							pressures,
							relHumidities,
							visibilities
						];
						var labels = [
							'Celsius',
							'Kilo-Pascals',
							'%',
							'Kilometers'
						];

						for(var i = 0; i < plots.length; ++i){
							charts.push(c3.generate({
								bindto: ids[i],
								data: {
									x: 'x',
									columns: [
										xs,
										plots[i]
									]
								},
								axis: {
									x: {
										type: 'timeseries',
										tick: {
											rotate: 75,
											format: function(x){ 
												return x.toLocaleDateString() + " "
												+ x.toLocaleTimeString(); 
											}
										},
										height: 120
									},
									y : {
										tick: {
											format: function(d){ 
												if(d != null){
													return d.toPrecision(5);
												}
												else{
													return null;
												}
											}
										},
										label: {
											text: labels[i],
											position: 'outer-middle'
										}
									}
								},
								legend: {
									show: false
								},
								onrendered: function(){
									if(this.svg != null && this.svg[0] != null){
										$(this.svg[0]).css("overflow", "visible")
									}
								}
							}));
						}
						PageManipulationService.scrollTo("#StationDetails", 1000);
					}
						

					function colorTemperatureToHSL(temp){
						if(temp < 0) temp = 0;
						if(temp > 1) temp = 1;
						var h = (1.0 - temp) * 240;
						return "hsla(" + Math.round(h) + ", 100%, 50%,1)";
					}
					
				}
			};
		}]);

	});	