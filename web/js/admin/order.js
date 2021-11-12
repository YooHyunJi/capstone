// 주문 관리
// Author : Sumin, Created : 2021.10.27
$(document).ready(function () {
    getAllOrders();
})

function getAllOrders() {
    // 전체 주문내역 조회 서버와 통신
    $.ajax({
        type: 'GET',
        url: '/admin/getAllOrders',
        success: function (result) {
            for(let i=0; i<result.orders.length; i++) {
                let orderNo=i+1;
                let orderStatus='';
                if (result.orders[i].orderStatus==0) {
                    orderStatus='준비중';
                }
                else if (result.orders[i].orderStatus==1) {
                    orderStatus='준비완료';
                }

                let cancelYn='';
                if (result.orders[i].cancelYn=='Y') {
                    cancelYn='주문취소';
                }
                else if (result.orders[i].cancelYn=='N') {
                    cancelYn='-';
                }
                
                let orderClass='';
                if (orderStatus == '준비중') {
                    if (cancelYn=='-') {
                        orderClass='preparingOrder';
                    }
                    else if (cancelYn=='주문취소') {
                        orderClass='preparingOrder canceledOrder';
                    }
                }
                else if (orderStatus == '준비완료') {
                    orderClass='finishedOrder';
                }
                
                $('#orders').append(
                    `<tr class="`+orderClass+`">
                    <td>`+orderNo+`</td>
                    <td>${result.orders[i].orderTime}</td>
                    <td class="orderStatus">`+orderStatus+`</td>
                    <td>${result.orders[i].customerTel}</td>
                    <td>${result.orders[i].totalPrice}</td>
                    <td class="orderCancel">`+cancelYn+`</td>
                    <td class="orderDetail" onclick="getOrderDetails('${result.orders[i].orderNo}')">-</td>
                    <td class="changeStatusBtn" onclick="changeOrderStatus('${result.orders[i].orderStatus}', '${result.orders[i].cancelYn}', '${result.orders[i].orderNo}', '${result.orders[i].customerTel}')">준비완료</td>
                    <td class="orderCancelBtn" onclick="cancelOrder('${result.orders[i].orderStatus}', '${result.orders[i].cancelYn}', '${result.orders[i].orderNo}')">취소</td>
                    </tr>`
                )
            }
        }
    })  
}

function cancelOrder(orderStatus, cancelYn, orderNo) {
    if (orderStatus=='1') {
        alert('준비완료된 주문은 취소불가');
        location.href="/manage_order";
        return;
    }
    else if (cancelYn=='Y') {
        alert('이미 주문취소됨');
        location.href="/manage_order";
        return;
    }
    else if (orderStatus=='0' && cancelYn=='N') {
        var orderParent = $(this).parent();
        // 주문 취소 서버와 통신
        if (confirm("정말 취소하시겠습니까?") == true) { // 메뉴 삭제 확인
            $.ajax({
                type: 'POST',
                url: '/admin/cancelOrder',
                contentType: 'application/json', 
                data: JSON.stringify({'orderNo': orderNo}),
                success: function (result) {
                    if (result.code == 200) {
                        alert('주문 취소되었습니다.');
                        orderParent.addClass("canceledOrder");
                    }
                    else
                        alert('주문 취소 실패');
                    location.href="/manage_order";
                }
            }) 
        } else {// 주문취소 취소
            location.href="/manage_order";
            return;
        } 
    }
}

function changeOrderStatus(orderStatus, cancelYn, orderNo, customerTel) {
    if (cancelYn=='Y') {
        alert('취소된 주문임');
        location.href="/manage_order";
        return;
    }
    else if (orderStatus=='1') {
        alert('이미 준비완료됨');
        location.href="/manage_order";
        return;
    }
    else if (orderStatus=='0' && cancelYn=='N') {
        // 주문상태 변경 서버와 통신
        $.ajax({
            type: 'POST',
            url: '/admin/changeOrderStatus',
            contentType: 'application/json', 
            data: JSON.stringify({'orderNo': orderNo}),
            success: function (result) {
                if (result.code == 200)
                    alert('주문상태가 변경되었습니다.');
                else
                    alert('주문상태 변경 실패');
                location.href="/manage_order";
            }
        })

        // 픽업메시지 발송
        $.ajax({
            type: 'POST',
            url: '/api/sens/sendPickupMsg',
            contentType: 'application/json',
            data: JSON.stringify({'phone': customerTel, 'orderNo': orderNo}), 
            success: function(res) {
                console.log('send message success');
            }, 
            error: function(err) {
                console.log('send message error', err);
            }
        });
    }
}

function getOrderDetails(orderNo) {
    modal('orderDetailModal');

    $.ajax({
        type: 'GET',
        url: `admin/getOrderDetails/`+orderNo,
        success: function (result) {
            // 초기화
            $('#orderDetailArea__1').empty();
            $('#orderDetailArea__2').empty();
            $('#orderDetailArea__3').empty();

            // 영역 1
            $('#orderDetailArea__1').append(
                `<p>주문 번호</p>
                <p class="order_no">`+orderNo+`</p>`
            )
            
            // 영역 2
            $('#orderDetailArea__2').append(
                `<p class="detailTitle__2">주문 정보</p><br>
                <span class="detailTitle__2 menu_name">메뉴</span>
                <span class="detailTitle__2 count">수량</span>
                <span class="detailTitle__2 orderDetailPrice">가격</span><br>`
            )
            for (let i=0; i<result.orderList.length; i++) {
                $('#orderDetailArea__2').append( // 메뉴, 수량, 가격
                    `<span class="menu_name">${result.orderList[i].menuName}</span>
                    <span class="count">${result.orderList[i].count}</span>
                    <span class="orderDetailPrice">`+numberWithCommas(result.orderList[i].orderDetailPrice)+`</span><br><hr>`
                )
            }

            $('#orderDetailArea__2').append( // 총 주문금액
                `<span class="totalPrice">`+numberWithCommas(result.totalPrice[0].totalPrice)+`</span>`
            )

            // 영역 3
            $('#orderDetailArea__3').append(
                `<P>결제 정보</p><br>`
            )
            for (let i=0; i<result.payment.length; i++) { // 총 결제금액, 결제 시간, 수단, 타입
                $('#orderDetailArea__3').append(
                    `<span class="detailTitle__3">총 결제 금액</span><span class="paymentPrice">`+numberWithCommas(result.payment[i].paymentPrice)+`</span>
                    <span class="detailTitle__3">결제 시간</span><span class="paymentPricepaymentTime">${result.payment[i].paymentTime}</span><br>
                    <span class="detailTitle__3">결제 수단</span><span class="paymentMethod">${result.payment[i].paymentMethod}</span>
                    <span class="detailTitle__3">결제 타입</span><span class="paymentType">${result.payment[i].paymentType}</span>`
                )
            }
        }
    });
}

// 숫자에 콤마 붙여 표현하는 메서드
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 주문 현황 카톡 발신
/*function sendKakaoMessage() {
    Kakao.init("b0acf0bf7eaa895e395a0d5ff254a55c");
    Kakao.Link.sendCustom({
        templateId: 64485
    });
}*/