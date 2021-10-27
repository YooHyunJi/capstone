// 매장 관리
// Author : Sumin, Created : 2021.10.27

getMenusByCategoryNo();
function getMenus() {
    $.ajax({
        type: 'POST',
        url: '/admin/getMenus',
        contentType: 'application/json',
        data: JSON.stringify({}),
        success: function (json) {
        }
    })    
}

function getMenusByCategoryNo(categoryNo) {
    $.ajax({
        url: 'admin/getMenusByCategory',
        type: 'POST',
        contentType: 'application/json', 
        data: JSON.stringify({'categoryNo': 1}),
        success: function (result) {
            for(let i=0; i<result.menus.length; i++) {
                console.log(result.menus[i].menuName);
            }
        }
    });
}