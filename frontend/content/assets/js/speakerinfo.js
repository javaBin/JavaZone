(function(jz, _, Velocity) {

    jz.speakerinfo = function() {
        createRoomWidget();
        showRoom('room-1');
    };

    function createRoomWidget() {
        var rooms = document.querySelectorAll('.room-list li');
        _.each(rooms, function(room) { room.addEventListener('click', getRoom); });
    }

    function getRoom(ev) {
        var roomId = ev.target.dataset.id;
        showRoom(roomId);
    }

    function showRoom(room) {
        var button = document.querySelector('[data-id=' + room + ']');
        var roomInfo = document.querySelector('.rooms .' + room);
        if (!roomInfo || _.includes(roomInfo.classList, 'active'))
            return;

        var activeButton = document.querySelector('.button.active');
        if (activeButton)
            activeButton.classList.remove('active');

        button.classList.add('active');
        var activeRoomInfo = document.querySelector('.room.active');
        if (activeRoomInfo)
            Velocity(activeRoomInfo, 'fadeOut', {
                complete: function() {
                    activeRoomInfo.classList.remove('active');
                    fadeIn(roomInfo);
                }
            });
        else
            fadeIn(roomInfo);
    }

    function fadeIn(room) {
        Velocity(room, 'fadeIn', {
            complete: function() {
                room.classList.add('active');
            }
        });
    }

})(window.jz = window.jz || {}, window._, window.Velocity);