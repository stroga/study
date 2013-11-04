(function($) {
	$.fn.makePopup = function(options) {
		var self = this;
		var options = $.extend({
			timeOut: 500,
			animateTime: 1000,
			target: false
		}, options);

		(function() {
			self = $(options.target) ? $(options.target) : self;
			$("body").css("overflow", "hidden");
			//window size
			var winHeight = $(window).height();
			var winWidth = $(window).width();
			//picture size
			var contentHeight = self.height();
			var contentWidth = self.width();
			$("body").css("overflow", "auto");

			function show() {
				self.css({
					"z-index": "101",
					"position": "absolute",
					"display": "block",
					left: function(i, val) {
						return val = (winWidth / 2 - contentWidth / 2) > 0 ?
							(winWidth / 2 - contentWidth / 2) : 0;
					},
					top: function(i, val) {
						return val = (winHeight / 2 - contentHeight / 2) > 0 ?
							(winHeight / 2 - contentHeight / 2) : 0;
					},
					"height": 0,
					"width": contentWidth
				}).animate({
					width: contentWidth,
					height: contentHeight

				}, options.animateTime, function() {
					self.css("height", "");
				}).addClass("active");
			}

			if (!self.hasClass("active")) {
				setTimeout(function() {
					show();
				}, options.timeOut);
			}

			//make dark background
			$("<div></div>").appendTo("body").addClass("show_dark");

			$(window).resize(function() {
				$(".active").css({
					height: function(val) {
						return val = $(".active").height();
					},
					width: function(val) {
						return val = $(".active").width();
					},
					left: function(val) {
						return val = ($(window).width() / 2 - $(this).width() / 2) > 0 ?
							($(window).width() / 2 - $(this).width() / 2) : 0;
					},
					top: function(val) {
						return val = ($(window).height() / 2 - $(this).height() / 2) > 0 ?
							($(window).height() / 2 - $(this).height() / 2) : 0;
					}
				});
			});
		})()
	};

	return this;
})(jQuery);