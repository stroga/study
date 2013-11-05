/*################################################################
Превратить меню хабры http://grab.by/r434 в меню из табов. 
 - Внешне вид никак не должен измениться, изменяется поведение. 
 - Активный таб должен подсвечиваться, как это сейчас происходит (только без перехода на странцы). 
 - Скрипт должен быть самодостаточным и работать только на гравной странице хабра.
 - При нажатии на таб, должно показываться содержимое страницы, куда вела оригинальная ссылка из меню, в ифрейме. 
 - Высота ифрейма подстраивается под высоту содержимого. 
 - В ифрейме убраны части страницы (шапка с меню), которые будут дублироваться визуально. 
 - Ключевая задача - сделать переключение по пункам меню моментальным. 
 - Состояния внутри ифреймов должны сохраняться между переключениями (но не сохраняется при перезагрузке страницы). 
 - Обновление содержимого ифрейма происходит следующим образом: при клике по табу показывается ифрейм с содержимым таба, 
   при повторном клике - содержимое ифрейма обновляется. При перезагрузке главной страницы и повторном выполнении скрипта 
   становится активным тот таб, который был активным до перезугрузки.

##################################################################*/
(function checkJquery() {
	"use strict";
	if (typeof jQuery !== "undefined") {
		$("html").css("visibility", "hidden");
		$(function() {
			$("#layout").children().not("#header").hide(); //hiding everything in content area, except header

			var contentArea = $("#layout");
			$(contentArea).children().not("#header").hide()
			var widthCont = $(contentArea).width() + "px";
			var widthLeftCont = $(".content_left").width() + "px";
			var expiresData = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
			var COOKIE_NAME = "activeTab";

			//check for active tab information in cookie 
			(function() {
				if (document.cookie.match(COOKIE_NAME)) {
					var arrOfCookie = document.cookie.split("; ");
					for (var i = 0; i < arrOfCookie.length; i++) {
						if (arrOfCookie[i].match(COOKIE_NAME)) {
							var previousLink = decodeURIComponent(arrOfCookie[i]).split("=")[1];
							setActiveTab(previousLink);
						}
					}
				}
			})();

			$(".main_menu a").each(function() {
				cancelClick(this);
				createIframe(this.href, changeIframeContent);
				$(this).click(function() {
					var self = $(this);
					var hrefAttr = self.attr("href");
					if (self.hasClass("active")) {
						$('.iframe_js[src="' + hrefAttr + '"]').remove();
						createIframe(hrefAttr, changeIframeContent);
					} else {
						$(".main_menu a").removeClass("active");
						self.addClass("active");
						$("body .iframe_js").each(function() {
							$(this).css("display", "none");
						});
						$('.iframe_js[src="' + hrefAttr + '"]').css("display", "block");
					}
					addActiveTabToCookie(hrefAttr);
				})
			});

			function cancelClick(link) {
				$(link).click(function(event) {
					event.preventDefault();
				});
			}


			//in case cookie contains information about active tab we make this tab active

			function setActiveTab(link) {
				$(".main_menu a").each(function() {
					$(this).removeClass("active")
				});
				$('.main_menu a[href="' + link + '"]').addClass("active");
			}

			function addActiveTabToCookie(tab) {
				document.cookie = COOKIE_NAME + "=" + encodeURIComponent(tab) + "; expires=" + expiresData.toUTCString();
			}

			function createIframe(url, callback) {
				var iframe = $(document.createElement("iframe"));
				iframe.attr({
					class: "iframe_js",
					src: url,
					scrolling: "no",
					frameborder: "0"
				});
				$(contentArea).append(iframe);
				iframe.css({
					display: "none",
					width: widthCont
				});
				iframe.load(function() {
					callback(this);
				});
			}
			//check iframes and set current one

			function setCurrentIframe(iframe) {
				if ($(iframe).attr("src") === $(".main_menu a[class=active]").get(0).href) {
					$(iframe).css("display", "block");
				}
			}
			//modify iframe content

			function changeIframeContent(iframeNode) {
				var iframe = $(iframeNode);
				var iframeContent = $(iframe.get(0).contentWindow.document);
				iframeContent.find("#header").hide();
				iframeContent.find("#layout").css({
					width: widthCont,
					padding: "0",
					margin: "0"
				});
				iframeContent.find(".content_left").css({
					width: widthLeftCont,
					padding: "0"
				});
				//Here I'm show iframe for a short time to get height value
				iframe.css("display", "block");
				var contentHeight = iframeContent.find("#layout").height() + "px";
				iframe.css("display", "none");

				//provided for non-flashing 
				$(iframe.get(0).contentWindow).on('unload', function() {
					iframe.hide();
					iframe.load(function() {
						iframe.show();
					});
				});

				iframe.css("height", contentHeight);
				setCurrentIframe(iframe);
			}
			$("html").css("visibility", "visible");
		});

	} else {
		setTimeout(checkJquery, 20);
	}
})();