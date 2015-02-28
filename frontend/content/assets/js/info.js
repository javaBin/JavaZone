(function(_, jz){

	function initializeMap() {
		var spektrum = new google.maps.LatLng(59.912993, 10.754742);
		var options = {
			center:  spektrum,
			zoom: 15,
			disableDefaultUI: true,
			scrollwheel: false,
			styles: [{"featureType":"landscape.man_made","elementType":"geometry.stroke","stylers":[{"color":"#c7c7c7"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#a9d8ae"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","elementType":"geometry.fill","stylers":[{"color":"#f2dccd"}]},{"featureType":"poi.medical","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#a9d8ae"}]},{"featureType":"poi.sports_complex","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"saturation":-100},{"lightness":99}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#808080"},{"lightness":54}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#f2f2f2"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"color":"#e7e7e7"}]},{"featureType":"water","elementType":"all","stylers":[{"saturation":43},{"lightness":-11},{"hue":"#0088ff"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#66cae1"}]}]
			// styles: [{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#d3d3d3"}]},{"featureType":"transit","stylers":[{"color":"#808080"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#b3b3b3"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"weight":1.8}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#d7d7d7"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ebebeb"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#a7a7a7"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#efefef"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#696969"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#737373"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#d6d6d6"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#dadada"}]}]
		};
		var map = new google.maps.Map(document.getElementsByClassName('map')[0], options);

		var icon = {
			path: 'M17,9 C12.8575,9 9.5,12.3575 9.5,16.5 C9.5,20.6425 12.8575,24 17,24 C21.1425,24 24.5,20.6425 24.5,16.5 C24.5,12.3575 21.1425,9 17,9 L17,9 Z M1,17 C1,8.178 8.178,1 17,1 C25.822,1 33,8.178 33,17 C33,24.034668 27.545166,31.9897461 17.004,42.685 C6.32055664,31.9897461 1,24.0964355 1,17 Z',
			fillColor: '#a10035',
			fillOpacity: 1,
			strokeWeight: 0,
			scale: .8
		}

		var marker = new google.maps.Marker({
			position: spektrum,
			title: 'Oslo Spektrum',
			icon: icon
		});

		marker.setMap(map);
	}

	jz.info = {
		initializeMap: initializeMap
	};

})(window._, window.jz = window.jz || {});
