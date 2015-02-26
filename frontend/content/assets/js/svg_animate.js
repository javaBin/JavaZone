(function(window, Velocity, _) {

	window.svgAnimate = function(el, props) {
		this.el = el;
		this.props = props;
		this.toggled = false;
		this.animElements = this.getElements();
		this.registerListener();
	}

	svgAnimate.prototype.getElements = function() {
		var _this = this;
		return this.props.animation.map(function(element) {
			return {
				node: _this.el.querySelector(element.el),
				from: element.animation.from,
				to: element.animation.to,
				props: element.props
			};
		});
	};

	svgAnimate.prototype.registerListener = function() {
		var _this = this;
		var eventType = Modernizr.touch ? 'touchstart' : 'click';
		this.el.addEventListener(eventType, function() { _this.toggle(); }, false);
	};

	svgAnimate.prototype.toggle = function() {
		var to = this.toggled ? 'from' : 'to';
		this.animElements.forEach(function(element) {
			var props = _.defaults({}, element.props, { duration: element.props.duration || 400, easing: 'easeOutExpo' })
			Velocity(element.node, element[to], props);
		});

		this.toggled = !this.toggled;
		this.props.action && this.props.action();
	};

})(window, window.Velocity, window._);