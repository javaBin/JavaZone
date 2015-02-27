(function(_, jz, $) {

	jz.contact = function() {
		var superstarsDiv = $('.javabinsuperstars');
		_(jz.data.helter)
			.shuffle()
			.map(function(helt) {
				console.log('helt', helt);
				var heltDiv = $('<a/>')
					.addClass('javabiner')
					.attr('href', helt[2])
					.attr('target', '_blank');
				heltDiv.append(
					$('<div/>')
						.css('background-image', 'url(' + helt[1]  +')')
				);
				heltDiv.append(
					$('<p/>').append($('<span>').text(helt[0]))
				);
				
				superstarsDiv.prepend(heltDiv);
			}).value();
	}

})(window._, window.jz = window.jz || {}, window.$);