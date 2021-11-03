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
                if (result.orders[i].orderStatus==0)
                    orderStatus='준비중';
                else if (result.orders[i].orderStatus==1)
                    orderStatus='준비완료';

                let cancelYn='';
                if (result.orders[i].cancelYn=='Y')
                    cancelYn='주문취소';
                else if (result.orders[i].cancelYn=='N')
                    cancelYn='-';
                $('#orders').append(
                    `<tr class="order">
                    <td>`+orderNo+`</td>
                    <td>${result.orders[i].orderTime}</td>
                    <td class="orderStatus">`+orderStatus+`</td>
                    <td>${result.orders[i].customerTel}</td>
                    <td>${result.orders[i].totalPrice}</td>
                    <td>`+cancelYn+`</td>
                    <td class="changeStatus">준비 완료</td>
                    <td class="orderCancel" onclick="cancelOrder('${result.orders[i].orderNo}')">취소</td>
                    </tr>`
                )
            }
        }
    })  
}

function cancelOrder(orderNo) {
    // 주문 취소 서버와 통신
    if (confirm("정말 취소하시겠습니까?") == true) { // 메뉴 삭제 확인
        $.ajax({
            type: 'POST',
            url: '/admin/cancelOrder',
            contentType: 'application/json', 
            data: JSON.stringify({'orderNo': orderNo}),
            success: function (result) {
                if (result.code == 200)
                    alert('주문 취소되었습니다.')
            }
        }) 
    } else {// 메뉴 삭제 취소
        return;
    } 
}

function sendKakaoMessage() {
    Kakao.init("b0acf0bf7eaa895e395a0d5ff254a55c");
    Kakao.Link.sendCustom({
        templateId: 64485
    });
}