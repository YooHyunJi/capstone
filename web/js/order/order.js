$(document).ready(function() {
    const baseUrl = $(location).attr('protocol') + '//' + $(location).attr('host');
    const storeNo = location.href.split(baseUrl + "/order/")[1];

    let shoppingCartList = {};
    let paymentInfo = '';
    let totalPrice = 0;

    $('#orderList').empty();

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

    if (getCookie("shoppingCart")) {
        let shoppingCartList = JSON.parse((getCookie("shoppingCart")));
        for (key in shoppingCartList) {
            $('#orderList').append($('<div />', {
                class: 'orderMenu',
                id: key
            }).append($('<div />', {
                class: 'orderMenuName',
                text: shoppingCartList[key]["menuName"]
            })).append($('<div />', {
                class: 'orderMenuPrice',
                text: shoppingCartList[key]["totalPrice"],
                id: 'price' + key
            })).append($('<div />', {
                class: 'orderQuantity',
            }).append($('<div />', {
                text: '▼',
                class: 'orderMenuQuantityDec',
                click: function() {
                    if (orderMenuDec($(this).parent().parent().attr('id'), shoppingCartList) == false) {
                        if (delete shoppingCartList[$(this).parent().parent().attr('id')]) {
                            $(this).parent().parent().remove();
                            // deleteCookie("shoppingCart"); // 쿠키에 변경 사항 새로 저장
                            setCookie("shoppingCart", JSON.stringify(shoppingCartList), 3);
                        }
                    } else {
                        $('#cntNum' + $(this).parent().parent().attr('id')).text(shoppingCartList[$(this).parent().parent().attr('id')]["count"]);
                        $('#price' + $(this).parent().parent().attr('id')).text(shoppingCartList[$(this).parent().parent().attr('id')]["totalPrice"]);
                        // deleteCookie("shoppingCart");
                        setCookie("shoppingCart", JSON.stringify(shoppingCartList), 3);    
                    }
                }
            })).append($('<div />', {
                text: shoppingCartList[key]["count"],
                class: 'orderMenuQuantity',
                id: "cntNum" + key
            })).append($('<div />', {
                text: '▲',
                class: 'orderMenuQuantityInc',
                id: 'orderMenuIc',
                click: function() {
                    shoppingCartList = orderMenuInc($(this).parent().parent().attr('id'), shoppingCartList);
                    $('#cntNum' + $(this).parent().parent().attr('id')).text(shoppingCartList[$(this).parent().parent().attr('id')]["count"]);
                    $('#price' + $(this).parent().parent().attr('id')).text(shoppingCartList[$(this).parent().parent().attr('id')]["totalPrice"]);
                    // deleteCookie("shoppingCart");
                    setCookie("shoppingCart", JSON.stringify(shoppingCartList), 3);
                }
            }))).append($('<div />', {
                class: 'orderMenuCancel', 
                text: 'CANCEL',
                click: function() {
                    if (delete shoppingCartList[$(this).parent().attr('id')]) {
                        $(this).parent().remove();
                        // deleteCookie("shoppingCart"); 
                        setCookie("shoppingCart", JSON.stringify(shoppingCartList), 3);
                    }
                }
            })));
        }
    }

    $('.phoneNumBtn tr td').on({
        click: function() {
            let btnId = $(this).attr('id').substring(3, 10);
            if (btnId == 'Cancel') {
                // input 마지막 숫자 지우기
                $('#inputPhone').val($('#inputPhone').val().substring(0, ($('#inputPhone').val()).length - 1));
            } else {
                // input 숫자 하나씩 추가하기
                $('#inputPhone').val($('#inputPhone').val() + btnId);
            }
        }
    })

    // 전화번호 입력 완료
    $('#phoneBtn').on({
        click: function() {
            shoppingCartList = JSON.parse(getCookie('shoppingCart'));
            paymentInfo = getCookie('payment');
            let customerTel = $('#inputPhone').val();
            let totalPrice = 10000; // test
            let orderNo;

            if (customerTel == '') {
                alert('전화번호를 입력해 주세요');
            } else {
                $.ajax({
                    url: '/api/order/add/orderInfo',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        'customerTel': customerTel,
                        'totalPrice': totalPrice, // test
                        'storeNo': storeNo
                    }),
                    success: function(result) {
                        orderNo = parseInt(result['orderNo']);
                        $.ajax({
                            url: '/api/order/add/payment',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({
                                'paymentMethod': paymentInfo,
                                'paymentPrice': totalPrice,
                                'storeNo': storeNo,
                                'orderNo': orderNo,
                                'shoppingCart': getCookie('shoppingCart')
                            }),
                            success: function(res) {
                                // 문자 메시지 전송
                                $.ajax({
                                    url: '/api/order/sens',
                                    type: 'POST',
                                    contentType: 'application/json',
                                    data: JSON.stringify({
                                        'phone': customerTel, // test
                                        'orderNo': orderNo
                                    }), success: function(res) {
                                        console.log('send message success');
                                        deleteCookie('shoppingCart');
                                        location.reload();
                                    }, error: function(err) {
                                        console.log('send message error ', err);
                                    }
                                });
                            }, error: function(err) {
                                console.log('add payemnt error ', err);
                            }
                        })
                    }, error: function(err) {
                        console.log('add orderinfo error');
                    }
                })
            }
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
            // deleteCookie("shoppingCart"); // 쿠키에 변경 사항 새로 저장
            setCookie("shoppingCart", JSON.stringify(shoppingCartList), 3);
            } else { // 장바구니에 담겨있지 않던 메뉴일 때
                shoppingCartList[menuNo] = {
                    menuNo: menuNo,
                    menuName: menuName,
                    count: 1,
                    menuPrice: menuPrice,
                    totalPrice: menuPrice
                }
                setCookie("shoppingCart", JSON.stringify(shoppingCartList), 3);
            }

        totalPrice = 0;
        $('#orderList').empty();
        for (key in shoppingCartList) {
            $('#orderList').append($('<div />', {
                class: 'orderMenu',
                id: key
            }).append($('<div />', {
                class: 'orderMenuName',
                text: shoppingCartList[key]["menuName"]
            })).append($('<div />', {
                class: 'orderMenuPrice',
                text: shoppingCartList[key]["totalPrice"],
                id: 'price' + key
            })).append($('<div />', {
                class: 'orderQuantity',
            }).append($('<div />', {
                text: '▼',
                class: 'orderMenuQuantityDec',
                click: function() {
                    if (orderMenuDec($(this).parent().parent().attr('id'), shoppingCartList) == false) {
                        if (delete shoppingCartList[$(this).parent().parent().attr('id')]) {
                            $(this).parent().parent().remove();
                            // deleteCookie("shoppingCart"); // 쿠키에 변경 사항 새로 저장
                            setCookie("shoppingCart", JSON.stringify(shoppingCartList), 3);
                            console.log(shoppingCartList);
                        }
                    } else {
                        $('#cntNum' + $(this).parent().parent().attr('id')).text(shoppingCartList[$(this).parent().parent().attr('id')]["count"]);
                        $('#price' + $(this).parent().parent().attr('id')).text(shoppingCartList[$(this).parent().parent().attr('id')]["totalPrice"]);
                        // deleteCookie("shoppingCart");
                        setCookie("shoppingCart", JSON.stringify(shoppingCartList), 3);    
                    }
                }
            })).append($('<div />', {
                text: shoppingCartList[key]["count"],
                class: 'orderMenuQuantity',
                id: "cntNum" + key
            })).append($('<div />', {
                text: '▲',
                class: 'orderMenuQuantityInc',
                id: 'orderMenuIc',
                click: function() {
                    shoppingCartList = orderMenuInc($(this).parent().parent().attr('id'), shoppingCartList);
                    $('#cntNum' + $(this).parent().parent().attr('id')).text(shoppingCartList[$(this).parent().parent().attr('id')]["count"]);
                    $('#price' + $(this).parent().parent().attr('id')).text(shoppingCartList[$(this).parent().parent().attr('id')]["totalPrice"]);
                    // deleteCookie("shoppingCart");
                    setCookie("shoppingCart", JSON.stringify(shoppingCartList), 3);
                }
            }))).append($('<div />', {
                class: 'orderMenuCancel', 
                text: 'CANCEL',
                click: function() {
                    if (delete shoppingCartList[$(this).parent().attr('id')]) {
                        $(this).parent().remove();
                        // deleteCookie("shoppingCart"); 
                        setCookie("shoppingCart", JSON.stringify(shoppingCartList), 3);
                    }
                }
            })));
        }
    }


    // 장바구니 div에서 개수 감소
    const orderMenuDec = (menuNo, shoppingCartDict) => {
        if (shoppingCartDict[menuNo]["count"] == 1) {
            return false;
        } else {
            shoppingCartDict[menuNo]["count"] -= 1;
            shoppingCartDict[menuNo]["totalPrice"] -= shoppingCartDict[menuNo]["menuPrice"];
            return true;
        }
    }
    // 장바구니 div에서 개수 증가
    const orderMenuInc = (menuNo, shoppingCartDict) => {
        shoppingCartDict[menuNo]["count"] += 1;
        shoppingCartDict[menuNo]["totalPrice"] += shoppingCartDict[menuNo]["menuPrice"];
        return shoppingCartDict;
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

// 장바구니 쿠키 있는지 확인
function checkCart () {
    let cart = getCookie('shoppingCart') ? JSON.parse(getCookie('shoppingCart')) : {};
    if (Object.keys(cart).length == 0){ // 장바구니 비어있을 때
        return false; 
    } else { // 장바구니에 내역이 있을 때
        return true;
    }
}
