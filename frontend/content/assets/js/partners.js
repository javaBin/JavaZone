(function(_, jz) {

	if (!String.format) {
		String.format = function(format) {
			var args = Array.prototype.slice.call(arguments, 1);
			return format.replace(/{(\d+)}/g, function(match, number) { 
				return typeof args[number] != 'undefined' ? args[number] : match;
			});
		};
	}

	jz.partners = function() {
		var imagePath = '/assets/img/partners/';
		var partners = document.querySelector('.partner-list');
		var partnerList = _(jz.data.partners)
			.shuffle()
			.map(function(partner) {
				return String.format('<li><a href="{0}"><img src="{1}" alt="{2}"></a>', partner[2], imagePath + partner[1], partner[0]);
			})
			.join('');
		partners.innerHTML = String.format('<ul class="cf">{0}</ul>', partnerList);
	}

})(window._, window.jz = window.jz || {});