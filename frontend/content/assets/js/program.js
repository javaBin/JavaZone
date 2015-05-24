(function(_, request, jz) {

	function program() {
		request('http://test.javazone.no/javazone-web-api/event/javazone_2014/sessions')
		.end(function(err, res) {
			if (err) {
				console.log(err);
				return;
			}

			console.log(res);
		});
	}

	jz.program = program;

})(window._, window.superagent, window.jz = window.jz || {});