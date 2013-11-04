"use strict"

var Slider = (function () {
/*#################################   HELPERS && GENERAL FUNCTIONS   ######################*/
	function bindEvent(node, eventName, handler) {
        var handler_wrapper = function(event) {
            event = event || window.event;
            if (!event.target && event.srcElement) {
                event.target = event.srcElement;
            }
            return handler.call(node, event);
        };

        if (node.addEventListener) {
            node.addEventListener(eventName, handler_wrapper, false);
        } else if (node.attachEvent) {
            node.attachEvent('on' + eventName, handler_wrapper);
        }
        return handler_wrapper;
    }	

    function unbindEvent (obj, event_name, handler) {
		if (obj.removeEventListener) {
			obj.removeEventListener(event_name, handler, false);
		} else {
			obj.detachEvent('on' + event_name, handler);
		}
	}


 function cancelDefaultEvent (event) {
		if(event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	}


	function getCoords(elem) {
	    var box = elem.getBoundingClientRect();
	     
	    var body = document.body;
	    var docEl = document.documentElement;
	     
	    
	    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
	    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
	     
	    
	    var clientTop = docEl.clientTop || body.clientTop || 0;
	    var clientLeft = docEl.clientLeft || body.clientLeft || 0;
	     
	    
	    var top  = box.top +  scrollTop - clientTop;
	    var left = box.left + scrollLeft - clientLeft;
	     
	    
	    return { top: Math.round(top), left: Math.round(left) };
	}

	function fixEvent(event) {
  
  if (event.pageX == null && event.clientX != null ) {
    var html = document.documentElement;
    var body = document.body;

    event.pageX = event.clientX + (html.scrollLeft || body && body.scrollLeft || 0);
    event.pageX -= html.clientLeft || 0;

  }

  if (!event.which && event.button) {
    event.which = event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) )
  }

  return event;
}

function computedStyle (elem) {
	if (window.getComputedStyle) {
		var computedStyle = getComputedStyle(elem, null);
	} else {
		computedStyle = elem.currentStyle;
	}
	return computedStyle;
}

/*####################################################################################*/
var Observer = {
    events: [],
    listen: function(id, callback) {
      if (!this.events[id]) {
        this.events[id] = [];
      }
      return this.events[id].push(callback);
    },
    trigger: function(id, data) {
      var callback,
      	key,
      	_ref,
      	_results;
      	
      if (data == null) {
        data = {};
      }
      if (this.events[id]) {
        _ref = this.events[id];
        _results = [];
        for (key in _ref) {
          callback = _ref[key];
          _results.push(callback(data));
        }
        return _results;
      }
    }
  };

/*#################################   MAIN FUNCTIONS   ######################*/
	
	var CreateSlider = function (domNode) {
		this.slideObject = domNode;
		this.line = this.slideObject.querySelector(".line");
		this.slider = this.slideObject.querySelector(".slider");
		this.formSend = this.slideObject.querySelector("[name=slider_form]");
		this.currentPosition = 0;
		
		this.maxLeft = parseInt(computedStyle(this.line).width) - parseInt(computedStyle(this.slider).width);
		this.modulo = 100/this.maxLeft;
		var self = this;

		(function moveSlider () {
		
		
		var moveEvent;

		bindEvent(self.slider, "dragstart", function (event) {
			cancelDefaultEvent (event);
		});
		
		bindEvent(self.slider, "mousedown", function (event) {
			cancelDefaultEvent (event);
			event = fixEvent(event);
			if (event.which === 1) {
				var sliderCoords = getCoords(self.slider);
		  		var shiftX = event.pageX - sliderCoords.left;
		  		var shiftY = event.pageY - sliderCoords.top;
		  		var lineCoords = getCoords(self.line);

		 		moveEvent = bindEvent(document, "mousemove", function(event) {

			    	event = fixEvent(event);
			    	var newLeft = event.pageX - shiftX - lineCoords.left;
			    	if (newLeft < 0) {
			      	newLeft = 0;
			    	}
			    	var rightEdge = self.line.offsetWidth - self.slider.offsetWidth;
			    	if (newLeft > rightEdge) {
			      		newLeft = rightEdge;
					}
					self.currentPosition = Math.round(newLeft*self.modulo);
				    self.slider.style.left = newLeft + 'px';
				    Observer.trigger("slide", self.currentPosition);
				});
			}
		});
	
		bindEvent (document, "mouseup", function (event) {
			Observer.trigger("change", self.currentPosition);
			unbindEvent(document, "mousemove", moveEvent);
		});

	})();

	}

	CreateSlider.prototype.on = function (obj) {
		var self = this;
		Observer.listen("slide", obj.slide);
		Observer.listen("change", obj.change);
	};

return CreateSlider;

})();
//use example

var slider = new Slider(document.querySelector(".first"));
slider.on({
	slide: function(value) {
    	document.querySelector(".slide_value span").innerHTML = value;
	},
	change: function(value) {
		document.querySelector(".change_value span").innerHTML = value;
		document.querySelector("[name=result]").value = value;
	}
});