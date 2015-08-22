(function(jz) {

    function journeyzone() {
        initializeMap();
        attachScrollListener();
    }

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
            styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#79BDE7"},{"visibility":"on"}]}]
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

    function attachScrollListener() {
        var nav = document.querySelector('.nav')
        document.addEventListener('scroll', _.throttle(function() {
            var height = document.querySelector('.mood').clientHeight;
            var scrolled = window.scrollY;
            if (scrolled > height && !nav.classList.contains('bg')) {
                nav.classList.add('bg');
            } else if (scrolled < height) {
                nav.classList.remove('bg');
            }
        }, 100));
    }

    jz.journeyzone = journeyzone;

})(window.jz = window.jz || {});