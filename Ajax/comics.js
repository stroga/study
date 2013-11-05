/*##############################################################
Сделать "бесконечную" ленту из комиксов на http://www.explosm.net/comics/3305. 
При прокручивании странице ниже, должна подгружатся и вставляться картинка со следующей страницы. 
Учтите, что иногда вставляется видео. Решение должно быть самодостаточным (внутри одной анонимной функции)


В данной реализации сделал подгрузку комиксов в количестве одна штука. 
Думаю, что в данном случае, если читать комиксы, а не бешенно листать, это уместно.
Подгружает только картинки. Если на странице есть видео или страничка без картинки, то пропускаем.
Добавил определение последней странички.
#############################################################*/

(function (currentUrl, currentPage) {
/*######################TOOLBOX############################*/
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
		} else if (obj.attachEvent) {
			node.attachEvent('on' + eventName, handler_wrapper);
		}
		return handler_wrapper;
	}

	function unbind (obj, event_name, handler) {
	if (obj.removeEventListener) {
		obj.removeEventListener(event_name, handler, false);
	} else {
		obj.detachEvent('on' + event_name, handler);
	}
}

	function getXmlHttp(){
		var xmlhttp;
		try {
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (E) {
				xmlhttp = false;
			}
		}
		if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
			xmlhttp = new XMLHttpRequest();
		}
		return xmlhttp;
	}
/*###################################################################*/

/*#########################MAIN PART#################################*/	
	var thisPage = currentPage;
	var thisUrl = currentUrl;
	var re = /http.+comics\//;
	var imageContainer = thisPage.querySelector("img[alt~=Cyanide]").parentNode;

	var currentPageNumber = parseInt(thisUrl.match(/\d+/)[0],10);
	var lastPageUrl = document.querySelector("#maincontent table nobr a[rel='last']").href;
	var lastPageNumber;

	bindEvent(window, "scroll", almostEndOfPage);

	var PIXELS_TILL_THE_BOTTOM = 600;
	var queue = [];
	var queueOgRequests = [];

	function almostEndOfPage () {
		var hightOfAllPage = document.documentElement.scrollHeight;
		var visibleHeight = document.documentElement.clientHeight;
		var scrolledHeight = window.pageYOffset || document.documentElement.scrollTop;
		if(scrolledHeight+visibleHeight >= hightOfAllPage-PIXELS_TILL_THE_BOTTOM && queueOgRequests.length === 0 && 
			lastPageNumber !== currentPageNumber) {
			currentPageNumber++;
			queueOgRequests.push(currentPageNumber);
			getNextImage(currentPageNumber);
		}
	}
	//for getting last page number
	(function (url) {
		var responseContainer = document.createElement("span");
		var xhr = getXmlHttp ();
		xhr.open("GET", url, true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState != 4) return;
			if (xhr.status != 200) {
            	console.error("Ошибка " + xhr.status + ": " + xhr.statusText);
      			return;
    		}
    		responseContainer.innerHTML = xhr.responseText;
    		lastPageNumber = parseInt(responseContainer.querySelector("title").innerHTML.match(/#(\d+)/)[1],10);
		}
		xhr.send(null);
	})(lastPageUrl);

	function getNextImage (nextPage) {
		var srcCurrentPageImage = document.querySelector("img[alt~=Cyanide]").parentNode.lastChild.src;
		var responseContainer = document.createElement("span");
		var xhr = getXmlHttp ();
		xhr.open("GET", thisUrl.match(re)+nextPage, true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState != 4) return;
			if (xhr.status != 200) {
            	console.error("Ошибка " + xhr.status + ": " + xhr.statusText);
      			return;
    		}
    		responseContainer.innerHTML = xhr.responseText;
    		if (responseContainer.querySelector("img[alt~=Cyanide]") !== null && 
    			responseContainer.querySelector("img[alt~=Cyanide]").parentNode.nodeName === "DIV" &&
    			 responseContainer.querySelector("img[alt~=Cyanide]").src !== srcCurrentPageImage) {
    			var responseImg = responseContainer.querySelector("img[alt~=Cyanide]");
    			imageContainer.appendChild(responseImg);
    			queueOgRequests=[];
    		} else {
    			currentPageNumber++;
    			getNextImage(currentPageNumber);
			}	
		};
		xhr.send(null);
	}
})(window.location.href, document.body);