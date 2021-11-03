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
                    <td class="changeStatusBtn" onclick="changeOrderStatus('${result.orders[i].orderStatus}', '${result.orders[i].cancelYn}', '${result.orders[i].orderNo}')">준비완료</td>
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

function changeOrderStatus(orderStatus, cancelYn, orderNo) {
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
    }
}

function sendKakaoMessage() {
    Kakao.init("b0acf0bf7eaa895e395a0d5ff254a55c");
    Kakao.Link.sendCustom({
        templateId: 64485
    });
}