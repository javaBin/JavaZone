(function(_, jz){

	function initializeMap() {
		var options = {
			center:  {lat: 59.912993, lng: 10.754742},
			zoom: 15,
			disableDefaultUI: true,
			scrollwheel: false
		};
		var map = new google.maps.Map(document.getElementsByClassName('map')[0], options);
	}

	jz.info = {
		initializeMap: initializeMap
	};

})(window._, window.jz = window.jz || {});