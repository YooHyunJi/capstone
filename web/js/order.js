// 주문 관리
// Author : Sumin, Created : 2021.10.27

function getAllOrders() {
    // 전체 주문내역 조회 서버와 통신
    $.ajax({
        type: 'GET',
        url: '/admin/getAllOrders',
        success: function (result) {
            for(let i=0; i<result.orders.length; i++) {
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
                console.log(result.orders[i].orderNo + ", " + result.orders[i].orderTime + ", " + orderStatus + ", " + cancelYn);
            }
        }
    })  
}

function cancelOrder() {
    // 주문 취소 서버와 통신
    $.ajax({
        type: 'POST',
        url: '/admin/cancelOrder',
        contentType: 'application/json', 
        data: JSON.stringify({'orderNo': 1}),
        success: function (result) {
        }
    })  
}