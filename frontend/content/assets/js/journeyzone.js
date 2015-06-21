(function(jz) {

    function initializeMap() {
        var center = new google.maps.LatLng(78.320019, 15.580244);
        var longyearbyenPos = new google.maps.LatLng(78.320019, 15.580244);
        var barentsburgPos = new google.maps.LatLng(78.136230, 14.217940);
        var isfjordPos = new google.maps.LatLng(78.072168, 13.628250);
        var options = {
            center:  center,
            zoom: 6,
            disableDefaultUI: true,
            scrollwheel: false,
            draggable: false,
            styles: [{"featureType":"landscape.man_made","elementType":"geometry.stroke","stylers":[{"color":"#c7c7c7"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#a9d8ae"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","elementType":"geometry.fill","stylers":[{"color":"#f2dccd"}]},{"featureType":"poi.medical","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#a9d8ae"}]},{"featureType":"poi.sports_complex","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"saturation":-100},{"lightness":99}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#808080"},{"lightness":54}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#f2f2f2"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"color":"#e7e7e7"}]},{"featureType":"water","elementType":"all","stylers":[{"saturation":43},{"lightness":-11},{"hue":"#0088ff"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#66cae1"}]}]
        };
        var map = new google.maps.Map(document.getElementsByClassName('map')[0], options);

        var icon = {
            path: 'M17,9 C12.8575,9 9.5,12.3575 9.5,16.5 C9.5,20.6425 12.8575,24 17,24 C21.1425,24 24.5,20.6425 24.5,16.5 C24.5,12.3575 21.1425,9 17,9 L17,9 Z M1,17 C1,8.178 8.178,1 17,1 C25.822,1 33,8.178 33,17 C33,24.034668 27.545166,31.9897461 17.004,42.685 C6.32055664,31.9897461 1,24.0964355 1,17 Z',
            fillColor: '#a10035',
            fillOpacity: 1,
            strokeWeight: 0,
            scale: .8,
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(13, 35)
        }

        var longyearbyen = new google.maps.Marker({
            position: longyearbyenPos,
            title: 'Longyearbyen',
            icon: icon
        });

        var barentsburg = new google.maps.Marker({
            position: barentsburgPos,
            title: 'Barentsburg',
            icon: icon
        });

        var isfjord = new google.maps.Marker({
            position: isfjordPos,
            title: 'Isfjord Radio',
            icon: icon
        });

        longyearbyen.setMap(map);
        barentsburg.setMap(map);
        isfjord.setMap(map);
    }

    jz.journeyzone = initializeMap;

})(window.jz = window.jz || {});