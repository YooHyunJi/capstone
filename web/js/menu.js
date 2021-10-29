// 메뉴 관리
// Author : Sumin, Created : 2021.10.27

function getAllMenus() {
    // 전체 메뉴 조회 서버와 통신
    $.ajax({
        type: 'GET',
        url: '/admin/getAllMenus',
        success: function (result) {
            for(let i=0; i<result.menus.length; i++) {
                console.log(result.menus[0].menuName);
                //console.log(window.URL.createObjectURL((result.menus[0].menuImg)));
            }
        }
    })    
}

function getMenusByCategory() {
    // 카테고리별 메뉴 조회 서버와 통신
    $.ajax({
        type: 'POST',
        url: 'admin/getMenusByCategory',
        contentType: 'application/json', 
        data: JSON.stringify({'categoryNo': 1}),
        success: function (result) {
            for(let i=0; i<result.menus.length; i++) {
                console.log(result.menus[i].menuName);
            }
        }
    });
}

function menuImgPreview(id, file) {
    id.src=URL.createObjectURL(file);
}

function addMenu() {
    var form = $('#fileForm')[0];
    var formData = new FormData(form);

    $.ajax({
        type: 'post',
        url: 'admin/addMenu',
        data: formData,
        processData: false,
        contentType: false
    });
}

function deleteMenu() {
    let menuNo = $('#menuNo').val();
    $.ajax({
        type: 'POST',
        url: 'admin/deleteMenu',
        contentType: 'application/json', 
        data: JSON.stringify({'menuNo': menuNo}),
        success: function (result) {
            
        }
    });
}

function updateMenu() {
    
}