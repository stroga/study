/*##############################################################################################
Реализовать галерею
Требования:
 - Использовать разные изображения для превьюшек и большого изображения (в этом и заключается цимес)
 - Автоматически листать на следующее изображение через 5 секунд
 - Не листать галерею после того, как пользователь кликнул на одну из превьюшек
 - Количество галерей на странице может быть любым
 - Количество изображений в галерее может быть любым
 - Галерею можно листать с клавиатуры. Но только одну из всех галерей на странице. Листается та, с которой
   пользователь работал в последний раз. Или над которой находится мышка в данный момент.
 - Должно работать в 8 ие.
###############################################################################################*/



/*##########################################################################
######################   Gallery constructor   #############################
############################################################################*/
"use strict";
var Gallery = (function() {

	var currentActiveGallery;
	var storage = [];
	var storageOfIndex = [];

	function GalleryCreator(domNode) {
		this.domNode = domNode;
		this.largeImage = this.domNode.querySelector(".big-picture img");
		this.images = this.domNode.querySelectorAll(".previews img");
		this.preview = this.domNode.querySelector(".previews");
		this.liOfSmallImages = this.domNode.querySelectorAll(".previews li");
		this.leftArrow = this.domNode.querySelector(".left-arrow");
		this.rigthArrow = this.domNode.querySelector(".right-arrow");

		this.numberOfImages = this.images.length;
		this.NUMBER_OF_IMAGES_PREVIEW = 5;
		this.MODULO = this.numberOfImages - this.NUMBER_OF_IMAGES_PREVIEW; //the number of free positions in preview
		this.WIDTH_ELEMENT_PREVIEW = 124; //px
		this.currentPosition = 0;
		this.TIME_INTERVAL = 5000;
		this.RIGHT_KEY_NUMBER = 39;
		this.LEFT_KEY_NUMBER = 37;
		this.currentImage;
		this.intervalTimer = null;

		var self = this;
		this.show(0);

		bindEvent(this.preview, "click", function(event) {
			if (event.target.nodeName === "IMG") {
				self.show(Array.prototype.indexOf.call(self.images, event.target));
			}
		});

		bindEvent(window, "load", function() {
			self.startAutoChanging();
		});

		bindEvent(this.domNode, "mouseover", function() {
			currentActiveGallery = this;
			self.stopAutoChanging();
		});

		bindEvent(document, "keyup", function(event) {
			if (currentActiveGallery === self.domNode) {
				self.controlWithKeys(event);
			}
		});

		bindEvent(this.domNode, "mouseout", function() {
			currentActiveGallery = undefined;
			self.startAutoChanging();
		});

		bindEvent(this.leftArrow, "click", function(event) {
			cancelDefaultEvent(event);
			self.clickArrows(event);
		});

		bindEvent(this.rigthArrow, "click", function(event) {
			cancelDefaultEvent(event);
			self.clickArrows(event);
		});

	}

	GalleryCreator.prototype.show = function(imageIndex) {
		this.currentImage = imageIndex;
		for (var i = 0; i < this.liOfSmallImages.length; i++) {
			removeClass(this.liOfSmallImages[i], "current");
		}
		addClass(this.images[imageIndex].parentNode, "current");
		var currentDataAttr = this.images[imageIndex].getAttribute("data-largeimagesrc");
		this.largeImage.src = currentDataAttr;
	}

	GalleryCreator.prototype.nextImage = function() {
		if (this.currentImage < this.images.length - 1) {
			if (this.currentImage >= this.NUMBER_OF_IMAGES_PREVIEW - 1 && this.preview.style.marginLeft !== "-" + this.WIDTH_ELEMENT_PREVIEW * this.MODULO + "px") { //
				this.currentPosition += this.WIDTH_ELEMENT_PREVIEW;
				this.preview.style.marginLeft = -this.currentPosition + 'px';
			}
			this.show(this.currentImage + 1);
		} else {
			this.currentPosition = 0;
			this.preview.style.marginLeft = 0
			this.currentImage = 0;
			this.show(this.currentImage);
		}
		this.nextImageCache(this.currentImage);
	}

	GalleryCreator.prototype.nextImageCache = function(currentImageIndex) {
		if (storageOfIndex.indexOf(currentImageIndex) === -1 && currentImageIndex < this.images.length - 1) {
			var nextLargeImageSrc = this.images[currentImageIndex + 1].getAttribute("data-largeimagesrc");
			var img = document.createElement("img");
			img.src = nextLargeImageSrc;
			storage.push(img.src);
			storageOfIndex.push(currentImageIndex);
		} else {
			return;
		}
	}

	GalleryCreator.prototype.previousImage = function() {
		if (this.currentImage !== 0) {
			this.show(this.currentImage - 1);
			if (this.currentPosition > this.NUMBER_OF_IMAGES_PREVIEW) {
				this.currentPosition -= this.WIDTH_ELEMENT_PREVIEW;
				this.preview.style.marginLeft = -this.currentPosition + 'px';
			}
		} else {
			this.currentImage = this.images.length - 1;
			this.show(this.currentImage);
			this.currentPosition = this.WIDTH_ELEMENT_PREVIEW * this.MODULO;
			this.preview.style.marginLeft = -this.currentPosition + 'px';
		}
	}

	GalleryCreator.prototype.startAutoChanging = function() {
		var self = this;

		this.intervalTimer = setInterval(function() {
			self.nextImage();
		}, this.TIME_INTERVAL);
	}

	GalleryCreator.prototype.stopAutoChanging = function() {
		clearTimeout(this.intervalTimer);
	}

	GalleryCreator.prototype.controlWithKeys = function(event) {
		if (event.keyCode === this.RIGHT_KEY_NUMBER) {
			this.nextImage();
		}
		if (event.keyCode === this.LEFT_KEY_NUMBER) {
			this.previousImage();
		}
	}

	GalleryCreator.prototype.clickArrows = function(event) {
		if (event.target === this.leftArrow.firstChild) {
			cancelDefaultEvent(event);
			this.previousImage();
		}
		if (event.target === this.rigthArrow.firstChild) {
			cancelDefaultEvent(event);
			this.nextImage();
		}
	}

	return GalleryCreator;
})();

var galleryFirst = new Gallery(document.querySelector(".car-gallery"));

var gallerySecond = new Gallery(document.querySelector(".car-gallery1"));