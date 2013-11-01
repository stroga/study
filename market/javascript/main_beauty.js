/*#########################################################
Не учитывал размер cookie.
###########################################################*/
$(function() {
    //sort function
    jQuery.fn.sortElements = (function() {
        var sort = [].sort;
        return function(comparator, getSortable) {
            getSortable = getSortable || function() {
                return this;
            };
            var placements = this.map(function() {
                var sortElement = getSortable.call(this),
                    parentNode = sortElement.parentNode,
                    nextSibling = parentNode.insertBefore(
                        document.createTextNode(''),
                        sortElement.nextSibling
                    );

                return function() {
                    if (parentNode === this) {
                        throw new Error(
                            "You can't sort elements if any one is a descendant of another."
                        );
                    }
                    // Insert before flag:
                    parentNode.insertBefore(this, nextSibling);
                    // Remove flag:
                    parentNode.removeChild(nextSibling);
                };
            });

            return sort.call(this, comparator).each(function(i) {
                placements[i].call(getSortable.call(this));
            });

        };

    })();
    //-----------------------------------------------------



    //local version
    var drinks = [{
        "name": "milk",
        "price": 20,
        "quantity": 13
    }, {
        "name": "wine",
        "price": 97,
        "quantity": 12
    }, {
        "name": "shugar",
        "price": 30,
        "quantity": 4
    }, {
        "name": "beer",
        "price": 55,
        "quantity": 20
    }];

    var food = [{
        "name": "bread",
        "price": 10,
        "quantity": 90
    }, {
        "name": "milk",
        "price": 20,
        "quantity": 13
    }, {
        "name": "shugar",
        "price": 30,
        "quantity": 4
    }];


    var furniture = [{
        "name": "chair",
        "price": 200,
        "quantity": 2
    }, {
        "name": "table",
        "price": 400,
        "quantity": 1
    }];

    var tools = [{
        "name": "pliers",
        "price": 420,
        "quantity": 2
    }, {
        "name": "screwdriver",
        "price": 250,
        "quantity": 30
    }, {
        "name": "hammer",
        "price": 21,
        "quantity": 2
    }, {
        "name": "hammer",
        "price": 21,
        "quantity": 2
    }, {
        "name": "drill",
        "price": 120,
        "quantity": 41
    }];

    var pans = [{
        "name": "Сковорода TEFAL 04005622 PROVENCE блинная 22 см",
        "price": 94,
        "quantity": 2
    }, {
        "name": "Сковорода MEHTAP HT 24",
        "price": 120,
        "quantity": 1
    }, {
        "name": "Блинная сковородка GRANCHIO Crepe, красная",
        "price": 103,
        "quantity": 3
    }, {
        "name": "Сковорода MEHTAP WT 28",
        "price": 120,
        "quantity": 21
    }, {
        "name": "Сковорода TEFAL EVIDENCE 4015122 Black 22 см",
        "price": 163,
        "quantity": 13
    }, {
        "name": "Сковорода SILEX 1728 Ecoceram для блинов",
        "price": 185,
        "quantity": 3
    }, {
        "name": "Сковорода DEBUYER Carbone Plus 5530.26 26 см гриль",
        "price": 256,
        "quantity": 5
    }];

    var roasters = [{
        "name": "Гусятница д/СВЧ SIMAX 7156/7166",
        "price": 495,
        "quantity": 13
    }, {
        "name": "Гусятница GRANCHIO 88011 Marmo Induction, 32х21см",
        "price": 97,
        "quantity": 12
    }, {
        "name": "Гусятница д/СВЧ GRANCHIO 88535 Тажин Orientale Green Fiamma 3,0 л",
        "price": 387,
        "quantity": 4
    }, {
        "name": "Гусятница д/СВЧ SIMAX 7136/7146",
        "price": 162,
        "quantity": 20
    }];



    if (window.location.hash) {

        createList();

    } else {
        createListOfGoods(drinks);
    }

    $(".categories").on("click", "a", function(event) {
        event.preventDefault();
        window.location.hash = this.hash;
        $(".categories a").each(function() {
            $(this).removeClass("clicked");
        });
        $(this).addClass("clicked");
        createList();

    });



    function createList() {
        if (window.location.hash === "#drinks") {
            createListOfGoods(drinks);
        }
        if (window.location.hash === "#food") {
            createListOfGoods(food);
        }
        if (window.location.hash === "#furniture") {
            createListOfGoods(furniture);
        }
        if (window.location.hash === "#tools") {
            createListOfGoods(tools);
        }
        if (window.location.hash === "#pans") {
            createListOfGoods(pans);
        }
        if (window.location.hash === "#kitchen_utensils") {
            createListOfGoods(roasters);
        }

    }
    //-------------------------------------------------
    var cookieNameCart = "cartGoods";
    var cookieNameQuantity = "cartQuantity";
    var flagSortPrice = true;
    var flagSortName = true;
    var total = $(".sum");
    var totalSum = 0;
    var arrOfGoodsObjectsInCart = [];
    var maxNumberOfGoods = {};
    EXPIRES_COOKIE_TIME = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
    var quantityInTheCart = 0;



    //work version
    /*if (!window.location.hash) {
        $.get("data/" + $(".categories a").get(0).hash.slice(1) + ".json", function (data) {
            createListOfGoods(data);
        });
    } else {
        var request = window.location.href.match(/#.+/)[0].slice(1);
        $.get("data/" + request + ".json", function (data) {
            createListOfGoods(data);
        });
    }*/

    //check cookie for cart contents
    if (decodeURIComponent(document.cookie).indexOf(cookieNameCart + "=0") < 0 &&
        decodeURIComponent(document.cookie).indexOf(cookieNameCart + "=[]") < 0 &&
        decodeURIComponent(document.cookie).indexOf(cookieNameCart) >= 0) {
        arrOfGoodsObjectsInCart = JSON.parse(decodeURIComponent(document.cookie).match(/cartGoods=(\[.+\])?/)[1]);
        setCurrentCookie(arrOfGoodsObjectsInCart);
        $(".cart .order").not(":first").each(function() {
            quantityInTheCart += parseInt($(this).children().eq(1).text());
        });
        setCurrentCartItems();
    }
    if (decodeURIComponent(document.cookie).indexOf(cookieNameQuantity + "=0") < 0 &&
        decodeURIComponent(document.cookie).indexOf(cookieNameQuantity + "={}") < 0 &&
        decodeURIComponent(document.cookie).indexOf(cookieNameQuantity) >= 0) {
        maxNumberOfGoods = JSON.parse(decodeURIComponent(document.cookie).match(/cartQuantity=(\{.+\};)?/)[1].slice(0, -1));
    }

    //work version
    /* $(".categories").on("click", "a", function (event) {
        event.preventDefault();
        window.location.hash = this.hash;
        $.get("data/" + window.location.hash.slice(1) + ".json", function(data) {
            createListOfGoods(data);
        });
    });*/


    function createListOfGoods(ArrOfObjects) {
        var divCont = $(document.createElement("div"));
        divCont.addClass("goods");
        $(ArrOfObjects).each(function() {
            divCont.append("<div><span>" + this.name + "</span><span>" + this.quantity + "</span><span>" + this.price + "</span></div>");
        });
        $(".goods").replaceWith(divCont);

    }

    //Sort goods
    $(".sort span").on("click", function() {
        if ($(this).hasClass("sortByName")) {
            sorting("name");
        }
        if ($(this).hasClass("sortByPrice")) {
            sorting("price");
        }
    });

    function sorting(param) {
        if (param === "name") {
            if (flagSortName === true) {
                flagSortName = false;
                $('.goods div').sortElements(function(a, b) {
                    return $(a).text() > $(b).text() ? 1 : -1;
                });
            } else {
                flagSortName = true;
                $('.goods div').sortElements(function(a, b) {
                    return $(a).text() < $(b).text() ? 1 : -1;
                });
            }
        }
        if (param === "price") {
            if (flagSortPrice === true) {
                flagSortPrice = false;
                $('.goods div').sortElements(function(a, b) {
                    return (parseInt($(a).children(":last").text()) > parseInt($(b).children(":last").text())) ? 1 : -1;
                });
            } else {
                flagSortPrice = true;
                $('.goods div').sortElements(function(a, b) {
                    return (parseInt($(a).children(":last").text()) < parseInt($(b).children(":last").text())) ? 1 : -1;
                });
            }
        }
    }

    function setCurrentCartItems() {
        quantityInTheCart = 0;
        $(".cart .order").not(":first").each(function() {
            quantityInTheCart += parseInt($(this).children().eq(1).text());
        });
        $(".items .quantity").text(quantityInTheCart);
    }

    //Adding goods into cart
    $(".content").on("click", ".goods div", function() {

        addItemTocart(this);
        arrOfGoodsObjectsInCart = [];
        setCookie(cookieNameCart);
        setCurrentCartItems();

    });

    function addItemTocart(node) {
        var isMatch = false;
        var currentNode = $(node);
        $(".cart .order").each(function() {
            //
            if ($(this).children().eq(0).text() === currentNode.children().eq(0).text() &&
                parseInt($(this).children().eq(1).text()) < parseInt(currentNode.children().eq(1).text())) {
                $(this).children().eq(2).html(parseInt($(this).children().eq(2).text()) + parseInt(currentNode.children().eq(2).text()));
                $(this).children().eq(1).html(parseInt($(this).children().eq(1).text()) + 1)
                totalSum += parseInt(currentNode.children().eq(2).text());
                total.html(totalSum);
                isMatch = true;
            }
            //check for presence of current item in cart
            if (parseInt($(this).children().eq(1).text()) === parseInt(currentNode.children().eq(1).text()) &&
                $(this).children().eq(0).text() === currentNode.children().eq(0).text()) {
                isMatch = true;
            }
        });
        //if item first time adds into cart
        if (isMatch === false) {
            maxNumberOfGoods[currentNode.children().eq(0).text()] = parseInt(currentNode.children().eq(1).text());
            setCookie(cookieNameQuantity);
            var tr = $(document.createElement("tr"));
            tr.addClass("order");
            tr.append("<td>" + currentNode.children().eq(0).text() + "</td>" +
                "<td>" + 1 + "</td>" +
                "<td>" + currentNode.children().eq(2).text() + "</td>" +
                "<td class='incDec'><button class='remove'>-</button><button class='add'>+</button></td>");
            totalSum += parseInt(currentNode.children().eq(2).text());
            total.html(totalSum);
            $(".cart").find(".order:last").after(tr);
        }
    }

    //Clear cart
    $(".clear").on("click", function() {
        totalSum = 0;
        total.html(totalSum);
        $(".cart .order").not(":first").remove();
        document.cookie = cookieNameCart + "=0";
        document.cookie = cookieNameQuantity + "=0";
        setCurrentCartItems();
    });

    //Remove from cart by pressing "-"
    $(".cart").on("click", ".order .remove", function() {
        removeItem($(this).closest("tr"));
        arrOfGoodsObjectsInCart = [];
        setCookie(cookieNameCart);
        setCurrentCartItems();
    });

    function removeItem(item) {
        var currentItem = item;
        var itemQuantity = parseInt(currentItem.children().eq(1).text());
        var itemPrice = parseInt(currentItem.children().eq(2).text()) / itemQuantity;
        if (parseInt(currentItem.children().eq(1).text()) > 1) {
            currentItem.children().eq(1).html(itemQuantity - 1);
            currentItem.children().eq(2).html(parseInt(currentItem.children().eq(2).text()) - itemPrice);
            totalSum -= itemPrice;
            total.html(totalSum);
        } else {
            currentItem.remove();
            delete maxNumberOfGoods[currentItem.children().eq(0).text()];
            setCookie(cookieNameQuantity);
            totalSum -= itemPrice;
            total.html(totalSum);
        }
    }


    //Add to cart by pressing "+"
    $(".cart").on("click", ".order .add", function() {
        addItem($(this).closest("tr"));
        arrOfGoodsObjectsInCart = [];
        setCookie(cookieNameCart);
        setCurrentCartItems();
    });

    function addItem(item) {
        var currentItem = item;
        var itemQuantity = parseInt(currentItem.children().eq(1).text());
        var itemPrice = parseInt(currentItem.children().eq(2).text()) / itemQuantity;
        if (parseInt(currentItem.children().eq(1).text()) < maxNumberOfGoods[currentItem.children().eq(0).text()]) {
            currentItem.children().eq(1).html(itemQuantity + 1);
            currentItem.children().eq(2).html(parseInt(currentItem.children().eq(2).text()) + itemPrice);
            totalSum += itemPrice;
            total.html(totalSum);
        }
    }

    //set cart cookie

    function setCookie(cookieName) {
        var cookieValue = [];
        if (cookieName === cookieNameCart) {
            $(".cart .order").not(":first").each(function() {
                var currentItem = $(this);
                var obj = {};
                obj.name = currentItem.children().eq(0).text();
                obj.quantity = currentItem.children().eq(1).text();
                obj.price = currentItem.children().eq(2).text();
                cookieValue.push(obj);

            });
        }
        if (cookieName === cookieNameQuantity) {
            cookieValue = maxNumberOfGoods;
        }

        document.cookie = cookieName + "=" + encodeURIComponent(stringifyObject(cookieValue)) + "; " + "expires=" + EXPIRES_COOKIE_TIME.toUTCString();
    }

    function stringifyObject(obj) {
        return JSON.stringify(obj);
    }

    function setCurrentCookie(cookieContent) {
        var arr = $(cookieContent);
        arr.each(function() {
            var tr = $(document.createElement("tr"));
            tr.addClass("order");
            tr.append("<td>" + this.name + "</td>" +
                "<td>" + this.quantity + "</td>" +
                "<td>" + this.price + "</td>" +
                "<td class='incDec'><button class='remove'>-</button><button class='add'>+</button></td>");
            totalSum += parseInt(this.price);
            $(".cart").find(".order:last").after(tr);
        });
        total.html(totalSum);
    }



    //adding popup
    $('.mini_cart').click(function() {

        $(this).makePopup({
            "target": ".cart",
            "timeOut": 100,
            "animateTime": 500
        });
    });

    //close cart
    $(".head img").click(function() {
        $(".cart").css("display", "none").removeClass("active");
        $(".darkBg").remove();
    });

});