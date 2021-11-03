$(document).ready(function() {
    const baseUrl = $(location).attr('protocol') + '//' + $(location).attr('host');
    const storeNo = location.href.split(baseUrl + "/order/")[1];

    let shoppingCartList = {};
    let totalPrice = 0;

    // 접속 시 카테고리 리스트와 첫 카테고리에 대한 메뉴 리스트
    $.ajax({
        url: baseUrl + '/api/order/main/' + storeNo,
        type: 'GET', 
        dataType: 'json', 
        success: function(result) {
            addCategoryList(result.category);
            addMenuList(result.menu);
        }, error: function(error) {
            console.log(error);
        }
    })

    // 카테고리 리스트
    function addCategoryList(result) { 
        $('#categoryList').empty();
        $.each(result, function(index, data){
            $('#categoryList').append($('<li />', {
                id: data.categoryNo,
                text: data.categoryName,
                class: 'category',
                click: function() {
                    getMenuByCategoryNo(data.categoryNo);
                }
            }));
        });
    }

    // 메뉴 리스트
    function addMenuList(result) {
        $('#menuList').empty();
        $.each(result, function(index, data){
            $('#menuList').append($('<div />', {
                class: 'menu',
                id: data.menuNo,
                click: function () {
                    addShoppingCart(data.menuNo, data.menuName, data.menuPrice);
                }
            }).append($('<img />', {
                alt: 'img',
                src: '/img/bori.JPG',
                img: 'manuImg',
                class: 'menuImg'
            })).append($('<h4 />', {
                text: data.menuName,
                class: 'menuTitle',
            })).append($('<h4 />', {
                class: 'menuPrice',
                text: 'W' + data.menuPrice,
            })))
        });
    }

    // 카테고리별 메뉴 리스트
    function getMenuByCategoryNo(categoryNo) {
        $.ajax({
            url: baseUrl + '/api/order/menu/' + categoryNo,
            type: 'GET',
            dataType : 'json', 
            success: function (result) {
                addMenuList(result);
            }, error: function (error) {
                console.log(error);
            }
        });
    }

    // 장바구니 정보 저장
    const addShoppingCart = (menuNo, menuName, menuPrice) => {
        shoppingCartList = getCookie("shoppingCart") ? JSON.parse((getCookie("shoppingCart"))) : {};

        if(menuNo in shoppingCartList) { // 장바구니에 담긴 메뉴일 때
            shoppingCartList[menuNo]["count"]++; // 1개씩 추가
            shoppingCartList[menuNo]["totalPrice"] += shoppingCartList[menuNo]["menuPrice"];
            deleteCookie("shoppingCart"); // 쿠키에 변경 사항 새로 저장
            setCookie("shoppingCart", JSON.stringify(shoppingCartList), 1);
        } else { // 장바구니에 담겨있지 않던 메뉴일 때
            shoppingCartList[menuNo] = {
                menuNo: menuNo,
                menuName: menuName,
                count: 1,
                menuPrice: menuPrice,
                totalPrice: menuPrice
            }
            setCookie("shoppingCart", JSON.stringify(shoppingCartList), 1);
        }

        totalPrice = 0;
        $('#orderList').empty();
        for (key in shoppingCartList) {
            $('#orderList').append($('<div />', {
                class: 'orderMenu'
            }).append($('<div />', {
                class: 'orderMenuName',
                text: shoppingCartList[key]["menuName"]
            })).append($('<div />', {
                class: 'orderMenuPrice',
                text: shoppingCartList[key]["totalPrice"]
            })).append($('<div />', {
                class: 'orderQuantity',
            }).append($('<div />', {
                text: '▼',
                class: 'orderMenuQuantityDec',
                click: function() {
                    shoppingCartList[key]["count"] -= 1;
                    shoppingCartList[key]["totalPrice"] -= shoppingCartList[key]["menuPrice"];
                    deleteCookie("shoppingCart");
                    $('#cntNum' + key).text(shoppingCartList[key]["count"]);
                    setCookie("shoppingCart", JSON.stringify(shoppingCartList), 1);
                }
            })).append($('<div />', {
                text: shoppingCartList[key]["count"],
                class: 'orderMenuQuantity',
                id: "cntNum" + key
            })).append($('<div />', {
                text: '▲',
                class: 'orderMenuQuantityInc',
                click: function() {
                    shoppingCartList[key]["count"] += 1;
                    shoppingCartList[key]["totalPrice"] += shoppingCartList[key]["menuPrice"];
                    $('#cntNum' + key).text(shoppingCartList[key]["count"]);
                    deleteCookie("shoppingCart");
                    setCookie("shoppingCart", JSON.stringify(shoppingCartList), 1);
                }
            }))).append($('<div />', {
                class: 'orderMenuCancel', 
                text: 'CANCEL',
                click: function() {
                    $(this).parent().remove();
                    delete shoppingCartList[key];
                    deleteCookie("shoppingCart"); // 쿠키에 변경 사항 새로 저장
                    setCookie("shoppingCart", JSON.stringify(shoppingCartList), 1);
                }
            })));
        }
    }

    // 장바구니 리스트 추가
    const addShoppingCartList = (menuNo, menuName, menuPrice) => {
        $('#shoppingCart').append($('<li />', {
            id: menuNo,
            text: menuName + ' ' + menuPrice
        }).append($('<button />', {
            text: 'up',
            click: function() {
                totalPrice += menuPrice;
                changeTotalPrice(totalPrice);
            }
        })).append($('<a />', {
            text: 1, 
        })).append($('<button />', {
            text: 'down',
            click: function() {
                totalPrice -= menuPrice;
                if (totalPrice < 0) {
                    alert('잘못된 접근입니다!');
                    $(this).parent().remove();
                } else {
                    $('#totalPrice').text(totalPrice);
                }
            }
        })).append($('<button />', {
            text: '취소',
            click: function() {
                $(this).parent().remove();
                totalPrice -= parseInt(menuPrice);
                changeTotalPrice(totalPrice);
            }
        })));
        
        totalPrice += parseInt(menuPrice);
        changeTotalPrice(totalPrice);
    }

    // 총 가격 조정
    function changeTotalPrice(totalPrice) {
        if (totalPrice < 0) {
            alert('잘못된 접근입니다!');
            $(this).parent().remove();
        } else {
            $('#totalPrice').text(totalPrice);
        }
    }
})