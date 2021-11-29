$(document).ready(function() {
    const baseUrl = $(location).attr('protocol') + '//' + $(location).attr('host');

    // const storeNo = location.href.split(baseUrl + "/order/")[1];
    const storeNo = $('#storeNo').text(); // 서버에서 세션값으로 받아온 storeNo -> ejs

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
            console.log('get category & first menu list error');
        }
    })

    if (getCookie("shoppingCart")) {
        let shoppingCartList = JSON.parse((getCookie("shoppingCart")));
        addShoppingCartForDiv(shoppingCartList, totalPrice);
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
            totalPrice = parseInt($('#totalPriceSpan').text().slice(0, -1).replace(',', ''));
            let orderNo;

            if (customerTel == '') {
                // 전화번호 입력하지 않았을 때 동작하지 않음
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
                                    url: '/api/sens/order',
                                    type: 'POST',
                                    contentType: 'application/json',
                                    data: JSON.stringify({
                                        'phone': customerTel, // test
                                        'orderNo': orderNo
                                    }), success: function(res) {
                                        console.log('send message success');
                                        deleteCookie('shoppingCart');
                                        // 주문 완료 안내 띄우고 3초 후 재시작
                                        setTimeout(function() {location.reload();}, 3000);
                                        // server
                                        socket.emit('orderInfo', {
                                            'orderNo': orderNo,
                                        }); 
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
            // 첫 로딩 시 처음 카테고리에 selected 클래스 부여, 클릭될 때 이전 selected 카테고리 해제 및 현재 카테고리에 selected 클래스 추가
            if(index==0){
                $('#categoryList').append($('<li />', {
                    id: data.categoryNo,
                    text: data.categoryName,
                    class: 'category selected',
                    click: function() {
                        var prev_category = $('.selected');
                        prev_category.removeClass('selected');
                        $(this).addClass('selected');
                        getMenuByCategoryNo(data.categoryNo);
                    }
                }));
            }
            // 처음 카테고리가 아닐 경우 selected 클래스 부여하지 않고 append, 클릭될 때 이전 selected 카테고리 해제 및 현재 카테고리에 selected 클래스 추가
            else{
                $('#categoryList').append($('<li />', {
                    id: data.categoryNo,
                    text: data.categoryName,
                    class: 'category',
                    click: function() {
                        var prev_category = $('.selected');
                        prev_category.removeClass('selected');
                        $(this).addClass('selected');
                        getMenuByCategoryNo(data.categoryNo);
                    }
                }));
            }
        });

        var categoryCnt = $(".category").length;
        var categoryWidth;

        // 카테고리 개수가 5개 미만이면 (100/카테고리 개수)%로 지정해서 꽉차도록
        if(categoryCnt < 5){
            categoryWidth = 100 / categoryCnt;}
        // 카테고리 개수가 5개 이상이면 20%%로 지정해서 최대 5개가 나타나고 버튼으로 좌우 이동
        else{
            categoryWidth = 20;}
            
        $('.category').css('width', categoryWidth + '%');
    }

    // 카테고리 가로 이동 버튼
    $("#categoryBtnLeft").on({
    click: function() {
        categoryList.scrollBy(-$('.category').width(), 0);
        }})
    $("#categoryBtnRight").on({
        click: function() {
            categoryList.scrollBy($('.category').width(), 0);
        }
    })

    // 메뉴 리스트
    function addMenuList(result) {
        $('#menuList').empty();
        $.each(result, function(index, data){
            // console.log(data.menuImg);
            // var url = window.URL || window.webkitURL;
            // var src = url.createObjectURL(new Blob(new Uint8Array(data.menuImg), { type: 'application/octet-stream' }));
            $('#menuList').append($('<div />', {
                class: 'menu',
                id: data.menuNo,
                click: function () {
                    addShoppingCart(data.menuNo, data.menuName, data.menuPrice);
                }
            }).append($('<div />', {
                class: 'imgWrapper'
            }).append($('<img />', {
                alt: 'img',
                id: 'img' + data.menuNo,
                class: 'menuImg'
            }))
            ).append($('<h4 />', {
                text: data.menuName,
                class: 'menuTitle',
            })).append($('<h4 />', {
                class: 'menuPrice',
                text: '₩' + priceGetComma(data.menuPrice,)
            })));

            $.ajax({
                type: 'GET',
                url:`/admin/getMenuImg/`+data.menuNo,
                success: function(result) {
                    $('#img' + data.menuNo).attr('src', "/"+result.menuImg);
                }
            });
        
            // 메뉴 이미지
            /*$.ajax({
                url: '/admin/getMenuImg/'+ data.menuNo,
                cache: false,
                xhr:function() {
                    var xhr = new XMLHttpRequest();
                    xhr.responseType= 'blob'
                    return xhr;
                },
                success: function(result){
                    var url = window.URL || window.webkitURL;
                    var src = url.createObjectURL(result);
                    $('#img' + data.menuNo).attr('src', src);
                }
            });*/

        });

        /*var div = $('.imgWrapper'); // 이미지를 감싸는 div
        var img = $('.menuImg'); // 이미지

        for(var i=0; i<div.length; i++){
            var divAspect = 1; // div의 가로세로비는 알고 있는 값이다
            var imgAspect = img[i].height / img[i].width;

            if (imgAspect < divAspect) {
                // 이미지가 div보다 납작한 경우 세로를 div에 맞추고 가로는 잘라낸다
                var imgWidthActual = div[i].offsetHeight / imgAspect;
                var imgWidthToBe = div[i].offsetHeight / divAspect;
                var marginLeft = -(Math.round((imgWidthActual - imgWidthToBe) / 2));
                img[i].style.cssText = 'width: auto; height: 100%; margin-left: ' + marginLeft + 'px;';
            }
            else {
                // 이미지가 div보다 길쭉한 경우 가로를 div에 맞추고 세로를 잘라낸다
                img[i].style.cssText = 'width: 100%; height: auto; margin-left: 0; margin-top:' + marginLeft + 'px;';
            }
        }*/

        // 디스픙레이 모드(일반 / 크게 보기)토글 버튼
        $("#displayModeBtn").on({
            click: function() {
                // 일반 → 크게보기
                if($("#menuList").attr('class') == "zoomOut"){
                    $("#menuList").removeClass('zoomOut');
                    $("#menuList").addClass('zoomIn');
                }
                // 크게보기 → 일반
                else{
                    $("#menuList").removeClass('zoomIn');
                    $("#menuList").addClass('zoomOut');
                }
            }
        })
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
                console.log('get menu by category error');
            }
        });
    }

}) // document


// 메뉴 클릭 시 장바구니 정보 저장
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
    addShoppingCartForDiv(shoppingCartList, totalPrice); // 장바구니 div append
}

// 쿠키로 얻은 장바구니 div append & 장바구니 영역에서 개수 조절
function addShoppingCartForDiv(shoppingCartList, totalprice) {
    for (key in shoppingCartList) {
        totalprice += shoppingCartList[key]["totalPrice"];
        $('#orderList').append($('<div />', {
            class: 'orderMenu',
            id: key
        }).append($('<div />', {
            class: 'orderMenuName',
            text: shoppingCartList[key]["menuName"]
        })).append($('<div />', {
            class: 'orderMenuPrice',
            text: priceGetComma(shoppingCartList[key]["totalPrice"]),
            id: 'price' + key
        })).append($('<div />', {
            class: 'orderQuantity',
        }).append($('<div />', {
            text: '▼',
            class: 'orderMenuQuantityDec',
            click: function() {
                totalprice -= shoppingCartList[$(this).parent().parent().attr('id')]["menuPrice"];
                $('#totalPriceSpan').text(priceGetComma(totalprice) + '원');
                $('#totalPriceDiv').text('총 결제 금액 ' + priceGetComma(totalprice) + '원');
                if (orderMenuDec($(this).parent().parent().attr('id'), shoppingCartList) == false) {
                    if (delete shoppingCartList[$(this).parent().parent().attr('id')]) { // 남은 메뉴 수량이 0개 이하로 아예 삭제
                        $(this).parent().parent().remove();
                        // deleteCookie("shoppingCart"); // 쿠키에 변경 사항 새로 저장
                        setCookie("shoppingCart", JSON.stringify(shoppingCartList), 3);
                    }
                } else { // 남은 수량 2개 이상일 때
                    $('#cntNum' + $(this).parent().parent().attr('id')).text(shoppingCartList[$(this).parent().parent().attr('id')]["count"]);
                    $('#price' + $(this).parent().parent().attr('id')).text(priceGetComma(shoppingCartList[$(this).parent().parent().attr('id')]["totalPrice"]));
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
                totalprice += shoppingCartList[$(this).parent().parent().attr('id')]["menuPrice"];
                $('#cntNum' + $(this).parent().parent().attr('id')).text(shoppingCartList[$(this).parent().parent().attr('id')]["count"]);
                $('#price' + $(this).parent().parent().attr('id')).text(priceGetComma(shoppingCartList[$(this).parent().parent().attr('id')]["totalPrice"]));
                $('#totalPriceSpan').text(priceGetComma(totalprice) + '원');
                $('#totalPriceDiv').text('총 결제 금액 ' + priceGetComma(totalprice) + '원');
                // deleteCookie("shoppingCart");
                setCookie("shoppingCart", JSON.stringify(shoppingCartList), 3);
            }
        }))).append($('<div />', {
            class: 'orderMenuCancel', 
            text: 'CANCEL',
            click: function() {
                totalprice -= shoppingCartList[$(this).parent().attr('id')]["totalPrice"];
                $('#totalPriceSpan').text(priceGetComma(totalprice) + '원');
                $('#totalPriceDiv').text('총 결제 금액 ' + priceGetComma(totalprice) + '원');
                if (delete shoppingCartList[$(this).parent().attr('id')]) {
                    $(this).parent().remove();
                    // deleteCookie("shoppingCart"); 
                    setCookie("shoppingCart", JSON.stringify(shoppingCartList), 3);   
                }
            }
        })));
    }
    $('#totalPriceSpan').text(priceGetComma(totalprice) + '원');
    $('#totalPriceDiv').text('총 결제 금액 ' + priceGetComma(totalprice) + '원');
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

// 장바구니 쿠키 있는지 확인
function checkCart () {
    let cart = getCookie('shoppingCart') ? JSON.parse(getCookie('shoppingCart')) : {};
    if (Object.keys(cart).length == 0){ // 장바구니 비어있을 때
        return false; 
    } else { // 장바구니에 내역이 있을 때
        return true;
    }
}

function toBase64(arr) {
    //arr = new Uint8Array(arr) if it's an ArrayBuffer
    return btoa(
       arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
 }
 