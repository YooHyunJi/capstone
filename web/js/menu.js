// 메뉴 관리
// Author : Sumin, Created : 2021.10.27
$(document).ready(function () {
    getAllMenus();
    getAllCategoryNames();
})

function getAllMenus() {
    $('#menuList').empty();
    $('#menuList').append(
        `<th>메뉴 번호</th>
        <th>카테고리</th>
        <th>이름</th>
        <th>가격</th>
        <th>상세 정보</th>
        <th></th>
        <th></th>`
    )
    // 전체 메뉴 조회 서버와 통신
    $.ajax({
        type: 'GET',
        url: '/admin/getAllMenus',
        success: function (result) {
            for (let i=0; i<result.menus.length; i++) {
                let menuNo=i+1;
                $('#menuList').append(
                    `<tr class="menu">
                    <td>`+menuNo+`</td>
                    <td>${result.menus[i].categoryName}</td>
                    <td>${result.menus[i].menuName}</td>
                    <td>${result.menus[i].menuPrice}</td>
                    <td>${result.menus[i].menuDetail}</td>
                    <td class="changeStatus">수정</td>
                    <td class="orderCancel" onclick="deleteMenu('${result.menus[i].menuNo}')">삭제</td>
                    </tr>`
                )
            }
        }
    })    
}

function getAllCategoryNames() {
    $('#category').empty();
    $.ajax({
        type: 'GET',
        url: '/admin/getAllCategoryNames',
        success: function (result) {
            for (let i=0; i<result.categories.length; i++) {
                $('#categoryList').append(
                    `<p class="category" onclick="getMenusByCategory('${result.categories[i].categoryName}')">${result.categories[i].categoryName}</p>`
                )
            }
        }
    })
}

function getMenusByCategory(categoryName) {
    $('#menuList').empty();
    $('#menuList').append(
        `<th>메뉴 번호</th>
        <th>카테고리</th>
        <th>이름</th>
        <th>가격</th>
        <th>상세 정보</th>
        <th></th>
        <th></th>`
    )
    // 카테고리별 메뉴 조회 서버와 통신
    $.ajax({
        type: 'POST',
        url: 'admin/getMenusByCategory',
        contentType: 'application/json', 
        data: JSON.stringify({'categoryName': categoryName}),
        success: function (result) {
            for (let i=0; i<result.menus.length; i++) {
                let menuNo=i+1;
                $('#menuList').append(
                    `<tr class="menu">
                    <td>`+menuNo+`</td>
                    <td>${result.menus[i].categoryName}</td>
                    <td>${result.menus[i].menuName}</td>
                    <td>${result.menus[i].menuPrice}</td>
                    <td>${result.menus[i].menuDetail}</td>
                    <td class="changeStatus">수정</td>
                    <td class="orderCancel" onclick="deleteMenu('${result.menus[i].menuNo}')">삭제</td>
                    </tr>`
                )
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

function deleteMenu(menuNo) {
    if (confirm("정말 삭제하시겠습니까?") == true) { // 메뉴 삭제 확인
        $.ajax({
            type: 'POST',
            url: 'admin/deleteMenu',
            contentType: 'application/json', 
            data: JSON.stringify({'menuNo': menuNo}),
            success: function (result) {
                if (result.code == 200)
                    alert('삭제되었습니다.');
            }
        });
    } else {// 메뉴 삭제 취소
        return;
    }
    
}

function updateMenu() {
    
}