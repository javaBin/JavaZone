(function(_, jz) {

	jz.tickets = function() {
		var tickets = document.querySelectorAll('.ticket-types a');
		var jzTicket = tickets[0];
		var regularTicket = tickets[1];
		jzTicket.addEventListener('mouseenter', function() {
			regularTicket.classList.add('inactive');
		});

		jzTicket.addEventListener('mouseleave', function() {
			regularTicket.classList.remove('inactive');
		});

		regularTicket.addEventListener('mouseenter', function() {
			jzTicket.classList.add('inactive');
		});

		regularTicket.addEventListener('mouseleave', function() {
			jzTicket.classList.remove('inactive');
		});
	}

})(window._, window.jz = window.jz || {})