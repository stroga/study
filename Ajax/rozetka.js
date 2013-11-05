/*###################################################################################
Получить данные о продуктах на розетке с других страниц категории (ссылки - внизу на педжинаторе). 
Вывести в консоль объект со всеми данными.


Данна реализация предложена для сайта http://rozetka.com.ua/usb-flash-memory/c80045/
###################################################################################*/

(function () {
	"use strict";
	
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

//document.getElementById("block_with_goods") - current node element for function takeModifiedGoods
	var arrOfGoods = [];

	function takeModifiedGoods (nodeDom) {
		var regName = /(\w*\S+\s)+\(?\s?\S+\)?/;
		var regUsd = /\d+/;
		var regVol = /\d+\s?GB/;
		var container = nodeDom;
		var namesCont = container.querySelectorAll(".gtile-i-title");
		var pricesCont = container.querySelectorAll(".row-price-buy");

		for (var i = 0; i < namesCont.length; i++) {
			var currentItem = {};
			currentItem.name = regName.exec(namesCont[i].children[0].innerHTML)[0];
			if (pricesCont[i].querySelector(".g-price-usd")) {
				currentItem.priceUSD = parseInt(regUsd.exec(pricesCont[i].querySelector(".g-price-usd").innerHTML)[0], 10);
			} else {
				currentItem.priceUSD = 0;
			}
			
			if (pricesCont[i].querySelector(".g-price-uah")) {
				currentItem.priceUAH = parseInt(pricesCont[i].querySelector(".g-price-uah").firstChild.nodeValue, 10);
			} else {
				currentItem.priceUAH = 0;
			}
			
			currentItem.link = namesCont[i].children[0].href;
			currentItem.volume = parseInt(regVol.exec(currentItem.name),10);
			arrOfGoods.push(currentItem);
		}
	}
	var numberOfRequests = 1;
	var numberOfPages = parseInt(document.querySelector(".goods-pages-list li:last-child span").innerHTML, 10);
	for (var i = 1; i <= numberOfPages; i++) {
		getGoods(i);
	}

	function getGoods (numberOfPage) {
		var responseContainer = document.createElement("span");
		var xhr = getXmlHttp ();
		xhr.open ("GET", "http://rozetka.com.ua/usb-flash-memory/c80045/page="+numberOfPage, true);

		xhr.onreadystatechange = function () {
			if (xhr.readyState != 4) return;
			if (xhr.status != 200) {
            	alert("Ошибка " + xhr.status + ": " + xhr.statusText);
      			return;
    		}
    		responseContainer.innerHTML = xhr.responseText;
    		takeModifiedGoods(responseContainer);
    		if (numberOfRequests === numberOfPages-1) {
    			showResult(arrOfGoods);
    		}
    		numberOfRequests++;
		};
		
    xhr.send(null);       	
	}
})();	

function showResult (value) {
	console.log(value);
}
