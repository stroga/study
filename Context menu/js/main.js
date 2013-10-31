/*##############################################################################################
Реализовать многоуровневое контекстное меню как в Windows.
Открываться должно по правой кнопке в любой части страницы.
###############################################################################################*/
"use strict";
bindEvent(document, "DOMContentLoaded", createContextMenu);


function createContextMenu() {
    var menuElements = {
        "open": {},
        "close": {},
        "edit": {},
        "create": {
            "folder": {},
            "file": {
                "large": {},
                "small": {}
            },
            "object": {}
        },
        "delete": {},
        "change": {
            "name": {},
            "color": {},
            "size": {
                "width": {},
                "height": {
                    "very high": {},
                    "little high": {}
                },
                "deepth": {}
            },
            "smt else": {}
        },
        "properties": {}
    };
    //--------------------MENU CREATING-----------//

    function makeMenu() {
        var div = document.createElement("div");
        div.className = "my_menu_js";
        var i = 1;

        function createMenu(obj) {
            if (isObjectEmpty(obj)) return;
            var ul = document.createElement("ul");

            for (var key in obj) {
                var li = document.createElement("li");
                li.innerHTML = key;
                li.className = key;
                var childrenUl = createMenu(obj[key]);



                if (childrenUl) {
                    var newLi = document.createElement("li");
                    newLi.innerHTML = key;
                    newLi.className = key + " repository";
                    ul.appendChild(newLi);
                    newLi.appendChild(childrenUl);
                    i++;
                } else {
                    ul.appendChild(li);
                }

                ul.className = "container " + "count" + i;
            }
            return ul;
        }

        function isObjectEmpty(obj) {
            for (var key in obj) {
                return false;
            }
            return true;
        }

        div.appendChild(createMenu(menuElements));
        var menu = div.firstChild;
        menu.className = "menu_js";
        return div;
    }
    //---------------------------------------------------//

    document.body.appendChild(makeMenu());



    /*#####################################################################
##################EVERYTHING ABOUT VISIBILITY OF CONTEXT MENU##########
######################################################################*/


    //----------------try found out which button was "mousedowned"----------//

    function whichButton(event) {
        if (!event.which && event.button) {
            if (event.button & 1) event.which = 1;
            else if (event.button & 4) event.which = 2;
            else if (event.button & 2) event.which = 3;
        }
        return event.which;
    }
    //--------------------------------------------------------------------//
    //----------functions of location and show/hide menu-----------//

    function changeVisibilityOfMenu(event) {
        var menu = document.querySelector(".menu_js");
        if (whichButton(event) === 3) {
            menu.parentNode.style.top = event.clientY + "px";
            menu.parentNode.style.left = event.clientX + "px";
            removeClass(menu, "nonvisible");
            addClass(menu, "blocked");
            hideAllSubMenu();
        }

        if (whichButton(event) === 1) {
            removeClass(menu, "blocked");
            addClass(menu, "nonvisible");
            hideAllSubMenu();
        }
    };



    function hideAllSubMenu() {
        var mainNodeMenu = document.querySelectorAll(".container");
        var lies = document.querySelectorAll("li");
        for (var i = 0; i < mainNodeMenu.length; i++) {
            addClass(mainNodeMenu[i], "nonvisible");
            removeClass(mainNodeMenu[i], "blocked");
        }
        for (var i = 0; i < lies.length; i++) {
            removeClass(lies[i], ["hovered", "sub"]);
        }

    }
    //------------------------------------------------//
    bindEvent(document, "contextmenu", function(event) {
        cancelDefaultEvent(event);
    });
    bindEvent(document.documentElement, "mousedown", changeVisibilityOfMenu);


    /*#####################################################################
##################EVERYTHING ABOUT SUBMENU#############################
######################################################################*/

    (function() { //showing submenu
        var allRepositories = document.querySelectorAll(".repository");
        for (var i = 0; i < allRepositories.length; i++) {
            bindEvent(allRepositories[i], "mouseover", function(event) {
                var shownBlock = document.querySelector("." + this.className.split(" ")[0] + " ul");
                addClass(shownBlock, "blocked");
                addClass(this, "sub");
                removeClass(shownBlock, "nonvisible");
            });
        }
    })();


    (function() { //hiding submenu
        var allRepositories = document.querySelectorAll(".repository");
        for (var i = 0; i < allRepositories.length; i++) {

            bindEvent(allRepositories[i], "mouseout", function(event) {
                removeClass(this.firstChild.nextSibling, "blocked");
                var innerCont = document.querySelectorAll("." + this.parentNode.className.split(" ")[1] + ">.repository");
                for (var i = 0; i < innerCont.length; i++) {
                    removeClass(innerCont[i], "sub");
                }

            });
        }
    })();

    (function() { //adding hovering
        var allLi = document.querySelectorAll("li");
        for (var i = 0; i < allLi.length; i++) {
            bindEvent(allLi[i], "mouseover", function(event) {
                if (!hasClass(this, "repository")) {
                    for (var j = 0; j < allLi.length; j++) {
                        removeClass(allLi[j], "sub");
                    }
                }
                for (var k = 0; k < allLi.length; k++) {
                    removeClass(allLi[k], "hovered");
                }
                addClass(event.target, "hovered");
            });
        }
    })();

    function getClickedMenuItem(event) {
        if (whichButton(event) === 1) {
            if (event.stopPropagation) {
                event.stopPropagation = event.stopPropagation();
            } else {
                event.stopPropagation = (event.cancelBubble = true);
            }

            if (this.className !== "") {
                var nameOfItem = event.target.className.split(" ")[0];
                doForMenuItem(nameOfItem);
                event.stopPropagation;
            }
        }
    }

    (function addHandlerForClickedItem() {
        var allLi = document.querySelectorAll(".my_menu_js li");
        for (var i = 0; i < allLi.length; i++) {
            if (!hasClass(allLi[i], "repository")) {
                bindEvent(allLi[i], "mousedown", getClickedMenuItem);
            }
            
        }
    })();

    // ---------------here we can work with clicked item--------------//

    function doForMenuItem(itemClicked, event) {
        if (itemClicked === "open") {
            console.log("You have just pushed 'OPEN' item, but nothing happened(");
        } else if (itemClicked === "close") {
            console.log("By pushing this item 'CLOSE' nothing will happen too(");
        } else if (itemClicked === "edit") {
            console.log("Nice item 'EDIT', but without results too");
        } else if (itemClicked === "create") {
            console.log("Just 'CREATE'");
        } else if (itemClicked === "file") {
            console.log("Just 'FILE'");
        } else if (itemClicked === "folder") {
            console.log("'FOLDER...'");
        } else if (itemClicked === "object") {
            console.log("'OBJECT...'");
        } else if (itemClicked === "large") {
            console.log("'LARGE...'");
        } else if (itemClicked === "small") {
            console.log("'SMALL...'");
        } else if (itemClicked === "delete") {
            console.log("'DELETE...'");
        } else if (itemClicked === "change") {
            console.log("'CHANGE...'");
        } else if (itemClicked === "name") {
            console.log("'NAME...");
        } else if (itemClicked === "color") {
            console.log("'COLOR...'");
        } else if (itemClicked === "size") {
            console.log("'SIZE...'");
        } else if (itemClicked === "width") {
            console.log("'WIDTH...'");
        } //and so on
    }
    // ----------------------------------------------//
}