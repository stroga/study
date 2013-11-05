(function () {

	"use strict";
	
	var tabsContent = document.querySelectorAll("[class*=_page]");
	var tabs = document.querySelectorAll("[class*=_b] img");

	//check for hash and setting current one
	if (window.location.hash) {
		makeThisContentVisible(window.location.hash.slice(1));
	}
	//add event handler to sidebar links 
	bindEvent (document.querySelector(".sidebar"), "click", function (event) {
		if (event.target.nodeName === "A") {
			window.location.hash = event.target.hash;
			cancelDefaultEvent(event);
			makeThisContentVisible(event.target.parentNode.className);
		}
		
	});

	
//redirection to code_page 
	bindEvent (document.querySelector(".courses a"), "click", function (event) {
			cancelDefaultEvent(event);
			makeThisContentVisible(this.href.match(/#.+/)[0].slice(1));
	});


	function makeThisContentVisible (name) {
		for (var i = 0; i < tabsContent.length; i++) {
			removeClass(tabsContent[i], "show");
			addClass(tabsContent[i], "hide")
		}

		for (var j = 0; j < tabs.length; j++) {
			tabs[j].style.marginLeft = "-58px";
		}

		if (name === "resume") {
			removeClass(document.querySelector(".resume_page"), "hide");
			addClass(document.querySelector(".resume_page"), "show");
			document.querySelector(".res_b img").style.marginLeft = "0";
		}
		if (name === "tasks") {
			removeClass(document.querySelector(".code_page"), "hide");
			addClass(document.querySelector(".code_page"), "show");
			document.querySelector(".task_b img").style.marginLeft = "0";
		}
	}


})();